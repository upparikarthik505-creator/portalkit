"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Jitter Orbit: Cards — cards travel an elliptical path around a center (~5s loop).
 * Pause on hover. Transform-only.
 */
export function OrbitRing({
  children,
  className = "",
  radiusX = 140,
  radiusY = 56,
  duration = 14,
}: {
  children: ReactNode;
  className?: string;
  radiusX?: number;
  radiusY?: number;
  duration?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const items = root.current?.querySelectorAll<HTMLElement>(".orbit-item");
      if (!items?.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        items.forEach((el, i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          gsap.set(el, {
            x: Math.cos(a) * radiusX,
            y: Math.sin(a) * radiusY,
            zIndex: Math.round(50 + Math.sin(a) * 10),
          });
        });
        return;
      }

      const state = { t: 0 };
      tweenRef.current = gsap.to(state, {
        t: Math.PI * 2,
        duration,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          items.forEach((el, i) => {
            const a =
              state.t + (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(a) * radiusX;
            const y = Math.sin(a) * radiusY;
            const depth = (Math.sin(a) + 1) / 2;
            gsap.set(el, {
              x,
              y,
              scale: 0.86 + depth * 0.18,
              zIndex: Math.round(10 + depth * 40),
            });
          });
        },
      });

      return () => {
        tweenRef.current?.kill();
      };
    },
    { scope: root, dependencies: [radiusX, radiusY, duration] },
  );

  function pause() {
    tweenRef.current?.pause();
  }
  function resume() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tweenRef.current?.resume();
  }

  return (
    <div
      ref={root}
      className={`orbit-ring relative mx-auto flex h-[280px] w-full max-w-lg items-center justify-center ${className}`.trim()}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="orbit-core pointer-events-none absolute inset-0 m-auto h-24 w-24 rounded-full border border-dashed border-line/80 bg-white/40" />
      {children}
    </div>
  );
}

export function OrbitItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`orbit-item absolute left-1/2 top-1/2 w-[140px] -translate-x-1/2 -translate-y-1/2 will-change-transform ${className}`.trim()}
    >
      {children}
    </div>
  );
}
