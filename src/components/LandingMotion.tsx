"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function LandingMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-kicker", { y: 24, opacity: 0, duration: 0.55 })
        .from(".hero-title", { y: 48, opacity: 0, duration: 0.75 }, "-=0.25")
        .from(".hero-sub", { y: 28, opacity: 0, duration: 0.55 }, "-=0.35")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.25")
        .from(".hero-stage", { y: 60, opacity: 0, duration: 0.85 }, "-=0.45");

      gsap.from(".reveal", {
        scrollTrigger: undefined,
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.15,
      });

      gsap.to(".orb", {
        y: -18,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.4,
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
