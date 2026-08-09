"use client";

import { nanoid } from "nanoid";

export type AutomationTrigger =
  | "lead_submitted"
  | "offer_sent"
  | "offer_accepted"
  | "deposit_paid"
  | "stage_in_build"
  | "stage_done"
  | "invoice_overdue";

export type AutomationActionType =
  | "send_email"
  | "create_portal_tasks"
  | "post_portal_message"
  | "update_project_status"
  | "create_invoice";

export type AutomationAction = {
  id: string;
  type: AutomationActionType;
  label: string;
  config: {
    template?: string;
    subject?: string;
    body?: string;
    tasks?: string[];
    status?: string;
    amountCents?: number;
    invoiceLabel?: string;
  };
};

export type AutomationRule = {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  triggerLabel: string;
  category: "Intake" | "Sales" | "Delivery" | "Billing";
  actions: AutomationAction[];
  enabled: boolean;
  runCount: number;
  lastRunAt: string | null;
  createdAt: string;
};

export type AutomationLog = {
  id: string;
  ruleId: string;
  ruleName: string;
  trigger: string;
  entityName: string;
  status: "success" | "skipped" | "failed";
  details: string;
  timestamp: string;
};

export const TRIGGER_OPTIONS: {
  key: AutomationTrigger;
  label: string;
  category: "Intake" | "Sales" | "Delivery" | "Billing";
  hint: string;
}[] = [
  {
    key: "lead_submitted",
    label: "Lead form submitted",
    category: "Intake",
    hint: "Fires when a merchant submits your public intake form",
  },
  {
    key: "offer_sent",
    label: "Proposal / Offer sent",
    category: "Sales",
    hint: "Fires when an offer link is created and sent to a client",
  },
  {
    key: "offer_accepted",
    label: "Offer accepted by client",
    category: "Sales",
    hint: "Fires when a client digitally accepts your proposal scope",
  },
  {
    key: "deposit_paid",
    label: "Deposit / Milestone paid",
    category: "Billing",
    hint: "Fires when payment is marked paid or completed via Razorpay",
  },
  {
    key: "stage_in_build",
    label: "Project moved to In Build",
    category: "Delivery",
    hint: "Fires when work starts on the Shopify store/theme",
  },
  {
    key: "stage_done",
    label: "Project completed (Done)",
    category: "Delivery",
    hint: "Fires when final delivery is reached and project is marked done",
  },
  {
    key: "invoice_overdue",
    label: "Payment ask overdue (>7 days)",
    category: "Billing",
    hint: "Fires when an outstanding invoice passes due date",
  },
];

export const ACTION_OPTIONS: {
  type: AutomationActionType;
  label: string;
  hint: string;
}[] = [
  {
    type: "send_email",
    label: "Send transactional email",
    hint: "Sends automated branded notification to client or freelancer",
  },
  {
    type: "create_portal_tasks",
    label: "Add checklist tasks",
    hint: "Automatically populates onboarding or delivery tasks on the portal",
  },
  {
    type: "post_portal_message",
    label: "Post portal announcement",
    hint: "Publishes a status message directly into the client portal thread",
  },
  {
    type: "update_project_status",
    label: "Advance project stage",
    hint: "Automatically transitions project status (e.g. Lead → Signed → In Build)",
  },
  {
    type: "create_invoice",
    label: "Generate payment request",
    hint: "Creates a deposit or milestone payment request automatically",
  },
];

export const DEFAULT_RECIPES: Omit<AutomationRule, "id" | "createdAt">[] = [
  {
    name: "Lead Intake Autopilot",
    description: "Instantly acknowledges new store inquiries and prepares kickoff tasks.",
    trigger: "lead_submitted",
    triggerLabel: "Lead form submitted",
    category: "Intake",
    enabled: true,
    runCount: 3,
    lastRunAt: "Yesterday at 4:15 PM",
    actions: [
      {
        id: "act_1",
        type: "send_email",
        label: "Send welcome email",
        config: {
          subject: "Thanks for reaching out! We received your Shopify inquiry",
          body: "Hi {{client_name}},\n\nThank you for reaching out! We've received your project details and are reviewing your store requirements. We'll be in touch within 24 hours with next steps.\n\nBest regards,\nYour Studio Team",
        },
      },
      {
        id: "act_2",
        type: "create_portal_tasks",
        label: "Add lead prep tasks",
        config: {
          tasks: [
            "Review store URL and catalog size",
            "Perform initial speed & theme audit",
            "Draft custom proposal package",
          ],
        },
      },
    ],
  },
  {
    name: "Offer Accepted → Kickoff & Invoice",
    description: "When an offer is accepted, generates kickoff deposit and sets status to Signed.",
    trigger: "offer_accepted",
    triggerLabel: "Offer accepted by client",
    category: "Sales",
    enabled: true,
    runCount: 2,
    lastRunAt: "2 days ago",
    actions: [
      {
        id: "act_3",
        type: "update_project_status",
        label: "Move stage to Signed",
        config: { status: "signed" },
      },
      {
        id: "act_4",
        type: "create_portal_tasks",
        label: "Add onboarding checklist",
        config: {
          tasks: [
            "Send Shopify collaborator request (code/themes access)",
            "Collect brand assets (Figma, logo SVGs, fonts, color hexes)",
            "Review product taxonomy and required third-party apps",
          ],
        },
      },
      {
        id: "act_5",
        type: "post_portal_message",
        label: "Post portal kickoff note",
        config: {
          body: "🎉 Scope accepted! We have prepared your kickoff checklist. Please review the tasks above so we can begin.",
        },
      },
    ],
  },
  {
    name: "Deposit Paid → Build Kickoff",
    description: "When deposit is confirmed, advances project to In Build and alerts merchant.",
    trigger: "deposit_paid",
    triggerLabel: "Deposit / Milestone paid",
    category: "Billing",
    enabled: true,
    runCount: 2,
    lastRunAt: "3 days ago",
    actions: [
      {
        id: "act_6",
        type: "update_project_status",
        label: "Advance stage to In Build",
        config: { status: "in_build" },
      },
      {
        id: "act_7",
        type: "post_portal_message",
        label: "Post build kickoff message",
        config: {
          body: "Deposit confirmed! Build phase is officially underway. Check the portal for preview links and progress updates.",
        },
      },
    ],
  },
  {
    name: "Build Shipped → 5-Star Review Request",
    description: "When project is marked Done, automatically requests a client review and testimonial.",
    trigger: "stage_done",
    triggerLabel: "Project completed (Done)",
    category: "Delivery",
    enabled: true,
    runCount: 1,
    lastRunAt: "Last week",
    actions: [
      {
        id: "act_8",
        type: "send_email",
        label: "Send review & testimonial request",
        config: {
          subject: "How did your Shopify theme launch go? We'd love your feedback!",
          body: "Hi {{client_name}},\n\nCongratulations on the new store launch! It was a pleasure working with you.\n\nCould you take 60 seconds to share a short review of our collaboration? It helps our studio tremendously.\n\nThank you again!",
        },
      },
      {
        id: "act_9",
        type: "post_portal_message",
        label: "Post handover congratulations",
        config: {
          body: "🚀 Project successfully delivered! All theme files, assets, and documentation are archived in this portal.",
        },
      },
    ],
  },
  {
    name: "Overdue Invoice Chase",
    description: "Sends automated friendly follow-up when a milestone invoice is pending >7 days.",
    trigger: "invoice_overdue",
    triggerLabel: "Payment ask overdue (>7 days)",
    category: "Billing",
    enabled: false,
    runCount: 0,
    lastRunAt: null,
    actions: [
      {
        id: "act_10",
        type: "send_email",
        label: "Send gentle payment nudge",
        config: {
          subject: "Friendly reminder: milestone invoice for {{project_name}}",
          body: "Hi {{client_name}},\n\nJust a quick note that the milestone invoice for {{project_name}} is pending. You can pay securely via the client portal link below.\n\nLet us know if you have any questions!",
        },
      },
    ],
  },
];

const STORAGE_KEY_RULES = "portalkit.automations.rules.v2";
const STORAGE_KEY_LOGS = "portalkit.automations.logs.v2";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadAutomations(): AutomationRule[] {
  if (!canUseStorage()) {
    return DEFAULT_RECIPES.map((r, i) => ({
      ...r,
      id: `auto_${i + 1}`,
      createdAt: new Date().toISOString(),
    }));
  }
  const raw = localStorage.getItem(STORAGE_KEY_RULES);
  if (!raw) {
    const seeded = DEFAULT_RECIPES.map((r, i) => ({
      ...r,
      id: `auto_${i + 1}`,
      createdAt: new Date().toISOString(),
    }));
    saveAutomations(seeded);
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* fallback */
  }
  return DEFAULT_RECIPES.map((r, i) => ({
    ...r,
    id: `auto_${i + 1}`,
    createdAt: new Date().toISOString(),
  }));
}

export function saveAutomations(rules: AutomationRule[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
}

export function toggleAutomation(id: string): AutomationRule[] {
  const list = loadAutomations().map((r) =>
    r.id === id ? { ...r, enabled: !r.enabled } : r,
  );
  saveAutomations(list);
  return list;
}

export function createAutomation(
  rule: Omit<AutomationRule, "id" | "runCount" | "lastRunAt" | "createdAt">,
): AutomationRule {
  const newRule: AutomationRule = {
    ...rule,
    id: `auto_${nanoid(8)}`,
    runCount: 0,
    lastRunAt: null,
    createdAt: new Date().toISOString(),
  };
  const list = [newRule, ...loadAutomations()];
  saveAutomations(list);
  return newRule;
}

export function updateAutomation(
  id: string,
  updates: Partial<AutomationRule>,
): AutomationRule | null {
  let updated: AutomationRule | null = null;
  const list = loadAutomations().map((r) => {
    if (r.id === id) {
      updated = { ...r, ...updates };
      return updated;
    }
    return r;
  });
  saveAutomations(list);
  return updated;
}

export function deleteAutomation(id: string): AutomationRule[] {
  const list = loadAutomations().filter((r) => r.id !== id);
  saveAutomations(list);
  return list;
}

export function loadAutomationLogs(): AutomationLog[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(STORAGE_KEY_LOGS);
  if (!raw) {
    const initialLogs: AutomationLog[] = [
      {
        id: "log_1",
        ruleId: "auto_1",
        ruleName: "Lead Intake Autopilot",
        trigger: "Lead form submitted",
        entityName: "Kith Apparel Redesign (Sarah Miller)",
        status: "success",
        details: "Sent welcome email · Created 3 kickoff preparation tasks",
        timestamp: "Yesterday at 4:15 PM",
      },
      {
        id: "log_2",
        ruleId: "auto_2",
        ruleName: "Offer Accepted → Kickoff & Invoice",
        trigger: "Offer accepted by client",
        entityName: "Aura Skincare 2.0 Theme Rebuild",
        status: "success",
        details: "Project moved to Signed · 3 onboarding tasks added · Portal kickoff note posted",
        timestamp: "2 days ago at 11:30 AM",
      },
      {
        id: "log_3",
        ruleId: "auto_3",
        ruleName: "Deposit Paid → Build Kickoff",
        trigger: "Deposit / Milestone paid",
        entityName: "Nomad Roasters Replatform",
        status: "success",
        details: "Status advanced to In Build · Kickoff announcement posted to portal",
        timestamp: "3 days ago at 2:40 PM",
      },
      {
        id: "log_4",
        ruleId: "auto_4",
        ruleName: "Build Shipped → 5-Star Review Request",
        trigger: "Project completed (Done)",
        entityName: "Velvet Home Speed & CRO Audit",
        status: "success",
        details: "Review request email sent to client · Handover archive message posted",
        timestamp: "Aug 4 at 6:00 PM",
      },
    ];
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(initialLogs));
    return initialLogs;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* fallback */
  }
  return [];
}

export function addAutomationLog(
  log: Omit<AutomationLog, "id" | "timestamp">,
): AutomationLog {
  const newLog: AutomationLog = {
    ...log,
    id: `log_${nanoid(8)}`,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    }),
  };
  if (canUseStorage()) {
    const logs = [newLog, ...loadAutomationLogs().slice(0, 49)];
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }
  return newLog;
}

export function clearAutomationLogs() {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify([]));
}

/**
 * Executes matching active automations for a given event trigger
 */
export async function triggerAutomations(
  trigger: AutomationTrigger,
  payload: {
    projectName?: string;
    clientName?: string;
    clientEmail?: string;
    projectId?: string;
    amountCents?: number;
    offerTitle?: string;
  },
): Promise<AutomationLog[]> {
  const rules = loadAutomations().filter((r) => r.enabled && r.trigger === trigger);
  const generatedLogs: AutomationLog[] = [];

  const nowStr = "Just now";

  for (const rule of rules) {
    const actionSummaries: string[] = [];
    for (const act of rule.actions) {
      if (act.type === "send_email") {
        actionSummaries.push(`Sent email "${act.config.subject || act.label}"`);
      } else if (act.type === "create_portal_tasks") {
        const count = act.config.tasks?.length ?? 1;
        actionSummaries.push(`Created ${count} portal tasks`);
      } else if (act.type === "post_portal_message") {
        actionSummaries.push("Posted message to portal thread");
      } else if (act.type === "update_project_status") {
        actionSummaries.push(`Advanced status to "${act.config.status || "active"}"`);
      } else if (act.type === "create_invoice") {
        actionSummaries.push("Created payment request");
      }
    }

    const log = addAutomationLog({
      ruleId: rule.id,
      ruleName: rule.name,
      trigger: rule.triggerLabel,
      entityName:
        payload.projectName || payload.clientName || payload.offerTitle || "Project Deal",
      status: "success",
      details: actionSummaries.join(" · ") || "Executed all steps",
    });

    // Update rule counters
    updateAutomation(rule.id, {
      runCount: (rule.runCount || 0) + 1,
      lastRunAt: nowStr,
    });

    generatedLogs.push(log);
  }

  return generatedLogs;
}
