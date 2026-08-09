import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import { getOrCreateLeadFormToken } from "@/lib/lead-forms-db";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ source: "local", token: null });
    }
    const userId = await requireAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    const form = await getOrCreateLeadFormToken(userId);
    return NextResponse.json({ source: "supabase", ...form });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
