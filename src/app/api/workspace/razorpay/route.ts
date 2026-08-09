import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

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
      return NextResponse.json({ source: "local", configured: false });
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const sb = getSupabaseAdmin()!;
    const { data } = await sb
      .from("workspaces")
      .select("client_razorpay_key_id")
      .eq("clerk_user_id", auth.userId)
      .maybeSingle();
    const keyId = (data?.client_razorpay_key_id as string) || "";
    return NextResponse.json({
      source: "supabase",
      configured: !!keyId,
      keyIdPreview: keyId ? `${keyId.slice(0, 8)}…` : "",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as {
      keyId?: string;
      keySecret?: string;
      clear?: boolean;
    };
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase required" }, { status: 503 });
    }
    const auth = await requireUser();
    if ("error" in auth) return auth.error;
    const sb = getSupabaseAdmin()!;

    // Ensure workspace row exists before update.
    const { data: existing } = await sb
      .from("workspaces")
      .select("id")
      .eq("clerk_user_id", auth.userId)
      .maybeSingle();
    if (!existing) {
      await sb.from("workspaces").insert({
        clerk_user_id: auth.userId,
        name: "My workspace",
      });
    }

    if (body.clear) {
      await sb
        .from("workspaces")
        .update({
          client_razorpay_key_id: "",
          client_razorpay_key_secret: "",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", auth.userId);
      return NextResponse.json({ ok: true, configured: false });
    }

    const keyId = (body.keyId ?? "").trim();
    const keySecret = (body.keySecret ?? "").trim();
    if (!keyId.startsWith("rzp_")) {
      return NextResponse.json(
        { error: "Key ID should look like rzp_test_… or rzp_live_…" },
        { status: 400 },
      );
    }
    if (keySecret.length < 10) {
      return NextResponse.json({ error: "Key secret required" }, { status: 400 });
    }

    await sb
      .from("workspaces")
      .update({
        client_razorpay_key_id: keyId,
        client_razorpay_key_secret: keySecret,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_user_id", auth.userId);

    return NextResponse.json({ ok: true, configured: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
