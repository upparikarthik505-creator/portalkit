import { nanoid } from "nanoid";
import { DEMO_PROJECTS } from "./demo-data";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase/admin";
import type { PaymentRequest, Project, ProjectFile, ProjectStatus } from "./types";
import { normalizeProjectStatus } from "./types";

type ProjectRow = {
  id: string;
  name: string;
  client_name: string;
  client_email: string;
  store_url: string;
  status: ProjectStatus;
  due_date: string | null;
  notes: string;
  share_token: string;
  contact_id?: string | null;
  created_at: string;
  updated_at: string;
  project_files?: {
    id: string;
    name: string;
    size_label: string;
    uploaded_at: string;
    storage_path?: string | null;
  }[];
  payments?: {
    id: string;
    label: string;
    amount_cents: number;
    status: PaymentRequest["status"];
    created_at: string;
  }[];
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    clientName: row.client_name,
    clientEmail: row.client_email,
    storeUrl: row.store_url,
    status: normalizeProjectStatus(row.status),
    dueDate: row.due_date ?? "",
    notes: row.notes ?? "",
    shareToken: row.share_token,
    contactId: row.contact_id ?? null,
    files: (row.project_files ?? []).map(
      (f): ProjectFile => ({
        id: f.id,
        name: f.name,
        sizeLabel: f.size_label,
        uploadedAt: f.uploaded_at,
        storagePath: f.storage_path ?? null,
      }),
    ),
    payments: (row.payments ?? []).map(
      (p): PaymentRequest => ({
        id: p.id,
        label: p.label,
        amountCents: p.amount_cents,
        status: p.status,
        createdAt: p.created_at,
      }),
    ),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureWorkspace(clerkUserId: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return null;

  const { data: existing } = await sb
    .from("workspaces")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (existing?.id) return existing.id as string;

  const { data, error } = await sb
    .from("workspaces")
    .insert({ clerk_user_id: clerkUserId, name: "My workspace" })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function listProjectsForUser(clerkUserId: string): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    // Local-only demo browsing. Real Clerk users never get shared seed data.
    return clerkUserId === "demo-user" ? DEMO_PROJECTS : [];
  }

  const sb = getSupabaseAdmin()!;
  const workspaceId = await ensureWorkspace(clerkUserId);

  const { data, error } = await sb
    .from("projects")
    .select("*, project_files(*), payments(*)")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  // Never seed DEMO_PROJECTS into a real Clerk workspace.
  return (data ?? []).map((row) => mapProject(row as ProjectRow));
}

export async function getProjectById(
  clerkUserId: string,
  id: string,
): Promise<Project | null> {
  const projects = await listProjectsForUser(clerkUserId);
  return projects.find((p) => p.id === id) ?? null;
}

/**
 * Public client-portal lookup.
 * Bound ONLY by unique `share_token` — no workspace_id or clerk user is
 * taken from the request, so a token cannot open another workspace's
 * project unless that project's exact token is known.
 */
export async function getProjectByShareToken(token: string): Promise<Project | null> {
  if (!token || typeof token !== "string") return null;

  // Fail closed: never serve DEMO_PROJECTS when Supabase is missing.
  if (!isSupabaseConfigured()) {
    return null;
  }

  const sb = getSupabaseAdmin()!;
  const { data, error } = await sb
    .from("projects")
    .select("*, project_files(*), payments(*)")
    .eq("share_token", token)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const project = mapProject(data as ProjectRow);
  // Refuse mismatches even if the DB row somehow differed (unique constraint + eq).
  if (project.shareToken !== token) return null;
  return project;
}

async function insertProject(clerkUserId: string, project: Project) {
  const sb = getSupabaseAdmin()!;
  const workspaceId = await ensureWorkspace(clerkUserId);

  const { error } = await sb.from("projects").insert({
    id: project.id,
    workspace_id: workspaceId,
    contact_id: project.contactId ?? null,
    name: project.name,
    client_name: project.clientName,
    client_email: project.clientEmail,
    store_url: project.storeUrl,
    status: project.status,
    due_date: project.dueDate || null,
    notes: project.notes,
    share_token: project.shareToken,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  });
  if (error) throw error;

  if (project.files.length) {
    await sb.from("project_files").insert(
      project.files.map((f) => ({
        id: f.id,
        project_id: project.id,
        name: f.name,
        size_label: f.sizeLabel,
        uploaded_at: f.uploadedAt,
      })),
    );
  }
  if (project.payments.length) {
    await sb.from("payments").insert(
      project.payments.map((p) => ({
        id: p.id,
        project_id: project.id,
        label: p.label,
        amount_cents: p.amountCents,
        status: p.status,
        created_at: p.createdAt,
      })),
    );
  }
}

export async function createProjectForUser(
  clerkUserId: string,
  input: {
    id?: string;
    shareToken?: string;
    name: string;
    clientName: string;
    clientEmail: string;
    storeUrl: string;
    dueDate: string;
    contactId?: string | null;
  },
): Promise<Project> {
  const now = new Date().toISOString();
  const project: Project = {
    id: input.id ?? `prj_${nanoid(8)}`,
    name: input.name,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    storeUrl: input.storeUrl,
    status: "lead",
    dueDate: input.dueDate,
    notes: "",
    shareToken: input.shareToken ?? nanoid(10),
    contactId: input.contactId ?? null,
    files: [],
    payments: [],
    updatedAt: now,
    createdAt: now,
  };

  if (!isSupabaseConfigured()) return project;

  await insertProject(clerkUserId, project);
  return project;
}

export async function updateProjectForUser(
  clerkUserId: string,
  id: string,
  patch: Partial<{
    status: ProjectStatus;
    notes: string;
  }>,
): Promise<Project | null> {
  if (!isSupabaseConfigured()) return null;

  const sb = getSupabaseAdmin()!;
  const workspaceId = await ensureWorkspace(clerkUserId);
  const { data, error } = await sb
    .from("projects")
    .update({
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .select("*, project_files(*), payments(*)")
    .maybeSingle();

  if (error) throw error;
  return data ? mapProject(data as ProjectRow) : null;
}

export async function addPaymentForUser(
  clerkUserId: string,
  projectId: string,
  label: string,
  amountCents: number,
  paymentId?: string,
): Promise<PaymentRequest | null> {
  const payment: PaymentRequest = {
    id: paymentId || `pay_${nanoid(6)}`,
    label,
    amountCents,
    status: "sent",
    createdAt: new Date().toISOString().slice(0, 10),
  };

  if (!isSupabaseConfigured()) return payment;

  const existing = await getProjectById(clerkUserId, projectId);
  if (!existing) return null;

  const due = new Date();
  due.setDate(due.getDate() + 7);

  const sb = getSupabaseAdmin()!;
  const { error } = await sb.from("payments").insert({
    id: payment.id,
    project_id: projectId,
    label: payment.label,
    amount_cents: payment.amountCents,
    status: payment.status,
    created_at: payment.createdAt,
    due_at: due.toISOString().slice(0, 10),
  });
  if (error) throw error;

  await sb
    .from("projects")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", projectId);

  return payment;
}

export async function markPaymentPaid(
  paymentId: string,
  razorpayPaymentId?: string,
) {
  if (!isSupabaseConfigured()) return;
  const sb = getSupabaseAdmin()!;
  await sb
    .from("payments")
    .update({
      status: "paid",
      razorpay_payment_id: razorpayPaymentId ?? null,
    })
    .eq("id", paymentId);
}

/** Freelancer mark-paid — scoped to workspace via project ownership. */
export async function markPaymentPaidForUser(
  clerkUserId: string,
  projectId: string,
  paymentId: string,
): Promise<PaymentRequest | null> {
  if (!isSupabaseConfigured()) return null;
  const existing = await getProjectById(clerkUserId, projectId);
  if (!existing) return null;
  const pay = existing.payments.find((p) => p.id === paymentId);
  if (!pay) return null;

  await markPaymentPaid(paymentId);

  if (existing.clientEmail) {
    const { getBrandingForUser } = await import("@/lib/workspace-branding-db");
    const branding = await getBrandingForUser(clerkUserId);
    const { emailPaymentReceipt } = await import("@/lib/transactional-email");
    void emailPaymentReceipt({
      to: existing.clientEmail,
      studioName: branding?.studioName || "Studio",
      clientName: existing.clientName || "there",
      label: pay.label,
      amountCents: pay.amountCents,
    }).catch(() => undefined);
  }

  return { ...pay, status: "paid" };
}
