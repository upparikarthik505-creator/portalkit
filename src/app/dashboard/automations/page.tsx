"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Copy,
  FolderKanban,
  Mail,
  MessageSquare,
  Play,
  Plus,
  Receipt,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Workflow,
  Zap,
} from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import {
  ACTION_OPTIONS,
  DEFAULT_RECIPES,
  TRIGGER_OPTIONS,
  addAutomationLog,
  clearAutomationLogs,
  createAutomation,
  deleteAutomation,
  loadAutomationLogs,
  loadAutomations,
  toggleAutomation,
  updateAutomation,
  type AutomationAction,
  type AutomationActionType,
  type AutomationLog,
  type AutomationRule,
  type AutomationTrigger,
} from "@/lib/automations-store";

const TABS = ["Flows", "Recipe Library", "Activity Log"] as const;

export default function AutomationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Flows");
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [testToast, setTestToast] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState<
    "Intake" | "Sales" | "Delivery" | "Billing"
  >("Sales");
  const [formTrigger, setFormTrigger] = useState<AutomationTrigger>(
    "offer_accepted",
  );
  const [formActions, setFormActions] = useState<
    {
      type: AutomationActionType;
      label: string;
      config: Record<string, any>;
    }[]
  >([
    {
      type: "update_project_status",
      label: "Advance stage to Signed",
      config: { status: "signed" },
    },
    {
      type: "create_portal_tasks",
      label: "Add onboarding checklist",
      config: {
        tasks: [
          "Request Shopify collaborator access",
          "Collect brand files & fonts",
        ],
      },
    },
  ]);

  useEffect(() => {
    setRules(loadAutomations());
    setLogs(loadAutomationLogs());
  }, []);

  const stats = useMemo(() => {
    const activeCount = rules.filter((r) => r.enabled).length;
    const totalRuns = rules.reduce((sum, r) => sum + (r.runCount || 0), 0);
    const estimatedHours = (totalRuns * 0.45).toFixed(1);
    return { activeCount, totalRuns, estimatedHours };
  }, [rules]);

  function handleToggle(id: string) {
    const next = toggleAutomation(id);
    setRules(next);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this automation flow?")) {
      const next = deleteAutomation(id);
      setRules(next);
    }
  }

  function openCreateModal(template?: (typeof DEFAULT_RECIPES)[0]) {
    if (template) {
      setFormName(template.name);
      setFormDesc(template.description);
      setFormCategory(template.category);
      setFormTrigger(template.trigger);
      setFormActions(
        template.actions.map((a) => ({
          type: a.type,
          label: a.label,
          config: { ...a.config },
        })),
      );
    } else {
      setFormName("");
      setFormDesc("");
      setFormCategory("Sales");
      setFormTrigger("offer_accepted");
      setFormActions([
        {
          type: "post_portal_message",
          label: "Post portal announcement",
          config: {
            body: "🚀 Scope accepted! Onboarding checklist is now ready.",
          },
        },
      ]);
    }
    setEditingRule(null);
    setModalOpen(true);
  }

  function openEditModal(rule: AutomationRule) {
    setEditingRule(rule);
    setFormName(rule.name);
    setFormDesc(rule.description);
    setFormCategory(rule.category);
    setFormTrigger(rule.trigger);
    setFormActions(
      rule.actions.map((a) => ({
        type: a.type,
        label: a.label,
        config: { ...a.config },
      })),
    );
    setModalOpen(true);
  }

  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) return;

    const triggerMeta = TRIGGER_OPTIONS.find((t) => t.key === formTrigger);
    const triggerLabel = triggerMeta?.label ?? formTrigger;

    const formattedActions: AutomationAction[] = formActions.map((a, i) => ({
      id: `act_${Date.now()}_${i}`,
      type: a.type,
      label: a.label,
      config: a.config,
    }));

    if (editingRule) {
      const updated = updateAutomation(editingRule.id, {
        name: formName.trim(),
        description: formDesc.trim(),
        category: formCategory,
        trigger: formTrigger,
        triggerLabel,
        actions: formattedActions,
      });
      if (updated) {
        setRules(loadAutomations());
      }
    } else {
      createAutomation({
        name: formName.trim(),
        description: formDesc.trim(),
        category: formCategory,
        trigger: formTrigger,
        triggerLabel,
        actions: formattedActions,
        enabled: true,
      });
      setRules(loadAutomations());
    }

    setModalOpen(false);
    setTab("Flows");
  }

  function handleRunTest(rule: AutomationRule) {
    const actionSummaries = rule.actions.map((a) => a.label).join(" · ");
    const log = addAutomationLog({
      ruleId: rule.id,
      ruleName: rule.name,
      trigger: `${rule.triggerLabel} (Simulated Test)`,
      entityName: "Kith Apparel Rebuild ($3,500)",
      status: "success",
      details: actionSummaries || "Triggered all action steps",
    });

    updateAutomation(rule.id, {
      runCount: (rule.runCount || 0) + 1,
      lastRunAt: "Just now",
    });

    setRules(loadAutomations());
    setLogs([log, ...loadAutomationLogs()]);

    setTestToast(`✓ Test run successful for "${rule.name}"`);
    setTimeout(() => setTestToast(null), 3500);
  }

  function handleClearLogs() {
    if (confirm("Clear all automation activity history?")) {
      clearAutomationLogs();
      setLogs([]);
    }
  }

  function addActionToForm(type: AutomationActionType) {
    const opt = ACTION_OPTIONS.find((o) => o.type === type);
    setFormActions((prev) => [
      ...prev,
      {
        type,
        label: opt?.label ?? "New Action",
        config:
          type === "send_email"
            ? {
                subject: "Project update for {{project_name}}",
                body: "Hi {{client_name}},\n\nHere is an automated update regarding your project.\n\nBest,\nYour Studio",
              }
            : type === "create_portal_tasks"
              ? { tasks: ["Review theme preview", "Confirm product collection"] }
              : type === "post_portal_message"
                ? { body: "Milestone reached! Please review files on the portal." }
                : type === "update_project_status"
                  ? { status: "in_build" }
                  : {},
      },
    ]);
  }

  function removeActionFromForm(index: number) {
    setFormActions((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {testToast ? (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>{testToast}</span>
        </div>
      ) : null}

      {/* Header */}
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mkt-eyebrow">Autopilot</p>
          <SplitHeadline
            as="h1"
            text="Automations that follow the deal"
            className="mkt-h2 mt-1"
          />
          <p className="mkt-lede mt-2 max-w-2xl">
            Trigger onboarding checklists, milestone emails, invoice generation,
            and review asks automatically as deals advance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MagneticButton
            type="button"
            className="btn btn-secondary btn-compact"
            onClick={() => setTab("Recipe Library")}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Browse recipes
          </MagneticButton>
          <MagneticButton
            type="button"
            className="btn btn-primary btn-compact"
            onClick={() => openCreateModal()}
          >
            <Plus className="h-4 w-4" aria-hidden />
            New flow
          </MagneticButton>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-4 shadow-[var(--shadow)]">
          <p className="mkt-label text-muted">Active Workflows</p>
          <p className="mkt-metric mt-1 text-ink">
            {stats.activeCount}{" "}
            <span className="text-sm font-normal text-muted">
              of {rules.length} flows
            </span>
          </p>
          <p className="mkt-meta mt-1 text-mint-ink">
            ● Listening for live pipeline triggers
          </p>
        </div>

        <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-4 shadow-[var(--shadow)]">
          <p className="mkt-label text-muted">Automations Executed</p>
          <p className="mkt-metric mt-1 text-ink">{stats.totalRuns}</p>
          <p className="mkt-meta mt-1 text-muted">
            Actions performed across projects
          </p>
        </div>

        <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-4 shadow-[var(--shadow)]">
          <p className="mkt-label text-muted">Time Saved</p>
          <p className="mkt-metric mt-1 text-accent">~{stats.estimatedHours}h</p>
          <p className="mkt-meta mt-1 text-muted">Admin & follow-up hours saved</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2.5 text-[13px] font-bold transition-colors ${
              tab === t
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t}
            {t === "Activity Log" && logs.length > 0 ? (
              <span className="ml-2 rounded-full bg-paper px-2 py-0.5 text-[11px] text-muted">
                {logs.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Tab 1: Flows List */}
      {tab === "Flows" && (
        <div className="space-y-4">
          {rules.length === 0 ? (
            <div className="rounded-[var(--radius)] border border-line bg-paper-2 px-5 py-12 text-center shadow-[var(--shadow)]">
              <p className="mkt-row">No automations configured yet</p>
              <p className="mkt-meta mt-2 text-muted">
                Choose a pre-built Shopify recipe or create a custom flow.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-compact mt-4"
                onClick={() => setTab("Recipe Library")}
              >
                Explore Recipe Library
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`rounded-[var(--radius)] border p-5 transition-all shadow-[var(--shadow)] ${
                    rule.enabled
                      ? "border-line bg-paper-2 hover:border-accent/40"
                      : "border-line/60 bg-paper/50 opacity-75"
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h2 className="mkt-h3">{rule.name}</h2>
                        <span className="mkt-chip rounded-full bg-paper px-2.5 py-0.5 text-muted">
                          {rule.category}
                        </span>
                        {rule.enabled ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-mint-ink">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-muted">
                            Paused
                          </span>
                        )}
                      </div>
                      <p className="mkt-meta text-muted">{rule.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRunTest(rule)}
                        className="btn btn-secondary !py-1.5 !px-3 !text-[12px]"
                        title="Simulate this flow with sample deal data"
                      >
                        <Play className="h-3 w-3 text-accent" />
                        Test run
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(rule)}
                        className="btn btn-secondary !py-1.5 !px-3 !text-[12px]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(rule.id)}
                        className="p-1.5 text-muted hover:text-ink"
                        title={rule.enabled ? "Pause Flow" : "Enable Flow"}
                      >
                        {rule.enabled ? (
                          <ToggleRight className="h-7 w-7 text-accent" />
                        ) : (
                          <ToggleLeft className="h-7 w-7 text-muted" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(rule.id)}
                        className="p-1.5 text-muted hover:text-accent-deep"
                        title="Delete Flow"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Flow Steps Diagram */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-paper px-3.5 py-3">
                    {/* Trigger */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 shadow-sm">
                      <Zap className="h-3.5 w-3.5 text-accent" />
                      <span className="text-[12px] font-bold text-ink">
                        When: {rule.triggerLabel}
                      </span>
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 text-muted" />

                    {/* Actions */}
                    {rule.actions.map((action, idx) => (
                      <div
                        key={action.id || idx}
                        className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink-2 shadow-sm"
                      >
                        {action.type === "send_email" && (
                          <Mail className="h-3 w-3 text-info" />
                        )}
                        {action.type === "create_portal_tasks" && (
                          <CheckCircle2 className="h-3 w-3 text-mint-ink" />
                        )}
                        {action.type === "post_portal_message" && (
                          <MessageSquare className="h-3 w-3 text-accent" />
                        )}
                        {action.type === "update_project_status" && (
                          <Workflow className="h-3 w-3 text-warn" />
                        )}
                        {action.type === "create_invoice" && (
                          <Receipt className="h-3 w-3 text-accent" />
                        )}
                        <span>{action.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Meta stats */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
                    <span>
                      Triggered {rule.runCount || 0} times
                      {rule.lastRunAt ? ` · Last run: ${rule.lastRunAt}` : ""}
                    </span>
                    <span className="font-mono">ID: {rule.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Recipe Library */}
      {tab === "Recipe Library" && (
        <div className="space-y-4">
          <p className="mkt-lede text-muted">
            One-click Shopify freelancer recipes tuned for theme rebuilds,
            onboarding, and recurring retainer management.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {DEFAULT_RECIPES.map((recipe, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)] transition-all hover:border-accent/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="mkt-chip rounded-full bg-paper px-2.5 py-0.5 text-muted">
                      {recipe.category}
                    </span>
                    <span className="text-[11px] text-muted font-semibold">
                      {recipe.actions.length} action steps
                    </span>
                  </div>
                  <h3 className="mkt-h3 mt-2">{recipe.name}</h3>
                  <p className="mkt-meta mt-1 text-muted">
                    {recipe.description}
                  </p>

                  <div className="mt-3 space-y-1.5 border-t border-line/60 pt-3 text-[12px] text-muted">
                    <p className="font-semibold text-ink-2">
                      ⚡ Trigger: {recipe.triggerLabel}
                    </p>
                    <ul className="list-inside list-disc space-y-0.5 pl-1 text-[11px]">
                      {recipe.actions.map((act, i) => (
                        <li key={i}>{act.label}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openCreateModal(recipe)}
                  className="btn btn-primary btn-compact mt-5 w-full"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Use this recipe
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Activity Log */}
      {tab === "Activity Log" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="mkt-lede text-muted">
              Live execution history of automated background events.
            </p>
            {logs.length > 0 ? (
              <button
                type="button"
                onClick={handleClearLogs}
                className="btn btn-secondary !py-1.5 !px-3 !text-[12px]"
              >
                Clear log
              </button>
            ) : null}
          </div>

          {logs.length === 0 ? (
            <div className="rounded-[var(--radius)] border border-line bg-paper-2 px-5 py-12 text-center shadow-[var(--shadow)]">
              <Activity className="mx-auto h-8 w-8 text-muted" />
              <p className="mkt-row mt-2">No activity logged yet</p>
              <p className="mkt-meta mt-1 text-muted">
                Run a test flow or let live pipeline triggers fire automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-paper-2 shadow-[var(--shadow)]">
              <div className="hidden grid-cols-[1.2fr_1fr_1.5fr_0.8fr] gap-3 border-b border-line px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted md:grid">
                <span>Event / Flow</span>
                <span>Entity</span>
                <span>Actions Executed</span>
                <span>Time</span>
              </div>
              <div className="divide-y divide-line">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="grid gap-1 px-5 py-3.5 text-sm md:grid-cols-[1.2fr_1fr_1.5fr_0.8fr] md:items-center md:gap-3"
                  >
                    <div>
                      <p className="font-semibold text-ink">{log.ruleName}</p>
                      <p className="text-[12px] text-muted">{log.trigger}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-ink-2">
                        {log.entityName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-muted leading-relaxed">
                        {log.details}
                      </p>
                    </div>
                    <div>
                      <span className="text-[12px] text-muted">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Workflow Builder */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSaveForm}
            className="surface max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-xl font-extrabold">
                {editingRule ? "Edit Automation Flow" : "Create New Automation"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-muted hover:text-ink text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Flow Name</span>
                <input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Deposit Paid → Kickoff Portal"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">
                    Category
                  </span>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(
                        e.target.value as "Intake" | "Sales" | "Delivery" | "Billing",
                      )
                    }
                    className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                  >
                    <option value="Intake">Intake</option>
                    <option value="Sales">Sales</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Billing">Billing</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Trigger</span>
                  <select
                    value={formTrigger}
                    onChange={(e) =>
                      setFormTrigger(e.target.value as AutomationTrigger)
                    }
                    className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                  >
                    {TRIGGER_OPTIONS.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Description
                </span>
                <input
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Briefly describe what this automation does"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              {/* Actions Builder */}
              <div className="space-y-2 border-t border-line pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Action Steps</span>
                  <div className="flex gap-1">
                    {ACTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => addActionToForm(opt.type)}
                        className="rounded-lg border border-line bg-paper px-2 py-1 text-[11px] font-semibold text-muted hover:border-accent hover:text-ink"
                      >
                        + {opt.label.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {formActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-line bg-paper/50 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-ink-2">
                          Step {idx + 1}: {action.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeActionFromForm(idx)}
                          className="text-[11px] text-accent-deep hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      {action.type === "send_email" && (
                        <div className="space-y-1.5">
                          <input
                            value={action.config.subject || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormActions((prev) =>
                                prev.map((a, i) =>
                                  i === idx
                                    ? {
                                        ...a,
                                        config: { ...a.config, subject: val },
                                      }
                                    : a,
                                ),
                              );
                            }}
                            placeholder="Email Subject"
                            className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs"
                          />
                          <textarea
                            rows={3}
                            value={action.config.body || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormActions((prev) =>
                                prev.map((a, i) =>
                                  i === idx
                                    ? { ...a, config: { ...a.config, body: val } }
                                    : a,
                                ),
                              );
                            }}
                            placeholder="Email body template (use {{client_name}}, {{project_name}})"
                            className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-mono"
                          />
                        </div>
                      )}

                      {action.type === "post_portal_message" && (
                        <textarea
                          rows={2}
                          value={action.config.body || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormActions((prev) =>
                              prev.map((a, i) =>
                                i === idx
                                  ? { ...a, config: { ...a.config, body: val } }
                                  : a,
                              ),
                            );
                          }}
                          placeholder="Message posted to portal thread"
                          className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs"
                        />
                      )}

                      {action.type === "create_portal_tasks" && (
                        <textarea
                          rows={3}
                          value={(action.config.tasks || []).join("\n")}
                          onChange={(e) => {
                            const val = e.target.value.split("\n");
                            setFormActions((prev) =>
                              prev.map((a, i) =>
                                i === idx
                                  ? { ...a, config: { ...a.config, tasks: val } }
                                  : a,
                              ),
                            );
                          }}
                          placeholder="Enter tasks (one per line)"
                          className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs"
                        />
                      )}

                      {action.type === "update_project_status" && (
                        <select
                          value={action.config.status || "signed"}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormActions((prev) =>
                              prev.map((a, i) =>
                                i === idx
                                  ? { ...a, config: { ...a.config, status: val } }
                                  : a,
                              ),
                            );
                          }}
                          className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs"
                        >
                          <option value="lead">Lead</option>
                          <option value="offer_sent">Offer Sent</option>
                          <option value="signed">Signed</option>
                          <option value="deposit_paid">Deposit Paid</option>
                          <option value="in_build">In Build</option>
                          <option value="done">Done</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-line pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                {editingRule ? "Save Changes" : "Create Flow"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
