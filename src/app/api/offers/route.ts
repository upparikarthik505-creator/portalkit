import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import { createOfferForUser, listOffersForUser } from "@/lib/offers-db";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

async function requireUser() {
  const userId = await requireAuthenticatedUserId();
  if (!userId) {
    return {
      error: NextResponse.json({ error: "Sign in required." }, { status: 401 }),
    };
  }
  return { userId };
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ source: "local", offers: [] });
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const offers = await listOffersForUser(auth.userId);
    return NextResponse.json({ source: "supabase", offers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      projectId?: string;
      title?: string;
      scope?: string;
      totalCents?: number;
      depositCents?: number;
      send?: boolean;
    };
    if (!body.projectId || !body.title?.trim()) {
      return NextResponse.json(
        { error: "Project and title are required." },
        { status: 400 },
      );
    }
    if (typeof body.totalCents !== "number" || body.totalCents < 0) {
      return NextResponse.json({ error: "Invalid total" }, { status: 400 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured." },
        { status: 503 },
      );
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    const offer = await createOfferForUser(auth.userId, {
      projectId: body.projectId,
      title: body.title,
      scope: body.scope ?? "",
      totalCents: body.totalCents,
      depositCents:
        typeof body.depositCents === "number" ? body.depositCents : 0,
      send: !!body.send,
    });
    return NextResponse.json({ source: "supabase", offer });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to create offer";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
