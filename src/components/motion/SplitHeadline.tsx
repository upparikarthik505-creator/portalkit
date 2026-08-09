"use client";

import { useRef, type ElementType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * SplitRise type animation — words rise from a clip mask.
 * File that runs this: this component (used by AiSlider, Journey, Pricing, etc.)
 * Parent scroll orchestration: `LandingMotion.tsx`
 * Transform-only — never tweens opacity on copy.
 */
export function SplitHeadline({
  as: Tag = "h1",
  text,
  className = "",
  delay = 0,
  stagger = 0.055,
  scroll = false,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view instead of on mount */
  scroll?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(/(\s+)/).filter(Boolean);
  const Comp = Tag as ElementType;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const parts = el.querySelectorAll<HTMLElement>(".split-word");
      if (!parts.length) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(parts, { clearProps: "transform" });
        return;
      }

      const anim = gsap.fromTo(
        parts,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.95,
          delay,
          stagger,
          ease: "power3.out",
          clearProps: "transform",
          ...(scroll
            ? {
                scrollTrigger: {
                  trigger: el,
                  start: "top 92%",
                  once: true,
                  invalidateOnRefresh: true,
                },
              }
            : {}),
        },
      );

      // Fonts / layout can shift trigger positions after first paint
      void document.fonts?.ready?.then(() => ScrollTrigger.refresh());
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
        gsap.set(parts, { clearProps: "transform" });
      };
    },
    { scope: root, dependencies: [text, scroll, delay, stagger] },
  );

  return (
    <Comp ref={root} className={className} aria-label={text}>
      {words.map((token, i) =>
        /^\s+$/.test(token) ? (
          <span key={`s-${i}`}>{" "}</span>
        ) : (
          <span key={`${token}-${i}`} className="split-word-wrap" aria-hidden>
            <span className="split-word">{token}</span>
          </span>
        ),
      )}
    </Comp>
  );
}
