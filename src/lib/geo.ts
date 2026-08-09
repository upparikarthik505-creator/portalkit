import {
  COUNTRY_NAMES,
  currencyForCountry,
  type CurrencyCode,
} from "@/lib/currency";
import { localizedPlanPrices } from "@/lib/pricing";

export type GeoPricing = {
  country: string;
  countryName: string;
  currency: CurrencyCode;
  source: "header" | "timezone" | "default";
  prices: ReturnType<typeof localizedPlanPrices>;
  note: string;
};

/** Browser timezone → ISO country when IP geo headers are missing (e.g. localhost). */
const TIMEZONE_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Dubai": "AE",
  "Asia/Singapore": "SG",
  "Asia/Hong_Kong": "HK",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Bangkok": "TH",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Jakarta": "ID",
  "Asia/Manila": "PH",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Amsterdam": "NL",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Zurich": "CH",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Sao_Paulo": "BR",
  "America/Mexico_City": "MX",
  "Africa/Johannesburg": "ZA",
  "Asia/Riyadh": "SA",
  "Asia/Qatar": "QA",
  "Asia/Kuwait": "KW",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
};

export function countryFromTimezone(
  timeZone: string | null | undefined,
): string | null {
  if (!timeZone) return null;
  return TIMEZONE_COUNTRY[timeZone] ?? null;
}

export function detectCountryFromHeaders(headers: Headers): {
  country: string;
  source: Extract<GeoPricing["source"], "header" | "default">;
} {
  const candidates = [
    headers.get("x-vercel-ip-country"),
    headers.get("cf-ipcountry"),
    headers.get("x-country-code"),
    headers.get("cloudfront-viewer-country"),
  ];
  for (const raw of candidates) {
    if (raw && raw.length === 2 && raw.toUpperCase() !== "XX") {
      return { country: raw.toUpperCase(), source: "header" };
    }
  }
  return { country: "US", source: "default" };
}

/** Prefer IP geo; fall back to timezone (never a manual currency picker). */
export function resolveCountry(input: {
  headers: Headers;
  timeZone?: string | null;
}): { country: string; source: GeoPricing["source"] } {
  const fromIp = detectCountryFromHeaders(input.headers);
  if (fromIp.source === "header") return fromIp;

  const fromTz = countryFromTimezone(input.timeZone);
  if (fromTz) return { country: fromTz, source: "timezone" };

  return fromIp;
}

export function buildGeoPricing(
  country: string,
  source: GeoPricing["source"] = "default",
): GeoPricing {
  const code = country.toUpperCase();
  const currency = currencyForCountry(code);
  return {
    country: code,
    countryName: COUNTRY_NAMES[code] ?? code,
    currency,
    source,
    prices: localizedPlanPrices(currency),
    note: `Same USD list price ($19/mo Pro · $99 Founder)${
      currency === "USD"
        ? ""
        : ` — shown as ${currency} for ${COUNTRY_NAMES[code] ?? code}`
    }, then +18% GST worldwide. Razorpay does not add GST for you — PortalKit includes it in the charge.`,
  };
}
