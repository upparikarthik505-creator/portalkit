"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";

/** Anchor CTA that springs toward the cursor on hover. */
export function MagneticLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: x * 0.32,
      y: y * 0.28,
      scale: 1.055,
      duration: 0.28,
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
      duration: 0.55,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </Link>
  );
}
