"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Landing page motion orchestrator — wraps home content in `src/app/page.tsx`.
 *
 * Runs:
 * - HeroEnter (`.hero-anim`, `.hero-preview`) + float loop (`.hero-stage-float`)
 * - SectionReveal (`.reveal-section .reveal-item`) on scroll
 * - Beat progress dots/lines
 * - Final CTA rise
 *
 * Type SplitRise lives in `SplitHeadline.tsx` / `KineticHeadline.tsx` (self-running).
 * Orb drift: `AmbientOrbs.tsx`. Metric count-up: `CountMetric.tsx`.
 */
export function LandingMotion({
  children,
}: {
  children: React.ReactNode;
  orbs?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const ctx = gsap.context(() => {
        gsap.from(".hero-anim", {
          y: 42,
          scale: 0.97,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform",
        });

        gsap.from(".hero-preview", {
          y: 56,
          rotateZ: 0.6,
          duration: 1.05,
          delay: 0.28,
          ease: "power3.out",
          clearProps: "transform",
        });

        const floater = root.current?.querySelector(".hero-stage-float");
        if (floater) {
          gsap.to(floater, {
            y: -10,
            duration: 3.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.2,
          });
        }

        gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
          const items = section.querySelectorAll(".reveal-item");
          if (!items.length) return;
          gsap.from(items, {
            y: 40,
            duration: 0.65,
            stagger: 0.09,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".beat-progress-line").forEach((line) => {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.75,
              ease: "power2.out",
              transformOrigin: "left center",
              scrollTrigger: {
                trigger: line.closest(".beat-rail") ?? line,
                start: "top 85%",
                once: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".beat-progress-dot").forEach((dot, i) => {
          gsap.from(dot, {
            scale: 0.35,
            duration: 0.5,
            delay: i * 0.12,
            ease: "back.out(1.8)",
            clearProps: "transform",
            scrollTrigger: {
              trigger: dot.closest(".beat-rail") ?? dot,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        });

        const finalCta = root.current?.querySelector(".final-cta");
        if (finalCta) {
          gsap.from(finalCta.querySelectorAll("h2, p, a"), {
            y: 28,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: finalCta,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }

        const refresh = () => ScrollTrigger.refresh();
        requestAnimationFrame(refresh);
        void document.fonts?.ready?.then(refresh);
        window.addEventListener("load", refresh, { once: true });
      }, root);

      return () => ctx.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative overflow-x-clip">
      {children}
    </div>
  );
}
