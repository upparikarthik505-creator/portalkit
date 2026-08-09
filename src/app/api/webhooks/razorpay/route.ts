import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

type RazorpayWebhook = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        notes?: Record<string, string>;
        status?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
        notes?: Record<string, string>;
      };
    };
    subscription?: {
      entity?: {
        id?: string;
        status?: string;
        notes?: Record<string, string>;
      };
    };
  };
};

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: RazorpayWebhook;
  try {
    event = JSON.parse(raw) as RazorpayWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ received: true, persisted: false });
  }

  const sb = getSupabaseAdmin()!;

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const payment = event.payload?.payment?.entity;
    const notes = payment?.notes ?? event.payload?.order?.entity?.notes ?? {};

    if (notes.type === "deposit") {
      if (notes.payment_id) {
        await sb
          .from("payments")
          .update({
            status: "paid",
            razorpay_payment_id: payment?.id ?? null,
            razorpay_order_id: payment?.order_id ?? null,
          })
          .eq("id", notes.payment_id);

        if (notes.project_id) {
          await sb
            .from("projects")
            .update({
              status: "deposit_paid",
              updated_at: new Date().toISOString(),
            })
            .eq("id", notes.project_id)
            .in("status", ["signed", "offer_sent", "lead"]);
        }
      }
      return NextResponse.json({ received: true, deposit: true });
    }

    if (
      (notes.plan === "pro" ||
        notes.plan === "pro_yearly" ||
        notes.plan === "founder") &&
      notes.clerk_user_id
    ) {
      const plan = notes.plan === "founder" ? "founder" : "pro";
      await sb
        .from("workspaces")
        .update({
          plan,
          razorpay_payment_id: payment?.id ?? null,
          razorpay_order_id: payment?.order_id ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", notes.clerk_user_id);
    }
  }

  const sub = event.payload?.subscription?.entity;
  const subNotes = sub?.notes ?? {};
  const subId = sub?.id;
  const clerkUserId = subNotes.clerk_user_id;

  if (
    subId &&
    clerkUserId &&
    (event.event === "subscription.activated" ||
      event.event === "subscription.charged" ||
      event.event === "subscription.resumed")
  ) {
    await sb
      .from("workspaces")
      .update({
        plan: "pro",
        razorpay_subscription_id: subId,
        plan_interval: subNotes.interval || null,
        subscription_status: sub?.status || "active",
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_user_id", clerkUserId);
    return NextResponse.json({ received: true, subscription: true });
  }

  if (
    subId &&
    (event.event === "subscription.cancelled" ||
      event.event === "subscription.completed" ||
      event.event === "subscription.halted")
  ) {
    // Downgrade Pro subscribers — never touch Founder.
    const { data: ws } = await sb
      .from("workspaces")
      .select("id, plan, clerk_user_id")
      .eq("razorpay_subscription_id", subId)
      .maybeSingle();

    if (ws && ws.plan !== "founder") {
      await sb
        .from("workspaces")
        .update({
          plan: "starter",
          subscription_status: sub?.status || "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ws.id);
    } else if (clerkUserId) {
      await sb
        .from("workspaces")
        .update({
          plan: "starter",
          razorpay_subscription_id: subId,
          subscription_status: sub?.status || "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", clerkUserId)
        .neq("plan", "founder");
    }
    return NextResponse.json({ received: true, downgraded: true });
  }

  return NextResponse.json({ received: true });
}
