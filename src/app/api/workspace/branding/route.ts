import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import { normalizeBranding } from "@/lib/branding";
import {
  getBrandingForUser,
  getHideBadgePreferenceForUser,
  getPlanInfoForUser,
  saveBrandingForUser,
} from "@/lib/workspace-branding-db";
import { hasUnlimitedProjects } from "@/lib/workspace-plan";
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
      return NextResponse.json({
        source: "local",
        branding: null,
        plan: null,
        hidePortalkitBadge: false,
        canHideBadge: false,
        message: "Supabase not configured — client uses localStorage.",
      });
    }

    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    const [branding, plan, hidePortalkitBadge] = await Promise.all([
      getBrandingForUser(auth.userId),
      getPlanInfoForUser(auth.userId),
      getHideBadgePreferenceForUser(auth.userId),
    ]);
    return NextResponse.json({
      source: "supabase",
      branding,
      plan,
      hidePortalkitBadge,
      canHideBadge: hasUnlimitedProjects(plan),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load branding" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as {
      studioName?: string;
      accent?: string;
      supportEmail?: string;
      hidePortalkitBadge?: boolean;
    };

    const normalized = normalizeBranding(body);
    if ("error" in normalized) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        source: "local",
        branding: normalized,
        hidePortalkitBadge: false,
        message: "Supabase not configured — client persists to localStorage.",
      });
    }

    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    const plan = await getPlanInfoForUser(auth.userId);
    if (body.hidePortalkitBadge && !hasUnlimitedProjects(plan)) {
      return NextResponse.json(
        { error: "Upgrade to Pro to remove the PortalKit badge." },
        { status: 403 },
      );
    }

    const saved = await saveBrandingForUser(auth.userId, normalized, {
      hidePortalkitBadge: body.hidePortalkitBadge,
    });
    return NextResponse.json({
      source: "supabase",
      branding: saved.branding,
      hidePortalkitBadge: saved.hidePortalkitBadge,
      canHideBadge: hasUnlimitedProjects(plan),
      plan,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save branding" },
      { status: 500 },
    );
  }
}
