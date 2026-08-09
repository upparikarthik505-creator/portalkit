"use client";

import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import gsap from "gsap";

/** Button that springs toward the cursor on hover. */
export function MagneticButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);

  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: x * 0.2,
      y: y * 0.2,
      scale: 1.05,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  function onLeave() {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
  }

  return (
    <button
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
    </button>
  );
}
