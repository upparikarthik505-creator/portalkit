"use client";

import { useCurrency } from "@/components/CurrencyProvider";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { PLAN_USD } from "@/lib/pricing";

/** Hero founder price — fixed $99 USD converted for location. */
export function PricingFounderHero() {
  const { ready, prices } = useCurrency();
  const label = ready ? prices?.founder.label : "—";

  return (
    <div className="hero-preview hero-anim min-w-0">
      <p className="mkt-eyebrow">Founder seats</p>
      <p className="mkt-metric mt-3">
        {label}{" "}
        <span className="mkt-metric-sm text-muted">lifetime</span>
      </p>
      <p className="mkt-chip mt-2 text-muted">
        {ready && prices?.founder.conversion
          ? prices.founder.conversion
          : `$${PLAN_USD.founder} USD`}
      </p>
      {prices?.founder.gstNote ? (
        <p className="mkt-chip mt-1 text-mint-ink">{prices.founder.gstNote}</p>
      ) : null}
      <p className="mkt-lede mt-4 max-w-sm">
        Cheaper than ~5 months of Pro billing. First 20 freelancers get lifetime
        Pro — priority support and a founding badge.
      </p>
      <div className="mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-line">
        <div className="h-full w-[72%] rounded-full bg-accent" />
      </div>
      <p className="mkt-meta mt-2">~14 of 20 claimed this week</p>
      <MagneticLink href="/sign-up" className="btn btn-primary mt-6">
        Claim lifetime Pro
      </MagneticLink>
    </div>
  );
}
