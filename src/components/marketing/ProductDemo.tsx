"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CreditCard,
  FormInput,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { ScreenSlide } from "@/components/motion/ScreenSlide";

const TABS = [
  {
    id: "pipeline",
    label: "Project pipeline",
    icon: Workflow,
    title: "Every rebuild on one board",
    body: "Inquiry → offer → booked. Spot stalls before they cost a week.",
  },
  {
    id: "leads",
    label: "Lead capture",
    icon: FormInput,
    title: "Briefs that land ready to quote",
    body: "Store URL, budget, and timeline — no spreadsheet juggling.",
  },
  {
    id: "crm",
    label: "Client management",
    icon: Users,
    title: "One record per merchant",
    body: "Files, invoices, and history stay attached to the relationship.",
  },
  {
    id: "payments",
    label: "Online payments",
    icon: CreditCard,
    title: "Deposits inside the same flow",
    body: "Track payment asks next to the project — mark paid or share your Razorpay link.",
  },
  {
    id: "portal",
    label: "Client portal",
    icon: Zap,
    title: "One link for the merchant",
    body: "Branded portal shell for status and notes — files, tasks, and pay collect ship next.",
  },
] as const;

const DURATION = 4800;

const PIPELINE = [
  {
    stage: "Inquiry",
    count: 4,
    cards: [
      ["Lumen Home", "$4,500", "Theme rebuild", "2h"],
      ["Northwind Tea", "$2,200", "Launch pack", "1d"],
      ["Velvet Goods", "$3,100", "CRO pass", "3d"],
    ],
  },
  {
    stage: "Proposal",
    count: 3,
    cards: [
      ["Cedar & Co", "$2,800", "Viewed 2×", "5h"],
      ["Basin Supply", "$6,400", "Awaiting sign", "1d"],
      ["Orbit Pets", "$3,900", "Follow-up queued", "2d"],
    ],
  },
  {
    stage: "Booked",
    count: 5,
    cards: [
      ["Aurora Skincare", "$4,800", "Deposit paid", "Today"],
      ["Harbor Goods", "$5,200", "Kickoff Mon", "Today"],
      ["Field & Form", "$3,600", "Assets due", "2d"],
    ],
  },
] as const;

function PipelineMock({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="mkt-meta text-ink-2">Q3 rebuilds · 12 open</p>
          <p className="mkt-chip text-accent">$48.4k</p>
        </div>
        {PIPELINE.map((col) => {
          const [name, value] = col.cards[0];
          return (
            <div
              key={col.stage}
              className="flex items-center justify-between gap-3 rounded-xl border border-line/70 bg-paper-2 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="mkt-label">{col.stage}</p>
                <p className="mkt-row mt-0.5 truncate text-[0.8125rem]">{name}</p>
              </div>
              <p className="mkt-chip shrink-0 text-accent">{value}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="mkt-meta text-ink-2">Q3 rebuilds · 12 open</p>
        <p className="mkt-chip text-accent">$48.4k pipeline</p>
      </div>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
        {PIPELINE.map((col) => (
          <div key={col.stage} className="min-w-0 rounded-xl bg-paper/90 p-2">
            <div className="mb-2 flex items-center justify-between gap-1 px-1">
              <p className="mkt-label truncate">{col.stage}</p>
              <span className="mkt-chip shrink-0 text-muted">{col.count}</span>
            </div>
            <div className="space-y-1.5">
              {col.cards.map(([name, value, meta, age]) => (
                <div
                  key={name}
                  className="rounded-lg border border-line/70 bg-paper-2 px-2.5 py-2 shadow-[0_1px_0_rgba(31,31,35,0.04)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="mkt-row truncate text-[0.8125rem]">{name}</p>
                    <p className="mkt-chip shrink-0 text-accent">{value}</p>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="mkt-meta truncate !text-[0.6875rem]">{meta}</p>
                    <p className="mkt-meta shrink-0 !text-[0.6875rem]">{age}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="ghost-cursor pointer-events-none absolute left-[38%] top-[42%] hidden h-5 w-5 lg:block"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-sm" fill="#1f1f23">
          <path d="M4 2.5 19 12.2l-7.1 1.4-3.2 7.4L4 2.5Z" />
        </svg>
      </div>
    </div>
  );
}

function LeadsMock() {
  const full = "Launch before Black Friday";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_0.9fr]">
      <div className="space-y-2 rounded-xl border border-line bg-paper-2 p-3.5">
        <div className="flex items-center justify-between">
          <p className="mkt-row">New project inquiry</p>
          <span className="mkt-chip rounded-full bg-accent-soft px-2 py-0.5 text-accent-deep">
            Live form
          </span>
        </div>
        {[
          ["Store URL", "auroraskincare.com"],
          ["Budget", "$4,000 – $6,000"],
          ["Package", "Theme rebuild + launch"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-line bg-paper px-3 py-2">
            <p className="mkt-meta">{label}</p>
            <p className="mkt-row mt-0.5 text-[0.8125rem]">{value}</p>
          </div>
        ))}
        <div className="rounded-lg border border-line bg-paper px-3 py-2">
          <p className="mkt-meta">Timeline</p>
          <p className="mkt-row mt-0.5 min-h-[1.25rem] text-[0.8125rem]">
            {typed}
            <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-accent align-middle" />
          </p>
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-line bg-paper p-3.5">
        <p className="mkt-label">Inbox today</p>
        {[
          ["Maya · Aurora", "Brief + brand.zip", "12m"],
          ["Chris · Cedar", "Budget confirmed", "1h"],
          ["Priya · Lumen", "Kickoff availability", "3h"],
        ].map(([who, note, age]) => (
          <div
            key={who}
            className="flex items-center justify-between gap-2 rounded-lg border border-line/80 bg-paper-2 px-2.5 py-2"
          >
            <div className="min-w-0">
              <p className="mkt-row truncate text-[0.8125rem]">{who}</p>
              <p className="mkt-meta truncate">{note}</p>
            </div>
            <span className="mkt-meta shrink-0">{age}</span>
          </div>
        ))}
        <button type="button" className="btn btn-primary w-full !py-2.5">
          Submit inquiry
        </button>
      </div>
    </div>
  );
}

function CrmMock() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper-2 p-3.5">
        <div className="mkt-row grid h-11 w-11 place-items-center rounded-full bg-ink text-white">
          AS
        </div>
        <div className="min-w-0 flex-1">
          <p className="mkt-row">Aurora Skincare</p>
          <p className="mkt-meta mt-0.5 truncate">
            maya@auroraskincare.com · Shopify Plus · Retainer
          </p>
        </div>
        <span className="mkt-chip rounded-full bg-mint px-2.5 py-1 text-mint-ink">
          Active
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        {[
          ["Open invoices", "$1,800"],
          ["Files shared", "12"],
          ["Last activity", "Today"],
          ["Lifetime", "$18.4k"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-line bg-paper px-3 py-2.5">
            <p className="mkt-meta">{k}</p>
            <p className="mkt-row mt-1 text-[0.875rem]">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          ["Homepage mock v3", "File · 2.4 MB", "Shared"],
          ["INV-1042 deposit", "Invoice · $1,920", "Paid"],
          ["Kickoff checklist", "Task · 4/6", "In progress"],
          ["Brand guidelines", "File · PDF", "New"],
        ].map(([title, meta, status]) => (
          <div
            key={title}
            className="flex items-center justify-between gap-2 rounded-lg border border-line/80 bg-paper-2 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="mkt-row truncate text-[0.8125rem]">{title}</p>
              <p className="mkt-meta">{meta}</p>
            </div>
            <span className="mkt-chip shrink-0 text-ink-2">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsMock() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-3 rounded-xl border border-line bg-paper-2 p-4">
        <div className="flex items-center justify-between">
          <p className="mkt-label">Invoice INV-1042</p>
          <span className="mkt-chip rounded-full bg-mint px-2 py-0.5 text-mint-ink">
            Paid
          </span>
        </div>
        <p className="mkt-feature">$1,920.00</p>
        <p className="mkt-meta">40% deposit · Theme rebuild · Aurora Skincare</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Gross", "$4,800"],
            ["Received", "$1,920"],
            ["Due", "$2,880"],
            ["Method", "Razorpay"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-paper px-3 py-2">
              <p className="mkt-meta">{k}</p>
              <p className="mkt-row mt-0.5 text-[0.8125rem]">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-line bg-paper p-4">
        <p className="mkt-label">Recent payments</p>
        {[
          ["Harbor Goods", "$2,080", "Today"],
          ["Field & Form", "$1,440", "Yesterday"],
          ["Orbit Pets", "$980", "Mar 2"],
        ].map(([name, amt, when]) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg border border-line/80 bg-paper-2 px-3 py-2.5"
          >
            <div>
              <p className="mkt-row text-[0.8125rem]">{name}</p>
              <p className="mkt-meta">{when}</p>
            </div>
            <p className="mkt-chip text-accent">{amt}</p>
          </div>
        ))}
        <button type="button" className="btn btn-primary w-full !py-2.5">
          Send receipt
        </button>
      </div>
    </div>
  );
}

function PortalMock() {
  return (
    <div className="space-y-2">
      {[
        ["Studio accent", "Coral brand on portal chrome", "Live"],
        ["Client notes", "Visible on shared link", "Live"],
        ["Payment asks", "Mark paid · Razorpay link", "Live"],
        ["Files + tasks + pay", "Delivery loop", "Soon"],
      ].map(([title, detail, state]) => (
        <div
          key={title}
          className="flex items-start gap-3 rounded-xl border border-line bg-paper-2 p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="mkt-row text-[0.8125rem]">{title}</p>
              <span
                className={`mkt-chip rounded-full px-2 py-0.5 ${
                  state === "Live"
                    ? "bg-mint text-mint-ink"
                    : "bg-line text-muted"
                }`}
              >
                {state}
              </span>
            </div>
            <p className="mkt-meta mt-0.5">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MockFor({
  id,
  compact = false,
}: {
  id: (typeof TABS)[number]["id"];
  compact?: boolean;
}) {
  switch (id) {
    case "pipeline":
      return <PipelineMock compact={compact} />;
    case "leads":
      return <LeadsMock />;
    case "crm":
      return <CrmMock />;
    case "payments":
      return <PaymentsMock />;
    case "portal":
      return <PortalMock />;
  }
}

export function ProductDemo({ embedded = false }: { embedded?: boolean }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const pauseUntil = useRef(0);
  const activeRef = useRef(0);
  const elapsedRef = useRef(0);

  activeRef.current = active;

  const selectTab = useCallback((index: number) => {
    setActive(index);
    setProgress(0);
    elapsedRef.current = 0;
    pauseUntil.current = Date.now() + DURATION * 2;
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    let last = Date.now();

    const tick = () => {
      const now = Date.now();
      const dt = now - last;
      last = now;

      if (now >= pauseUntil.current) {
        elapsedRef.current += dt;
        if (elapsedRef.current >= DURATION) {
          elapsedRef.current = 0;
          const next = (activeRef.current + 1) % TABS.length;
          setActive(next);
        }
        setProgress(Math.min(1, elapsedRef.current / DURATION));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const tab = TABS[active];

  return (
    <div
      className={
        embedded
          ? "relative w-full min-w-0"
          : "hero-preview mx-auto max-w-5xl px-5 pb-16"
      }
    >
      {embedded ? null : (
        <div
          className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          role="tablist"
          aria-label="Product demo"
        >
          {TABS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`demo-tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`demo-panel-${t.id}`}
              className="demo-tab"
              data-active={i === active}
              onClick={() => selectTab(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div
        className={
          embedded
            ? "product-plane-ui w-full min-w-0 overflow-hidden"
            : "visual-frame product-plane-ui"
        }
      >
        <div className="flex min-w-0 items-center gap-3 border-b border-line/80 bg-paper-2/95 px-3 py-2.5 md:px-4">
          <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-gradient-to-br from-accent to-accent-deep text-[10px] font-bold text-white">
            Pk
          </div>
          <div className="min-w-0 flex-1">
            <p className="mkt-row truncate text-[0.8125rem]">Studio workspace</p>
            <p className="mkt-meta truncate !text-[0.6875rem]">
              PortalKit · {tab.label}
            </p>
          </div>
          {embedded ? (
            <div className="hidden gap-1 sm:flex" aria-hidden>
              {TABS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-4 rounded-full transition-colors ${
                    i === active ? "bg-accent" : "bg-line"
                  }`}
                />
              ))}
            </div>
          ) : (
            <span className="mkt-chip hidden rounded-full bg-ink px-2.5 py-1 text-white sm:inline">
              Live
            </span>
          )}
        </div>

        <div
          className={`grid gap-0 ${
            embedded ? "lg:grid-cols-[148px_1fr]" : "md:grid-cols-[200px_1fr]"
          }`}
        >
          <aside
            className={`border-b border-line/80 bg-paper md:border-b-0 md:border-r ${
              embedded ? "hidden p-2 lg:block" : "p-2.5"
            }`}
          >
            <p className="mkt-label px-2 py-1">Workspace</p>
            <div className="mt-1 space-y-0.5" role={embedded ? "tablist" : undefined}>
              {(
                [
                  ["pipeline", "Pipeline"],
                  ["leads", "Lead capture"],
                  ["crm", "Clients"],
                  ["payments", "Payments"],
                  ["portal", "Portal"],
                ] as const
              ).map(([id, label], i) => {
                const t = TABS[i];
                const Icon = t.icon;
                return (
                  <button
                    key={id}
                    type="button"
                    role={embedded ? "tab" : undefined}
                    id={embedded ? `demo-tab-${id}` : undefined}
                    aria-selected={embedded ? i === active : undefined}
                    onClick={() => selectTab(i)}
                    className={`mkt-meta flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-[background-color,color,transform] duration-[var(--motion-micro)] ease-out ${
                      i === active
                        ? "bg-ink text-white"
                        : "text-ink-2 hover:translate-x-0.5 hover:bg-paper-2 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className={embedded ? "bg-paper-2 p-3 sm:p-3.5 md:p-4" : "bg-paper-2 p-4 md:p-5"}>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="mkt-h3 text-[1.0625rem] md:text-[1.25rem]">{tab.title}</p>
                <p className="mkt-body mt-1 max-w-md !text-[0.8125rem] md:!text-[0.9375rem]">
                  {tab.body}
                </p>
              </div>
              <span className="mkt-chip hidden rounded-full border border-line bg-paper px-2.5 py-1 text-ink-2 sm:inline">
                Demo data
              </span>
            </div>

            {embedded ? (
              <div
                className="mb-3 flex gap-1.5 overflow-x-auto pb-1 lg:hidden"
                role="tablist"
                aria-label="Workspace views"
              >
                {TABS.map((t, i) => {
                  const short =
                    t.id === "pipeline"
                      ? "Pipeline"
                      : t.id === "leads"
                        ? "Leads"
                        : t.id === "crm"
                          ? "Clients"
                          : t.id === "payments"
                            ? "Payments"
                            : "Flows";
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      onClick={() => selectTab(i)}
                      className={`mkt-chip shrink-0 rounded-full px-2.5 py-1.5 transition-[color,background-color] duration-[var(--motion-micro)] ${
                        i === active
                          ? "bg-ink text-white"
                          : "border border-line bg-paper text-ink-2"
                      }`}
                    >
                      {short}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <ScreenSlide activeKey={tab.id}>
              <div
                className="demo-panel"
                role="tabpanel"
                id={`demo-panel-${tab.id}`}
                aria-labelledby={`demo-tab-${tab.id}`}
              >
                <MockFor id={tab.id} compact={embedded} />
              </div>
            </ScreenSlide>
            {embedded ? (
              <div
                className="mt-3 h-0.5 overflow-hidden rounded-full bg-line/70"
                aria-hidden
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-100 ease-linear"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
