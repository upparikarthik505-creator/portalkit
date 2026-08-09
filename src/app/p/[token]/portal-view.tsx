"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import type { WorkspaceBranding } from "@/lib/branding";
import { DEFAULT_BRANDING } from "@/lib/branding";
import type { ProjectMessage, ProjectTask } from "@/lib/delivery-db";
import { formatMoney } from "@/lib/money";
import { startDepositCheckout } from "@/lib/store";
import { STATUS_CLASS, STATUS_LABELS, type Project } from "@/lib/types";

const TABS = ["Overview", "Files", "Invoices", "Tasks", "Messages"] as const;

export function PortalView({
  project,
  branding = DEFAULT_BRANDING,
  showBadge = true,
}: {
  project: Project;
  branding?: WorkspaceBranding;
  /** Server-enforced: Starter always true; Pro may hide. */
  showBadge?: boolean;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [payError, setPayError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [msgBody, setMsgBody] = useState("");
  const accent = branding.accent || DEFAULT_BRANDING.accent;
  const studio = branding.studioName || DEFAULT_BRANDING.studioName;

  useEffect(() => {
    void fetch(`/api/portal/${project.shareToken}`)
      .then((r) => r.json())
      .then((d: { tasks?: ProjectTask[]; messages?: ProjectMessage[] }) => {
        setTasks(d.tasks ?? []);
        setMessages(d.messages ?? []);
      })
      .catch(() => undefined);
  }, [project.shareToken]);

  async function pay(paymentId: string, label: string, amountCents: number) {
    setPayError(null);
    setPayingId(paymentId);
    try {
      await startDepositCheckout(project.id, label, amountCents, {
        paymentId,
        shareToken: project.shareToken,
        onPaidRedirect: `/p/${project.shareToken}?paid=1`,
      });
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setPayingId(null);
    }
  }

  return (
    <div
      className="min-h-screen bg-paper px-4 py-6 md:px-6 md:py-10"
      style={
        {
          ["--accent" as string]: accent,
          ["--color-accent" as string]: accent,
        } as React.CSSProperties
      }
    >
      <div className="mx-auto w-full max-w-4xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted-2">
              Shared by {studio}
            </p>
            <BrandMark name={studio} />
          </div>
          <span className={`status-pill ${STATUS_CLASS[project.status]}`}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        <section className="overflow-hidden rounded-[24px] border border-line bg-white shadow-sm">
          <div className="bg-paper px-6 py-7 md:px-8">
            <p className="text-sm font-semibold text-accent">Project HQ</p>
            <h1 className="mt-2 text-[34px] font-extrabold tracking-[-0.03em] md:text-[40px]">
              {project.name}
            </h1>
            <p className="mt-3 max-w-xl text-muted">
              Hi {project.clientName.split(" ")[0]} — files, invoices, and updates
              for {project.storeUrl} live here.
            </p>
          </div>

          <div className="flex gap-1 overflow-x-auto border-t border-line px-2">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`shrink-0 border-b-2 px-4 py-3 text-[13px] font-bold ${
                  tab === t
                    ? "border-accent text-accent"
                    : "border-transparent text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === "Overview" && (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {[
                  ["Status", STATUS_LABELS[project.status]],
                  ["Due date", project.dueDate],
                  ["Store", project.storeUrl],
                  ["Files", `${project.files.length} shared`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-paper px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-2">
                      {label}
                    </p>
                    <p className="mt-1 truncate text-[14px] font-semibold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {tab === "Files" && (
              <div className="space-y-2">
                {project.files.length === 0 ? (
                  <p className="text-sm text-muted">No files shared yet.</p>
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
                      <button
                        type="button"
                        className="btn btn-secondary !py-1.5 !text-[12px]"
                        onClick={async () => {
                          const res = await fetch(
                            `/api/portal/${project.shareToken}?fileId=${file.id}`,
                          );
                          const data = await res.json();
                          if (data.url) window.open(data.url as string, "_blank");
                          else alert((data.error as string) || "Unavailable");
                        }}
                      >
                        Download
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "Invoices" && (
              <div className="space-y-3">
                {payError ? (
                  <p className="rounded-xl border border-line bg-paper px-3 py-2 text-sm text-accent-deep">
                    {payError}
                  </p>
                ) : null}
                {project.payments.length === 0 ? (
                  <p className="text-sm text-muted">No invoices yet.</p>
                ) : (
                  project.payments.map((payItem) => (
                    <div
                      key={payItem.id}
                      className="flex flex-col gap-3 rounded-2xl border border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{payItem.label}</p>
                        <p className="text-sm capitalize text-muted">
                          {payItem.status}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-[26px] font-extrabold tracking-[-0.03em]">
                          {formatMoney(payItem.amountCents)}
                        </p>
                        {payItem.status !== "paid" ? (
                          <button
                            type="button"
                            className="btn btn-primary !py-2 !text-[13px]"
                            disabled={payingId === payItem.id}
                            onClick={() =>
                              void pay(
                                payItem.id,
                                payItem.label,
                                payItem.amountCents,
                              )
                            }
                          >
                            {payingId === payItem.id ? "Opening…" : "Pay now"}
                          </button>
                        ) : (
                          <span className="status-pill status-done">Paid</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <p className="text-[12px] text-muted">
                  Pay now uses {studio}’s Razorpay checkout when connected. If
                  Pay fails, ask for their UPI / payment link.
                </p>
              </div>
            )}

            {tab === "Tasks" && (
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted">
                    No client tasks on this project yet.
                  </p>
                ) : (
                  tasks.map((tsk) => (
                    <label
                      key={tsk.id}
                      className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3"
                    >
                      <input
                        type="checkbox"
                        checked={tsk.done}
                        onChange={async () => {
                          const res = await fetch(
                            `/api/portal/${project.shareToken}`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                action: "toggle_task",
                                taskId: tsk.id,
                                done: !tsk.done,
                              }),
                            },
                          );
                          const data = await res.json();
                          if (data.task) {
                            setTasks((prev) =>
                              prev.map((x) =>
                                x.id === data.task.id ? data.task : x,
                              ),
                            );
                          }
                        }}
                      />
                      <span
                        className={tsk.done ? "text-muted line-through" : ""}
                      >
                        {tsk.title}
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}

            {tab === "Messages" && (
              <div className="space-y-4">
                {project.notes ? (
                  <div className="rounded-2xl bg-paper p-4">
                    <p className="text-[12px] font-bold text-accent">
                      Update from {studio}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-muted">
                      {project.notes}
                    </p>
                  </div>
                ) : null}
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted">No messages yet.</p>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          m.author === "client" ? "bg-accent-soft" : "bg-paper"
                        }`}
                      >
                        <p className="text-[11px] font-bold uppercase text-muted-2">
                          {m.author === "client" ? "You" : studio}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    placeholder="Write a reply"
                    className="flex-1 rounded-xl border border-line px-3 py-2"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={async () => {
                      if (!msgBody.trim()) return;
                      const res = await fetch(
                        `/api/portal/${project.shareToken}`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            action: "post_message",
                            body: msgBody,
                          }),
                        },
                      );
                      const data = await res.json();
                      if (data.message) {
                        setMessages((prev) => [...prev, data.message]);
                        setMsgBody("");
                      }
                    }}
                  >
                    Send
                  </button>
                </div>
                <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted">
                  <MessageSquare className="h-4 w-4" />
                  Thread stays on this portal
                </p>
              </div>
            )}
          </div>
        </section>

        {showBadge ? (
          <p className="pt-2 text-center text-[12px] font-semibold text-muted-2">
            Powered by{" "}
            <a
              href="https://portalkit-lime.vercel.app"
              className="text-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              PortalKit
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}
