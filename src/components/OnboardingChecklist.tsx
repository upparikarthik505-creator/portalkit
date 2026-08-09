"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Step = {
  id: string;
  label: string;
  href: string;
  done: boolean;
};

/** Empty workspace → branding → contact → project → offer in under 10 min. */
export function OnboardingChecklist() {
  const [steps, setSteps] = useState<Step[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [brandingRes, contactsRes, projectsRes, offersRes] =
        await Promise.all([
          fetch("/api/workspace/branding").then((r) => r.json()).catch(() => ({})),
          fetch("/api/contacts").then((r) => r.json()).catch(() => ({})),
          fetch("/api/projects").then((r) => r.json()).catch(() => ({})),
          fetch("/api/offers").then((r) => r.json()).catch(() => ({})),
        ]);
      if (cancelled) return;

      const studio =
        brandingRes?.branding?.studioName ||
        brandingRes?.plan?.studioName ||
        "";
      const branded =
        !!studio && studio.trim().toLowerCase() !== "my studio";
      const hasContact = (contactsRes?.contacts?.length ?? 0) > 0;
      const hasProject = (projectsRes?.projects?.length ?? 0) > 0;
      const hasOffer = (offersRes?.offers?.length ?? 0) > 0;

      setSteps([
        {
          id: "brand",
          label: "Name your studio",
          href: "/dashboard/settings",
          done: branded,
        },
        {
          id: "contact",
          label: "Add your first contact",
          href: "/dashboard/contacts",
          done: hasContact,
        },
        {
          id: "project",
          label: "Create a project + portal",
          href: "/dashboard/projects",
          done: hasProject,
        },
        {
          id: "offer",
          label: "Send an offer",
          href: "/dashboard/proposals",
          done: hasOffer,
        },
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!steps) {
    return (
      <div className="rounded-[var(--radius)] border border-line bg-paper p-5">
        <p className="text-sm text-muted">Loading setup…</p>
      </div>
    );
  }

  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  const next = steps.find((s) => !s.done);

  return (
    <section className="dash-rise rounded-[var(--radius)] border border-accent/30 bg-hero p-5 shadow-[var(--shadow)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mkt-eyebrow text-accent-deep">First 10 minutes</p>
          <h2 className="mkt-h3 mt-1">Get to your first offer</h2>
          <p className="mkt-meta mt-1 text-muted">
            {doneCount}/{steps.length} done
            {next ? ` · next: ${next.label}` : ""}
          </p>
        </div>
        {next ? (
          <Link href={next.href} className="btn btn-primary !py-2.5 !text-[13px]">
            Continue
          </Link>
        ) : null}
      </div>
      <ol className="mt-4 space-y-2">
        {steps.map((s, i) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                s.done
                  ? "border-line bg-paper text-muted"
                  : "border-accent/25 bg-paper hover:border-accent/50"
              }`}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-bold ${
                  s.done
                    ? "bg-mint text-mint-ink"
                    : "bg-ink text-white"
                }`}
              >
                {s.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="font-semibold">{s.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
