import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import {
  addTask,
  listMessages,
  listTasks,
  postMessage,
  setTaskDone,
} from "@/lib/delivery-db";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

async function requireUser() {
  const userId = await requireAuthenticatedUserId();
  if (!userId) {
    return {
      error: NextResponse.json({ error: "Sign in required." }, { status: 401 }),
    };
  }
  return { userId };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ tasks: [], messages: [] });
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const [tasks, messages] = await Promise.all([
      listTasks(id),
      listMessages(id),
    ]);
    return NextResponse.json({ tasks, messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const body = (await req.json()) as {
      action?: string;
      title?: string;
      taskId?: string;
      done?: boolean;
      body?: string;
    };

    if (body.action === "add_task") {
      if (!body.title?.trim()) {
        return NextResponse.json({ error: "Title required" }, { status: 400 });
      }
      const task = await addTask(auth.userId, id, body.title);
      return NextResponse.json({ task });
    }
    if (body.action === "toggle_task") {
      if (!body.taskId) {
        return NextResponse.json({ error: "taskId required" }, { status: 400 });
      }
      const task = await setTaskDone(
        id,
        body.taskId,
        !!body.done,
        "owner",
        auth.userId,
      );
      if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ task });
    }
    if (body.action === "post_message") {
      if (!body.body?.trim()) {
        return NextResponse.json({ error: "Message required" }, { status: 400 });
      }
      const message = await postMessage({
        projectId: id,
        body: body.body,
        author: "freelancer",
        clerkUserId: auth.userId,
      });
      return NextResponse.json({ message });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
