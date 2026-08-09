import { nanoid } from "nanoid";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const BUCKET = "project-files";

export type ProjectTask = {
  id: string;
  projectId: string;
  title: string;
  done: boolean;
  doneAt: string | null;
  createdAt: string;
};

export type ProjectMessage = {
  id: string;
  projectId: string;
  author: "freelancer" | "client";
  body: string;
  createdAt: string;
};

async function workspaceIdForUser(clerkUserId: string) {
  const sb = getSupabaseAdmin()!;
  const { data } = await sb
    .from("workspaces")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();
  if (data?.id) return data.id as string;
  const { data: created, error } = await sb
    .from("workspaces")
    .insert({ clerk_user_id: clerkUserId, name: "My workspace" })
    .select("id")
    .single();
  if (error) throw error;
  return created.id as string;
}

async function assertProjectOwned(clerkUserId: string, projectId: string) {
  const sb = getSupabaseAdmin()!;
  const wid = await workspaceIdForUser(clerkUserId);
  const { data } = await sb
    .from("projects")
    .select("id, workspace_id, share_token, client_email, client_name, name")
    .eq("id", projectId)
    .eq("workspace_id", wid)
    .maybeSingle();
  return data;
}

async function projectByShareToken(token: string) {
  const sb = getSupabaseAdmin()!;
  const { data } = await sb
    .from("projects")
    .select("id, workspace_id, share_token, client_email, client_name, name")
    .eq("share_token", token)
    .maybeSingle();
  if (!data || data.share_token !== token) return null;
  return data;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function uploadProjectFile(
  clerkUserId: string,
  projectId: string,
  file: File,
) {
  if (!isSupabaseConfigured()) throw new Error("Supabase required");
  if (file.size > 10 * 1024 * 1024) throw new Error("Max file size is 10MB");

  const project = await assertProjectOwned(clerkUserId, projectId);
  if (!project) throw new Error("Project not found");

  const sb = getSupabaseAdmin()!;
  const id = `file_${nanoid(8)}`;
  const safeName = file.name.replace(/[^\w.\-()+ ]/g, "_").slice(0, 120);
  const path = `${project.workspace_id}/${projectId}/${id}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) {
    throw new Error(
      upErr.message.includes("Bucket") || upErr.message.includes("not found")
        ? "Create a private Storage bucket named project-files in Supabase."
        : upErr.message,
    );
  }

  const uploadedAt = new Date().toISOString().slice(0, 10);
  const row = {
    id,
    project_id: projectId,
    name: safeName,
    size_label: formatSize(file.size),
    storage_path: path,
    uploaded_at: uploadedAt,
  };
  const { error } = await sb.from("project_files").insert(row);
  if (error) throw error;

  return {
    id,
    name: safeName,
    sizeLabel: formatSize(file.size),
    uploadedAt,
    storagePath: path,
  };
}

export async function signedFileUrl(storagePath: string) {
  if (!isSupabaseConfigured() || !storagePath) return null;
  const sb = getSupabaseAdmin()!;
  const { data, error } = await sb.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 30);
  if (error) return null;
  return data.signedUrl;
}

export async function deleteProjectFile(clerkUserId: string, fileId: string) {
  if (!isSupabaseConfigured()) return false;
  const sb = getSupabaseAdmin()!;
  const { data: plain } = await sb
    .from("project_files")
    .select("id, storage_path, project_id")
    .eq("id", fileId)
    .maybeSingle();
  if (!plain) return false;
  const owned = await assertProjectOwned(clerkUserId, plain.project_id as string);
  if (!owned) return false;
  const path = plain.storage_path as string | null;
  if (path) await sb.storage.from(BUCKET).remove([path]);
  await sb.from("project_files").delete().eq("id", fileId);
  return true;
}

export async function listTasks(projectId: string): Promise<ProjectTask[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getSupabaseAdmin()!;
  const { data, error } = await sb
    .from("project_tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id as string,
    projectId: r.project_id as string,
    title: r.title as string,
    done: !!r.done,
    doneAt: (r.done_at as string) || null,
    createdAt: r.created_at as string,
  }));
}

export async function addTask(
  clerkUserId: string,
  projectId: string,
  title: string,
) {
  const owned = await assertProjectOwned(clerkUserId, projectId);
  if (!owned) throw new Error("Project not found");
  const sb = getSupabaseAdmin()!;
  const row = {
    id: `tsk_${nanoid(8)}`,
    project_id: projectId,
    title: title.trim(),
    done: false,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await sb
    .from("project_tasks")
    .insert(row)
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id as string,
    projectId,
    title: data.title as string,
    done: false,
    doneAt: null,
    createdAt: data.created_at as string,
  };
}

export async function setTaskDone(
  projectId: string,
  taskId: string,
  done: boolean,
  via: "owner" | "portal",
  clerkUserId?: string,
  shareToken?: string,
) {
  if (!isSupabaseConfigured()) return null;
  if (via === "owner") {
    if (!clerkUserId) return null;
    const owned = await assertProjectOwned(clerkUserId, projectId);
    if (!owned) return null;
  } else {
    const p = shareToken ? await projectByShareToken(shareToken) : null;
    if (!p || p.id !== projectId) return null;
  }
  const sb = getSupabaseAdmin()!;
  const { data, error } = await sb
    .from("project_tasks")
    .update({
      done,
      done_at: done ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .eq("project_id", projectId)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id as string,
    projectId,
    title: data.title as string,
    done: !!data.done,
    doneAt: (data.done_at as string) || null,
    createdAt: data.created_at as string,
  };
}

export async function listMessages(
  projectId: string,
): Promise<ProjectMessage[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getSupabaseAdmin()!;
  const { data, error } = await sb
    .from("project_messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id as string,
    projectId: r.project_id as string,
    author: r.author as "freelancer" | "client",
    body: r.body as string,
    createdAt: r.created_at as string,
  }));
}

export async function postMessage(input: {
  projectId: string;
  body: string;
  author: "freelancer" | "client";
  clerkUserId?: string;
  shareToken?: string;
}) {
  if (!isSupabaseConfigured()) throw new Error("Supabase required");
  if (input.author === "freelancer") {
    if (!input.clerkUserId) throw new Error("Auth required");
    const owned = await assertProjectOwned(input.clerkUserId, input.projectId);
    if (!owned) throw new Error("Project not found");
  } else {
    const p = input.shareToken
      ? await projectByShareToken(input.shareToken)
      : null;
    if (!p || p.id !== input.projectId) throw new Error("Project not found");
  }
  const sb = getSupabaseAdmin()!;
  const row = {
    id: `msg_${nanoid(8)}`,
    project_id: input.projectId,
    author: input.author,
    body: input.body.trim(),
    created_at: new Date().toISOString(),
  };
  const { data, error } = await sb
    .from("project_messages")
    .insert(row)
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id as string,
    projectId: input.projectId,
    author: data.author as "freelancer" | "client",
    body: data.body as string,
    createdAt: data.created_at as string,
  };
}

export { projectByShareToken, assertProjectOwned };
