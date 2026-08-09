"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CurrencyCode } from "@/lib/currency";
import type { GeoPricing } from "@/lib/geo";

type CurrencyContextValue = {
  ready: boolean;
  country: string;
  countryName: string;
  currency: CurrencyCode;
  prices: GeoPricing["prices"] | null;
  note: string;
  refresh: () => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [geo, setGeo] = useState<GeoPricing | null>(null);

  const load = useCallback(async () => {
    try {
      const tz = browserTimeZone();
      const params = new URLSearchParams();
      if (tz) params.set("tz", tz);
      const res = await fetch(`/api/geo?${params.toString()}`);
      if (!res.ok) throw new Error("geo failed");
      const data = (await res.json()) as GeoPricing;
      setGeo(data);
    } catch {
      // Safe fallback: USD list prices (still fixed worldwide amounts).
      const res = await fetch("/api/geo").catch(() => null);
      if (res?.ok) {
        setGeo((await res.json()) as GeoPricing);
      } else {
        setGeo(null);
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      ready,
      country: geo?.country ?? "US",
      countryName: geo?.countryName ?? "United States",
      currency: geo?.currency ?? "USD",
      prices: geo?.prices ?? null,
      note: geo?.note ?? "",
      refresh: () => void load(),
    }),
    [ready, geo, load],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
