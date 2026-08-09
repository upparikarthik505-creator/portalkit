import { NextResponse } from "next/server";
import {
  listMessages,
  listTasks,
  postMessage,
  projectByShareToken,
  setTaskDone,
  signedFileUrl,
} from "@/lib/delivery-db";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Unavailable" }, { status: 503 });
    }
    const project = await projectByShareToken(token);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const url = new URL(req.url);
    const fileId = url.searchParams.get("fileId");
    if (fileId) {
      const sb = getSupabaseAdmin()!;
      const { data: file } = await sb
        .from("project_files")
        .select("storage_path, project_id")
        .eq("id", fileId)
        .eq("project_id", project.id)
        .maybeSingle();
      if (!file?.storage_path) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      const signed = await signedFileUrl(file.storage_path as string);
      if (!signed) {
        return NextResponse.json({ error: "Unavailable" }, { status: 404 });
      }
      return NextResponse.json({ url: signed });
    }

    const [tasks, messages] = await Promise.all([
      listTasks(project.id as string),
      listMessages(project.id as string),
    ]);
    return NextResponse.json({
      projectId: project.id,
      tasks,
      messages,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const project = await projectByShareToken(token);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const body = (await req.json()) as {
      action?: string;
      taskId?: string;
      done?: boolean;
      body?: string;
    };
    const projectId = project.id as string;

    if (body.action === "toggle_task") {
      if (!body.taskId) {
        return NextResponse.json({ error: "taskId required" }, { status: 400 });
      }
      const task = await setTaskDone(
        projectId,
        body.taskId,
        !!body.done,
        "portal",
        undefined,
        token,
      );
      if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ task });
    }
    if (body.action === "post_message") {
      if (!body.body?.trim()) {
        return NextResponse.json({ error: "Message required" }, { status: 400 });
      }
      const message = await postMessage({
        projectId,
        body: body.body,
        author: "client",
        shareToken: token,
      });
      return NextResponse.json({ message });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
