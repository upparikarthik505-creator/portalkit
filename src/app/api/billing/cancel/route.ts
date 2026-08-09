import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

/** Cancel Pro subscription at end of current billing cycle. */
export async function POST() {
  try {
    const userId = await requireAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Unavailable" }, { status: 503 });
    }

    const sb = getSupabaseAdmin()!;
    const { data: ws } = await sb
      .from("workspaces")
      .select("id, plan, razorpay_subscription_id, subscription_status")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (!ws) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    if (ws.plan === "founder") {
      return NextResponse.json(
        { error: "Founder is lifetime — nothing to cancel." },
        { status: 400 },
      );
    }
    if (!ws.razorpay_subscription_id) {
      return NextResponse.json(
        {
          error:
            "No active Razorpay subscription on this workspace. One-shot Pro stays until you contact support to downgrade.",
        },
        { status: 400 },
      );
    }

    const rzp = getRazorpay();
    if (!rzp) {
      return NextResponse.json({ error: "Payments unavailable" }, { status: 503 });
    }

    // false = cancel at cycle end (keep Pro until then)
    await rzp.subscriptions.cancel(ws.razorpay_subscription_id as string, false);

    await sb
      .from("workspaces")
      .update({
        subscription_status: "cancelling",
        updated_at: new Date().toISOString(),
      })
      .eq("id", ws.id);

    return NextResponse.json({
      ok: true,
      status: "cancelling",
      message: "Pro stays active until the end of the current billing period.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not cancel subscription" },
      { status: 500 },
    );
  }
}
