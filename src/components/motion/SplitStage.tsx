"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Split reveal product frame — design-system tokens + motion.
 * Transform-only panels; honors prefers-reduced-motion.
 */
export function SplitStage({
  children,
  className = "",
  labelLeft = "Booked",
  labelRight = "Built",
}: {
  children: ReactNode;
  className?: string;
  labelLeft?: string;
  labelRight?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const left = root.current?.querySelector<HTMLElement>(".split-panel-left");
      const right = root.current?.querySelector<HTMLElement>(".split-panel-right");
      const stage = root.current?.querySelector<HTMLElement>(".split-stage-inner");
      if (!left || !right || !stage) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([left, right], { xPercent: (i) => (i === 0 ? -100 : 100) });
        return;
      }

      gsap.set(stage, { scale: 0.96 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          once: true,
        },
      });
      tl.to(
        left,
        { xPercent: -100, duration: 1.05, ease: "power3.inOut" },
        0,
      )
        .to(
          right,
          { xPercent: 100, duration: 1.05, ease: "power3.inOut" },
          0,
        )
        .to(
          stage,
          { scale: 1, duration: 0.9, ease: "power3.out" },
          0.15,
        );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={`split-stage relative overflow-hidden rounded-[var(--radius)] border border-line bg-paper shadow-[var(--shadow)] ${className}`.trim()}
    >
      <div className="split-stage-inner relative">{children}</div>
      <div
        className="split-panel-left pointer-events-none absolute inset-y-0 left-0 z-10 flex w-1/2 items-center justify-center bg-ink text-white"
        aria-hidden
      >
        <span className="mkt-label text-white">{labelLeft}</span>
      </div>
      <div
        className="split-panel-right pointer-events-none absolute inset-y-0 right-0 z-10 flex w-1/2 items-center justify-center bg-accent text-white"
        aria-hidden
      >
        <span className="mkt-label text-white">{labelRight}</span>
      </div>
    </div>
  );
}
