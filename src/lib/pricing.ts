import {
  CURRENCIES,
  type CurrencyCode,
  formatCurrencyAmount,
  usdToSubunits,
} from "@/lib/currency";

/** Canonical plan prices in USD (major units). */
export const PLAN_USD = {
  starter: 0,
  proMonthly: 19,
  proYearly: 192, // billed yearly ($16/mo effective)
  founder: 99,
} as const;

/** Plan tax on PortalKit fees (all countries) — Razorpay does not auto-add this. */
export const PLAN_GST_RATE = 0.18;
/** @deprecated use PLAN_GST_RATE */
export const INDIA_GST_RATE = PLAN_GST_RATE;

export type CheckoutPlan = "pro" | "pro_yearly" | "founder";

export function planUsdAmount(plan: CheckoutPlan): number {
  if (plan === "founder") return PLAN_USD.founder;
  if (plan === "pro_yearly") return PLAN_USD.proYearly;
  return PLAN_USD.proMonthly;
}

/** 18% GST on PortalKit plan charges worldwide. */
export function appliesPlanGst(_currency?: CurrencyCode): boolean {
  return true;
}

/** @deprecated use appliesPlanGst */
export function appliesIndiaGst(currency: CurrencyCode): boolean {
  return appliesPlanGst(currency);
}

/** Add 18% GST to currency subunits. */
export function withPlanGst(subunits: number, _currency?: CurrencyCode): number {
  if (subunits <= 0) return subunits;
  return Math.round(subunits * (1 + PLAN_GST_RATE));
}

/** @deprecated use withPlanGst */
export function withIndiaGst(subunits: number, currency: CurrencyCode): number {
  return withPlanGst(subunits, currency);
}

export function gstPortion(subunitsInclGst: number, _currency?: CurrencyCode): number {
  if (subunitsInclGst <= 0) return 0;
  const base = Math.round(subunitsInclGst / (1 + PLAN_GST_RATE));
  return Math.max(0, subunitsInclGst - base);
}

/** Charge amount in subunits: USD → local FX, then +18% GST (all countries). */
export function planChargeSubunits(
  plan: CheckoutPlan,
  currency: CurrencyCode,
): number {
  const base = usdToSubunits(planUsdAmount(plan), currency);
  return withPlanGst(base, currency);
}

function conversionLine(usdMajor: number, currency: CurrencyCode): string {
  if (usdMajor === 0) return "$0 USD";
  const meta = CURRENCIES[currency];
  const base = usdToSubunits(usdMajor, currency);
  const charged = withPlanGst(base, currency);
  const baseLabel = formatCurrencyAmount(base, currency, { compact: true });
  const chargedLabel = formatCurrencyAmount(charged, currency, {
    compact: true,
  });
  if (currency === "USD") {
    return `$${usdMajor} + 18% GST = ${chargedLabel}`;
  }
  const rate = meta.perUsd;
  const rateLabel = Number.isInteger(rate) ? String(rate) : rate.toFixed(2);
  return `$${usdMajor} × ${rateLabel} = ${baseLabel} + 18% GST = ${chargedLabel}`;
}

export function localizedPlanPrices(currency: CurrencyCode) {
  const gst = true;
  const meta = CURRENCIES[currency];

  function priceBlock(usdMajor: number, opts?: { period?: string }) {
    const base = usdToSubunits(usdMajor, currency);
    const charged = withPlanGst(base, currency);
    return {
      label: formatCurrencyAmount(charged, currency, { compact: true }),
      baseLabel: formatCurrencyAmount(base, currency, { compact: true }),
      subunits: charged,
      baseSubunits: base,
      gstSubunits: gstPortion(charged, currency),
      gstRate: PLAN_GST_RATE,
      gstNote: "incl. 18% GST",
      conversion: conversionLine(usdMajor, currency),
      fxRate: meta.perUsd,
      period: opts?.period,
    };
  }

  const yearlyFull = priceBlock(PLAN_USD.proYearly);
  const yearlyMonthly = priceBlock(PLAN_USD.proYearly / 12, { period: "/mo" });

  return {
    currency,
    gst,
    fxRate: meta.perUsd,
    starter: {
      ...priceBlock(PLAN_USD.starter),
      label: formatCurrencyAmount(0, currency, { compact: true }),
      gstNote: null as string | null,
      conversion: "$0 USD",
    },
    proMonthly: {
      ...priceBlock(PLAN_USD.proMonthly, { period: "/mo" }),
    },
    proYearly: {
      ...yearlyMonthly,
      subunits: yearlyFull.subunits,
      baseSubunits: yearlyFull.baseSubunits,
      gstSubunits: yearlyFull.gstSubunits,
      billedAs: yearlyFull.label,
      billedAsBase: yearlyFull.baseLabel,
      conversion: yearlyFull.conversion,
    },
    founder: priceBlock(PLAN_USD.founder),
  };
}
