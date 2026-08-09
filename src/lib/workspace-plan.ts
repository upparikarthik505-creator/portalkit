/** New accounts get Pro features for this many days without a card. */
export const PRO_TRIAL_DAYS = 14;

/** Starter (post-trial) may keep this many non-done projects. */
export const STARTER_ACTIVE_PROJECT_LIMIT = 1;

export type WorkspacePlanInfo = {
  plan: "starter" | "pro" | "founder";
  studioName: string;
  /** True while starter account is still inside the free Pro trial window. */
  onTrial: boolean;
  trialDaysLeft: number;
  label: string;
  planInterval?: "monthly" | "yearly" | null;
  subscriptionStatus?: string | null;
  hasSubscription?: boolean;
};

export function planInfoFromWorkspace(row: {
  plan?: string | null;
  studio_name?: string | null;
  created_at?: string | null;
  plan_interval?: string | null;
  subscription_status?: string | null;
  razorpay_subscription_id?: string | null;
}): WorkspacePlanInfo {
  const plan =
    row.plan === "pro" || row.plan === "founder" ? row.plan : "starter";
  const studioName = row.studio_name?.trim() || "My studio";
  const planInterval =
    row.plan_interval === "yearly" || row.plan_interval === "monthly"
      ? row.plan_interval
      : null;
  const subscriptionStatus = row.subscription_status || null;
  const hasSubscription = !!row.razorpay_subscription_id;

  if (plan === "founder") {
    return {
      plan,
      studioName,
      onTrial: false,
      trialDaysLeft: 0,
      label: "Founder · lifetime",
      planInterval: null,
      subscriptionStatus: null,
      hasSubscription: false,
    };
  }
  if (plan === "pro") {
    const intervalLabel =
      planInterval === "yearly"
        ? "yearly"
        : planInterval === "monthly"
          ? "monthly"
          : null;
    const cancelNote =
      subscriptionStatus === "cancelling" ? " · cancels at period end" : "";
    return {
      plan,
      studioName,
      onTrial: false,
      trialDaysLeft: 0,
      label: intervalLabel
        ? `Pro · ${intervalLabel}${cancelNote}`
        : `Pro${cancelNote}`,
      planInterval,
      subscriptionStatus,
      hasSubscription,
    };
  }

  const createdMs = row.created_at
    ? new Date(row.created_at).getTime()
    : Date.now();
  const endsMs = createdMs + PRO_TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const trialDaysLeft = Math.max(
    0,
    Math.ceil((endsMs - Date.now()) / (24 * 60 * 60 * 1000)),
  );
  const onTrial = trialDaysLeft > 0;

  return {
    plan: "starter",
    studioName,
    onTrial,
    trialDaysLeft,
    label: onTrial
      ? `Pro trial · ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left`
      : "Starter",
    planInterval: null,
    subscriptionStatus: null,
    hasSubscription: false,
  };
}

/** Active = not Done / Lost. */
export function isActiveProjectStatus(status: string): boolean {
  return status !== "done" && status !== "lost";
}

export function hasUnlimitedProjects(plan: WorkspacePlanInfo): boolean {
  return plan.plan === "pro" || plan.plan === "founder" || plan.onTrial;
}

export function canAddActiveProject(
  plan: WorkspacePlanInfo,
  activeCount: number,
): boolean {
  if (hasUnlimitedProjects(plan)) return true;
  return activeCount < STARTER_ACTIVE_PROJECT_LIMIT;
}
