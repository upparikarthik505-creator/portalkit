"use client";

import Link from "next/link";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import {
  StackReveal,
  StackRevealItem,
} from "@/components/motion/StackReveal";

const QUOTES = [
  {
    quote:
      "PortalKit replaced my Notion + Razorpay + Google Drive scramble. Clients finally know where everything lives.",
    name: "Nina L.",
    role: "Shopify freelancer",
  },
  {
    quote:
      "I send a proposal with deposit in one link. Half my kickoffs used to die in email — not anymore.",
    name: "Jordan K.",
    role: "Theme developer",
  },
  {
    quote:
      "The portal is what sells retainers. Clients see files, invoices, and status without pinging me.",
    name: "Priya S.",
    role: "Ecommerce designer",
  },
  {
    quote:
      "Went from messy DMs to a real pipeline in an afternoon. Booked two stores the first week.",
    name: "Alex M.",
    role: "Freelance CRO",
  },
] as const;

export function TestimonialsMasonry({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  return (
    <section className="reveal-section mkt-section border-y border-line bg-paper-2">
      <div className="mx-auto max-w-3xl">
        {hideHeader ? null : (
          <div className="text-center">
            <p className="mkt-eyebrow reveal-item">Social proof</p>
            <SplitHeadline
              as="h2"
              scroll
              className="mkt-h2 mt-3"
              text="Trusted by freelancers who bill like agencies"
            />
            <p className="mkt-lede reveal-item mx-auto mt-4 max-w-xl">
              Built for Shopify freelancers and service businesses shipping client
              work weekly.
            </p>
            <div className="reveal-item mt-5 flex flex-wrap items-center justify-center gap-3">
              <span className="mkt-chip rounded-full border border-line bg-paper px-3 py-1.5 text-muted">
                4.9 avg rating
              </span>
              <span className="mkt-chip rounded-full border border-line bg-paper px-3 py-1.5 text-muted">
                Early founder cohort
              </span>
              <Link
                href="/reviews"
                className="mkt-chip rounded-full border border-line bg-paper px-3 py-1.5 text-accent"
              >
                Read reviews
              </Link>
            </div>
          </div>
        )}

        <StackReveal className={hideHeader ? "mt-2" : "mt-12"}>
          {QUOTES.map((t) => (
            <StackRevealItem
              key={t.name}
              className="-mt-6 first:mt-0 rounded-[var(--radius)] border border-line bg-paper p-6 shadow-[var(--shadow)]"
            >
              <blockquote>
                <p className="mkt-quote">“{t.quote}”</p>
                <footer className="mt-4">
                  <p className="mkt-row">{t.name}</p>
                  <p className="mkt-meta mt-0.5">{t.role}</p>
                </footer>
              </blockquote>
            </StackRevealItem>
          ))}
        </StackReveal>
      </div>
    </section>
  );
}
