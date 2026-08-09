"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HoverTiltCard } from "@/components/motion/HoverTiltCard";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { BUSINESS_TYPES } from "@/lib/marketing";

const COVERS = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
];

export function IndustryCarousel() {
  const scroller = useRef<HTMLDivElement>(null);

  function scroll(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: "smooth" });
  }

  return (
    <section className="reveal-section px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SplitHeadline
              as="h2"
              scroll
              className="display text-[36px] md:text-[44px]"
              text="Built for anyone with clients"
            />
            <p className="reveal-item mt-3 max-w-2xl text-[16px] text-muted">
              From Shopify freelancers to agencies — deliver a seamless client experience.
            </p>
          </div>
          <div className="reveal-item flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scroll(-1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white hover:bg-paper"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scroll(1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white hover:bg-paper"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="hover-tilt-scene reveal-item mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {BUSINESS_TYPES.map((biz, i) => (
            <HoverTiltCard
              key={biz.slug}
              intensity={0.9}
              className="w-[min(320px,85vw)] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-paper text-left"
            >
              <Link href={`/business-type/${biz.slug}`} className="group block">
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={COVERS[i % COVERS.length]}
                    alt={biz.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-[17px] font-extrabold">{biz.title}</h3>
                  <p className="mt-1 text-[14px] text-muted">{biz.blurb}</p>
                </div>
              </Link>
            </HoverTiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
