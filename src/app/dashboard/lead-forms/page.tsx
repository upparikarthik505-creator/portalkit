"use client";

import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";

export default function LeadFormsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/lead-forms")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Failed");
        setToken(d.token ?? null);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const url =
    typeof window !== "undefined" && token
      ? `${window.location.origin}/f/${token}`
      : token
        ? `/f/${token}`
        : "";

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-2">
            Intake
          </p>
          <SplitHeadline
            as="h1"
            text="Catch the brief before the call"
            className="mt-1 text-[34px] font-extrabold tracking-[-0.04em] md:text-[40px]"
          />
          <p className="mt-2 text-[15px] text-muted">
            One public form → contact + Lead on your deal board.
          </p>
        </div>
        <MagneticButton
          type="button"
          className="btn btn-primary !py-2.5 !text-[13px]"
          onClick={() => void copy()}
          disabled={!url}
        >
          {copied ? "Copied" : "Copy form link"}
        </MagneticButton>
      </div>

      {error ? (
        <p className="rounded-xl border border-line bg-paper px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-line bg-white/95 px-5 py-8">
        <p className="text-[16px] font-extrabold">Your intake link</p>
        <p className="mt-2 break-all text-[14px] text-muted">
          {url || "Loading…"}
        </p>
        <p className="mt-4 text-[13px] text-muted">
          Submissions create a contact and a project in <strong>Lead</strong>.
        </p>
      </div>
    </div>
  );
}
