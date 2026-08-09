"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Copy, ExternalLink, FileUp, Receipt } from "lucide-react";
import type { ProjectMessage, ProjectTask } from "@/lib/delivery-db";
import {
  addPayment,
  formatMoney,
  getProject,
  hydrateProjects,
  markPaymentPaidLocal,
  updateProjectNotes,
  updateProjectStatus,
} from "@/lib/store";
import {
  PIPELINE_STAGES,
  STATUS_CLASS,
  STATUS_LABELS,
  type Project,
  type ProjectStatus,
} from "@/lib/types";

const TABS = ["Pulse", "Docs", "Payouts", "Tasks", "Notes", "Portal"] as const;
const STATUSES: ProjectStatus[] = PIPELINE_STAGES.map((s) => s.key);

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | undefined>(() =>
    getProject(params.id),
  );
  const [ready, setReady] = useState(false);
  const [notes, setNotes] = useState(() => getProject(params.id)?.notes ?? "");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Pulse");
  const [copied, setCopied] = useState(false);
  const [payLabel, setPayLabel] = useState("Milestone payment");
  const [payAmount, setPayAmount] = useState("500");
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [uploading, setUploading] = useState(false);

  function refresh() {
    const next = getProject(params.id);
    setProject(next);
    setNotes(next?.notes ?? "");
  }

  const loadDelivery = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/delivery`);
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks ?? []);
        setMessages(data.messages ?? []);
      }
    } catch {
      /* ignore */
    }
  }, [params.id]);

  useEffect(() => {
    void hydrateProjects().then(() => {
      refresh();
      setReady(true);
    });
    void loadDelivery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (!project) {
    if (!ready) {
      return (
        <div className="surface p-8">
          <p className="text-sm font-semibold text-muted">Loading project…</p>
        </div>
      );
    }
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/projects"
            className="text-sm font-medium text-muted hover:text-ink"
          >
            ← Projects
          </Link>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
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

      <div className="flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-[13px] font-bold ${
              tab === t
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Pulse" && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-extrabold">Activity feed</h2>
            <p className="mt-4 rounded-xl border border-line bg-paper px-4 py-6 text-sm text-muted">
              No activity yet. Status changes and payment asks will show here as
              you work this build.
            </p>
          </section>
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-extrabold">Pipeline status</h2>
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
                    project.status === status
                      ? "ring-2 ring-accent/40"
                      : "opacity-70"
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">Due {project.dueDate}</p>
            <Link
              href={`/p/${project.shareToken}`}
              className="btn btn-secondary mt-4 w-full"
            >
              <ExternalLink className="h-4 w-4" />
              Open client portal
            </Link>
          </section>
        </div>
      )}

      {tab === "Docs" && (
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold">Files for the portal</h2>
            <label className="btn btn-secondary cursor-pointer">
              <FileUp className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload"}
              <input
                type="file"
                className="hidden"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setUploading(true);
                  try {
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch(
                      `/api/projects/${project.id}/files`,
                      { method: "POST", body: fd },
                    );
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Upload failed");
                    await hydrateProjects();
                    refresh();
                  } catch (err) {
                    alert(err instanceof Error ? err.message : "Upload failed");
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </label>
          </div>
          <div className="mt-4 space-y-2">
            {project.files.length === 0 ? (
              <p className="rounded-2xl bg-paper px-4 py-6 text-sm text-muted">
                No files yet — upload to share on the client portal (bucket
                project-files).
              </p>
            ) : (
              project.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted">
                      {file.sizeLabel} · {file.uploadedAt}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary !py-1.5 !text-[12px]"
                    onClick={async () => {
                      await fetch(
                        `/api/projects/${project.id}/files?fileId=${file.id}`,
                        { method: "DELETE" },
                      );
                      await hydrateProjects();
                      refresh();
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {tab === "Payouts" && (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-lg font-extrabold">Payments & invoices</h2>
          <div className="mt-4 space-y-2">
            {project.payments.length === 0 ? (
              <p className="rounded-2xl bg-paper px-4 py-6 text-sm text-muted">
                No payment asks yet. Add one below — it syncs to your workspace
                and the client portal.
              </p>
            ) : (
              project.payments.map((pay) => (
                <div
                  key={pay.id}
                  className="rounded-2xl border border-line px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{pay.label}</p>
                    <p className="font-semibold">
                      {formatMoney(pay.amountCents)}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs capitalize text-muted">
                      {pay.status} · {pay.createdAt}
                    </p>
                    {pay.status !== "paid" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary !py-1.5 !text-[12px]"
                          onClick={() => {
                            markPaymentPaidLocal(project.id, pay.id);
                            refresh();
                          }}
                        >
                          Mark paid
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary !py-1.5 !text-[12px]"
                          onClick={async () => {
                            const res = await fetch("/api/payments/remind", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ paymentId: pay.id }),
                            });
                            const data = await res.json();
                            alert(
                              res.ok
                                ? data.emailed
                                  ? "Reminder emailed."
                                  : "Logged (set RESEND_API_KEY to send)."
                                : data.error || "Failed",
                            );
                          }}
                        >
                          Remind
                        </button>
                      </div>
                    ) : (
                      <span className="status-pill status-done">Paid</span>
                    )}
                  </div>
                </div>
              ))
            )}
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
              Save payment ask
            </button>
            <p className="text-[12px] leading-relaxed text-muted">
              Clients see asks on the portal with instructions to pay via your
              Razorpay / UPI link. Use Mark paid after you confirm the transfer.
              In-app portal checkout ships next.
            </p>
          </div>
        </section>
      )}

      {tab === "Tasks" && (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-lg font-extrabold">Portal checklist</h2>
          <div className="mt-4 space-y-2">
            {tasks.length === 0 ? (
              <p className="rounded-xl border border-line bg-paper px-4 py-6 text-sm text-muted">
                No tasks yet — add items the client can complete on the portal.
              </p>
            ) : (
              tasks.map((tsk) => (
                <label
                  key={tsk.id}
                  className="flex items-center gap-3 rounded-xl border border-line px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={tsk.done}
                    onChange={async () => {
                      await fetch(`/api/projects/${project.id}/delivery`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "toggle_task",
                          taskId: tsk.id,
                          done: !tsk.done,
                        }),
                      });
                      void loadDelivery();
                    }}
                  />
                  <span className={tsk.done ? "text-muted line-through" : ""}>
                    {tsk.title}
                  </span>
                </label>
              ))
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              className="flex-1 rounded-xl border border-line px-3 py-2"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                if (!taskTitle.trim()) return;
                await fetch(`/api/projects/${project.id}/delivery`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "add_task",
                    title: taskTitle,
                  }),
                });
                setTaskTitle("");
                void loadDelivery();
              }}
            >
              Add
            </button>
          </div>
        </section>
      )}

      {tab === "Notes" && (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-lg font-extrabold">Client-visible updates</h2>
          <p className="mt-1 text-sm text-muted">
            These notes appear on the shared client portal.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {
              updateProjectNotes(project.id, notes);
              refresh();
            }}
            rows={4}
            className="mt-3 w-full rounded-xl border border-line px-3 py-2"
          />
          <h3 className="mt-6 text-base font-extrabold">Message thread</h3>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-muted">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    m.author === "freelancer" ? "bg-accent-soft" : "bg-paper"
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase text-muted-2">
                    {m.author}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={msgBody}
              onChange={(e) => setMsgBody(e.target.value)}
              placeholder="Message to client"
              className="flex-1 rounded-xl border border-line px-3 py-2"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                if (!msgBody.trim()) return;
                await fetch(`/api/projects/${project.id}/delivery`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "post_message",
                    body: msgBody,
                  }),
                });
                setMsgBody("");
                void loadDelivery();
              }}
            >
              Send
            </button>
          </div>
        </section>
      )}

      {tab === "Portal" && (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-lg font-extrabold">Client portal</h2>
          <p className="mt-1 text-sm text-muted">
            Shared project HQ for files, invoices, and updates.
          </p>
          <div className="mt-4 rounded-2xl bg-paper p-4">
            <p className="break-all text-sm text-muted">{clientUrl}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={copyLink}
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy link"}
              </button>
              <Link
                href={`/p/${project.shareToken}`}
                className="btn btn-primary"
              >
                <ExternalLink className="h-4 w-4" />
                Preview client view
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
