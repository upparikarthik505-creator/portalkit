"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";

export default function PublicLeadFormPage() {
  const params = useParams<{ token: string }>();
  const [studio, setStudio] = useState("Studio");
  const [accent, setAccent] = useState("#FF5A5F");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    budget: "",
    website: "",
  });

  useEffect(() => {
    void fetch(`/api/lead-forms/${params.token}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Not found");
        setStudio(d.studioName || "Studio");
        setAccent(d.accent || "#FF5A5F");
      })
      .catch((e: Error) => setError(e.message));
  }, [params.token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/lead-forms/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Submit failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-paper px-4 py-10"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="mx-auto max-w-lg space-y-5">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted-2">
            Project inquiry
          </p>
          <BrandMark name={studio} />
        </div>
        <section className="rounded-[24px] border border-line bg-white p-6 shadow-sm">
          {done ? (
            <div>
              <p className="text-xl font-extrabold">Thanks — brief received</p>
              <p className="mt-2 text-muted">
                {studio} will follow up from their PortalKit pipeline.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <h1 className="text-2xl font-extrabold tracking-[-0.03em]">
                Tell {studio} about your store
              </h1>
              {(
                [
                  ["name", "Your name"],
                  ["email", "Email"],
                  ["budget", "Budget (optional)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-sm font-medium">{label}</span>
                  <input
                    required={key !== "budget"}
                    type={key === "email" ? "email" : "text"}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-line px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Message</span>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
                />
              </label>
              {/* honeypot */}
              <input
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
                aria-hidden
              />
              {error ? (
                <p className="text-sm text-accent-deep">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="btn btn-primary w-full !py-3"
              >
                {busy ? "Sending…" : "Send brief"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
