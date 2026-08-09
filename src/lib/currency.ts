/** Country → currency + FX from USD for Razorpay international checkout. */

export type CurrencyCode =
  | "USD"
  | "INR"
  | "EUR"
  | "GBP"
  | "AED"
  | "SGD"
  | "AUD"
  | "CAD"
  | "JPY"
  | "MYR"
  | "THB"
  | "HKD"
  | "NZD"
  | "CHF"
  | "SEK"
  | "NOK"
  | "DKK"
  | "ZAR"
  | "BRL"
  | "MXN"
  | "PHP"
  | "IDR"
  | "KRW"
  | "SAR"
  | "QAR"
  | "KWD"
  | "BHD"
  | "OMR";

export type CurrencyMeta = {
  code: CurrencyCode;
  /** How many subunits per major unit (100 = cents/paise, 1 = JPY, 1000 = KWD). */
  subunit: 1 | 100 | 1000;
  /** Approximate units of this currency per 1 USD (display + checkout). */
  perUsd: number;
  locale: string;
  symbol: string;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  USD: { code: "USD", subunit: 100, perUsd: 1, locale: "en-US", symbol: "$" },
  INR: { code: "INR", subunit: 100, perUsd: 86.5, locale: "en-IN", symbol: "₹" },
  EUR: { code: "EUR", subunit: 100, perUsd: 0.92, locale: "en-IE", symbol: "€" },
  GBP: { code: "GBP", subunit: 100, perUsd: 0.79, locale: "en-GB", symbol: "£" },
  AED: { code: "AED", subunit: 100, perUsd: 3.67, locale: "en-AE", symbol: "د.إ" },
  SGD: { code: "SGD", subunit: 100, perUsd: 1.34, locale: "en-SG", symbol: "S$" },
  AUD: { code: "AUD", subunit: 100, perUsd: 1.52, locale: "en-AU", symbol: "A$" },
  CAD: { code: "CAD", subunit: 100, perUsd: 1.36, locale: "en-CA", symbol: "C$" },
  JPY: { code: "JPY", subunit: 1, perUsd: 149, locale: "ja-JP", symbol: "¥" },
  MYR: { code: "MYR", subunit: 100, perUsd: 4.7, locale: "en-MY", symbol: "RM" },
  THB: { code: "THB", subunit: 100, perUsd: 35.5, locale: "th-TH", symbol: "฿" },
  HKD: { code: "HKD", subunit: 100, perUsd: 7.8, locale: "en-HK", symbol: "HK$" },
  NZD: { code: "NZD", subunit: 100, perUsd: 1.66, locale: "en-NZ", symbol: "NZ$" },
  CHF: { code: "CHF", subunit: 100, perUsd: 0.88, locale: "de-CH", symbol: "CHF" },
  SEK: { code: "SEK", subunit: 100, perUsd: 10.5, locale: "sv-SE", symbol: "kr" },
  NOK: { code: "NOK", subunit: 100, perUsd: 10.7, locale: "nb-NO", symbol: "kr" },
  DKK: { code: "DKK", subunit: 100, perUsd: 6.9, locale: "da-DK", symbol: "kr" },
  ZAR: { code: "ZAR", subunit: 100, perUsd: 18.5, locale: "en-ZA", symbol: "R" },
  BRL: { code: "BRL", subunit: 100, perUsd: 5.1, locale: "pt-BR", symbol: "R$" },
  MXN: { code: "MXN", subunit: 100, perUsd: 17.2, locale: "es-MX", symbol: "MX$" },
  PHP: { code: "PHP", subunit: 100, perUsd: 56, locale: "en-PH", symbol: "₱" },
  IDR: { code: "IDR", subunit: 1, perUsd: 15800, locale: "id-ID", symbol: "Rp" },
  KRW: { code: "KRW", subunit: 1, perUsd: 1350, locale: "ko-KR", symbol: "₩" },
  SAR: { code: "SAR", subunit: 100, perUsd: 3.75, locale: "ar-SA", symbol: "﷼" },
  QAR: { code: "QAR", subunit: 100, perUsd: 3.64, locale: "ar-QA", symbol: "﷼" },
  KWD: { code: "KWD", subunit: 1000, perUsd: 0.31, locale: "ar-KW", symbol: "د.ك" },
  BHD: { code: "BHD", subunit: 1000, perUsd: 0.38, locale: "ar-BH", symbol: "د.ب" },
  OMR: { code: "OMR", subunit: 1000, perUsd: 0.38, locale: "ar-OM", symbol: "ر.ع." },
};

/** ISO country → currency (fallback USD). */
export const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  US: "USD",
  IN: "INR",
  GB: "GBP",
  IE: "EUR",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
  AE: "AED",
  SG: "SGD",
  AU: "AUD",
  CA: "CAD",
  JP: "JPY",
  MY: "MYR",
  TH: "THB",
  HK: "HKD",
  NZ: "NZD",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  ZA: "ZAR",
  BR: "BRL",
  MX: "MXN",
  PH: "PHP",
  ID: "IDR",
  KR: "KRW",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
};

export const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  IN: "India",
  GB: "United Kingdom",
  AE: "United Arab Emirates",
  SG: "Singapore",
  AU: "Australia",
  CA: "Canada",
  JP: "Japan",
  DE: "Germany",
  FR: "France",
  NL: "Netherlands",
  IE: "Ireland",
  MY: "Malaysia",
  TH: "Thailand",
  HK: "Hong Kong",
  NZ: "New Zealand",
  CH: "Switzerland",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  ZA: "South Africa",
  BR: "Brazil",
  MX: "Mexico",
  PH: "Philippines",
  ID: "Indonesia",
  KR: "South Korea",
  SA: "Saudi Arabia",
  QA: "Qatar",
  KW: "Kuwait",
  BH: "Bahrain",
  OM: "Oman",
};

export function currencyForCountry(countryCode: string | null | undefined): CurrencyCode {
  if (!countryCode) return "USD";
  return COUNTRY_CURRENCY[countryCode.toUpperCase()] ?? "USD";
}

/** Convert USD major units → Razorpay amount in currency subunits. */
export function usdToSubunits(usdAmount: number, currency: CurrencyCode): number {
  const meta = CURRENCIES[currency];
  const localMajor = usdAmount * meta.perUsd;
  if (meta.subunit === 1) return Math.max(1, Math.round(localMajor));
  if (meta.subunit === 1000) {
    // Razorpay expects last digit 0 for 3-decimal currencies
    return Math.max(10, Math.round(localMajor * 100) * 10);
  }
  return Math.max(1, Math.round(localMajor * 100));
}

/** Convert USD cents → local currency subunits. */
export function usdCentsToSubunits(usdCents: number, currency: CurrencyCode): number {
  return usdToSubunits(usdCents / 100, currency);
}

export function formatCurrencyAmount(
  subunits: number,
  currency: CurrencyCode,
  opts?: { compact?: boolean },
) {
  const meta = CURRENCIES[currency];
  const major = subunits / meta.subunit;
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    maximumFractionDigits: opts?.compact ? (meta.subunit === 1 ? 0 : 0) : meta.subunit === 1 ? 0 : 2,
    minimumFractionDigits: meta.subunit === 1 ? 0 : opts?.compact ? 0 : 2,
  }).format(major);
}

export function formatUsdAsLocal(usdAmount: number, currency: CurrencyCode) {
  return formatCurrencyAmount(usdToSubunits(usdAmount, currency), currency, {
    compact: Number.isInteger(usdAmount),
  });
}
