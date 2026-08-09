import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, LayoutTemplate, Sparkles } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { RESOURCE_HUB } from "@/lib/marketing";
import { pageMeta } from "@/lib/seo";

/**
 * Resources — reuses tokens/components from design-system.md
 * Surfaces: hero → paper-2 → paper → ink
 * Motion: HeroEnter + SplitRise (hero); SectionReveal elsewhere
 */

export const metadata = pageMeta(
  "Resources",
  "Guides, playbooks, and templates to help freelancers close clients and deliver work in PortalKit.",
  "/resources",
);

const HIGHLIGHTS = [
  {
    title: "Start free",
    body: "Open PortalKit and send your first proposal in minutes.",
    href: "/sign-up",
    icon: Sparkles,
  },
  {
    title: "Template gallery",
    body: "Proposals, contracts, invoices, and industry kits.",
    href: "/templates",
    icon: LayoutTemplate,
  },
  {
    title: "Guides & playbooks",
    body: "Practical help for Shopify freelancers closing and delivering.",
    href: "#guides",
    icon: BookOpen,
  },
] as const;

const TAG_TONE: Record<string, string> = {
  Guide: "bg-accent-soft text-accent-deep",
  Playbook: "bg-warn-soft text-warn",
  Product: "bg-hero text-ink-2",
  Templates: "bg-mint text-mint-ink",
  Pricing: "bg-info-soft text-info",
  Demo: "bg-paper text-ink-2",
  Vertical: "bg-accent-soft text-accent-deep",
};

export default function ResourcesPage() {
  return (
    <MarketingShell motion>
      {/* 1. Hero — brand-first, no cards */}
      <section className="hero-stage">
        <div className="hero-stage-bg" aria-hidden />
        <div className="hero-stage-grid" aria-hidden />
        <AmbientOrbs variant="blush" className="z-[1]" />

        <div className="relative z-[2] mx-auto w-full max-w-6xl px-5">
          <div className="max-w-2xl">
            <div className="hero-anim hero-accent-rule mb-4" aria-hidden />
            <p className="hero-anim mkt-brand text-ink">PortalKit</p>
            <KineticHeadline
              as="h1"
              mode="words"
              className="mkt-h1 mt-3 text-ink"
              text="Playbooks for freelancers who ship stores weekly."
            />
            <p className="hero-anim mkt-lede mt-4 max-w-lg">
              Close, deliver, and get paid on Shopify work — without reinventing
              your ops every Monday.
            </p>
            <div className="hero-anim mt-8 flex flex-wrap items-center gap-3">
              <MagneticLink href="/sign-up" className="btn btn-primary px-6">
                Start free trial
              </MagneticLink>
              <MagneticLink href="#guides" className="btn btn-secondary">
                Jump to guides
              </MagneticLink>
            </div>
            <p className="hero-anim mkt-meta mt-4">
              Guides · templates · product deep-dives
            </p>
          </div>
        </div>
      </section>

      {/* 2. Highlights — open beats */}
      <section className="reveal-section mkt-section border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl">
          <p className="mkt-eyebrow reveal-item">Quick paths</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Three ways in"
          />
          <div className="beat-rail reveal-item mt-12">
            {HIGHLIGHTS.map(({ title, body, href, icon: Icon }) => (
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
                  Go <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Guides hub */}
      <section
        id="guides"
        className="reveal-section mkt-section scroll-mt-24 bg-paper"
      >
        <div className="mx-auto max-w-6xl space-y-16">
          {RESOURCE_HUB.map((group, gi) => (
            <div key={group.group} className="reveal-item">
              <div className="mb-8 grid gap-2 border-b border-line pb-4 md:grid-cols-[auto_1fr_auto] md:items-end">
                <span className="mkt-feature text-accent/55">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <SplitHeadline
                  as="h2"
                  scroll
                  className="mkt-h2-sm"
                  text={group.group}
                />
                <span className="mkt-meta text-muted">
                  {group.items.length} resources
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item) => (
                  <MagneticLink
                    key={item.title}
                    href={item.href}
                    className="group flex items-start justify-between gap-4 rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)] transition-[border-color] duration-[var(--motion-ui)] ease-out hover:border-accent/35"
                  >
                    <div>
                      <span
                        className={`mkt-chip inline-flex rounded-full px-2.5 py-1 ${
                          TAG_TONE[item.tag] ?? "bg-paper text-muted"
                        }`}
                      >
                        {item.tag}
                      </span>
                      <h3 className="mkt-h3 mt-3">{item.title}</h3>
                      <p className="mkt-body mt-1.5">{item.blurb}</p>
                    </div>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-muted transition-colors duration-[var(--motion-micro)] group-hover:text-accent"
                      aria-hidden
                    />
                  </MagneticLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="final-cta cta-stage mkt-section text-center text-white">
        <div className="relative mx-auto max-w-2xl">
          <div className="hero-accent-rule mx-auto mb-6" aria-hidden />
          <p className="mkt-brand-sm">PortalKit</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2-sm mt-4"
            text="Ready when you are — start free, upgrade when you grow"
          />
          <p className="mkt-lede mkt-lede-invert mx-auto mt-5 max-w-lg">
            Create an account to send real files — or explore the demo dashboard
            with sample Shopify projects.
          </p>
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
