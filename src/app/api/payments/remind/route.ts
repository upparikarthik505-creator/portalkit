import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { appUrl } from "@/lib/razorpay";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

async function requireUser() {
  const userId = await requireAuthenticatedUserId();
  if (!userId) {
    return {
      error: NextResponse.json({ error: "Sign in required." }, { status: 401 }),
    };
  }
  return { userId };
}

/** Manual reminder from freelancer dashboard. */
export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase required" }, { status: 503 });
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const body = (await req.json()) as { paymentId?: string };
    if (!body.paymentId) {
      return NextResponse.json({ error: "paymentId required" }, { status: 400 });
    }

    const sb = getSupabaseAdmin()!;
    const { data: pay } = await sb
      .from("payments")
      .select("id, label, amount_cents, status, project_id")
      .eq("id", body.paymentId)
      .maybeSingle();
    if (!pay || pay.status === "paid") {
      return NextResponse.json({ error: "Not found or already paid" }, { status: 404 });
    }

    const { data: project } = await sb
      .from("projects")
      .select("name, client_name, client_email, share_token, workspace_id")
      .eq("id", pay.project_id)
      .maybeSingle();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: ws } = await sb
      .from("workspaces")
      .select("clerk_user_id, studio_name")
      .eq("id", project.workspace_id)
      .maybeSingle();
    if (!ws || ws.clerk_user_id !== auth.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const portal = `${appUrl()}/p/${project.share_token}`;
    const amount = ((pay.amount_cents as number) / 100).toFixed(2);
    const result = await sendEmail({
      to: project.client_email as string,
      fromName: (ws.studio_name as string) || "Studio",
      subject: `Payment reminder: ${pay.label}`,
      text: `Hi ${project.client_name},\n\nFriendly reminder that “${pay.label}” ($${amount}) is still open for ${project.name}.\n\nPay here: ${portal}\n\n— ${ws.studio_name || "Your freelancer"}`,
    });

    await sb
      .from("payments")
      .update({ last_reminder_at: new Date().toISOString() })
      .eq("id", pay.id);

    return NextResponse.json({
      ok: true,
      emailed: result.ok,
      skipped: result.skipped,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
