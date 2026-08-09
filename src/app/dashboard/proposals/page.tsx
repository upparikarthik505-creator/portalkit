"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import type { Offer } from "@/lib/offers-db";
import { formatMoney } from "@/lib/money";
import { hydrateProjects } from "@/lib/store";
import type { Project } from "@/lib/types";

export default function ProposalsPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    title: "",
    scope: "",
    total: "2500",
    deposit: "500",
    send: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [oRes, projs] = await Promise.all([
        fetch("/api/offers").then((r) => r.json()),
        hydrateProjects(),
      ]);
      setOffers((oRes as { offers?: Offer[] }).offers ?? []);
      setProjects(projs);
    } catch {
      setError("Could not load offers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    // Check if coming from AI Drafts Studio
    if (typeof window !== "undefined") {
      const aiDraftRaw = sessionStorage.getItem("portalkit.ai.draft_offer");
      if (aiDraftRaw) {
        try {
          const parsed = JSON.parse(aiDraftRaw);
          if (parsed && parsed.title) {
            setForm((prev) => ({
              ...prev,
              title: parsed.title,
              scope: parsed.scope,
              total: parsed.total || prev.total,
              deposit: parsed.deposit || prev.deposit,
            }));
            setOpen(true);
            sessionStorage.removeItem("portalkit.ai.draft_offer");
          }
        } catch {
          /* ignore */
        }
      }
    }
  }, [load]);

  function handleQuickAiGenerate() {
    const selectedProj = projects.find((p) => p.id === form.projectId);
    const store = selectedProj?.name || "Shopify Store";
    const client = selectedProj?.clientName || "Merchant";

    setForm((prev) => ({
      ...prev,
      title: `${store} — 2.0 Theme Rebuild & Performance`,
      scope: `PROJECT OVERVIEW:\nFlagship Shopify OS 2.0 rebuild tailored for ${client}.\n\nKEY DELIVERABLES:\n• Custom 2.0 architecture with dynamic liquid sections\n• Homepage, Product Detail Page, Collection Grid, and Cart Drawer\n• Mobile responsive QA & Lighthouse 85+ speed optimization\n• 14 days post-launch hypercare warranty\n\nCOMMERCIAL TERMS:\n• Total: $${prev.total} USD\n• Kickoff Deposit: $${prev.deposit} USD`,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: form.projectId,
          title: form.title,
          scope: form.scope,
          totalCents: Math.round(Number(form.total) * 100),
          depositCents: Math.round(Number(form.deposit) * 100),
          send: form.send,
        }),
      });
      const data = (await res.json()) as { error?: string; offer?: Offer };
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setOpen(false);
      await load();

      // Trigger active automations if sent
      if (form.send) {
        const { triggerAutomations } = await import("@/lib/automations-store");
        const selectedProj = projects.find((p) => p.id === form.projectId);
        void triggerAutomations("offer_sent", {
          projectId: form.projectId,
          projectName: selectedProj?.name,
          clientName: selectedProj?.clientName,
          clientEmail: selectedProj?.clientEmail,
          offerTitle: form.title,
        }).catch(() => undefined);
      }

      if (data.offer?.shareToken && form.send) {
        const url = `${window.location.origin}/offer/${data.offer.shareToken}`;
        await navigator.clipboard.writeText(url).catch(() => undefined);
      }
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-2">
            Offers
          </p>
          <SplitHeadline
            as="h1"
            text="Packages merchants say yes to"
            className="mt-1 text-[34px] font-extrabold tracking-[-0.04em] md:text-[40px]"
          />
          <p className="mt-2 max-w-xl text-[15px] text-muted">
            Scope + price → shareable client link. Sending moves the deal to
            Offer sent.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/ai"
            className="btn btn-secondary !py-2.5 !text-[13px]"
          >
            ✨ AI Draft Studio
          </Link>
          <MagneticButton
            type="button"
            className="btn btn-primary !py-2.5 !text-[13px]"
            onClick={() => setOpen(true)}
          >
            + Draft offer
          </MagneticButton>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-line bg-paper px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white/95 px-5 py-12 text-center">
          <p className="text-[16px] font-extrabold">No offers yet</p>
          <p className="mt-2 text-[14px] text-muted">
            Create a project first, then draft an offer with scope and price.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {offers.map((o) => (
            <div
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3"
            >
              <div>
                <p className="font-semibold">
                  {o.title}{" "}
                  <span className="text-muted">v{o.version}</span>
                </p>
                <p className="text-sm text-muted">
                  {formatMoney(o.totalCents)} · deposit{" "}
                  {formatMoney(o.depositCents)} · {o.status}
                </p>
              </div>
              {o.status === "sent" || o.status === "accepted" ? (
                <Link
                  href={`/offer/${o.shareToken}`}
                  className="btn btn-secondary !py-2 !text-[12px]"
                  target="_blank"
                >
                  Open link
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm">
          <form
            onSubmit={submit}
            className="surface max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold">New offer</h2>
              <button
                type="button"
                onClick={handleQuickAiGenerate}
                className="rounded-lg border border-line bg-paper px-2.5 py-1 text-xs font-bold text-accent hover:border-accent"
              >
                ✨ AI Fill Scope
              </button>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Project</span>
              <select
                required
                value={form.projectId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, projectId: e.target.value }))
                }
                className="w-full rounded-xl border border-line px-3 py-2.5"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Title</span>
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="w-full rounded-xl border border-line px-3 py-2.5"
                placeholder="Theme rebuild package"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Scope</span>
              <textarea
                required
                rows={5}
                value={form.scope}
                onChange={(e) =>
                  setForm((f) => ({ ...f, scope: e.target.value }))
                }
                className="w-full rounded-xl border border-line px-3 py-2.5"
                placeholder={"• Homepage + 4 templates\n• Mobile QA\n• 1 revision round"}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Total USD</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.total}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, total: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line px-3 py-2.5"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Deposit USD
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.deposit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, deposit: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line px-3 py-2.5"
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.send}
                onChange={(e) =>
                  setForm((f) => ({ ...f, send: e.target.checked }))
                }
              />
              Send now (shareable link + move to Offer sent)
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1"
              >
                {saving ? "Saving…" : form.send ? "Send offer" : "Save draft"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
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
