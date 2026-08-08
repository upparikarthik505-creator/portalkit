"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  FileText,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { formatMoney, getProjectByToken } from "@/lib/store";
import { STATUS_CLASS, STATUS_LABELS, type Project } from "@/lib/types";

const TIMELINE = [
  { label: "Proposal accepted", done: true },
  { label: "Deposit paid", done: true },
  { label: "Design in progress", done: true },
  { label: "Client review", done: false },
  { label: "Final delivery", done: false },
];

export default function ClientPortalPage() {
  const params = useParams<{ token: string }>();
  const [project, setProject] = useState<Project | undefined>();

  useEffect(() => {
    setProject(getProjectByToken(params.token));
  }, [params.token]);

  if (!project) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-5">
        <div className="w-full rounded-3xl border border-[#e4e4e7] bg-white p-8 text-center shadow-lg">
          <BrandMark />
          <p className="mt-4 font-semibold">Portal not found</p>
          <p className="mt-2 text-sm text-[#71717a]">
            Ask your freelancer for a fresh link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f5] px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto w-full max-w-4xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#a1a1aa]">
              North Loop Studio
            </p>
            <BrandMark />
          </div>
          <span className={`status-pill ${STATUS_CLASS[project.status]}`}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[#e4e4e7] bg-white shadow-[0_20px_60px_rgba(16,35,28,0.08)]">
          <div className="relative overflow-hidden bg-ink px-6 py-8 text-white md:px-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/50 blur-3xl" />
            <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-signal/30 blur-2xl" />
            <div className="relative">
            <p className="text-sm text-white/70">Your project portal</p>
            <h1 className="mt-2 font-[family-name:var(--font-syne)] text-[36px] tracking-[-0.035em] md:text-[42px]">
              {project.name}
            </h1>
            <p className="mt-3 max-w-xl text-white/80">
              Hi {project.clientName.split(" ")[0]} — status, files, invoices, and
              updates for {project.storeUrl} live here. No more email hunting.
            </p>
            </div>
          </div>

          <div className="grid gap-3 p-5 md:grid-cols-4 md:p-6">
            {[
              ["Status", STATUS_LABELS[project.status]],
              ["Due date", project.dueDate],
              ["Store", project.storeUrl],
              ["Files", `${project.files.length} shared`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[#f4f4f5] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#a1a1aa]">
                  {label}
                </p>
                <p className="mt-1 truncate text-[14px] font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-[#e4e4e7] bg-white p-6 shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
            <h2 className="font-[family-name:var(--font-syne)] text-[24px]">
              Project timeline
            </h2>
            <ol className="mt-5 space-y-4">
              {TIMELINE.map((step, i) => (
                <li key={step.label} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full ${
                      step.done
                        ? "bg-[#ffe8e0] text-[#ff4f1a]"
                        : "bg-[#f4f4f5] text-[#a1a1aa]"
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-[11px] font-bold">{i + 1}</span>
                    )}
                  </span>
                  <div>
                    <p className={`font-semibold ${step.done ? "" : "text-[#a1a1aa]"}`}>
                      {step.label}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-3xl border border-[#e4e4e7] bg-white p-6 shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#ff4f1a]" />
              <h2 className="font-[family-name:var(--font-syne)] text-[24px]">
                Shared files
              </h2>
            </div>
            <div className="space-y-2">
              {project.files.length === 0 ? (
                <p className="text-sm text-[#71717a]">No files shared yet.</p>
              ) : (
                project.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-2xl border border-[#e4e4e7] px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-[#a1a1aa]">
                        {file.sizeLabel} · {file.uploadedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e4e7] px-3 py-2 text-[12px] font-bold"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-[#e4e4e7] bg-white p-6 shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
          <h2 className="font-[family-name:var(--font-syne)] text-[24px]">
            Invoices & payments
          </h2>
          <div className="mt-4 space-y-3">
            {project.payments.map((pay) => (
              <div
                key={pay.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#e4e4e7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{pay.label}</p>
                  <p className="text-sm capitalize text-[#a1a1aa]">{pay.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-[family-name:var(--font-syne)] text-[28px]">
                    {formatMoney(pay.amountCents)}
                  </p>
                  {pay.status !== "paid" ? (
                    <button
                      type="button"
                      className="rounded-full bg-[#ff4f1a] px-4 py-2.5 text-[13px] font-bold text-white"
                    >
                      Pay now
                    </button>
                  ) : (
                    <span className="status-pill status-done">Paid</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {project.notes ? (
          <section className="rounded-3xl border border-[#e4e4e7] bg-white p-6 shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
            <div className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff4f1a]">
              <Sparkles className="h-4 w-4" />
              Latest update
            </div>
            <p className="whitespace-pre-wrap text-[#71717a]">{project.notes}</p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#e4e4e7] px-4 py-2.5 text-[13px] font-bold"
            >
              <MessageSquare className="h-4 w-4" />
              Reply to North Loop Studio
            </button>
          </section>
        ) : null}
      </div>
    </div>
  );
}
