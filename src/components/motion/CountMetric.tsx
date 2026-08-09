"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Animated metrics — transform chrome + number counter.
 * Always lands on the final value (ScrollTrigger + reduced-motion safe).
 */
export function CountMetric({
  value,
  suffix = "",
  prefix = "",
  label,
  hint,
  bar = 0,
  className = "",
  decimals = 0,
  flat = false,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  hint?: string;
  bar?: number;
  className?: string;
  decimals?: number;
  flat?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const format = (n: number) =>
    `${prefix}${n.toFixed(decimals)}${suffix}`;

  useGSAP(
    () => {
      const el = root.current;
      const num = numRef.current;
      if (!el || !num) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        num.textContent = format(value);
        if (barRef.current && bar > 0) {
          gsap.set(barRef.current, { scaleX: bar });
        }
        return;
      }

      const trigger = {
        trigger: el,
        start: "top 92%",
        once: true,
      } as const;

      gsap.fromTo(
        el,
        { y: 18, scale: 0.96 },
        {
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: trigger,
        },
      );

      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: trigger,
        onUpdate: () => {
          num.textContent = format(counter.n);
        },
        onComplete: () => {
          num.textContent = format(value);
        },
      });

      if (barRef.current && bar > 0) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: Math.min(1, Math.max(0, bar)),
            duration: 0.9,
            ease: "power2.out",
            transformOrigin: "left center",
            scrollTrigger: trigger,
          },
        );
      }

      // Ensure values if already in view after layout/fonts
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: root, dependencies: [value, suffix, prefix, bar, decimals] },
  );

  return (
    <div
      ref={root}
      className={`count-metric rounded-2xl border border-line bg-paper/40 p-5 ${flat ? "count-metric-flat" : ""} ${className}`.trim()}
    >
      <p className="mkt-eyebrow !text-muted">{label}</p>
      <p className="mkt-metric mt-2">
        <span ref={numRef}>
          {prefix}
          {value.toFixed(decimals)}
          {suffix}
        </span>
      </p>
      {hint ? <p className="mkt-meta mt-1.5">{hint}</p> : null}
      {bar > 0 ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line/80">
          <div
            ref={barRef}
            className="h-full origin-left rounded-full bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      ) : null}
    </div>
  );
}
