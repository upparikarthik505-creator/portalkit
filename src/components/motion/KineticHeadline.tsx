"use client";

import { useRef, type ElementType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Hero SplitRise — words/letters rise from a clip mask on mount (or scroll).
 * Used on home hero via `KineticHeadline` in `src/app/page.tsx`.
 */
export function KineticHeadline({
  as: Tag = "h1",
  text,
  className = "",
  mode = "words",
  delay = 0.12,
  stagger,
  scroll = false,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  text: string;
  className?: string;
  mode?: "words" | "letters";
  delay?: number;
  stagger?: number;
  scroll?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const Comp = Tag as ElementType;
  const wordStagger = stagger ?? (mode === "letters" ? 0.022 : 0.055);
  const tokens = text.split(/(\s+)/).filter(Boolean);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const parts = el.querySelectorAll<HTMLElement>(".kinetic-part");
      if (!parts.length) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(parts, { clearProps: "all" });
        return;
      }

      const scrollOpts = scroll
        ? {
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        : {};

      if (mode === "letters") {
        gsap.fromTo(
          parts,
          { scale: 0.5, yPercent: 50, skewY: 8 },
          {
            scale: 1,
            yPercent: 0,
            skewY: 0,
            duration: 0.75,
            delay,
            stagger: wordStagger,
            ease: "back.out(1.7)",
            clearProps: "transform",
            ...scrollOpts,
          },
        );
        return;
      }

      gsap.fromTo(
        parts,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.95,
          delay,
          stagger: wordStagger,
          ease: "power3.out",
          clearProps: "transform",
          ...scrollOpts,
        },
      );
    },
    { scope: root, dependencies: [text, mode, scroll, delay, wordStagger] },
  );

  return (
    <Comp ref={root} className={className}>
      <span className="sr-only">{text}</span>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={`s-${i}`}>{" "}</span>;
        }
        if (mode === "letters") {
          return (
            <span key={`${token}-${i}`} className="kinetic-word-wrap" aria-hidden>
              {token.split("").map((ch, j) => (
                <span key={`${ch}-${j}`} className="kinetic-part kinetic-letter">
                  {ch}
                </span>
              ))}
            </span>
          );
        }
        return (
          <span key={`${token}-${i}`} className="kinetic-word-wrap" aria-hidden>
            <span className="kinetic-part kinetic-word">{token}</span>
          </span>
        );
      })}
    </Comp>
  );
}
