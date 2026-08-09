import Link from "next/link";
import { ArrowRight, FileSignature, FileText, Receipt } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { TemplateGallery } from "@/components/marketing/TemplateGallery";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { INDUSTRY_KITS } from "@/lib/marketing";
import { pageMeta } from "@/lib/seo";

/**
 * Templates / Packs — reuses tokens/components from design-system.md
 * Surfaces: hero → paper-2 → paper → paper-2 → ink
 * Motion: HeroEnter + SplitRise (hero); SectionReveal elsewhere
 */

export const metadata = pageMeta(
  "Templates",
  "Proposal, contract, invoice, and industry kits built for Shopify freelancers and service businesses.",
  "/templates",
);

const FEATURED = [
  {
    title: "Proposals",
    body: "Scoped offers with packages, timelines, and accept-to-pay.",
    href: "/product/proposals",
    icon: FileText,
    preview: [
      "Theme rebuild — Standard",
      "Launch + training add-on",
      "Deposit due on accept",
    ],
  },
  {
    title: "Contracts",
    body: "E-sign agreements with deposit terms before kickoff.",
    href: "/product/contracts",
    icon: FileSignature,
    preview: ["Scope & revisions", "Payment schedule", "IP & handoff"],
  },
  {
    title: "Invoices",
    body: "Deposits, milestones, and retainers paid on the spot.",
    href: "/product/invoices",
    icon: Receipt,
    preview: ["50% deposit", "Milestone 2 — QA", "Retainer — Month 1"],
  },
] as const;

export default function TemplatesPage() {
  return (
    <MarketingShell motion>
      {/* 1. Hero — brand-first, no cards */}
      <section className="hero-stage">
        <div className="hero-stage-bg" aria-hidden />
        <div className="hero-stage-grid" aria-hidden />
        <AmbientOrbs variant="blush" className="z-[1]" />

        <div className="relative z-[2] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-xl">
            <div className="hero-anim hero-accent-rule mb-4" aria-hidden />
            <p className="hero-anim mkt-brand text-ink">PortalKit</p>
            <KineticHeadline
              as="h1"
              mode="words"
              className="mkt-h1 mt-3 text-ink"
              text="Offer packs that book the build before kickoff week."
            />
            <p className="hero-anim mkt-lede mt-4 max-w-md">
              Proposals, agreements, and deposit invoices tuned for Shopify
              freelancers — not wedding planners.
            </p>
            <div className="hero-anim mt-8 flex flex-wrap items-center gap-3">
              <MagneticLink href="/sign-up" className="btn btn-primary px-6">
                Customize a template
              </MagneticLink>
              <MagneticLink href="#gallery" className="btn btn-secondary">
                Browse gallery
              </MagneticLink>
            </div>
            <p className="hero-anim mkt-meta mt-4">
              Duplicate · personalize · send in minutes
            </p>
          </div>

          {/* Dominant visual — open offer-pack plane */}
          <div className="hero-preview hero-anim min-w-0">
            <p className="mkt-label">Sample offer pack</p>
            <p className="mkt-feature mt-3">Lumen Home · Theme rebuild</p>
            <ul className="mt-6 space-y-3 border-t border-line pt-6">
              {FEATURED.map(({ title, preview }) => (
                <li key={title}>
                  <p className="mkt-meta text-ink">{title}</p>
                  <p className="mkt-body mt-1">{preview[0]}</p>
                </li>
              ))}
            </ul>
            <p className="mkt-chip mt-6 text-accent">3 docs · deposit on accept</p>
          </div>
        </div>
      </section>

      {/* 2. Featured three — open beats */}
      <section className="reveal-section mkt-section border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mkt-eyebrow reveal-item">Essentials</p>
              <SplitHeadline
                as="h2"
                scroll
                className="mkt-h2 mt-3"
                text="Close faster with these three"
              />
              <p className="reveal-item mkt-lede mt-4 max-w-lg">
                The files that turn inquiries into funded kickoffs.
              </p>
            </div>
            <MagneticLink
              href="/sign-up"
              className="reveal-item mkt-link inline-flex items-center gap-1"
            >
              Use in workspace <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </MagneticLink>
          </div>
          <div className="beat-rail reveal-item mt-12">
            {FEATURED.map(({ title, body, href, icon: Icon }) => (
              <div key={title} className="beat-cell">
                <div className="flex h-10 w-10 items-center justify-center rounded-[calc(var(--radius)-4px)] bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mkt-h3 mt-4">{title}</h3>
                <p className="mkt-body mt-2 max-w-sm">{body}</p>
                <Link
                  href={href}
                  className="mkt-link mt-6 inline-flex items-center gap-1"
                >
                  Explore <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Gallery */}
      <section id="gallery" className="reveal-section scroll-mt-24 bg-paper">
        <div className="mkt-section mx-auto max-w-6xl !pb-0">
          <p className="mkt-eyebrow reveal-item">Gallery</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Browse packs by type"
          />
          <p className="reveal-item mkt-lede mt-4 max-w-xl">
            Filter and search templates, then drop them into your workspace.
          </p>
        </div>
        <div className="reveal-item">
          <TemplateGallery />
        </div>
      </section>

      {/* 4. Industry kits */}
      <section className="reveal-section mkt-section border-t border-line bg-paper-2">
        <div className="mx-auto max-w-6xl">
          <p className="mkt-eyebrow reveal-item">Vertical kits</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Industry kits, not generic blanks"
          />
          <p className="reveal-item mkt-lede mt-4 max-w-2xl">
            Bundles shaped around how each vertical actually sells and delivers.
          </p>
          <div className="reveal-item mt-12 divide-y divide-line border-y border-line">
            {INDUSTRY_KITS.map((kit, i) => (
              <div
                key={kit.name}
                className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <span className="mkt-feature text-accent/55">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mkt-h3">{kit.name}</h3>
                    <p className="mkt-body mt-1 max-w-xl">{kit.blurb}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-4 sm:pl-12">
                  <MagneticLink
                    href="/sign-up"
                    className="mkt-link inline-flex items-center gap-1"
                  >
                    Use kit <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </MagneticLink>
                  <MagneticLink
                    href={kit.href}
                    className="mkt-meta text-muted transition-colors duration-[var(--motion-micro)] hover:text-ink"
                  >
                    See vertical
                  </MagneticLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="final-cta cta-stage mkt-section text-center text-white">
        <div className="relative mx-auto max-w-2xl">
          <div className="hero-accent-rule mx-auto mb-6" aria-hidden />
          <p className="mkt-brand-sm">PortalKit</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2-sm mt-4"
            text="Duplicate a kit. Send your first offer today."
          />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticLink href="/sign-up" className="btn btn-primary px-8">
              Get started for free
            </MagneticLink>
            <MagneticLink href="/dashboard" className="btn btn-secondary">
              Open demo workspace
            </MagneticLink>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
