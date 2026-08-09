import { nanoid } from "nanoid";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export type OfferStatus = "draft" | "sent" | "accepted" | "superseded";

export type Offer = {
  id: string;
  projectId: string;
  shareToken: string;
  title: string;
  scope: string;
  totalCents: number;
  depositCents: number;
  currency: string;
  status: OfferStatus;
  version: number;
  acceptedName: string | null;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type OfferRow = {
  id: string;
  project_id: string;
  share_token: string;
  title: string;
  scope: string;
  total_cents: number;
  deposit_cents: number;
  currency: string;
  status: OfferStatus;
  version: number;
  accepted_name: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    projectId: row.project_id,
    shareToken: row.share_token,
    title: row.title,
    scope: row.scope,
    totalCents: row.total_cents,
    depositCents: row.deposit_cents,
    currency: row.currency,
    status: row.status,
    version: row.version,
    acceptedName: row.accepted_name,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function workspaceId(clerkUserId: string) {
  const sb = getSupabaseAdmin()!;
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

export async function listOffersForUser(clerkUserId: string): Promise<Offer[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getSupabaseAdmin()!;
  const wid = await workspaceId(clerkUserId);
  const { data, error } = await sb
    .from("offers")
    .select("*")
    .eq("workspace_id", wid)
    .neq("status", "superseded")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as OfferRow[]).map(mapOffer);
}

export async function createOfferForUser(
  clerkUserId: string,
  input: {
    projectId: string;
    title: string;
    scope: string;
    totalCents: number;
    depositCents: number;
    send?: boolean;
  },
): Promise<Offer> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const sb = getSupabaseAdmin()!;
  const wid = await workspaceId(clerkUserId);

  const { data: project } = await sb
    .from("projects")
    .select("id")
    .eq("id", input.projectId)
    .eq("workspace_id", wid)
    .maybeSingle();
  if (!project) throw new Error("Project not found");

  // Supersede prior non-accepted versions for this project.
  await sb
    .from("offers")
    .update({ status: "superseded", updated_at: new Date().toISOString() })
    .eq("project_id", input.projectId)
    .eq("workspace_id", wid)
    .in("status", ["draft", "sent"]);

  const { data: latest } = await sb
    .from("offers")
    .select("version")
    .eq("project_id", input.projectId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date().toISOString();
  const status: OfferStatus = input.send ? "sent" : "draft";
  const row = {
    id: `off_${nanoid(8)}`,
    workspace_id: wid,
    project_id: input.projectId,
    share_token: nanoid(12),
    title: input.title.trim(),
    scope: input.scope.trim(),
    total_cents: input.totalCents,
    deposit_cents: input.depositCents,
    currency: "USD",
    status,
    version: ((latest?.version as number) || 0) + 1,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await sb.from("offers").insert(row).select("*").single();
  if (error) throw error;

  if (input.send) {
    await sb
      .from("projects")
      .update({ status: "offer_sent", updated_at: now })
      .eq("id", input.projectId)
      .eq("workspace_id", wid);

    const [{ data: project }, { data: workspace }] = await Promise.all([
      sb
        .from("projects")
        .select("client_name, client_email")
        .eq("id", input.projectId)
        .maybeSingle(),
      sb
        .from("workspaces")
        .select("studio_name")
        .eq("id", wid)
        .maybeSingle(),
    ]);
    if (project?.client_email) {
      const { emailOfferSent } = await import("@/lib/transactional-email");
      void emailOfferSent({
        to: project.client_email as string,
        studioName: (workspace?.studio_name as string) || "Studio",
        offerTitle: row.title,
        shareToken: row.share_token,
        clientName: (project.client_name as string) || "there",
      }).catch(() => undefined);
    }
  }

  return mapOffer(data as OfferRow);
}

export async function getOfferByShareToken(token: string): Promise<{
  offer: Offer;
  projectName: string;
  clientName: string;
  studioName: string;
  accent: string;
} | null> {
  if (!token || !isSupabaseConfigured()) return null;
  const sb = getSupabaseAdmin()!;
  const { data, error } = await sb
    .from("offers")
    .select("*")
    .eq("share_token", token)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const offer = mapOffer(data as OfferRow);
  if (offer.status === "superseded" || offer.status === "draft") return null;

  const [{ data: project }, { data: workspace }] = await Promise.all([
    sb
      .from("projects")
      .select("name, client_name")
      .eq("id", offer.projectId)
      .maybeSingle(),
    sb
      .from("workspaces")
      .select("studio_name, brand_accent")
      .eq("id", (data as { workspace_id: string }).workspace_id)
      .maybeSingle(),
  ]);

  return {
    offer,
    projectName: (project?.name as string) ?? "Project",
    clientName: (project?.client_name as string) ?? "Client",
    studioName: (workspace?.studio_name as string) ?? "Studio",
    accent: (workspace?.brand_accent as string) ?? "#FF5A5F",
  };
}

export async function acceptOfferByToken(
  token: string,
  acceptedName: string,
): Promise<{
  offer: Offer;
  shareToken: string;
  invoicePaymentIds: string[];
} | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = getSupabaseAdmin()!;
  const { data: existing } = await sb
    .from("offers")
    .select("*")
    .eq("share_token", token)
    .maybeSingle();
  if (!existing) return null;
  const offer = mapOffer(existing as OfferRow);
  if (offer.status !== "sent") return null;

  const now = new Date().toISOString();
  const { data, error } = await sb
    .from("offers")
    .update({
      status: "accepted",
      accepted_name: acceptedName.trim(),
      accepted_at: now,
      updated_at: now,
    })
    .eq("id", offer.id)
    .eq("status", "sent")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  await sb
    .from("projects")
    .update({ status: "signed", updated_at: now })
    .eq("id", offer.projectId);

  // Invoice from offer: deposit ask (+ balance if any).
  const payments: {
    id: string;
    project_id: string;
    label: string;
    amount_cents: number;
    status: string;
    created_at: string;
    due_at: string;
  }[] = [];
  const day = now.slice(0, 10);
  const due = new Date();
  due.setDate(due.getDate() + 7);
  const dueAt = due.toISOString().slice(0, 10);
  if (offer.depositCents > 0) {
    payments.push({
      id: `pay_${nanoid(6)}`,
      project_id: offer.projectId,
      label: `Deposit — ${offer.title}`,
      amount_cents: offer.depositCents,
      status: "sent",
      created_at: day,
      due_at: dueAt,
    });
  }
  const balance = offer.totalCents - offer.depositCents;
  if (balance > 0) {
    payments.push({
      id: `pay_${nanoid(6)}`,
      project_id: offer.projectId,
      label: `Balance — ${offer.title}`,
      amount_cents: balance,
      status: "sent",
      created_at: day,
      due_at: dueAt,
    });
  }
  if (payments.length === 0 && offer.totalCents > 0) {
    payments.push({
      id: `pay_${nanoid(6)}`,
      project_id: offer.projectId,
      label: `Invoice — ${offer.title}`,
      amount_cents: offer.totalCents,
      status: "sent",
      created_at: day,
      due_at: dueAt,
    });
  }
  if (payments.length) {
    await sb.from("payments").insert(payments);
  }

  const { data: projectRow } = await sb
    .from("projects")
    .select("share_token, client_email, client_name, workspace_id")
    .eq("id", offer.projectId)
    .maybeSingle();

  const shareToken = (projectRow?.share_token as string) || "";

  if (projectRow?.client_email && shareToken) {
    const { data: workspace } = await sb
      .from("workspaces")
      .select("studio_name, support_email, clerk_user_id")
      .eq("id", projectRow.workspace_id)
      .maybeSingle();
    const studio = (workspace?.studio_name as string) || "Studio";
    const { emailOfferSigned, emailPayLink } = await import(
      "@/lib/transactional-email"
    );
    void emailOfferSigned({
      to: projectRow.client_email as string,
      studioName: studio,
      offerTitle: offer.title,
      acceptedName: acceptedName.trim(),
      portalToken: shareToken,
    }).catch(() => undefined);

    // Notify freelancer support/studio email if set
    if (workspace?.support_email) {
      void emailOfferSigned({
        to: workspace.support_email as string,
        studioName: studio,
        offerTitle: offer.title,
        acceptedName: acceptedName.trim(),
        portalToken: shareToken,
      }).catch(() => undefined);
    }

    const deposit = payments.find((p) => /deposit/i.test(p.label));
    if (deposit) {
      void emailPayLink({
        to: projectRow.client_email as string,
        studioName: studio,
        clientName: (projectRow.client_name as string) || "there",
        label: deposit.label,
        amountCents: deposit.amount_cents,
        portalToken: shareToken,
      }).catch(() => undefined);
    }
  }

  return {
    offer: mapOffer(data as OfferRow),
    shareToken,
    invoicePaymentIds: payments.map((p) => p.id),
  };
}
