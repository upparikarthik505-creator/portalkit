"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [brand, setBrand] = useState({
    studioName: "North Loop Studio",
    accent: "#ff4f1a",
    supportEmail: "hello@northloop.studio",
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
          Settings
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-syne)] text-4xl tracking-[-0.03em]">
          Brand your client portals
        </h1>
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
              type={key === "accent" ? "color" : key === "supportEmail" ? "email" : "text"}
              value={brand[key]}
              onChange={(e) =>
                setBrand((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className={`rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2 ${
                key === "accent" ? "h-12 w-24 p-1" : "w-full"
              }`}
            />
          </label>
        ))}

        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: brand.accent }}
        >
          <p className="text-sm text-white/75">Client portal preview</p>
          <p className="mt-1 font-[family-name:var(--font-syne)] text-2xl">
            {brand.studioName}
          </p>
          <p className="mt-2 text-sm text-white/80">{brand.supportEmail}</p>
        </div>

        <button type="button" className="btn btn-primary">
          Save branding
        </button>
      </div>
    </div>
  );
}
