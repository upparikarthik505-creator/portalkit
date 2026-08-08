import Link from "next/link";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    detail: "Try the portal with one active project.",
    features: ["1 active project", "50MB files", "Client magic link"],
    cta: "Current plan",
    primary: false,
  },
  {
    name: "Pro",
    price: "$19/mo",
    detail: "For freelancers shipping multiple Shopify stores.",
    features: [
      "Unlimited projects",
      "Custom branding",
      "5GB file storage",
      "Stripe deposits & invoices",
    ],
    cta: "Upgrade with Stripe",
    primary: true,
  },
  {
    name: "Early bird",
    price: "$99",
    detail: "Lifetime Pro for the first 20 founders who pay this week.",
    features: ["Everything in Pro", "Founding badge", "Priority feature votes"],
    cta: "Claim lifetime",
    primary: false,
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
          Billing
        </p>
        <h1 className="display mt-1 text-4xl">
          Price like HoneyBook. Look like a new category.
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-6 ${
              plan.primary
                ? "border-ink bg-ink text-white shadow-[0_24px_60px_rgba(9,9,11,0.25)]"
                : "border-line bg-paper-2"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                plan.primary ? "text-white/60" : "text-muted"
              }`}
            >
              {plan.name}
            </p>
            <p className="display mt-2 text-4xl">{plan.price}</p>
            <p
              className={`mt-2 text-sm ${
                plan.primary ? "text-white/70" : "text-muted"
              }`}
            >
              {plan.detail}
            </p>
            <ul className="mt-5 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`btn mt-6 w-full ${
                plan.primary ? "btn-primary" : "btn-secondary"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted">
        Stripe Checkout wires next. For now this page is the sales surface.{" "}
        <Link href="/dashboard" className="font-semibold text-accent">
          Back to overview
        </Link>
      </p>
    </div>
  );
}
