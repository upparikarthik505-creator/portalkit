"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  FileText,
  Plus,
  Receipt,
  Users,
  Workflow,
} from "lucide-react";
import { NewProjectModal } from "@/components/NewProjectModal";
import {
  DEMO_INVOICES,
  DEMO_LEADS,
  DEMO_PROPOSALS,
} from "@/lib/demo-data";
import { formatMoney, loadProjects } from "@/lib/store";
import { STATUS_CLASS, STATUS_LABELS, type Project } from "@/lib/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const stats = useMemo(() => {
    const pipeline = DEMO_LEADS.reduce((s, l) => s + l.valueCents, 0);
    const awaiting = DEMO_INVOICES.filter((i) => i.status === "sent" || i.status === "overdue").reduce(
      (s, i) => s + i.amountCents,
      0,
    );
    const paid = DEMO_INVOICES.filter((i) => i.status === "paid").reduce(
      (s, i) => s + i.amountCents,
      0,
    );
    return {
      pipeline,
      awaiting,
      paid,
      clients: 5,
      active: projects.filter((p) => p.status !== "done").length,
    };
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#71717a]">
            Home
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-syne)] text-[36px] tracking-[-0.035em]">
            Good evening — here’s your business
          </h1>
          <p className="mt-1 text-[15px] text-[#71717a]">
            Pipeline, clients, proposals, invoices, and portals in one workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/proposals"
            className="inline-flex items-center gap-2 rounded-full border border-[#e4e4e7] bg-white px-4 py-2.5 text-[13px] font-bold"
          >
            <FileText className="h-4 w-4" />
            New proposal
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff4f1a] px-4 py-2.5 text-[13px] font-bold text-white"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New project
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Pipeline value", formatMoney(stats.pipeline), "Open deals", Workflow, "/dashboard/pipeline"],
          ["Awaiting payment", formatMoney(stats.awaiting), "Invoices out", Receipt, "/dashboard/invoices"],
          ["Collected", formatMoney(stats.paid), "Marked paid", Receipt, "/dashboard/invoices"],
          ["Active projects", String(stats.active), "In delivery", Users, "/dashboard/projects"],
        ].map(([label, value, hint, Icon, href]) => {
          const I = Icon as typeof Workflow;
          return (
            <Link
              key={label as string}
              href={href as string}
              className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_10px_30px_rgba(16,35,28,0.04)] transition hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[#71717a]">{label as string}</p>
                <I className="h-4 w-4 text-[#ff4f1a]" />
              </div>
              <p className="mt-3 font-[family-name:var(--font-syne)] text-[32px] tracking-[-0.03em]">
                {value as string}
              </p>
              <p className="mt-1 text-[12px] text-[#a1a1aa]">{hint as string}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
          <div className="flex items-center justify-between border-b border-[#f4f4f5] px-5 py-4">
            <h2 className="font-[family-name:var(--font-syne)] text-[22px]">
              Active projects
            </h2>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-[#ff4f1a]"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-[#f4f4f5]">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-[#f4f4f5] md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">{project.name}</p>
                  <p className="mt-1 text-[13px] text-[#71717a]">
                    {project.clientName} · {project.storeUrl}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`status-pill ${STATUS_CLASS[project.status]}`}>
                    {STATUS_LABELS[project.status]}
                  </span>
                  <span className="text-[13px] text-[#a1a1aa]">Due {project.dueDate}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-syne)] text-[20px]">
                Proposals
              </h2>
              <Link href="/dashboard/proposals" className="text-[12px] font-bold text-[#ff4f1a]">
                Open
              </Link>
            </div>
            <div className="space-y-2">
              {DEMO_PROPOSALS.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-[#f4f4f5] px-3 py-2.5"
                >
                  <div>
                    <p className="text-[13px] font-semibold">{p.clientName}</p>
                    <p className="text-[11px] capitalize text-[#a1a1aa]">{p.status}</p>
                  </div>
                  <p className="text-[13px] font-bold">{formatMoney(p.amountCents)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-syne)] text-[20px]">
                Invoices
              </h2>
              <Link href="/dashboard/invoices" className="text-[12px] font-bold text-[#ff4f1a]">
                Open
              </Link>
            </div>
            <div className="space-y-2">
              {DEMO_INVOICES.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-xl bg-[#f4f4f5] px-3 py-2.5"
                >
                  <div>
                    <p className="text-[13px] font-semibold">{inv.number}</p>
                    <p className="text-[11px] capitalize text-[#a1a1aa]">
                      {inv.status} · {inv.clientName}
                    </p>
                  </div>
                  <p className="text-[13px] font-bold">{formatMoney(inv.amountCents)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
