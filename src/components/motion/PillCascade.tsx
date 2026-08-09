"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Jitter Color Pills: Reveal — spring chip stagger (transform-only).
 */
export function PillCascade({
  children,
  className = "",
  delay = 0.35,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const pills = root.current?.querySelectorAll<HTMLElement>(".pill-cascade-item");
      if (!pills?.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        pills,
        { y: 16, scale: 0.86 },
        {
          y: 0,
          scale: 1,
          duration: 0.5,
          delay,
          stagger: 0.035,
          ease: "back.out(1.8)",
          clearProps: "transform",
        },
      );
    },
    { scope: root, dependencies: [delay] },
  );

  return (
    <div ref={root} className={`pill-cascade flex flex-wrap gap-2 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function PillCascadeItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`pill-cascade-item inline-flex will-change-transform ${className}`.trim()}>
      {children}
    </span>
  );
}
