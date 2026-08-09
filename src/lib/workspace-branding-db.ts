import {
  DEFAULT_BRANDING,
  type WorkspaceBranding,
} from "@/lib/branding";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  hasUnlimitedProjects,
  planInfoFromWorkspace,
  type WorkspacePlanInfo,
} from "@/lib/workspace-plan";

async function ensureWorkspace(clerkUserId: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return null;

  const { data: existing } = await sb
    .from("workspaces")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (existing?.id) return existing.id as string;

  const { data, error } = await sb
    .from("workspaces")
    .insert({
      clerk_user_id: clerkUserId,
      name: "My workspace",
      plan: "starter",
      studio_name: DEFAULT_BRANDING.studioName,
      brand_accent: DEFAULT_BRANDING.accent,
      support_email: DEFAULT_BRANDING.supportEmail,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function getBrandingForUser(
  clerkUserId: string,
): Promise<WorkspaceBranding> {
  if (!isSupabaseConfigured()) return DEFAULT_BRANDING;

  const sb = getSupabaseAdmin()!;
  await ensureWorkspace(clerkUserId);

  const { data, error } = await sb
    .from("workspaces")
    .select("studio_name, brand_accent, support_email")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return DEFAULT_BRANDING;

  return {
    studioName: (data.studio_name as string) || DEFAULT_BRANDING.studioName,
    accent: (data.brand_accent as string) || DEFAULT_BRANDING.accent,
    supportEmail: (data.support_email as string) || "",
  };
}

export async function getHideBadgePreferenceForUser(
  clerkUserId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const sb = getSupabaseAdmin()!;
  await ensureWorkspace(clerkUserId);
  const { data, error } = await sb
    .from("workspaces")
    .select("hide_portalkit_badge")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data?.hide_portalkit_badge);
}

export async function getPlanInfoForUser(
  clerkUserId: string,
): Promise<WorkspacePlanInfo> {
  if (!isSupabaseConfigured()) {
    return planInfoFromWorkspace({
      plan: "starter",
      studio_name: DEFAULT_BRANDING.studioName,
      created_at: new Date().toISOString(),
    });
  }

  const sb = getSupabaseAdmin()!;
  await ensureWorkspace(clerkUserId);

  const { data, error } = await sb
    .from("workspaces")
    .select(
      "plan, studio_name, created_at, plan_interval, subscription_status, razorpay_subscription_id",
    )
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) throw error;
  return planInfoFromWorkspace(data ?? {});
}

/** Public portal branding — resolved only via project share token. */
export async function getBrandingByShareToken(
  token: string,
): Promise<WorkspaceBranding> {
  const presentation = await getPortalPresentationByShareToken(token);
  return presentation.branding;
}

/** Branding + whether “Powered by PortalKit” must show (server-enforced). */
export async function getPortalPresentationByShareToken(token: string): Promise<{
  branding: WorkspaceBranding;
  showBadge: boolean;
}> {
  if (!token || !isSupabaseConfigured()) {
    return { branding: DEFAULT_BRANDING, showBadge: true };
  }

  const sb = getSupabaseAdmin()!;
  const { data: project, error: projectError } = await sb
    .from("projects")
    .select("workspace_id")
    .eq("share_token", token)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project?.workspace_id) {
    return { branding: DEFAULT_BRANDING, showBadge: true };
  }

  const { data, error } = await sb
    .from("workspaces")
    .select(
      "studio_name, brand_accent, support_email, plan, created_at, hide_portalkit_badge",
    )
    .eq("id", project.workspace_id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { branding: DEFAULT_BRANDING, showBadge: true };

  const branding: WorkspaceBranding = {
    studioName: (data.studio_name as string) || DEFAULT_BRANDING.studioName,
    accent: (data.brand_accent as string) || DEFAULT_BRANDING.accent,
    supportEmail: (data.support_email as string) || "",
  };
  const plan = planInfoFromWorkspace(data);
  const canHide = hasUnlimitedProjects(plan);
  const showBadge = !(canHide && Boolean(data.hide_portalkit_badge));

  return { branding, showBadge };
}

export async function saveBrandingForUser(
  clerkUserId: string,
  branding: WorkspaceBranding,
  opts?: { hidePortalkitBadge?: boolean },
): Promise<{ branding: WorkspaceBranding; hidePortalkitBadge: boolean }> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const sb = getSupabaseAdmin()!;
  await ensureWorkspace(clerkUserId);

  const plan = await getPlanInfoForUser(clerkUserId);
  const canHide = hasUnlimitedProjects(plan);
  const hidePortalkitBadge = canHide
    ? Boolean(opts?.hidePortalkitBadge)
    : false;

  const { data, error } = await sb
    .from("workspaces")
    .update({
      studio_name: branding.studioName,
      brand_accent: branding.accent,
      support_email: branding.supportEmail,
      hide_portalkit_badge: hidePortalkitBadge,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId)
    .select("studio_name, brand_accent, support_email, hide_portalkit_badge")
    .single();

  if (error) throw error;

  return {
    branding: {
      studioName: data.studio_name as string,
      accent: data.brand_accent as string,
      supportEmail: (data.support_email as string) || "",
    },
    hidePortalkitBadge: Boolean(data.hide_portalkit_badge),
  };
}
