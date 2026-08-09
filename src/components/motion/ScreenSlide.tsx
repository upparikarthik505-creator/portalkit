"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

/**
 * Jitter Sliding Web Screens — horizontal cascade when `activeKey` changes (~7s energy, shortened).
 */
export function ScreenSlide({
  activeKey,
  children,
  className = "",
}: {
  activeKey: string;
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef(activeKey);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prev.current = activeKey;
      return;
    }
    if (prev.current === activeKey) return;

    const dir = 1;
    gsap.fromTo(
      el,
      { x: 48 * dir, rotateY: -6 },
      {
        x: 0,
        rotateY: 0,
        duration: 0.55,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
    prev.current = activeKey;
  }, [activeKey]);

  return (
    <div
      ref={root}
      className={`screen-slide will-change-transform ${className}`.trim()}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
