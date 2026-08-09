"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DEFAULT_BRANDING,
  normalizeBranding,
  readLocalBranding,
  writeLocalBranding,
  type WorkspaceBranding,
} from "@/lib/branding";

export default function SettingsPage() {
  const [brand, setBrand] = useState<WorkspaceBranding>(DEFAULT_BRANDING);
  const [hideBadge, setHideBadge] = useState(false);
  const [canHideBadge, setCanHideBadge] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/workspace/branding");
        const data = (await res.json()) as {
          source?: string;
          branding?: WorkspaceBranding | null;
          hidePortalkitBadge?: boolean;
          canHideBadge?: boolean;
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Could not load branding");
          setBrand(readLocalBranding());
          return;
        }
        if (data.source === "supabase" && data.branding) {
          setBrand(data.branding);
          setHideBadge(Boolean(data.hidePortalkitBadge));
          setCanHideBadge(Boolean(data.canHideBadge));
        } else {
          setBrand(readLocalBranding());
        }
      } catch {
        if (!cancelled) setBrand(readLocalBranding());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSave() {
    setError(null);
    setMessage(null);
    const normalized = normalizeBranding(brand);
    if ("error" in normalized) {
      setError(normalized.error);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/workspace/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...normalized,
          hidePortalkitBadge: hideBadge,
        }),
      });
      const data = (await res.json()) as {
        source?: string;
        branding?: WorkspaceBranding;
        hidePortalkitBadge?: boolean;
        canHideBadge?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }

      const saved = data.branding ?? normalized;
      setBrand(saved);
      if (typeof data.hidePortalkitBadge === "boolean") {
        setHideBadge(data.hidePortalkitBadge);
      }
      if (typeof data.canHideBadge === "boolean") {
        setCanHideBadge(data.canHideBadge);
      }
      // Always mirror locally so reload works without Supabase.
      writeLocalBranding(saved);
      setMessage(
        data.source === "supabase"
          ? "Branding saved to your workspace."
          : "Branding saved on this device.",
      );
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="dash-rise">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
          Settings
        </p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-[-0.03em]">
          Make every portal feel like Forge
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Studio name, accent, and support email show up on client-facing pages.
        </p>
      </div>

      <div className="surface max-w-2xl space-y-4 p-6">
        {(
          [
            ["studioName", "Studio name"],
            ["supportEmail", "Support email"],
            ["accent", "Accent color"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-sm font-medium">{label}</span>
            <input
              type={
                key === "accent"
                  ? "color"
                  : key === "supportEmail"
                    ? "email"
                    : "text"
              }
              value={brand[key]}
              disabled={loading || saving}
              onChange={(e) =>
                setBrand((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className={`rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2 disabled:opacity-60 ${
                key === "accent" ? "h-12 w-24 p-1" : "w-full"
              }`}
            />
          </label>
        ))}

        <div className="rounded-xl border border-line bg-paper px-4 py-3">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={hideBadge}
              disabled={loading || saving || !canHideBadge}
              onChange={(e) => setHideBadge(e.target.checked)}
            />
            <span>
              <span className="block text-sm font-semibold">
                Remove “Powered by PortalKit” badge
              </span>
              <span className="mt-0.5 block text-[13px] text-muted">
                {canHideBadge ? (
                  "Hides the badge on client portals (Pro / Founder / trial)."
                ) : (
                  <>
                    Pro feature.{" "}
                    <Link
                      href="/dashboard/billing"
                      className="font-semibold text-accent"
                    >
                      Upgrade to hide it
                    </Link>
                    .
                  </>
                )}
              </span>
            </span>
          </label>
        </div>

        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: brand.accent }}
        >
          <p className="text-sm text-white/75">Client portal preview</p>
          <p className="mt-1 font-extrabold tracking-[-0.02em] text-2xl">
            {brand.studioName}
          </p>
          <p className="mt-2 text-sm text-white/80">{brand.supportEmail}</p>
          {!hideBadge || !canHideBadge ? (
            <p className="mt-3 text-[11px] font-semibold text-white/70">
              Powered by PortalKit
            </p>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="text-sm text-muted">
            {error}
          </p>
        ) : null}
        {message ? <p className="text-sm text-muted">{message}</p> : null}

        <button
          type="button"
          className="btn btn-primary"
          disabled={loading || saving}
          onClick={() => void onSave()}
        >
          {saving ? "Saving…" : "Save branding"}
        </button>
      </div>

      <RazorpayKeysCard />
    </div>
  );
}

function RazorpayKeysCard() {
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [preview, setPreview] = useState("");
  const [configured, setConfigured] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetch("/api/workspace/razorpay")
      .then((r) => r.json())
      .then(
        (d: { configured?: boolean; keyIdPreview?: string }) => {
          setConfigured(!!d.configured);
          setPreview(d.keyIdPreview || "");
        },
      )
      .catch(() => undefined);
  }, []);

  async function save() {
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/workspace/razorpay", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId, keySecret }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(data.error || "Save failed");
        return;
      }
      setConfigured(true);
      setPreview(`${keyId.slice(0, 8)}…`);
      setKeySecret("");
      setMsg(
        "Client payments will use your Razorpay account (not PortalKit’s).",
      );
    } catch {
      setErr("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="surface max-w-2xl space-y-4 p-6">
      <div>
        <h2 className="text-xl font-extrabold">Client Razorpay</h2>
        <p className="mt-1 text-sm text-muted">
          Connect your own Razorpay keys so deposits land in your account.
          PortalKit plan billing stays on platform keys. Prefer{" "}
          <code className="mkt-chip">rzp_test_*</code> while testing.
        </p>
        {configured ? (
          <p className="mt-2 text-sm text-mint-ink">Connected · {preview}</p>
        ) : (
          <p className="mt-2 text-sm text-muted">Not connected — portal Pay is off.</p>
        )}
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Key ID</span>
        <input
          value={keyId}
          onChange={(e) => setKeyId(e.target.value)}
          placeholder="rzp_test_…"
          className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Key secret</span>
        <input
          type="password"
          value={keySecret}
          onChange={(e) => setKeySecret(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
        />
      </label>
      {err ? <p className="text-sm text-accent-deep">{err}</p> : null}
      {msg ? <p className="text-sm text-muted">{msg}</p> : null}
      <button
        type="button"
        className="btn btn-primary"
        disabled={saving}
        onClick={() => void save()}
      >
        {saving ? "Saving…" : "Save Razorpay keys"}
      </button>
    </div>
  );
}
