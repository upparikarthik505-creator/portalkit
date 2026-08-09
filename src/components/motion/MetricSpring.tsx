"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Jitter “Animated Metrics” / Dribbble KPI pop —
 * spring scale overshoot on mount (transform-only).
 */
export function MetricSpring({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        el,
        { scale: 0.86, y: 10, rotateX: 12 },
        {
          scale: 1,
          y: 0,
          rotateX: 0,
          delay,
          duration: 0.75,
          ease: "back.out(1.7)",
          clearProps: "transform",
        },
      );
    },
    { scope: root, dependencies: [delay] },
  );

  return (
    <div ref={root} className={`metric-spring ${className}`.trim()}>
      {children}
    </div>
  );
}
