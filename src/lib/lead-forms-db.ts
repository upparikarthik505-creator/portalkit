import { nanoid } from "nanoid";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

async function workspaceByClerk(clerkUserId: string) {
  const sb = getSupabaseAdmin()!;
  const { data: existing } = await sb
    .from("workspaces")
    .select("id, lead_form_token, studio_name")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();
  if (existing) return existing;

  const token = nanoid(12);
  const { data, error } = await sb
    .from("workspaces")
    .insert({
      clerk_user_id: clerkUserId,
      name: "My workspace",
      lead_form_token: token,
    })
    .select("id, lead_form_token, studio_name")
    .single();
  if (error) throw error;
  return data;
}

export async function getOrCreateLeadFormToken(clerkUserId: string) {
  if (!isSupabaseConfigured()) return null;
  const sb = getSupabaseAdmin()!;
  const row = await workspaceByClerk(clerkUserId);
  if (row.lead_form_token) {
    return {
      token: row.lead_form_token as string,
      studioName: (row.studio_name as string) || "Studio",
    };
  }
  const token = nanoid(12);
  await sb
    .from("workspaces")
    .update({ lead_form_token: token })
    .eq("id", row.id);
  return {
    token,
    studioName: (row.studio_name as string) || "Studio",
  };
}

export async function submitLeadForm(
  token: string,
  input: {
    name: string;
    email: string;
    message: string;
    budget?: string;
    honey?: string;
  },
) {
  if (input.honey) return { ok: true as const }; // bot trap
  if (!isSupabaseConfigured()) throw new Error("Unavailable");

  const sb = getSupabaseAdmin()!;
  const { data: workspace } = await sb
    .from("workspaces")
    .select("id, studio_name")
    .eq("lead_form_token", token)
    .maybeSingle();
  if (!workspace) return null;

  const now = new Date().toISOString();
  const { data: contact, error: cErr } = await sb
    .from("contacts")
    .insert({
      workspace_id: workspace.id,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      notes: [input.message.trim(), input.budget ? `Budget: ${input.budget}` : ""]
        .filter(Boolean)
        .join("\n"),
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();
  if (cErr) throw cErr;

  const projectId = `prj_${nanoid(8)}`;
  const shareToken = nanoid(10);
  const { error: pErr } = await sb.from("projects").insert({
    id: projectId,
    workspace_id: workspace.id,
    contact_id: contact.id,
    name: `Lead — ${input.name.trim()}`,
    client_name: input.name.trim(),
    client_email: input.email.trim().toLowerCase(),
    store_url: "",
    status: "lead",
    notes: input.message.trim(),
    share_token: shareToken,
    created_at: now,
    updated_at: now,
  });
  if (pErr) throw pErr;

  return {
    ok: true as const,
    projectId,
    studioName: (workspace.studio_name as string) || "Studio",
  };
}

export async function getLeadFormPublic(token: string) {
  if (!isSupabaseConfigured()) return null;
  const sb = getSupabaseAdmin()!;
  const { data } = await sb
    .from("workspaces")
    .select("studio_name, brand_accent")
    .eq("lead_form_token", token)
    .maybeSingle();
  if (!data) return null;
  return {
    studioName: (data.studio_name as string) || "Studio",
    accent: (data.brand_accent as string) || "#FF5A5F",
  };
}
