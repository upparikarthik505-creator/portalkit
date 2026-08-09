"use client";

import { nanoid } from "nanoid";
import { formatMoney } from "./money";
import type { PaymentRequest, Project, ProjectFile, ProjectStatus } from "./types";
import { normalizeProjectStatus } from "./types";

export { formatMoney };

const STORAGE_KEY = "portalkit.projects.v2";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function useRemote() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function loadProjects(): Project[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => ({
      ...p,
      status: normalizeProjectStatus(p.status as string),
    }));
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/** Hydrate from Supabase API when configured; falls back to localStorage. */
export async function hydrateProjects(): Promise<Project[]> {
  if (!useRemote()) return loadProjects();
  try {
    const res = await fetch("/api/projects");
    const data = (await res.json()) as {
      source?: string;
      projects?: Project[] | null;
    };
    if (data.source === "supabase" && Array.isArray(data.projects)) {
      const normalized = data.projects.map((p) => ({
        ...p,
        status: normalizeProjectStatus(p.status as string),
      }));
      saveProjects(normalized);
      return normalized;
    }
  } catch {
    // keep local
  }
  return loadProjects();
}

export function getProject(id: string) {
  return loadProjects().find((p) => p.id === id);
}

export function getProjectByToken(token: string) {
  return loadProjects().find((p) => p.shareToken === token);
}

export function createProject(input: {
  name: string;
  clientName: string;
  clientEmail: string;
  storeUrl: string;
  dueDate: string;
}): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: `prj_${nanoid(8)}`,
    name: input.name,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    storeUrl: input.storeUrl,
    status: "lead",
    dueDate: input.dueDate,
    notes: "",
    shareToken: nanoid(10),
    files: [],
    payments: [],
    updatedAt: now,
    createdAt: now,
  };
  const projects = [project, ...loadProjects()];
  saveProjects(projects);

  if (useRemote()) {
    void fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: project.id,
        shareToken: project.shareToken,
        ...input,
      }),
    }).catch(() => undefined);
  }

  return project;
}

/** Create with plan-limit check (Starter = 1 active). Returns error string if blocked. */
export async function createProjectGuarded(input: {
  name: string;
  clientName: string;
  clientEmail: string;
  storeUrl: string;
  dueDate: string;
  contactId?: string | null;
}): Promise<{ project: Project } | { error: string; upgradeHref?: string }> {
  const { canAddActiveProject, isActiveProjectStatus } = await import(
    "./workspace-plan"
  );

  let unlimited = true;
  try {
    const res = await fetch("/api/workspace/branding");
    if (res.ok) {
      const data = (await res.json()) as {
        plan?: {
          plan: string;
          onTrial?: boolean;
        };
      };
      if (data.plan) {
        unlimited =
          data.plan.plan === "pro" ||
          data.plan.plan === "founder" ||
          !!data.plan.onTrial;
      }
    }
  } catch {
    // fail open for offline local
  }

  const activeCount = loadProjects().filter((p) =>
    isActiveProjectStatus(p.status),
  ).length;
  if (
    !unlimited &&
    !canAddActiveProject(
      {
        plan: "starter",
        studioName: "",
        onTrial: false,
        trialDaysLeft: 0,
        label: "Starter",
      },
      activeCount,
    )
  ) {
    return {
      error:
        "Starter allows 1 active project. Mark one Done or upgrade to Pro.",
      upgradeHref: "/dashboard/billing",
    };
  }

  const now = new Date().toISOString();
  const project: Project = {
    id: `prj_${nanoid(8)}`,
    name: input.name,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    storeUrl: input.storeUrl,
    status: "lead",
    dueDate: input.dueDate,
    notes: "",
    shareToken: nanoid(10),
    contactId: input.contactId ?? null,
    files: [],
    payments: [],
    updatedAt: now,
    createdAt: now,
  };

  if (useRemote()) {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          shareToken: project.shareToken,
          name: input.name,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          storeUrl: input.storeUrl,
          dueDate: input.dueDate,
          contactId: input.contactId ?? null,
        }),
      });
      if (res.status === 403) {
        const data = (await res.json()) as {
          error?: string;
          upgradeHref?: string;
        };
        return {
          error: data.error || "Plan limit reached.",
          upgradeHref: data.upgradeHref || "/dashboard/billing",
        };
      }
    } catch {
      // keep local create
    }
  }

  const projects = [project, ...loadProjects()];
  saveProjects(projects);
  return { project };
}

export function updateProjectStatus(id: string, status: ProjectStatus) {
  const projects = loadProjects().map((p) =>
    p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p,
  );
  saveProjects(projects);
  if (useRemote()) {
    void fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => undefined);
  }
  return projects.find((p) => p.id === id);
}

export function updateProjectNotes(id: string, notes: string) {
  const projects = loadProjects().map((p) =>
    p.id === id ? { ...p, notes, updatedAt: new Date().toISOString() } : p,
  );
  saveProjects(projects);
  if (useRemote()) {
    void fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    }).catch(() => undefined);
  }
  return projects.find((p) => p.id === id);
}

export function addDemoFile(id: string, name: string): ProjectFile | undefined {
  const file: ProjectFile = {
    id: `f_${nanoid(6)}`,
    name,
    sizeLabel: `${(Math.random() * 4 + 0.2).toFixed(1)} MB`,
    uploadedAt: new Date().toISOString().slice(0, 10),
  };
  const projects = loadProjects().map((p) =>
    p.id === id
      ? {
          ...p,
          files: [file, ...p.files],
          updatedAt: new Date().toISOString(),
        }
      : p,
  );
  saveProjects(projects);
  return file;
}

export function addPayment(
  id: string,
  label: string,
  amountCents: number,
): PaymentRequest | undefined {
  const payment: PaymentRequest = {
    id: `pay_${nanoid(6)}`,
    label,
    amountCents,
    status: "sent",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  const projects = loadProjects().map((p) =>
    p.id === id
      ? {
          ...p,
          payments: [payment, ...p.payments],
          updatedAt: new Date().toISOString(),
        }
      : p,
  );
  saveProjects(projects);

  if (useRemote()) {
    void fetch(`/api/projects/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_payment",
        label,
        amountCents,
        paymentId: payment.id,
      }),
    }).catch(() => undefined);
  }
  return payment;
}

export function markPaymentPaidLocal(
  projectId: string,
  paymentId: string,
): PaymentRequest | undefined {
  let updated: PaymentRequest | undefined;
  const projects = loadProjects().map((p) => {
    if (p.id !== projectId) return p;
    return {
      ...p,
      payments: p.payments.map((pay) => {
        if (pay.id !== paymentId) return pay;
        updated = { ...pay, status: "paid" as const };
        return updated;
      }),
      updatedAt: new Date().toISOString(),
    };
  });
  saveProjects(projects);

  if (useRemote()) {
    void fetch(`/api/projects/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "mark_payment_paid",
        paymentId,
      }),
    }).catch(() => undefined);
  }
  return updated;
}

/**
 * Client deposit / invoice checkout via the freelancer’s Razorpay keys
 * (Settings → Client Razorpay). Platform keys are not used for client $.
 */
export async function startDepositCheckout(
  projectId: string,
  label: string,
  amountCents: number,
  options?: {
    paymentId?: string;
    shareToken?: string;
    onPaidRedirect?: string;
  },
) {
  const { openRazorpayCheckout } = await import("@/lib/razorpay-browser");

  const res = await fetch("/api/checkout/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId,
      label,
      amountCents,
      paymentId: options?.paymentId,
      shareToken: options?.shareToken,
    }),
  });
  const data = (await res.json()) as {
    orderId?: string;
    amount?: number;
    currency?: string;
    keyId?: string;
    paymentId?: string;
    description?: string;
    name?: string;
    email?: string;
    error?: string;
  };
  if (!res.ok || !data.orderId || !data.keyId) {
    throw new Error(data.error || "Checkout failed");
  }

  await openRazorpayCheckout(
    {
      orderId: data.orderId,
      amount: data.amount!,
      currency: data.currency!,
      keyId: data.keyId,
      description: data.description || label,
      name: data.name,
      email: data.email,
    },
    async (payment) => {
      const verify = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payment,
          type: "deposit",
          paymentId: data.paymentId ?? options?.paymentId,
        }),
      });
      if (!verify.ok) {
        const err = (await verify.json()) as { error?: string };
        throw new Error(err.error || "Payment verification failed");
      }
      window.location.href =
        options?.onPaidRedirect ??
        `/dashboard/projects/${projectId}?paid=1`;
    },
  );
}
