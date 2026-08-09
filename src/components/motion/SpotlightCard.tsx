"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Dribbble-style cursor spotlight on cards (soft radial highlight).
 * Transform/position only on the glow layer — never fades content.
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  useGSAP(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceRef.current || !root.current || !glow.current) return;
    const rect = root.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(glow.current, {
      x: x - 120,
      y: y - 120,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.set(glow.current, { autoAlpha: 1 });
  }

  function onLeave() {
    if (!glow.current) return;
    gsap.to(glow.current, {
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  return (
    <div
      ref={root}
      className={`spotlight-card relative overflow-hidden ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[240px] w-[240px] rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,90,95,0.18) 0%, transparent 68%)",
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
