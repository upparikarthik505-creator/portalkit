import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  storeUrl: string;
  notes: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  store_url: string | null;
  notes: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapContact(row: ContactRow): Contact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    company: row.company ?? "",
    storeUrl: row.store_url ?? "",
    notes: row.notes ?? "",
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureWorkspace(clerkUserId: string) {
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

export async function listContactsForUser(
  clerkUserId: string,
  opts?: { includeArchived?: boolean },
): Promise<Contact[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getSupabaseAdmin()!;
  const workspaceId = await ensureWorkspace(clerkUserId);
  let q = sb
    .from("contacts")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false });
  if (!opts?.includeArchived) {
    q = q.is("archived_at", null);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data as ContactRow[]).map(mapContact);
}

export async function createContactForUser(
  clerkUserId: string,
  input: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    storeUrl?: string;
    notes?: string;
  },
): Promise<Contact> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured");
  }
  const sb = getSupabaseAdmin()!;
  const workspaceId = await ensureWorkspace(clerkUserId);
  const now = new Date().toISOString();
  const { data, error } = await sb
    .from("contacts")
    .insert({
      workspace_id: workspaceId,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: (input.phone ?? "").trim(),
      company: (input.company ?? "").trim() || null,
      store_url: (input.storeUrl ?? "").trim() || null,
      notes: (input.notes ?? "").trim(),
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapContact(data as ContactRow);
}

export async function updateContactForUser(
  clerkUserId: string,
  id: string,
  patch: Partial<{
    name: string;
    email: string;
    phone: string;
    company: string;
    storeUrl: string;
    notes: string;
    archive: boolean;
  }>,
): Promise<Contact | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = getSupabaseAdmin()!;
  const workspaceId = await ensureWorkspace(clerkUserId);
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.name !== undefined) updates.name = patch.name.trim();
  if (patch.email !== undefined) updates.email = patch.email.trim().toLowerCase();
  if (patch.phone !== undefined) updates.phone = patch.phone.trim();
  if (patch.company !== undefined) updates.company = patch.company.trim() || null;
  if (patch.storeUrl !== undefined) {
    updates.store_url = patch.storeUrl.trim() || null;
  }
  if (patch.notes !== undefined) updates.notes = patch.notes.trim();
  if (patch.archive === true) updates.archived_at = new Date().toISOString();
  if (patch.archive === false) updates.archived_at = null;

  const { data, error } = await sb
    .from("contacts")
    .update(updates)
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? mapContact(data as ContactRow) : null;
}

export async function linkContactToProject(
  clerkUserId: string,
  projectId: string,
  contactId: string | null,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const sb = getSupabaseAdmin()!;
  const workspaceId = await ensureWorkspace(clerkUserId);

  if (contactId) {
    const { data: contact } = await sb
      .from("contacts")
      .select("id")
      .eq("id", contactId)
      .eq("workspace_id", workspaceId)
      .maybeSingle();
    if (!contact) return false;
  }

  const { error } = await sb
    .from("projects")
    .update({ contact_id: contactId, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("workspace_id", workspaceId);
  if (error) throw error;
  return true;
}
