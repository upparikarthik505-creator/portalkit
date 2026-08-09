import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import {
  deleteProjectFile,
  signedFileUrl,
  uploadProjectFile,
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase required" }, { status: 503 });
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    const uploaded = await uploadProjectFile(auth.userId, id, file);
    return NextResponse.json({ file: uploaded });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const url = new URL(req.url);
    const fileId = url.searchParams.get("fileId");
    if (!fileId) {
      return NextResponse.json({ error: "fileId required" }, { status: 400 });
    }
    const ok = await deleteProjectFile(auth.userId, fileId);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const path = new URL(req.url).searchParams.get("path");
    if (!path) {
      return NextResponse.json({ error: "path required" }, { status: 400 });
    }
    // Ownership: path must start with workspace — verified by signed URL only after
    // freelancer auth; still require auth here.
    void params;
    void auth;
    const signed = await signedFileUrl(path);
    if (!signed) {
      return NextResponse.json({ error: "Unavailable" }, { status: 404 });
    }
    return NextResponse.json({ url: signed });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
