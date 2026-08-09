import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingMotion } from "@/components/LandingMotion";
import { AiSlider } from "@/components/marketing/AiSlider";
import { GalleriesPromo } from "@/components/marketing/GalleriesPromo";
import { HomePlansTeaser } from "@/components/marketing/HomePlansTeaser";
import { JourneyScroll } from "@/components/marketing/JourneyScroll";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ProductDemo } from "@/components/marketing/ProductDemo";
import { TestimonialsMasonry } from "@/components/marketing/TestimonialsMasonry";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { CountMetric } from "@/components/motion/CountMetric";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { pageMeta } from "@/lib/seo";

/**
 * Home — reuses tokens/components from design-system.md
 * Tension vs design-system §1 surface rules: user direction expands ink/charcoal
 * mid-page bands (not only final CTA) and keeps coral accent-only for authority.
 * Surfaces: hero → paper-2 → ink → paper-2 → ink → paper-2 → paper → paper-2 → ink
 * Motion: HeroEnter + SplitRise (hero); SectionReveal elsewhere
 */

export const metadata = pageMeta(
  "Client HQ for Shopify freelancers",
  "PortalKit is the freelancer OS for theme rebuilds, launches, and retainers — deals, delivery, and deposits in one workspace.",
  "/",
);

const BEATS = [
  [
    "01",
    "Catch the brief",
    "Intake forms drop onto your deal board with store URL, budget, and timeline.",
    "/product/lead-forms",
  ],
  [
    "02",
    "Send one offer pack",
    "Scope, agreement, and deposit in a single client-facing document.",
    "/product/proposals",
  ],
  [
    "03",
    "Deliver in the portal",
    "Files, tasks, and invoices live where merchants already look.",
    "/product/client-portal",
  ],
] as const;

export default function HomePage() {
  return (
    <MarketingShell>
      <LandingMotion>
        {/* 1. Hero — brand-first, one visual plane */}
        <section className="hero-stage">
          <div className="hero-stage-bg" aria-hidden />
          <div className="hero-stage-grid" aria-hidden />
          <AmbientOrbs variant="blush" className="z-[1]" />

          <div className="relative z-[2] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-5 px-5 md:grid-cols-2 md:gap-8 lg:gap-10">
            <div className="min-w-0 max-w-xl">
              <div className="hero-anim hero-accent-rule mb-3 md:mb-4" aria-hidden />
              <p className="hero-anim mkt-brand text-ink">PortalKit</p>
              <KineticHeadline
                as="h1"
                mode="words"
                className="mkt-h1 mt-2 text-ink md:mt-3"
                text="Client HQ for Shopify freelancers."
              />
              <p className="hero-anim mkt-lede mt-3 max-w-md md:mt-4">
                Deals, delivery, and deposits for theme rebuilds and launches —
                without the Notion + Docs + Razorpay scramble.
              </p>
              <div className="hero-anim mt-5 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                <MagneticLink
                  href="/sign-up"
                  className="btn btn-primary w-full px-6 sm:w-auto"
                >
                  Start free
                </MagneticLink>
                <MagneticLink
                  href="/dashboard"
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Open demo workspace
                </MagneticLink>
              </div>
              <p className="hero-anim mkt-meta mt-3 md:mt-4">
                No card · Razorpay worldwide · same USD list price everywhere
              </p>
            </div>

            <div className="hero-preview hero-stage-visual min-w-0 w-full">
              <div className="hero-stage-glow" aria-hidden />
              <div className="hero-stage-frame">
                <div className="hero-stage-float">
                  <ProductDemo embedded />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Proof — open strip on paper-2 */}
        <section className="reveal-section border-y border-line bg-paper-2 px-5 py-16 md:py-[5.5rem]">
          <div className="proof-strip mx-auto max-w-6xl">
            <div className="proof-cell reveal-item">
              <CountMetric
                flat
                value={20}
                suffix=" hrs"
                label="Time back"
                hint="Less chasing files and invoices"
                bar={0.82}
              />
            </div>
            <div className="proof-cell reveal-item">
              <CountMetric
                flat
                value={1}
                suffix=" portal"
                label="Client path"
                hint="Offer pack → signature → deposit"
                bar={0.55}
              />
            </div>
            <div className="proof-cell reveal-item">
              <CountMetric
                flat
                value={19}
                prefix="$"
                label="Pro entry"
                hint="Priced for freelancers, not agencies"
                bar={0.4}
              />
            </div>
          </div>
        </section>

        {/* 3. Journey — ink mid-page band */}
        <JourneyScroll />

        {/* 4. AI — paper-2 */}
        <AiSlider />

        {/* 5. How it flows — ink mid-page band */}
        <section className="reveal-section mkt-section bg-ink text-white">
          <div className="mx-auto max-w-6xl">
            <p className="mkt-eyebrow reveal-item text-accent">How it flows</p>
            <SplitHeadline
              as="h2"
              scroll
              className="mkt-h2 mt-3 max-w-2xl"
              text="From first inquiry to live theme — one workspace."
            />
            <div className="beat-rail beat-rail-dark reveal-item mt-12">
              {BEATS.map(([n, title, body, href], i) => (
                <div key={title} className="beat-cell beat-cell-dark group">
                  <div className="beat-progress" aria-hidden>
                    <span className="beat-progress-dot" />
                    {i < BEATS.length - 1 ? (
                      <span className="beat-progress-line" />
                    ) : null}
                  </div>
                  <p className="mkt-feature text-accent/70 transition-[color,transform] duration-[var(--motion-micro)] group-hover:translate-x-0.5 group-hover:text-accent">
                    {n}
                  </p>
                  <h3 className="mkt-h3 mt-4 text-white">{title}</h3>
                  <p className="mkt-body mt-2 max-w-sm text-white/65">{body}</p>
                  <Link
                    href={href}
                    className="mkt-link mt-6 inline-flex items-center gap-1 text-accent"
                  >
                    Explore{" "}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-[var(--motion-micro)] ease-out group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Social proof — paper-2 */}
        <TestimonialsMasonry />

        {/* 7. Pricing — paper */}
        <section className="reveal-section mkt-section border-y border-line bg-paper">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-12">
            <div>
              <p className="mkt-eyebrow reveal-item">Pricing</p>
              <SplitHeadline
                as="h2"
                scroll
                className="mkt-h2 mt-3"
                text="Priced like a freelancer tool."
              />
              <p className="reveal-item mkt-lede mt-4 max-w-md">
                Start free. Upgrade when flows and AI earn their keep. Yearly Pro
                saves 16%.
              </p>
              <MagneticLink
                href="/pricing"
                className="reveal-item btn btn-primary mt-8"
              >
                See full pricing
              </MagneticLink>
            </div>
            <HomePlansTeaser />
          </div>
        </section>

        {/* 8. Portal promo — paper-2 */}
        <GalleriesPromo />

        {/* 9. Final CTA — ink */}
        <section className="final-cta cta-stage mkt-section text-center text-white">
          <div className="relative mx-auto max-w-2xl">
            <div className="hero-accent-rule mx-auto mb-6" aria-hidden />
            <p className="mkt-brand-sm">PortalKit</p>
            <SplitHeadline
              as="h2"
              scroll
              className="mkt-h2-sm mt-4"
              text="Ship more themes. Chase less admin."
            />
            <p className="mkt-lede mkt-lede-invert mx-auto mt-5 max-w-lg">
              Your deal board, offer packs, and client portal — ready before the
              next inquiry hits your inbox.
            </p>
            <MagneticLink href="/sign-up" className="btn btn-primary mt-8 px-8">
              Start free
            </MagneticLink>
          </div>
        </section>
      </LandingMotion>
    </MarketingShell>
  );
}
