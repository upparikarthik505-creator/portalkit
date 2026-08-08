"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Copy,
  ExternalLink,
  FileUp,
  Link2,
  Receipt,
} from "lucide-react";
import {
  addDemoFile,
  addPayment,
  formatMoney,
  getProject,
  updateProjectNotes,
  updateProjectStatus,
} from "@/lib/store";
import {
  STATUS_CLASS,
  STATUS_LABELS,
  type Project,
  type ProjectStatus,
} from "@/lib/types";

const STATUSES: ProjectStatus[] = ["todo", "in_progress", "in_review", "done"];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | undefined>();
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [payLabel, setPayLabel] = useState("Milestone payment");
  const [payAmount, setPayAmount] = useState("500");

  function refresh() {
    const next = getProject(params.id);
    setProject(next);
    setNotes(next?.notes ?? "");
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (!project) {
    return (
      <div className="surface p-8">
        <p className="font-semibold">Project not found</p>
        <Link href="/dashboard/projects" className="btn btn-secondary mt-4">
          Back to projects
        </Link>
      </div>
    );
  }

  const clientUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${project.shareToken}`
      : `/p/${project.shareToken}`;

  async function copyLink() {
    await navigator.clipboard.writeText(clientUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/projects"
            className="text-sm font-medium text-muted hover:text-ink"
          >
            ← Projects
          </Link>
          <h1 className="mt-2 max-w-3xl font-[family-name:var(--font-syne)] text-4xl tracking-[-0.03em]">
            {project.name}
          </h1>
          <p className="mt-2 text-muted">
            {project.clientName} · {project.clientEmail} · {project.storeUrl}
          </p>
        </div>
        <span className={`status-pill ${STATUS_CLASS[project.status]}`}>
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      <div className="surface flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Client portal link</p>
          <p className="mt-1 break-all text-sm text-muted">{clientUrl}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={copyLink}>
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy link"}
          </button>
          <Link href={`/p/${project.shareToken}`} className="btn btn-primary">
            <ExternalLink className="h-4 w-4" />
            Open client view
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <section className="surface p-5">
            <h2 className="font-[family-name:var(--font-syne)] text-xl">
              Status
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    updateProjectStatus(project.id, status);
                    refresh();
                  }}
                  className={`status-pill ${STATUS_CLASS[status]} ${
                    project.status === status ? "ring-2 ring-accent/40" : "opacity-70"
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </section>

          <section className="surface p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-[family-name:var(--font-syne)] text-xl">
                Files
              </h2>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const name = prompt("File name", "deliverable-v2.zip");
                  if (!name) return;
                  addDemoFile(project.id, name);
                  refresh();
                }}
              >
                <FileUp className="h-4 w-4" />
                Add file
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {project.files.length === 0 ? (
                <p className="rounded-2xl bg-paper px-4 py-6 text-sm text-muted">
                  No files yet. Add mockups, theme zips, or QA notes for your client.
                </p>
              ) : (
                project.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-2xl border border-line px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted">
                        {file.sizeLabel} · {file.uploadedAt}
                      </p>
                    </div>
                    <Link2 className="h-4 w-4 text-muted" />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="surface p-5">
            <h2 className="font-[family-name:var(--font-syne)] text-xl">
              Internal notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => {
                updateProjectNotes(project.id, notes);
                refresh();
              }}
              rows={5}
              className="mt-3 w-full rounded-2xl border border-line bg-paper px-4 py-3 outline-none ring-accent/30 focus:ring-2"
              placeholder="Kickoff notes, blockers, next steps…"
            />
          </section>
        </div>

        <div className="space-y-4">
          <section className="surface p-5">
            <h2 className="font-[family-name:var(--font-syne)] text-xl">
              Payments
            </h2>
            <div className="mt-4 space-y-2">
              {project.payments.map((pay) => (
                <div
                  key={pay.id}
                  className="rounded-2xl border border-line px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{pay.label}</p>
                    <p className="font-semibold">{formatMoney(pay.amountCents)}</p>
                  </div>
                  <p className="mt-1 text-xs capitalize text-muted">
                    {pay.status} · {pay.createdAt}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-paper p-3">
              <input
                value={payLabel}
                onChange={(e) => setPayLabel(e.target.value)}
                className="w-full rounded-xl border border-line bg-white px-3 py-2 outline-none"
                placeholder="Payment label"
              />
              <input
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full rounded-xl border border-line bg-white px-3 py-2 outline-none"
                placeholder="Amount USD"
                type="number"
                min="1"
              />
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={() => {
                  const cents = Math.round(Number(payAmount) * 100);
                  if (!payLabel || !cents) return;
                  addPayment(project.id, payLabel, cents);
                  refresh();
                }}
              >
                <Receipt className="h-4 w-4" />
                Send payment request
              </button>
              <p className="text-xs text-muted">
                Demo mode marks it as sent. Stripe checkout wires in next.
              </p>
            </div>
          </section>

          <section className="rounded-2xl bg-[linear-gradient(160deg,#ff4f1a,#18181b)] p-5 text-white">
            <p className="text-sm text-white/70">Due date</p>
            <p className="mt-1 font-[family-name:var(--font-syne)] text-2xl">
              {project.dueDate}
            </p>
            <p className="mt-3 text-sm text-white/80">
              Share the client link after every status update so Maya never has to
              ask “where are we?” again.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
