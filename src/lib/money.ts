import {
  type CurrencyCode,
  formatCurrencyAmount,
  usdCentsToSubunits,
} from "@/lib/currency";

/** Format USD-cents amounts (dashboard demo data) in a locale currency. */
export function formatMoney(
  cents: number,
  currency: CurrencyCode = "USD",
) {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(cents / 100);
  }
  return formatCurrencyAmount(usdCentsToSubunits(cents, currency), currency, {
    compact: true,
  });
}
