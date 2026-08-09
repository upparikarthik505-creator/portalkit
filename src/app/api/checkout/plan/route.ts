import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import {
  currencyForCountry,
  type CurrencyCode,
} from "@/lib/currency";
import { resolveCountry } from "@/lib/geo";
import {
  appliesPlanGst,
  PLAN_GST_RATE,
  planChargeSubunits,
  planUsdAmount,
  type CheckoutPlan,
} from "@/lib/pricing";
import {
  getRazorpay,
  isRazorpayConfigured,
  isRazorpaySubscriptionsConfigured,
  razorpayKeyId,
  razorpayProPlanId,
} from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const userId = await requireAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Sign in required to purchase a plan." },
        { status: 401 },
      );
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          error:
            "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local.",
        },
        { status: 503 },
      );
    }

    const body = (await req.json()) as {
      plan?: CheckoutPlan | "pro";
      interval?: "monthly" | "yearly";
      timeZone?: string;
    };

    let plan: CheckoutPlan = "pro";
    if (body.plan === "founder") plan = "founder";
    else if (body.plan === "pro_yearly" || body.interval === "yearly") {
      plan = "pro_yearly";
    } else {
      plan = "pro";
    }

    const { country } = resolveCountry({
      headers: req.headers,
      timeZone: body.timeZone,
    });
    const currency: CurrencyCode = currencyForCountry(country);
    const usd = planUsdAmount(plan);
    const amount = planChargeSubunits(plan, currency);
    const gstApplied = appliesPlanGst(currency);
    const rzp = getRazorpay()!;

    // Recurring Pro when Razorpay plan IDs are configured.
    // Plan amounts in Razorpay should already include 18% GST.
    if (plan === "pro" || plan === "pro_yearly") {
      const interval = plan === "pro_yearly" ? "yearly" : "monthly";
      if (isRazorpaySubscriptionsConfigured(interval)) {
        const planId = razorpayProPlanId(interval);
        const subscription = await rzp.subscriptions.create({
          plan_id: planId,
          total_count: interval === "yearly" ? 10 : 120,
          customer_notify: 1,
          notes: {
            clerk_user_id: userId,
            plan,
            country,
            type: "plan_subscription",
            interval,
            usd_list: String(usd),
            gst_rate: String(PLAN_GST_RATE),
          },
        });

        return NextResponse.json({
          mode: "subscription",
          subscriptionId: subscription.id,
          keyId: razorpayKeyId(),
          gstApplied: true,
          gstRate: PLAN_GST_RATE,
          description:
            interval === "yearly"
              ? "PortalKit Pro — yearly subscription (incl. 18% GST)"
              : "PortalKit Pro — monthly subscription (incl. 18% GST)",
          plan,
          country,
          interval,
        });
      }
    }

    // Founder (lifetime) or Pro one-shot fallback when plan IDs are missing.
    const order = await rzp.orders.create({
      amount,
      currency,
      receipt: `pk_${plan}_${Date.now()}`.slice(0, 40),
      notes: {
        clerk_user_id: userId,
        plan,
        country,
        type: "plan",
        usd_list: String(usd),
        gst_rate: String(PLAN_GST_RATE),
      },
    });

    return NextResponse.json({
      mode: "order",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId(),
      gstApplied: true,
      gstRate: PLAN_GST_RATE,
      description:
        plan === "founder"
          ? "PortalKit Founder — lifetime Pro (incl. 18% GST)"
          : plan === "pro_yearly"
            ? "PortalKit Pro — yearly (incl. 18% GST)"
            : "PortalKit Pro — monthly (incl. 18% GST)",
      plan,
      country,
      subscriptionFallback: plan !== "founder",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not create Razorpay order" },
      { status: 500 },
    );
  }
}
