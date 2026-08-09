"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Jitter “Stacked Cards” / “Orbit: Cards” energy —
 * layered stack that fans open on hover.
 */
export function StackFan({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  useGSAP(
    () => {
      reduceRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const items = root.current?.querySelectorAll<HTMLElement>(".stack-fan-item");
      if (!items?.length || reduceRef.current) return;

      gsap.set(items, {
        y: (i) => i * 6,
        rotateZ: (i) => (i - (items.length - 1) / 2) * 1.4,
        scale: (i) => 1 - i * 0.012,
        zIndex: (i) => items.length - i,
      });
    },
    { scope: root },
  );

  function fanOpen() {
    if (reduceRef.current || !root.current) return;
    const items = root.current.querySelectorAll<HTMLElement>(".stack-fan-item");
    gsap.to(items, {
      y: (i) => i * 14,
      rotateZ: (i) => (i - (items.length - 1) / 2) * 3.2,
      scale: 1,
      duration: 0.45,
      stagger: 0.03,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  function fanClose() {
    if (!root.current) return;
    const items = root.current.querySelectorAll<HTMLElement>(".stack-fan-item");
    gsap.to(items, {
      y: (i) => i * 6,
      rotateZ: (i) => (i - (items.length - 1) / 2) * 1.4,
      scale: (i) => 1 - i * 0.012,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  return (
    <div
      ref={root}
      className={`stack-fan ${className}`.trim()}
      onMouseEnter={fanOpen}
      onMouseLeave={fanClose}
    >
      {children}
    </div>
  );
}

export function StackFanItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`stack-fan-item will-change-transform ${className}`.trim()}>
      {children}
    </div>
  );
}
