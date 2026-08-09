"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { formatMoney, hydrateProjects } from "@/lib/store";
import type { Project } from "@/lib/types";

const STATUS_STYLE = {
  draft: "bg-paper text-muted",
  sent: "bg-[#e7eefc] text-[#2f4f9b]",
  paid: "bg-mint text-mint-ink",
} as const;

export default function InvoicesPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    void hydrateProjects().then(setProjects);
  }, []);

  const rows = useMemo(
    () =>
      projects.flatMap((p) =>
        p.payments.map((pay) => ({
          ...pay,
          projectId: p.id,
          projectName: p.name,
          clientName: p.clientName,
        })),
      ),
    [projects],
  );

  const outstanding = rows
    .filter((r) => r.status === "sent")
    .reduce((s, r) => s + r.amountCents, 0);

  return (
    <div className="space-y-6">
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-2">
            Invoices
          </p>
          <SplitHeadline
            as="h1"
            text="Cash that doesn’t chase itself"
            className="mt-1 text-[34px] font-extrabold tracking-[-0.04em] md:text-[40px]"
          />
          <p className="mt-2 text-[15px] text-muted">
            Outstanding{" "}
            <span className="font-semibold text-accent">
              {formatMoney(outstanding)}
            </span>{" "}
            · add payment asks on a project
          </p>
        </div>
        <MagneticButton
          type="button"
          className="btn btn-primary !py-2.5 !text-[13px]"
          onClick={() => {
            window.location.href = "/dashboard/projects";
          }}
        >
          + Add on a project
        </MagneticButton>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white/95 px-5 py-12 text-center shadow-[0_14px_34px_rgba(31,31,35,0.06)]">
          <p className="text-[16px] font-extrabold tracking-[-0.02em]">
            No invoices yet
          </p>
          <p className="mt-2 text-[14px] text-muted">
            Open a project and add a payment request — it shows here and on the
            client portal.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white/95 shadow-[0_14px_34px_rgba(31,31,35,0.06)]">
          <div className="hidden grid-cols-[1fr_1fr_1.2fr_0.7fr_0.7fr] gap-3 border-b border-line px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted-2 md:grid">
            <span>Label</span>
            <span>Client</span>
            <span>Project</span>
            <span>Status</span>
            <span>Amount</span>
          </div>
          {rows.map((row) => (
            <Link
              key={row.id}
              href={`/dashboard/projects/${row.projectId}`}
              className="grid gap-2 border-b border-line/70 px-5 py-4 last:border-b-0 transition hover:bg-paper/60 md:grid-cols-[1fr_1fr_1.2fr_0.7fr_0.7fr] md:items-center md:gap-3"
            >
              <p className="font-semibold">{row.label}</p>
              <p className="text-[13px] text-muted">{row.clientName}</p>
              <p className="truncate text-[13px] text-muted">{row.projectName}</p>
              <span
                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[row.status]}`}
              >
                {row.status}
              </span>
              <p className="font-bold">{formatMoney(row.amountCents)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
