import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import {
  createContactForUser,
  listContactsForUser,
  updateContactForUser,
} from "@/lib/contacts-db";
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
      return NextResponse.json({ source: "local", contacts: [] });
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const contacts = await listContactsForUser(auth.userId);
    return NextResponse.json({ source: "supabase", contacts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load contacts" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      storeUrl?: string;
      notes?: string;
    };
    if (!body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured." },
        { status: 503 },
      );
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const contact = await createContactForUser(auth.userId, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      storeUrl: body.storeUrl,
      notes: body.notes,
    });
    return NextResponse.json({ source: "supabase", contact });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as {
      id?: string;
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      storeUrl?: string;
      notes?: string;
      archive?: boolean;
    };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase not configured." },
        { status: 503 },
      );
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const contact = await updateContactForUser(auth.userId, body.id, body);
    if (!contact) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ source: "supabase", contact });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 },
    );
  }
}
