import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import {
  getRazorpay,
  getRazorpayWithKeys,
  verifyPaymentSignature,
  verifySubscriptionPaymentSignature,
} from "@/lib/razorpay";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

async function upsertWorkspacePlan(input: {
  clerkUserId: string;
  plan: "pro" | "founder";
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  razorpaySubscriptionId?: string | null;
  planInterval?: string | null;
  subscriptionStatus?: string | null;
}) {
  if (!isSupabaseConfigured()) return false;
  const sb = getSupabaseAdmin()!;
  const { data: existing } = await sb
    .from("workspaces")
    .select("id")
    .eq("clerk_user_id", input.clerkUserId)
    .maybeSingle();

  const patch = {
    plan: input.plan,
    razorpay_payment_id: input.razorpayPaymentId ?? null,
    razorpay_order_id: input.razorpayOrderId ?? null,
    razorpay_subscription_id: input.razorpaySubscriptionId ?? null,
    plan_interval: input.planInterval ?? null,
    subscription_status: input.subscriptionStatus ?? null,
    updated_at: new Date().toISOString(),
  };

  if (!existing?.id) {
    const { error } = await sb.from("workspaces").insert({
      clerk_user_id: input.clerkUserId,
      name: "My workspace",
      ...patch,
    });
    if (error) throw error;
  } else {
    const { error } = await sb
      .from("workspaces")
      .update(patch)
      .eq("clerk_user_id", input.clerkUserId);
    if (error) throw error;
  }
  return true;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      razorpay_order_id?: string;
      razorpay_subscription_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      plan?: string;
      paymentId?: string;
      type?: "plan" | "deposit" | "plan_subscription";
    };

    if (!body.razorpay_payment_id || !body.razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    if (body.type === "deposit") {
      if (!body.razorpay_order_id) {
        return NextResponse.json({ error: "Missing order id" }, { status: 400 });
      }
      if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: "Unavailable" }, { status: 503 });
      }
      const sb = getSupabaseAdmin()!;

      let paymentRow: {
        id: string;
        project_id: string;
        label: string;
        status: string;
      } | null = null;

      if (body.paymentId) {
        const { data } = await sb
          .from("payments")
          .select("id, project_id, label, status")
          .eq("id", body.paymentId)
          .maybeSingle();
        paymentRow = data;
      }
      if (!paymentRow) {
        const { data } = await sb
          .from("payments")
          .select("id, project_id, label, status")
          .eq("razorpay_order_id", body.razorpay_order_id)
          .maybeSingle();
        paymentRow = data;
      }
      if (!paymentRow) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }

      const { data: project } = await sb
        .from("projects")
        .select("workspace_id, status")
        .eq("id", paymentRow.project_id)
        .maybeSingle();
      if (!project?.workspace_id) {
        return NextResponse.json({ error: "Workspace missing" }, { status: 500 });
      }

      const { data: workspace } = await sb
        .from("workspaces")
        .select("client_razorpay_key_id, client_razorpay_key_secret")
        .eq("id", project.workspace_id)
        .maybeSingle();
      const secret = (workspace?.client_razorpay_key_secret as string) || "";
      const keyId = (workspace?.client_razorpay_key_id as string) || "";
      if (!secret || !keyId) {
        return NextResponse.json(
          { error: "Freelancer Razorpay not configured" },
          { status: 503 },
        );
      }

      const ok = verifyPaymentSignature(
        {
          orderId: body.razorpay_order_id,
          paymentId: body.razorpay_payment_id,
          signature: body.razorpay_signature,
        },
        secret,
      );
      if (!ok) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }

      const rzp = getRazorpayWithKeys(keyId, secret);
      const order = await rzp.orders.fetch(body.razorpay_order_id);
      const notes = (order.notes ?? {}) as Record<string, string>;
      if (notes.type !== "deposit" || notes.payment_id !== paymentRow.id) {
        return NextResponse.json({ error: "Order mismatch" }, { status: 403 });
      }

      await sb
        .from("payments")
        .update({
          status: "paid",
          razorpay_payment_id: body.razorpay_payment_id,
          razorpay_order_id: body.razorpay_order_id,
        })
        .eq("id", paymentRow.id);

      if (/deposit/i.test(paymentRow.label) || project.status === "signed") {
        await sb
          .from("projects")
          .update({
            status: "deposit_paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", paymentRow.project_id)
          .in("status", ["signed", "offer_sent", "lead"]);
      }

      const { data: payFull } = await sb
        .from("payments")
        .select("amount_cents, label")
        .eq("id", paymentRow.id)
        .maybeSingle();
      const { data: projFull } = await sb
        .from("projects")
        .select("client_email, client_name, workspace_id")
        .eq("id", paymentRow.project_id)
        .maybeSingle();
      if (projFull?.client_email && payFull) {
        const { data: ws } = await sb
          .from("workspaces")
          .select("studio_name")
          .eq("id", projFull.workspace_id)
          .maybeSingle();
        const { emailPaymentReceipt } = await import(
          "@/lib/transactional-email"
        );
        void emailPaymentReceipt({
          to: projFull.client_email as string,
          studioName: (ws?.studio_name as string) || "Studio",
          clientName: (projFull.client_name as string) || "there",
          label: (payFull.label as string) || paymentRow.label,
          amountCents: payFull.amount_cents as number,
        }).catch(() => undefined);
      }

      return NextResponse.json({ ok: true, type: "deposit", persisted: true });
    }

    const clerkUserId = await requireAuthenticatedUserId();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Sign in required to activate a plan." },
        { status: 401 },
      );
    }

    const rzp = getRazorpay();
    if (!rzp) {
      return NextResponse.json({ error: "Payments unavailable" }, { status: 503 });
    }

    // Recurring Pro subscription
    if (
      body.type === "plan_subscription" ||
      (!body.razorpay_order_id && body.razorpay_subscription_id)
    ) {
      if (!body.razorpay_subscription_id) {
        return NextResponse.json(
          { error: "Missing subscription id" },
          { status: 400 },
        );
      }

      const ok = verifySubscriptionPaymentSignature({
        paymentId: body.razorpay_payment_id,
        subscriptionId: body.razorpay_subscription_id,
        signature: body.razorpay_signature,
      });
      if (!ok) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }

      const sub = await rzp.subscriptions.fetch(body.razorpay_subscription_id);
      const notes = (sub.notes ?? {}) as Record<string, string>;
      if (
        notes.type !== "plan_subscription" ||
        notes.clerk_user_id !== clerkUserId
      ) {
        return NextResponse.json({ error: "Subscription mismatch" }, { status: 403 });
      }

      const planNote = notes.plan;
      if (planNote !== "pro" && planNote !== "pro_yearly") {
        return NextResponse.json({ error: "Unknown plan on subscription" }, { status: 400 });
      }

      const persisted = await upsertWorkspacePlan({
        clerkUserId,
        plan: "pro",
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySubscriptionId: body.razorpay_subscription_id,
        planInterval: notes.interval || (planNote === "pro_yearly" ? "yearly" : "monthly"),
        subscriptionStatus: (sub.status as string) || "active",
      });

      return NextResponse.json({
        ok: true,
        plan: "pro",
        mode: "subscription",
        persisted,
      });
    }

    if (!body.razorpay_order_id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const ok = verifyPaymentSignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!ok) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const order = await rzp.orders.fetch(body.razorpay_order_id);
    const notes = (order.notes ?? {}) as Record<string, string>;
    if (notes.type !== "plan" || notes.clerk_user_id !== clerkUserId) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 403 });
    }

    const planNote = notes.plan;
    if (
      planNote !== "pro" &&
      planNote !== "pro_yearly" &&
      planNote !== "founder"
    ) {
      return NextResponse.json({ error: "Unknown plan on order" }, { status: 400 });
    }

    const plan = planNote === "founder" ? "founder" : "pro";
    const persisted = await upsertWorkspacePlan({
      clerkUserId,
      plan,
      razorpayPaymentId: body.razorpay_payment_id,
      razorpayOrderId: body.razorpay_order_id,
      razorpaySubscriptionId: null,
      planInterval: plan === "pro" ? (planNote === "pro_yearly" ? "yearly" : "monthly") : null,
      subscriptionStatus: null,
    });

    return NextResponse.json({ ok: true, plan, mode: "order", persisted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
