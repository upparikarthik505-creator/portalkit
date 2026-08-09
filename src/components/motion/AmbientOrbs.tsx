"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Soft drifting orbs — warm coral/peach only (no purple wash).
 */
export function AmbientOrbs({
  className = "",
  variant = "blush",
}: {
  className?: string;
  variant?: "blush" | "lavender" | "mint";
}) {
  const root = useRef<HTMLDivElement>(null);

  const tones =
    variant === "lavender"
      ? ["bg-[#ffc9cc]/40", "bg-accent/20", "bg-[#ffd8a8]/35"]
      : variant === "mint"
        ? ["bg-[#bbf7d0]/35", "bg-accent/12", "bg-[#ffe0c2]/30"]
        : ["bg-accent/22", "bg-[#ffc4a8]/28", "bg-[#ffb8bc]/24"];

  useGSAP(
    () => {
      const orbs = root.current?.querySelectorAll<HTMLElement>(".ambient-orb");
      if (!orbs?.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 === 0 ? -36 : 24,
          x: i % 2 === 0 ? 22 : -28,
          scale: i % 2 === 0 ? 1.08 : 0.94,
          duration: 4.5 + i * 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      aria-hidden
    >
      <div
        className={`ambient-orb absolute left-0 top-6 h-44 w-44 rounded-full blur-3xl sm:h-56 sm:w-56 ${tones[0]}`}
      />
      <div
        className={`ambient-orb absolute right-0 top-20 h-52 w-52 rounded-full blur-3xl sm:h-72 sm:w-72 ${tones[1]}`}
      />
      <div
        className={`ambient-orb absolute bottom-2 left-1/3 h-40 w-40 rounded-full blur-3xl sm:h-48 sm:w-48 ${tones[2]}`}
      />
    </div>
  );
}
