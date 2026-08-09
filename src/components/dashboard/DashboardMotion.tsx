"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Dashboard scene motion — design-system §6 timings.
 * Transform-only; honors prefers-reduced-motion.
 */
export function DashboardMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.fromTo(
        ".dash-rise",
        { y: 28, scale: 0.98 },
        {
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "transform",
        },
      );

      gsap.fromTo(
        ".dash-row",
        { y: 14 },
        {
          y: 0,
          duration: 0.45,
          delay: 0.2,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "transform",
        },
      );

      const orbs = gsap.utils.toArray<HTMLElement>(".dash-orb");
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 === 0 ? -14 : 12,
          x: i % 2 === 0 ? 10 : -10,
          duration: 3.4 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="dash-scene relative">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="dash-orb absolute -left-10 top-6 h-44 w-44 rounded-full bg-accent/15 blur-3xl" />
        <div className="dash-orb absolute right-0 top-24 h-52 w-52 rounded-full bg-hero blur-3xl" />
        <div className="dash-orb absolute bottom-10 left-1/3 h-36 w-36 rounded-full bg-accent-soft/80 blur-3xl" />
      </div>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
