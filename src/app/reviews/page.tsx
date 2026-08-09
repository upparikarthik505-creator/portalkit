import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { TestimonialsMasonry } from "@/components/marketing/TestimonialsMasonry";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { pageMeta } from "@/lib/seo";

/**
 * Reviews — reuses tokens/components from design-system.md
 * Surfaces: hero → paper-2 → paper → paper-2 → paper → ink
 * Motion: HeroEnter + SplitRise (hero); SectionReveal elsewhere
 */

export const metadata = pageMeta(
  "Reviews",
  "What Shopify freelancers say about PortalKit — pipeline, portals, and getting paid.",
  "/reviews",
);

const FEATURED = {
  quote:
    "I used to send a Doc, an e-sign link, and a Razorpay invoice. Now merchants accept the offer pack in one portal — and I’m booked before kickoff week.",
  name: "Priya N.",
  role: "Shopify theme freelancer · Bangalore",
};

const VERTICALS = [
  ["Shopify freelancers", "/business-type/shopify-freelancers"],
  ["Web designers", "/business-type/web-designers"],
  ["Agencies", "/business-type/marketing-agencies"],
  ["Consultants", "/business-type/consultants"],
  ["Coaches", "/business-type/coaches"],
  ["Photographers", "/business-type/photographers"],
] as const;

export default function ReviewsPage() {
  return (
    <MarketingShell motion>
      {/* 1. Hero — brand-first, no cards */}
      <section className="hero-stage">
        <div className="hero-stage-bg" aria-hidden />
        <div className="hero-stage-grid" aria-hidden />
        <AmbientOrbs variant="blush" className="z-[1]" />

        <div className="relative z-[2] mx-auto w-full max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <div className="hero-anim hero-accent-rule mx-auto mb-4" aria-hidden />
            <p className="hero-anim mkt-brand text-ink">PortalKit</p>
            <KineticHeadline
              as="h1"
              mode="words"
              className="mkt-h1 mt-3 text-ink"
              text="Merchants book. Freelancers stay sane."
            />
            <p className="hero-anim mkt-lede mx-auto mt-4 max-w-lg">
              What early founders say about pipeline, portals, and getting paid —
              without the spreadsheet scramble.
            </p>
            <div className="hero-anim mt-8 flex flex-wrap items-center justify-center gap-3">
              <MagneticLink href="/sign-up" className="btn btn-primary px-6">
                Start free
              </MagneticLink>
              <MagneticLink href="/why" className="btn btn-secondary">
                Why PortalKit
              </MagneticLink>
            </div>
            <p className="hero-anim mkt-meta mt-4">
              4.9 avg · Founder cohort · Shopify freelancers
            </p>
          </div>
        </div>
      </section>

      {/* 2. Featured quote — open editorial plane */}
      <section className="reveal-section mkt-section border-y border-line bg-paper-2">
        <div className="mx-auto max-w-3xl">
          <p className="mkt-eyebrow reveal-item">Featured</p>
          <blockquote className="reveal-item mt-6">
            <p className="mkt-feature text-ink">“{FEATURED.quote}”</p>
            <footer className="mt-6">
              <p className="mkt-row">{FEATURED.name}</p>
              <p className="mkt-meta mt-1">{FEATURED.role}</p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 3. Voices intro */}
      <section className="reveal-section mkt-section bg-paper">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mkt-eyebrow reveal-item">Social proof</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Voices from freelancers shipping client work"
          />
          <p className="reveal-item mkt-lede mx-auto mt-4">
            Early members on Shopify theme, design, and retainer work — pipeline,
            portals, and getting paid.
          </p>
        </div>
      </section>

      {/* 4. Quote stack */}
      <TestimonialsMasonry hideHeader />

      {/* 5. Verticals — links, not pill cluster */}
      <section className="reveal-section mkt-section border-t border-line bg-paper">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mkt-eyebrow reveal-item">Studios</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Trusted across service verticals"
          />
          <ul className="reveal-item mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {VERTICALS.map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="mkt-link inline-flex items-center gap-1"
                >
                  {label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="final-cta cta-stage mkt-section text-center text-white">
        <div className="relative mx-auto max-w-2xl">
          <div className="hero-accent-rule mx-auto mb-6" aria-hidden />
          <p className="mkt-brand-sm">PortalKit</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2-sm mt-4"
            text="Join freelancers moving off spreadsheet chaos"
          />
          <p className="mkt-lede mkt-lede-invert mx-auto mt-5 max-w-lg">
            Start free. Upgrade to Pro when you need unlimited active projects.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticLink href="/sign-up" className="btn btn-primary px-8">
              Get started for free
            </MagneticLink>
            <MagneticLink href="/why" className="btn btn-secondary">
              Why PortalKit
            </MagneticLink>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
