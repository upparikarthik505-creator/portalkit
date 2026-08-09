import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { appUrl } from "@/lib/razorpay";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

/**
 * Overdue payment nudges. Protect with CRON_SECRET header.
 * Vercel cron: Authorization: Bearer $CRON_SECRET
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ sent: 0 });
  }

  const sb = getSupabaseAdmin()!;
  const today = new Date().toISOString().slice(0, 10);
  const { data: overdue } = await sb
    .from("payments")
    .select("id, label, amount_cents, due_at, last_reminder_at, project_id")
    .eq("status", "sent")
    .not("due_at", "is", null)
    .lte("due_at", today)
    .limit(50);

  let sent = 0;
  for (const pay of overdue ?? []) {
    const last = pay.last_reminder_at
      ? new Date(pay.last_reminder_at as string).getTime()
      : 0;
    if (Date.now() - last < 24 * 60 * 60 * 1000) continue; // idempotent daily

    const { data: project } = await sb
      .from("projects")
      .select("name, client_name, client_email, share_token, workspace_id")
      .eq("id", pay.project_id)
      .maybeSingle();
    if (!project?.client_email) continue;

    const { data: ws } = await sb
      .from("workspaces")
      .select("studio_name")
      .eq("id", project.workspace_id)
      .maybeSingle();

    const portal = `${appUrl()}/p/${project.share_token}`;
    const amount = ((pay.amount_cents as number) / 100).toFixed(2);
    const result = await sendEmail({
      to: project.client_email as string,
      fromName: (ws?.studio_name as string) || "Studio",
      subject: `Overdue: ${pay.label}`,
      text: `Hi ${project.client_name},\n\n“${pay.label}” ($${amount}) for ${project.name} was due ${pay.due_at}.\n\nPay here: ${portal}\n`,
    });
    if (result.ok || result.skipped) {
      await sb
        .from("payments")
        .update({ last_reminder_at: new Date().toISOString() })
        .eq("id", pay.id);
      if (result.ok) sent += 1;
    }
  }

  return NextResponse.json({ sent, checked: overdue?.length ?? 0 });
}
