"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Soft 3D tilt + lift on hover (Jitter “Orbit: Cards” energy).
 * Disabled when prefers-reduced-motion.
 */
export function HoverTiltCard({
  children,
  className = "",
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const card = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  useGSAP(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceRef.current || !card.current) return;
    const el = card.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Orbit: Cards — deeper 3D tracking
    gsap.to(el, {
      rotateY: x * 14 * intensity,
      rotateX: -y * 11 * intensity,
      y: -10 * intensity,
      z: 18 * intensity,
      scale: 1.03,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
    el.style.setProperty("--tilt-x", `${50 + x * 40}%`);
    el.style.setProperty("--tilt-y", `${50 + y * 40}%`);
  }

  function onLeave() {
    if (!card.current) return;
    gsap.to(card.current, {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      z: 0,
      scale: 1,
      duration: 0.65,
      ease: "elastic.out(1, 0.55)",
      overwrite: "auto",
    });
    card.current.style.setProperty("--tilt-x", "50%");
    card.current.style.setProperty("--tilt-y", "50%");
  }

  return (
    <div
      ref={card}
      className={`hover-tilt hover-tilt-orbit ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
