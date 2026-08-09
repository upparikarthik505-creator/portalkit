"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";
import { openRazorpayCheckout } from "@/lib/razorpay-browser";
import type { WorkspacePlanInfo } from "@/lib/workspace-plan";

function BillingInner() {
  const search = useSearchParams();
  const success = search.get("success");
  const canceled = search.get("canceled");
  const { ready, currency, prices } = useCurrency();
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState<"pro" | "founder" | "cancel" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<WorkspacePlanInfo | null>(null);

  useEffect(() => {
    void fetch("/api/workspace/branding")
      .then((r) => r.json())
      .then((data: { plan?: WorkspacePlanInfo }) => {
        if (data.plan) setPlanInfo(data.plan);
      })
      .catch(() => undefined);
  }, [success, notice]);

  async function checkout(plan: "pro" | "founder") {
    setLoading(plan);
    setError(null);
    try {
      let timeZone = "";
      try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      } catch {
        timeZone = "";
      }
      const res = await fetch("/api/checkout/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan === "founder" ? "founder" : "pro",
          interval: plan === "pro" ? billing : undefined,
          timeZone: timeZone || undefined,
        }),
      });
      const data = (await res.json()) as {
        mode?: "order" | "subscription";
        orderId?: string;
        subscriptionId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        description?: string;
        plan?: string;
        error?: string;
      };
      if (!res.ok || !data.keyId) {
        throw new Error(data.error || "Checkout unavailable");
      }
      if (data.mode === "subscription") {
        if (!data.subscriptionId) {
          throw new Error(data.error || "Subscription unavailable");
        }
        await openRazorpayCheckout(
          {
            subscriptionId: data.subscriptionId,
            keyId: data.keyId,
            description: data.description || "PortalKit Pro",
          },
          async (payment) => {
            const verify = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...payment,
                plan: data.plan,
                type: "plan_subscription",
              }),
            });
            if (!verify.ok) {
              const err = (await verify.json()) as { error?: string };
              throw new Error(err.error || "Payment verification failed");
            }
            window.location.href = `/dashboard/billing?success=1&plan=pro`;
          },
        );
      } else {
        if (!data.orderId) {
          throw new Error(data.error || "Checkout unavailable");
        }
        await openRazorpayCheckout(
          {
            orderId: data.orderId,
            amount: data.amount!,
            currency: data.currency!,
            keyId: data.keyId,
            description: data.description || "PortalKit",
          },
          async (payment) => {
            const verify = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...payment,
                plan: data.plan,
                type: "plan",
              }),
            });
            if (!verify.ok) {
              const err = (await verify.json()) as { error?: string };
              throw new Error(err.error || "Payment verification failed");
            }
            window.location.href = `/dashboard/billing?success=1&plan=${plan}`;
          },
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed";
      if (message !== "Checkout canceled") setError(message);
      setLoading(null);
    }
  }

  async function cancelSubscription() {
    if (
      !window.confirm(
        "Cancel Pro at the end of this billing period? You’ll keep access until then.",
      )
    ) {
      return;
    }
    setLoading("cancel");
    setError(null);
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || "Cancel failed");
      setNotice(data.message || "Subscription set to cancel at period end.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setLoading(null);
    }
  }

  const proPrice =
    billing === "yearly"
      ? prices?.proYearly.label
      : prices?.proMonthly.label;
  const founderPrice = prices?.founder.label;
  const currentPlan = planInfo?.plan ?? "starter";
  const onTrial = planInfo?.onTrial ?? false;
  const canCancel =
    currentPlan === "pro" &&
    !!planInfo?.hasSubscription &&
    planInfo.subscriptionStatus !== "cancelling";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted-2">
          Billing
        </p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-[-0.03em]">
          Pick the right plan for you.
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          Prices in {ready ? currency : "your currency"}, incl. 18% GST.
          {planInfo ? (
            <>
              {" "}
              <span className="font-semibold text-ink">{planInfo.label}.</span>
            </>
          ) : null}
        </p>
      </div>

      <div
        className="inline-flex rounded-full border border-line bg-white p-1"
        role="group"
        aria-label="Billing period"
      >
        <button
          type="button"
          onClick={() => setBilling("monthly")}
          className={`rounded-full px-4 py-2 text-[13px] font-bold ${
            billing === "monthly" ? "bg-ink text-white" : "text-muted"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBilling("yearly")}
          className={`rounded-full px-4 py-2 text-[13px] font-bold ${
            billing === "yearly" ? "bg-ink text-white" : "text-muted"
          }`}
        >
          Yearly · save 16%
        </button>
      </div>

      {success ? (
        <div className="rounded-2xl border border-accent/30 bg-paper px-4 py-3 text-sm font-semibold text-accent">
          Payment received — welcome to{" "}
          {search.get("plan") === "founder" ? "Founder" : "Pro"}.
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
          {notice}
        </div>
      ) : null}
      {canceled ? (
        <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted">
          Checkout canceled. You can try again anytime.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[14px] font-bold text-muted">Starter</p>
          <p className="mt-2 text-4xl font-extrabold tracking-[-0.03em]">
            {ready ? prices?.starter.label : "—"}
          </p>
          <p className="mt-2 text-sm text-muted">
            Start with everything you need for one project.
          </p>
          <ul className="mt-5 space-y-2">
            {[
              "1 active project",
              "Invoices and payments",
              "Proposals",
              "Client portal",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent" />
                {f}
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-secondary mt-6 w-full" disabled>
            {currentPlan === "starter" && !onTrial
              ? "Current plan"
              : currentPlan === "starter"
                ? "Included · trial active"
                : "Starter"}
          </button>
        </div>

        <div className="rounded-2xl border border-accent bg-paper p-6 shadow-[0_16px_50px_rgba(255,90,95,0.12)]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] font-bold text-muted">Pro</p>
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white">
              Best seller
            </span>
          </div>
          <p className="mt-2 text-4xl font-extrabold tracking-[-0.03em]">
            {ready ? proPrice : "—"}
            <span className="text-[16px] font-semibold text-muted">/mo</span>
          </p>
          {billing === "yearly" && prices ? (
            <p className="mt-1 text-[12px] font-semibold text-mint-ink">
              Billed {prices.proYearly.billedAs}/yr · incl. 18% GST
            </p>
          ) : (
            <p className="mt-1 text-[12px] font-semibold text-mint-ink">
              Incl. 18% GST
            </p>
          )}
          <p className="mt-2 text-sm text-muted">
            Unlimited active projects and custom portal branding.
          </p>
          <ul className="mt-5 space-y-2">
            {[
              "Unlimited active projects",
              "Custom portal branding",
              "Offers, eSign, client pay",
              "Files, tasks, messages",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent" />
                {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-primary mt-6 w-full"
            disabled={
              loading !== null ||
              !ready ||
              currentPlan === "pro" ||
              currentPlan === "founder"
            }
            onClick={() => checkout("pro")}
          >
            {currentPlan === "pro" || currentPlan === "founder"
              ? "Current plan"
              : loading === "pro"
                ? "Opening Razorpay…"
                : onTrial
                  ? "Keep Pro after trial"
                  : "Upgrade to Pro"}
          </button>
          {canCancel ? (
            <button
              type="button"
              className="btn btn-secondary mt-3 w-full !py-2.5 !text-[13px]"
              disabled={loading !== null}
              onClick={() => void cancelSubscription()}
            >
              {loading === "cancel" ? "Cancelling…" : "Cancel at period end"}
            </button>
          ) : null}
          {planInfo?.subscriptionStatus === "cancelling" ? (
            <p className="mt-3 text-center text-[12px] text-muted">
              Cancels at the end of this billing period.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] font-bold text-muted">Founder</p>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-accent-deep">
              Cheaper than billing
            </span>
          </div>
          <p className="mt-2 text-4xl font-extrabold tracking-[-0.03em]">
            {ready ? founderPrice : "—"}
            <span className="text-[16px] font-semibold text-muted"> lifetime</span>
          </p>
          <p className="mt-1 text-[12px] font-semibold text-mint-ink">
            Pays for itself in ~5 months vs Pro monthly · incl. 18% GST
          </p>
          <p className="mt-2 text-sm text-muted">
            One payment for lifetime Pro — first 20 freelancers only.
          </p>
          <ul className="mt-5 space-y-2">
            {[
              "Everything in Pro",
              "Priority support",
              "Founding badge",
              "Feature votes",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent" />
                {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-secondary mt-6 w-full"
            disabled={loading !== null || !ready || currentPlan === "founder"}
            onClick={() => checkout("founder")}
          >
            {currentPlan === "founder"
              ? "Current plan"
              : loading === "founder"
                ? "Opening Razorpay…"
                : "Claim lifetime"}
          </button>
        </div>
      </div>

      <p className="text-sm text-muted">
        Pro uses Razorpay subscriptions when{" "}
        <code>RAZORPAY_PLAN_PRO_*</code> plan IDs are set; otherwise a one-shot
        checkout. Enable <strong>International payments</strong> in Razorpay.{" "}
        <Link href="/dashboard" className="font-semibold text-accent">
          Back to home
        </Link>
      </p>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted">Loading billing…</div>}>
      <BillingInner />
    </Suspense>
  );
}
