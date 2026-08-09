"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";
import { MagneticLink } from "@/components/motion/MagneticLink";

const FEATURES = {
  starter: [
    "1 active project",
    "Project HQ + client portal link",
    "Payment asks on projects",
    "Deal board (statuses)",
    "Studio branding settings",
    "14-day Pro trial",
  ],
  pro: [
    "Unlimited projects",
    "Everything in Starter",
    "Priority plan after trial",
    "Same workspace as you grow",
  ],
  founder: [
    "Everything in Pro",
    "Lifetime access (one payment)",
    "Cheaper than ~5 months Pro",
    "Founding cohort seat",
  ],
} as const;

/** Pricing cards — design-system surfaces, type, radius, shadow */
export function PricingPlans() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const { ready, currency, prices } = useCurrency();

  const proLabel =
    billing === "yearly" ? prices?.proYearly.label : prices?.proMonthly.label;

  return (
    <div>
      <div className="mb-10 flex flex-col items-center gap-3">
        <div
          className="inline-flex rounded-full border border-line bg-paper p-1"
          role="group"
          aria-label="Billing period"
        >
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-4 py-2 mkt-chip transition-[color,background-color] duration-[var(--motion-micro)] ease-out ${
              billing === "monthly"
                ? "bg-ink text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mkt-chip transition-[color,background-color] duration-[var(--motion-micro)] ease-out ${
              billing === "yearly"
                ? "bg-ink text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            Yearly
            <span
              className={`rounded-full px-2 py-0.5 mkt-chip ${
                billing === "yearly"
                  ? "bg-accent text-white"
                  : "bg-accent-soft text-accent-deep"
              }`}
            >
              Save 16%
            </span>
          </button>
        </div>
        <p className="mkt-meta text-center text-muted">
          Exact FX from USD · {ready ? currency : "…"}
          {ready && prices
            ? ` @ ${prices.fxRate} ${currency}/USD`
            : ""}
          {prices?.gst ? " · incl. 18% GST" : ""}
          {billing === "yearly" && prices
            ? ` · Pro ${prices.proYearly.billedAs}/yr`
            : ""}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PlanCard
          name="Starter"
          price={ready ? prices?.starter.label : "—"}
          conversion={ready ? prices?.starter.conversion : undefined}
          detail="Everything you need to create great client experiences — one project at a time. Includes a 14-day Pro trial."
          ctaHref="/sign-up"
          ctaLabel="Start free trial"
          ctaClass="btn btn-secondary"
          features={FEATURES.starter}
        />

        <PlanCard
          name="Pro"
          price={ready ? proLabel : "—"}
          priceSuffix="/mo"
          conversion={
            ready
              ? billing === "yearly"
                ? prices?.proYearly.conversion
                : prices?.proMonthly.conversion
              : undefined
          }
          badge="Best seller"
          highlight
          yearlyNote={
            billing === "yearly" && prices
              ? `${prices.proYearly.billedAs}/yr · save vs monthly`
              : null
          }
          gstNote={
            billing === "yearly"
              ? prices?.proYearly.gstNote
              : prices?.proMonthly.gstNote
          }
          detail="Unlimited active projects after trial — same client HQ as Starter."
          ctaHref="/sign-up"
          ctaLabel="Start Pro trial"
          ctaClass="btn btn-primary"
          features={FEATURES.pro}
        />

        <PlanCard
          name="Founder"
          price={ready ? prices?.founder.label : "—"}
          priceSuffix=" lifetime"
          conversion={ready ? prices?.founder.conversion : undefined}
          badge="Cheaper than billing"
          yearlyNote={
            ready && prices
              ? `Pays for itself in ~5 months vs Pro ${prices.proMonthly.label}/mo`
              : null
          }
          gstNote={prices?.founder.gstNote}
          detail="One payment for lifetime Pro — cheaper than staying on monthly billing. First 20 freelancers only."
          ctaHref="/sign-up"
          ctaLabel="Claim lifetime"
          ctaClass="btn btn-secondary"
          features={FEATURES.founder}
        />
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  priceSuffix,
  conversion,
  badge,
  highlight,
  yearlyNote,
  gstNote,
  detail,
  ctaHref,
  ctaLabel,
  ctaClass,
  features,
}: {
  name: string;
  price?: string;
  priceSuffix?: string;
  conversion?: string;
  badge?: string;
  highlight?: boolean;
  yearlyNote?: string | null;
  gstNote?: string | null;
  detail: string;
  ctaHref: string;
  ctaLabel: string;
  ctaClass: string;
  features: readonly string[];
}) {
  return (
    <div
      className={`flex flex-col rounded-[var(--radius)] border p-6 transition-[border-color,box-shadow] duration-[var(--motion-ui)] ease-out ${
        highlight
          ? "border-accent bg-paper shadow-[var(--shadow)] ring-1 ring-accent/20"
          : "border-line bg-paper shadow-[var(--shadow)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="mkt-meta">{name}</p>
        {badge ? (
          <span className="mkt-chip rounded-full bg-accent px-2.5 py-1 text-white">
            {badge}
          </span>
        ) : (
          <span className="invisible mkt-chip px-2.5 py-1" aria-hidden>
            ·
          </span>
        )}
      </div>
      <p className="mkt-metric mt-2">
        {price}
        {priceSuffix ? (
          <span className="mkt-metric-sm ml-0.5 text-muted">{priceSuffix}</span>
        ) : null}
      </p>
      {conversion ? (
        <p className="mkt-chip mt-1 text-muted">{conversion}</p>
      ) : null}
      {gstNote ? (
        <p className="mkt-chip mt-1 text-mint-ink">{gstNote}</p>
      ) : null}
      {yearlyNote ? (
        <p className="mkt-chip mt-1 text-mint-ink">{yearlyNote}</p>
      ) : null}
      <p className="mkt-body mt-2 text-muted">{detail}</p>
      <MagneticLink href={ctaHref} className={`${ctaClass} mt-5 w-full`}>
        {ctaLabel}
      </MagneticLink>
      <ul className="mt-5 space-y-2.5">
        {features.map((item) => (
          <li key={item} className="mkt-body flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
