"use client";

import { useState } from "react";
import { SplitHeadline } from "@/components/motion/SplitHeadline";

const BEATS = [
  {
    title: "Land the rebuild brief",
    body: "Branded intake captures store URL, budget, and timeline — then drops straight onto your deal board.",
    label: "New lead",
    name: "Lumen Home",
    meta: "Theme rebuild · $4,500",
    badge: "Inquiry · just now",
    badgeClass: "bg-accent-soft text-accent-deep",
  },
  {
    title: "Close with one offer pack",
    body: "Scope, agreement, and deposit in a single client link — so kickoffs don’t die in email threads.",
    label: "Offer pack",
    name: "Proposal + contract",
    meta: "Viewed · awaiting signature",
    badge: "2 of 3 steps done",
    badgeClass: "bg-warn-soft text-warn",
  },
  {
    title: "Deliver inside the portal",
    body: "Files, milestones, and invoices stay where merchants already look — from first hello to live theme.",
    label: "Client portal",
    name: "Aurora Skincare",
    meta: "3 files · 1 invoice · 2 tasks",
    badge: "On track",
    badgeClass: "bg-mint text-mint-ink",
  },
] as const;

/** Home journey — ink band + SplitRise + SectionReveal */
export function JourneyScroll() {
  const [active, setActive] = useState(0);
  const beat = BEATS[active];

  return (
    <section className="reveal-section journey-section mkt-section bg-ink text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mkt-eyebrow reveal-item text-center text-accent">
          The freelancer loop
        </p>
        <SplitHeadline
          as="h2"
          scroll
          className="mkt-h2 mx-auto mt-3 max-w-3xl text-center"
          text="Lead → offer pack → live theme"
        />
        <p className="mkt-lede mkt-lede-invert reveal-item mx-auto mt-4 max-w-xl text-center">
          Three beats that replace Notion boards, Doc chains, and payment chase.
        </p>

        {/* Mobile: stacked — <768px */}
        <div className="reveal-item mt-12 space-y-10 md:hidden">
          {BEATS.map((item, i) => (
            <div key={item.title} className="space-y-4">
              <p className="mkt-eyebrow text-accent">Beat {i + 1}</p>
              <h3 className="mkt-feature text-white">{item.title}</h3>
              <p className="mkt-lede mkt-lede-invert">{item.body}</p>
              <Visual beat={item} />
            </div>
          ))}
        </div>

        {/* Desktop tabs — ≥768px */}
        <div className="reveal-item mt-14 hidden gap-10 md:grid md:grid-cols-2 md:items-center">
          <div className="space-y-2" role="tablist" aria-label="Journey beats">
            {BEATS.map((item, i) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`w-full rounded-[var(--radius)] border px-5 py-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-[var(--motion-micro)] ease-out ${
                  i === active
                    ? "border-white/20 bg-white/8 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                    : "border-transparent hover:-translate-y-0.5 hover:bg-white/5"
                }`}
              >
                <p className="mkt-eyebrow text-accent">Beat {i + 1}</p>
                <h3 className="mkt-feature mt-2 text-white">{item.title}</h3>
                {i === active ? (
                  <p className="mkt-lede mkt-lede-invert mt-2">{item.body}</p>
                ) : null}
              </button>
            ))}
          </div>
          <Visual beat={beat} />
        </div>
      </div>
    </section>
  );
}

function Visual({ beat }: { beat: (typeof BEATS)[number] }) {
  return (
    <div className="flex min-h-[220px] flex-col justify-between rounded-[var(--radius)] border border-white/12 bg-white/[0.06] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.28)] sm:min-h-[240px] sm:p-6">
      <p className="mkt-label !text-white/45">{beat.label}</p>
      <div>
        <p className="mkt-h3 text-white">{beat.name}</p>
        <p className="mkt-body mt-1 !text-white/65">{beat.meta}</p>
      </div>
      <span
        className={`mkt-chip inline-flex w-fit rounded-full px-2.5 py-1 ${beat.badgeClass}`}
      >
        {beat.badge}
      </span>
    </div>
  );
}
