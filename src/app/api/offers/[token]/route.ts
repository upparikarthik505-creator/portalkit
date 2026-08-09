import { NextResponse } from "next/server";
import {
  acceptOfferByToken,
  getOfferByShareToken,
} from "@/lib/offers-db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const payload = await getOfferByShareToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(payload);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load offer" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const body = (await req.json()) as {
      action?: string;
      acceptedName?: string;
      agreed?: boolean;
    };
    if (body.action !== "accept") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
    if (!body.agreed || !body.acceptedName?.trim()) {
      return NextResponse.json(
        { error: "Check the box and type your full name." },
        { status: 400 },
      );
    }
    const result = await acceptOfferByToken(token, body.acceptedName);
    if (!result) {
      return NextResponse.json(
        { error: "Offer unavailable or already accepted." },
        { status: 409 },
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to accept offer" },
      { status: 500 },
    );
  }
}
