"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { SplitHeadline } from "@/components/motion/SplitHeadline";

const FEATURES = [
  {
    title: "Email drafts",
    body: "Personalized client replies from your tone and project context.",
  },
  {
    title: "Project recaps",
    body: "Meeting-ready summaries with milestones, files, and invoices.",
  },
  {
    title: "Business trends",
    body: "See which packages convert and where deals stall.",
  },
  {
    title: "Meeting notetaker",
    body: "Turn discovery calls into proposal scopes.",
  },
] as const;

const DURATION = 4200;

export function AiSlider() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const pauseUntil = useRef(0);
  const activeRef = useRef(0);
  const elapsedRef = useRef(0);
  activeRef.current = active;

  const panelRef = useRef<HTMLDivElement>(null);

  const select = useCallback((index: number) => {
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
          setActive((activeRef.current + 1) % FEATURES.length);
        }
        setProgress(Math.min(1, elapsedRef.current / DURATION));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Spotlight panel rise on feature change (transform-only)
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      panel,
      { y: 14 },
      { y: 0, duration: 0.45, ease: "power2.out", clearProps: "transform" },
    );
  }, [active]);

  const feature = FEATURES[active];

  return (
    <section className="reveal-section mkt-section border-y border-line bg-paper-2">
      <div className="mx-auto max-w-6xl">
        <div className="mkt-chip reveal-item mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-accent-deep">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          PortalKit AI
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SplitHeadline
              as="h2"
              scroll
              className="mkt-h2 max-w-2xl"
              text="AI that knows your Shopify deals"
            />
            <p className="mkt-lede reveal-item mt-4 max-w-xl">
              Drafts, recaps, and next steps tuned to rebuilds, launches, and
              retainers — not generic chat.
            </p>
          </div>
          <Link
            href="/product/ai"
            className="mkt-link reveal-item underline-offset-2 hover:underline"
          >
            Explore AI
          </Link>
        </div>

        <div className="reveal-item mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div
            className="space-y-2 rounded-[var(--radius)] border border-line bg-paper p-2"
            role="tablist"
            aria-label="AI features"
          >
            {FEATURES.map((f, i) => (
              <button
                key={f.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => select(i)}
                className={`w-full rounded-[calc(var(--radius)-4px)] border px-4 py-3.5 text-left transition-[border-color,background-color,box-shadow] duration-[var(--motion-micro)] ease-out ${
                  i === active
                    ? "border-accent/30 bg-paper-2 shadow-[var(--shadow)]"
                    : "border-transparent hover:bg-paper-2/80"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="mkt-row">{f.title}</p>
                  {i === active ? (
                    <span className="mkt-chip text-accent">Live</span>
                  ) : null}
                </div>
                {i === active ? (
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-100 ease-linear"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                ) : null}
              </button>
            ))}
          </div>

          <div
            ref={panelRef}
            className="rounded-[var(--radius)] border border-line bg-paper p-7 shadow-[var(--shadow)] md:p-9"
          >
            <p className="mkt-eyebrow">Feature spotlight</p>
            <h3 className="mkt-feature mt-3">{feature.title}</h3>
            <p className="mkt-lede mt-3">{feature.body}</p>
            <div className="mt-8 rounded-[calc(var(--radius)-4px)] border border-line bg-paper-2 p-4">
              <p className="mkt-meta">Draft preview</p>
              <p className="mkt-body mt-2 text-ink-2">
                Hi Maya — thanks for the brand assets. I&apos;ve updated the homepage
                mock and attached the deposit invoice so we can kick off Monday.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
