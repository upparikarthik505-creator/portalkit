"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Mail,
  Receipt,
  RotateCcw,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import {
  EMAIL_TEMPLATES,
  PROPOSAL_TEMPLATES,
  generateChecklist,
  generateClientEmail,
  generateProposalScope,
  type ChecklistType,
  type EmailTemplateType,
  type ProposalTemplateType,
  type ToneType,
} from "@/lib/ai-drafts";

const TABS = [
  { id: "proposal", label: "Proposal Architect", icon: FileText },
  { id: "email", label: "Client Message Copilot", icon: Mail },
  { id: "checklist", label: "Launch QA Checklists", icon: CheckCircle2 },
] as const;

export default function AiDraftsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("proposal");
  const [copied, setCopied] = useState(false);

  // Proposal State
  const [proposalType, setProposalType] =
    useState<ProposalTemplateType>("theme_rebuild");
  const [clientName, setClientName] = useState("Sarah Miller");
  const [storeName, setStoreName] = useState("Kith Apparel");
  const [niche, setNiche] = useState("Luxury Apparel & Streetwear");
  const [totalPrice, setTotalPrice] = useState("3500");
  const [depositPrice, setDepositPrice] = useState("1500");
  const [customNotes, setCustomNotes] = useState(
    "Include Klaviyo popup integration & size-guide metafield chart.",
  );

  // Email State
  const [emailType, setEmailType] = useState<EmailTemplateType>("kickoff");
  const [emailTone, setEmailTone] = useState<ToneType>("warm");
  const [studioName, setStudioName] = useState("Forge Studio");
  const [portalUrl, setPortalUrl] = useState("https://portalkit.io/p/kith-apparel");
  const [extraContext, setExtraContext] = useState("custom 3D product visualizer");

  // Checklist State
  const [checklistType, setChecklistType] =
    useState<ChecklistType>("launch_qa");

  // Generated Outputs
  const generatedProposal = generateProposalScope({
    type: proposalType,
    clientName,
    storeName,
    niche,
    totalPrice: Number(totalPrice) || 3500,
    depositPrice: Number(depositPrice) || 1500,
    customNotes,
  });

  const generatedEmail = generateClientEmail({
    type: emailType,
    clientName,
    storeName,
    studioName,
    portalUrl,
    tone: emailTone,
    extraContext,
  });

  const generatedChecklistItems = generateChecklist(checklistType, storeName);

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCreateOfferFromAi() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "portalkit.ai.draft_offer",
        JSON.stringify({
          title: generatedProposal.title,
          scope: generatedProposal.scopeText,
          total: totalPrice,
          deposit: depositPrice,
        }),
      );
      router.push("/dashboard/proposals");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mkt-eyebrow flex items-center gap-1.5 text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            AI Drafts Studio
          </p>
          <SplitHeadline
            as="h1"
            text="Draft scopes & client copy in seconds"
            className="mkt-h2 mt-1"
          />
          <p className="mkt-lede mt-2 max-w-2xl">
            Pre-tuned AI assistants for Shopify proposals, scope-creep pushbacks,
            kickoff notes, and pre-launch QA checklists.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-line pb-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all ${
                active
                  ? "bg-ink text-white shadow-sm"
                  : "bg-paper text-muted hover:text-ink"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-accent" : "text-muted"}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Proposal Architect */}
      {tab === "proposal" && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          {/* Controls */}
          <div className="surface space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 className="mkt-h3">Package Configurator</h2>
              <span className="mkt-chip text-muted">Shopify 2.0 Engine</span>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                Project Archetype
              </span>
              <select
                value={proposalType}
                onChange={(e) => {
                  const val = e.target.value as ProposalTemplateType;
                  setProposalType(val);
                  const found = PROPOSAL_TEMPLATES.find((p) => p.key === val);
                  if (found) {
                    setTotalPrice(String(found.defaultPrice));
                    setDepositPrice(String(found.defaultDeposit));
                  }
                }}
                className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              >
                {PROPOSAL_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.key} value={tmpl.key}>
                    {tmpl.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Client Name</span>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Sarah Miller"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Store Brand</span>
                <input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Kith Apparel"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                Store Niche / Category
              </span>
              <input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Beauty & Skincare, Direct-to-Consumer Food"
                className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Total ($ USD)</span>
                <input
                  type="number"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Deposit ($ USD)
                </span>
                <input
                  type="number"
                  value={depositPrice}
                  onChange={(e) => setDepositPrice(e.target.value)}
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                Special Client Requirements (Optional)
              </span>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Custom size chart popup, Klaviyo integration, subscription recharge"
                className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              />
            </label>
          </div>

          {/* Output Preview */}
          <div className="space-y-4">
            <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div>
                  <span className="mkt-label text-accent">Generated Scope</span>
                  <h3 className="mkt-h3 font-bold mt-0.5">
                    {generatedProposal.title}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Estimated Timeline: {generatedProposal.timeline}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyText(generatedProposal.scopeText)}
                    className="btn btn-secondary !py-1.5 !px-3 !text-xs flex items-center gap-1.5"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-mint-ink" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy Scope"}
                  </button>
                  <MagneticButton
                    type="button"
                    className="btn btn-primary !py-1.5 !px-3 !text-xs flex items-center gap-1.5"
                    onClick={handleCreateOfferFromAi}
                  >
                    <Send className="h-3.5 w-3.5" />
                    Draft Offer
                  </MagneticButton>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-line bg-paper p-4">
                <pre className="whitespace-pre-wrap font-sans text-xs text-ink-2 leading-relaxed">
                  {generatedProposal.scopeText}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Client Message Copilot */}
      {tab === "email" && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="surface space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 className="mkt-h3">Message Scenario</h2>
              <span className="mkt-chip text-muted">Shopify Client Copilot</span>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                Email Template
              </span>
              <select
                value={emailType}
                onChange={(e) =>
                  setEmailType(e.target.value as EmailTemplateType)
                }
                className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              >
                {EMAIL_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.key} value={tmpl.key}>
                    {tmpl.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-1.5">
              <span className="block text-sm font-medium">Tone of Voice</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "warm", label: "Warm & Collaborative" },
                  { key: "concise", label: "Direct & Concise" },
                  { key: "agency", label: "High-End Agency" },
                  { key: "firm", label: "Formal & Guarded" },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setEmailTone(t.key as ToneType)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                      emailTone === t.key
                        ? "border-accent bg-accent-soft/40 text-accent-deep"
                        : "border-line bg-paper text-muted hover:text-ink"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Client Name</span>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Store Name</span>
                <input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Kith Apparel"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Studio Name</span>
              <input
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="e.g. Forge Studio"
                className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              />
            </label>

            {emailType === "scope_pushback" && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Out-of-Scope Feature Mentioned
                </span>
                <input
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                  placeholder="e.g. 3D interactive model viewer"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                Client Portal Link
              </span>
              <input
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                className="w-full rounded-xl border border-line px-3 py-2 text-sm font-mono"
              />
            </label>
          </div>

          {/* Email Preview */}
          <div className="space-y-4">
            <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <p className="mkt-label text-muted">Subject Line</p>
                  <p className="font-bold text-ink mt-0.5">
                    {generatedEmail.subject}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`,
                    )
                  }
                  className="btn btn-secondary !py-1.5 !px-3 !text-xs flex items-center gap-1.5"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-mint-ink" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy Email"}
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-line bg-paper p-4">
                <pre className="whitespace-pre-wrap font-sans text-xs text-ink-2 leading-relaxed">
                  {generatedEmail.body}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Launch QA Checklists */}
      {tab === "checklist" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div className="surface space-y-4 p-5">
            <div className="border-b border-line pb-2">
              <h2 className="mkt-h3">Checklist Generator</h2>
              <p className="mkt-meta text-muted mt-1">
                Standard operating procedures for defect-free Shopify launches.
              </p>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Checklist Type</span>
              <select
                value={checklistType}
                onChange={(e) =>
                  setChecklistType(e.target.value as ChecklistType)
                }
                className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              >
                <option value="launch_qa">Shopify Store Launch QA (Final Polish)</option>
                <option value="seo_migration">SEO & 301 Redirects Migration</option>
                <option value="speed_audit">Speed & Core Web Vitals Optimization</option>
                <option value="app_cleanup">App Cleanup & Script Tag Audit</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Store Name</span>
              <input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Kith Apparel"
                className="w-full rounded-xl border border-line px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <h3 className="mkt-h3">
                    {checklistType === "launch_qa"
                      ? "Launch QA Checklist"
                      : checklistType === "seo_migration"
                        ? "SEO & 301 Migration Matrix"
                        : "Speed & CWV Checklist"}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    {generatedChecklistItems.length} verified checklist tasks
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      generatedChecklistItems
                        .map((item) => `[ ] ${item}`)
                        .join("\n"),
                    )
                  }
                  className="btn btn-secondary !py-1.5 !px-3 !text-xs flex items-center gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy all tasks
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {generatedChecklistItems.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-line bg-paper p-3 text-xs text-ink-2"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-mint-ink mt-0.5" />
                    <span className="leading-relaxed">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
