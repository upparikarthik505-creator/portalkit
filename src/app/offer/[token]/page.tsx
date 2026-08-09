"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import type { Offer } from "@/lib/offers-db";
import { formatMoney } from "@/lib/money";

type Payload = {
  offer: Offer;
  projectName: string;
  clientName: string;
  studioName: string;
  accent: string;
};

export default function OfferPublicPage() {
  const params = useParams<{ token: string }>();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [portalPath, setPortalPath] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/api/offers/${params.token}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || "Not found");
        setData(json as Payload);
        if ((json as Payload).offer.status === "accepted") setDone(true);
      })
      .catch((e: Error) => setError(e.message));
  }, [params.token]);

  async function accept(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/offers/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept",
          agreed,
          acceptedName: name,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Accept failed");
      setDone(true);
      const accepted = json as {
        offer: Offer;
        shareToken?: string;
      };
      setData((prev) =>
        prev ? { ...prev, offer: accepted.offer } : prev,
      );
      if (accepted.shareToken) {
        setPortalPath(`/p/${accepted.shareToken}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Accept failed");
    } finally {
      setBusy(false);
    }
  }

  if (error && !data) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-5">
        <div className="w-full rounded-3xl border border-line bg-white p-8 text-center">
          <BrandMark />
          <p className="mt-4 font-semibold">Offer not found</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted">
        Loading offer…
      </div>
    );
  }

  const { offer, projectName, clientName, studioName, accent } = data;

  return (
    <div
      className="min-h-screen bg-paper px-4 py-8 md:px-6"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted-2">
            Offer from {studioName}
          </p>
          <BrandMark name={studioName} />
        </div>

        <section className="rounded-[24px] border border-line bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold text-accent">{projectName}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">
            {offer.title}
          </h1>
          <p className="mt-2 text-muted">Prepared for {clientName}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-paper px-4 py-3">
              <p className="text-[11px] font-bold uppercase text-muted-2">
                Total
              </p>
              <p className="mt-1 text-2xl font-extrabold">
                {formatMoney(offer.totalCents)}
              </p>
            </div>
            <div className="rounded-2xl bg-paper px-4 py-3">
              <p className="text-[11px] font-bold uppercase text-muted-2">
                Deposit
              </p>
              <p className="mt-1 text-2xl font-extrabold">
                {formatMoney(offer.depositCents)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold">Scope</p>
            <p className="mt-2 whitespace-pre-wrap text-muted">{offer.scope}</p>
          </div>

          {done || offer.status === "accepted" ? (
            <div className="mt-8 rounded-2xl border border-line bg-mint/40 px-4 py-4">
              <p className="font-semibold text-mint-ink">Accepted</p>
              <p className="mt-1 text-sm text-muted">
                Signed by {offer.acceptedName || name}
                {offer.acceptedAt
                  ? ` · ${new Date(offer.acceptedAt).toLocaleString()}`
                  : ""}
              </p>
              <p className="mt-2 text-sm text-muted">
                Invoice / deposit asks are ready on your project portal.
              </p>
              {portalPath ? (
                <a href={portalPath} className="btn btn-primary mt-4 inline-flex">
                  Open portal & pay
                </a>
              ) : null}
            </div>
          ) : (
            <form onSubmit={accept} className="mt-8 space-y-3 border-t border-line pt-6">
              <p className="text-sm font-bold">Accept this offer</p>
              <label className="flex items-start gap-2 text-sm text-ink-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                />
                I agree to the scope and pricing above (simple eSign).
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Type your full name
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-line px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
                  placeholder="Full legal name"
                />
              </label>
              {error ? (
                <p className="text-sm text-accent-deep">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="btn btn-primary w-full !py-3"
              >
                {busy ? "Accepting…" : "Accept offer"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
