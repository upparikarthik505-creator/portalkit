import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { SplitStage } from "@/components/motion/SplitStage";
import { PRODUCT_LINKS, COMING_SOON_PRODUCT_SLUGS } from "@/lib/marketing";
import { pageMeta } from "@/lib/seo";

/**
 * Product tool pages — reuses tokens/components from design-system.md
 * Surfaces: hero → paper-2 → paper → paper-2 → paper → paper-2 → ink
 * Motion: HeroEnter + SplitRise (hero); SectionReveal elsewhere
 */

export function generateStaticParams() {
  return PRODUCT_LINKS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCT_LINKS.find((p) => p.slug === slug);
  if (!product) return pageMeta("Product", "PortalKit product features.");
  return pageMeta(product.title, product.subhead, `/product/${product.slug}`);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCT_LINKS.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = PRODUCT_LINKS.filter((p) => p.slug !== slug).slice(0, 4);
  const otherTools = PRODUCT_LINKS.filter((p) => p.slug !== slug);
  const soon = COMING_SOON_PRODUCT_SLUGS.has(product.slug);

  return (
    <MarketingShell motion>
      {/* 1. Hero — brand-first + product frame */}
      <section className="hero-stage">
        <div className="hero-stage-bg" aria-hidden />
        <div className="hero-stage-grid" aria-hidden />
        <AmbientOrbs variant="blush" className="z-[1]" />

        <div className="relative z-[2] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="max-w-xl">
            <div className="hero-anim hero-accent-rule mb-4" aria-hidden />
            <p className="hero-anim mkt-brand text-ink">PortalKit</p>
            <p className="hero-anim mkt-eyebrow mt-3">
              Tool · {product.title}
              {soon ? " · Coming soon" : ""}
            </p>
            <KineticHeadline
              as="h1"
              mode="words"
              className="mkt-h1 mt-3 text-ink"
              text={product.headline}
            />
            <p className="hero-anim mkt-lede mt-4 max-w-lg">{product.subhead}</p>
            {soon ? (
              <p className="hero-anim mkt-meta mt-3 rounded-[var(--radius)] border border-line bg-paper px-3 py-2 text-ink-2">
                Not live yet — start free for projects, portal, and payment asks
                today. This tool ships after the booking loop.
              </p>
            ) : null}
            <div className="hero-anim mt-8 flex flex-wrap items-center gap-3">
              <MagneticLink href="/sign-up" className="btn btn-primary px-6">
                {soon ? "Start free workspace" : `Try ${product.title} free`}
              </MagneticLink>
              <MagneticLink href="/dashboard" className="btn btn-secondary">
                Open workspace
              </MagneticLink>
            </div>
            <p className="hero-anim mkt-meta mt-4">No credit card required</p>
          </div>

          <div className="hero-preview min-w-0">
            <SplitStage labelLeft="Draft" labelRight="Live">
              <div className="p-5">
                <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-warn" aria-hidden />
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-success"
                    aria-hidden
                  />
                  <span className="mkt-meta ml-2">
                    PortalKit · {product.title}
                  </span>
                </div>
                <div className="space-y-3">
                  {product.journey.slice(0, 3).map((stage, i) => (
                    <div
                      key={stage.title}
                      className="rounded-[calc(var(--radius)-4px)] border border-line bg-paper px-4 py-3"
                    >
                      <p className="mkt-label text-accent">Step {i + 1}</p>
                      <p className="mkt-row mt-1">{stage.title}</p>
                      <p className="mkt-body mt-1 line-clamp-2">{stage.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SplitStage>
          </div>
        </div>
      </section>

      {/* 2. Proof strip */}
      <section className="reveal-section border-y border-line bg-paper-2 px-5 py-16 md:py-[5.5rem]">
        <div className="proof-strip mx-auto max-w-6xl">
          {product.stats.map((stat) => (
            <div key={stat.label} className="proof-cell reveal-item">
              <p className="mkt-metric text-accent">{stat.value}</p>
              <p className="mkt-meta mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Other tools — links, not pill strip */}
      <section className="reveal-section mkt-section bg-paper">
        <div className="mx-auto max-w-6xl">
          <p className="mkt-eyebrow reveal-item">Toolkit</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Pair with the rest of PortalKit"
          />
          <ul className="reveal-item mt-8 flex flex-wrap gap-x-5 gap-y-3">
            {otherTools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/product/${tool.slug}`}
                  className={`mkt-link inline-flex items-center gap-1 ${
                    tool.slug === slug ? "underline underline-offset-2" : ""
                  }`}
                >
                  {tool.title}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Journey */}
      <section className="reveal-section mkt-section border-y border-line bg-paper-2">
        <div className="mx-auto max-w-3xl">
          <p className="mkt-eyebrow reveal-item text-center">Journey</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3 text-center"
            text={`How ${product.title} fits the journey`}
          />
          <p className="reveal-item mkt-lede mx-auto mt-4 max-w-xl text-center">
            From first touch to finished work — attached to the same client file.
          </p>
          <ol className="relative mt-12 space-y-0 border-l-2 border-accent/25 pl-8">
            {product.journey.map((stage, i) => (
              <li
                key={stage.title}
                className="reveal-item relative pb-10 last:pb-0"
              >
                <span className="mkt-chip absolute -left-[2.55rem] flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent bg-paper-2 text-accent">
                  {i + 1}
                </span>
                <h3 className="mkt-h3">{stage.title}</h3>
                <p className="mkt-body mt-2">{stage.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Shopify focus */}
      <section className="reveal-section mkt-section bg-paper">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mkt-eyebrow reveal-item">Built for the work</p>
            <SplitHeadline
              as="h2"
              scroll
              className="mkt-h2 mt-3"
              text="Built for Shopify freelancers"
            />
            <p className="reveal-item mkt-lede mt-4 max-w-lg">
              {product.blurb} Keep proposals, portals, and payments attached to
              the same client — not scattered across tabs.
            </p>
            <div className="reveal-item mt-8 flex flex-wrap gap-3">
              <MagneticLink href="/sign-up" className="btn btn-primary">
                Try {product.title} free
              </MagneticLink>
              <MagneticLink href="/templates" className="btn btn-secondary">
                Browse templates
              </MagneticLink>
            </div>
          </div>
          <div className="reveal-item divide-y divide-line border-y border-line">
            {product.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-baseline justify-between gap-3 py-4"
              >
                <span className="mkt-meta">{stat.label}</span>
                <span className="mkt-row text-ink">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="reveal-section mkt-section border-y border-line bg-paper-2">
        <div className="mx-auto max-w-3xl">
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 text-center"
            text={`${product.title} FAQ`}
          />
          <div className="reveal-item mt-12">
            <FaqAccordion items={product.faqs} />
          </div>
        </div>
      </section>

      {/* 7. Related tools */}
      <section className="reveal-section mkt-section bg-paper">
        <div className="mx-auto max-w-6xl">
          <p className="mkt-eyebrow reveal-item text-center">Keep exploring</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3 text-center"
            text="More of the toolkit"
          />
          <div className="reveal-item mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                className="group rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)] transition-[border-color] duration-[var(--motion-ui)] ease-out hover:border-accent/35"
              >
                <p className="mkt-row">{item.title}</p>
                <p className="mkt-body mt-1 line-clamp-2">{item.blurb}</p>
                <span className="mkt-link mt-3 inline-flex items-center gap-1">
                  View <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="final-cta cta-stage mkt-section text-center text-white">
        <div className="relative mx-auto max-w-2xl">
          <div className="hero-accent-rule mx-auto mb-6" aria-hidden />
          <p className="mkt-brand-sm">PortalKit</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2-sm mt-4"
            text={`Try ${product.title} in PortalKit`}
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
