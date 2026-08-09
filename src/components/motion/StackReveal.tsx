"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Jitter Stacked Cards / The Stack: Testimonial —
 * scroll-triggered fan-out then settle (~4s energy, once).
 */
export function StackReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = root.current?.querySelectorAll<HTMLElement>(".stack-reveal-item");
      if (!items?.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(items, {
        y: (i) => 48 + i * 8,
        rotateZ: (i) => (i - (items.length - 1) / 2) * -6,
        scale: 0.92,
        zIndex: (i) => items.length - i,
      });

      gsap.to(items, {
        y: (i) => i * 12,
        rotateZ: (i) => (i - (items.length - 1) / 2) * 2.4,
        scale: 1,
        duration: 0.85,
        stagger: 0.08,
        ease: "back.out(1.35)",
        clearProps: "transform",
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          once: true,
        },
        onComplete: () => {
          items.forEach((el, i) => {
            gsap.set(el, {
              y: i * 12,
              rotateZ: (i - (items.length - 1) / 2) * 2.4,
              zIndex: items.length - i,
            });
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`stack-reveal relative ${className}`.trim()}>
      {children}
    </div>
  );
}

export function StackRevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`stack-reveal-item relative will-change-transform ${className}`.trim()}
    >
      {children}
    </div>
  );
}
