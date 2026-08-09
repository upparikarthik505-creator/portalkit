"use client";

import { useCurrency } from "@/components/CurrencyProvider";
import { PLAN_USD } from "@/lib/pricing";

const PLANS = [
  {
    name: "Starter",
    key: "starter" as const,
    usd: `$${PLAN_USD.starter}`,
    detail: "One active project, portal link, payment asks.",
  },
  {
    name: "Pro",
    key: "proMonthly" as const,
    usd: `$${PLAN_USD.proMonthly}`,
    period: "/mo",
    detail: "Unlimited active projects — same client HQ.",
    highlight: true,
  },
  {
    name: "Founder",
    key: "founder" as const,
    usd: `$${PLAN_USD.founder}`,
    detail: "Lifetime Pro — first 20 freelancers only.",
  },
] as const;

/** Home pricing teaser — same USD list, local currency from location. */
export function HomePlansTeaser() {
  const { ready, prices } = useCurrency();

  return (
    <div className="reveal-item grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-3">
      {PLANS.map((plan) => {
        const price =
          plan.key === "starter"
            ? prices?.starter.label
            : plan.key === "proMonthly"
              ? prices?.proMonthly.label
              : prices?.founder.label;
        return (
          <div
            key={plan.name}
            className={`plan-teaser flex min-h-[168px] flex-col bg-paper-2 p-6 transition-[transform,box-shadow,background-color] duration-[var(--motion-ui)] ease-out ${
              "highlight" in plan && plan.highlight
                ? "bg-hero ring-1 ring-inset ring-accent"
                : ""
            }`}
          >
            <p
              className={`mkt-chip mb-3 min-h-[1.1rem] ${
                "highlight" in plan && plan.highlight
                  ? "text-accent"
                  : "invisible"
              }`}
            >
              Best seller
            </p>
            <p className="mkt-meta">{plan.name}</p>
            <p className="mkt-metric mt-2">
              {ready ? price : "—"}
              {"period" in plan && plan.period ? (
                <span className="mkt-metric-sm ml-0.5">{plan.period}</span>
              ) : null}
            </p>
            <p className="mkt-chip mt-1 text-muted">
              {ready
                ? plan.key === "starter"
                  ? prices?.starter.conversion
                  : plan.key === "proMonthly"
                    ? prices?.proMonthly.conversion
                    : prices?.founder.conversion
                : `Fixed · ${plan.usd} USD`}
            </p>
            <p className="mkt-body mt-auto pt-3">{plan.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
