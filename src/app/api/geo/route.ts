import { NextResponse } from "next/server";
import { buildGeoPricing, resolveCountry } from "@/lib/geo";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const timeZone = url.searchParams.get("tz");
  const { country, source } = resolveCountry({
    headers: req.headers,
    timeZone,
  });
  return NextResponse.json(buildGeoPricing(country, source));
}
