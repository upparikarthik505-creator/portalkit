import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  getRazorpayWithKeys,
  isRazorpayConfigured,
} from "@/lib/razorpay";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

/**
 * Client deposit / invoice checkout.
 * Model: money goes to the freelancer’s own Razorpay keys stored on the
 * workspace (Settings). Platform PortalKit keys are never used for client $.
 */
export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Payments require Supabase." },
        { status: 503 },
      );
    }

    const body = (await req.json()) as {
      projectId?: string;
      paymentId?: string;
      shareToken?: string;
      label?: string;
      amountCents?: number;
    };

    const sb = getSupabaseAdmin()!;

    let projectId = body.projectId;
    if (!projectId && body.shareToken) {
      const { data: proj } = await sb
        .from("projects")
        .select("id, workspace_id, client_name, client_email, share_token")
        .eq("share_token", body.shareToken)
        .maybeSingle();
      if (!proj || proj.share_token !== body.shareToken) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      projectId = proj.id as string;
    }

    if (!projectId) {
      return NextResponse.json({ error: "Missing project" }, { status: 400 });
    }

    const { data: project } = await sb
      .from("projects")
      .select("id, workspace_id, client_name, client_email, share_token")
      .eq("id", projectId)
      .maybeSingle();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (body.shareToken && project.share_token !== body.shareToken) {
      return NextResponse.json({ error: "Token mismatch" }, { status: 403 });
    }

    const { data: workspace } = await sb
      .from("workspaces")
      .select(
        "id, studio_name, client_razorpay_key_id, client_razorpay_key_secret",
      )
      .eq("id", project.workspace_id)
      .maybeSingle();

    const keyId = (workspace?.client_razorpay_key_id as string)?.trim() || "";
    const keySecret =
      (workspace?.client_razorpay_key_secret as string)?.trim() || "";

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "This studio has not connected Razorpay yet. Ask them for a payment link, or they can add keys in Settings.",
          code: "FREELANCER_RAZORPAY_MISSING",
        },
        { status: 503 },
      );
    }

    let paymentId = body.paymentId;
    let amountCents = body.amountCents;
    let label = body.label || "Deposit";

    if (paymentId) {
      const { data: pay } = await sb
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .eq("project_id", projectId)
        .maybeSingle();
      if (!pay) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }
      if (pay.status === "paid") {
        return NextResponse.json({ error: "Already paid" }, { status: 409 });
      }
      amountCents = pay.amount_cents as number;
      label = pay.label as string;
    } else if (typeof amountCents === "number" && amountCents > 0) {
      paymentId = `pay_${nanoid(6)}`;
      await sb.from("payments").insert({
        id: paymentId,
        project_id: projectId,
        label,
        amount_cents: amountCents,
        status: "sent",
        created_at: new Date().toISOString().slice(0, 10),
      });
    } else {
      return NextResponse.json(
        { error: "paymentId or amountCents required" },
        { status: 400 },
      );
    }

    const rzp = getRazorpayWithKeys(keyId, keySecret);
    const currency = "USD";
    const order = await rzp.orders.create({
      amount: amountCents!,
      currency,
      receipt: `dep_${paymentId}`.slice(0, 40),
      notes: {
        type: "deposit",
        payment_id: paymentId!,
        project_id: projectId,
        workspace_id: workspace!.id as string,
      },
    });

    await sb
      .from("payments")
      .update({ razorpay_order_id: order.id })
      .eq("id", paymentId!);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      paymentId,
      description: `${label} · ${(workspace?.studio_name as string) || "Studio"}`,
      name: project.client_name,
      email: project.client_email,
      // Platform config still needed for webhooks in some setups; deposit uses freelancer keys.
      platformConfigured: isRazorpayConfigured(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not start checkout" },
      { status: 500 },
    );
  }
}
