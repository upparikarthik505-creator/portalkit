import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CreditCard, FolderKanban, FormInput } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { BUSINESS_TYPES, PRODUCT_LINKS } from "@/lib/marketing";
import { pageMeta } from "@/lib/seo";

/**
 * Studio / business-type — reuses tokens/components from design-system.md
 * Surfaces: hero → paper-2 → paper → ink → paper-2 → paper → paper-2 → ink
 * Motion: HeroEnter + SplitRise (hero); SectionReveal elsewhere
 */

const PILLAR_META = [
  { key: "capture" as const, icon: FormInput },
  { key: "paid" as const, icon: CreditCard },
  { key: "manage" as const, icon: FolderKanban },
];

function toolHref(label: string) {
  const match = PRODUCT_LINKS.find(
    (p) => p.title.toLowerCase() === label.toLowerCase(),
  );
  if (match) return `/product/${match.slug}`;
  const aliases: Record<string, string> = {
    Questionnaires: "/templates",
    "Services guides": "/templates",
    "Lead forms": "/product/lead-forms",
    "Client portal": "/product/client-portal",
  };
  return aliases[label] ?? "/templates";
}

export function generateStaticParams() {
  return BUSINESS_TYPES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const biz = BUSINESS_TYPES.find((b) => b.slug === slug);
  if (!biz) return pageMeta("Business type", "PortalKit for service businesses.");
  return pageMeta(biz.title, biz.blurb, `/business-type/${biz.slug}`);
}

export default async function BusinessTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const biz = BUSINESS_TYPES.find((b) => b.slug === slug);
  if (!biz) notFound();

  const relatedProducts = PRODUCT_LINKS.filter((p) =>
    ["crm", "proposals", "client-portal", "automations"].includes(p.slug),
  );

  const otherVerticals = BUSINESS_TYPES.filter((b) => b.slug !== slug);

  return (
    <MarketingShell motion>
      {/* 1. Hero — brand-first, no cards / orbit badges */}
      <section className="hero-stage">
        <div className="hero-stage-bg" aria-hidden />
        <div className="hero-stage-grid" aria-hidden />
        <AmbientOrbs variant="blush" className="z-[1]" />

        <div className="relative z-[2] mx-auto w-full max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <div className="hero-anim hero-accent-rule mx-auto mb-4" aria-hidden />
            <p className="hero-anim mkt-brand text-ink">PortalKit</p>
            <p className="hero-anim mkt-eyebrow mt-3">Studio · {biz.title}</p>
            <KineticHeadline
              as="h1"
              mode="words"
              className="mkt-h1 mt-3 text-ink"
              text={biz.hero}
            />
            <p className="hero-anim mkt-lede mx-auto mt-4 max-w-xl">
              <span className="font-semibold text-ink">{biz.proof}</span>{" "}
              {biz.blurb}
            </p>
            <div className="hero-anim mt-8 flex flex-wrap items-center justify-center gap-3">
              <MagneticLink href="/sign-up" className="btn btn-primary px-6">
                Get started for free
              </MagneticLink>
              <MagneticLink href="/templates" className="btn btn-secondary">
                Browse {biz.title.toLowerCase()} kits
              </MagneticLink>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Proof */}
      <section className="reveal-section border-y border-line bg-paper-2 px-5 py-16 md:py-[5.5rem]">
        <div className="proof-strip mx-auto max-w-6xl">
          {biz.stats.map((stat) => (
            <div key={stat.label} className="proof-cell reveal-item">
              <p className="mkt-metric text-accent">{stat.value}</p>
              <p className="mkt-meta mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pillars — open beats */}
      <section className="reveal-section mkt-section bg-paper">
        <div className="mx-auto max-w-6xl">
          <p className="mkt-eyebrow reveal-item text-center">How it works</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3 text-center"
            text={`Built for how ${biz.title} actually work`}
          />
          <p className="reveal-item mkt-lede mx-auto mt-4 max-w-xl text-center">
            Capture leads, get paid, and manage delivery — without juggling five
            tools.
          </p>
          <div className="beat-rail reveal-item mt-12">
            {PILLAR_META.map(({ key, icon: Icon }) => {
              const pillar = biz.pillars[key];
              return (
                <div key={key} className="beat-cell">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[calc(var(--radius)-4px)] bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mkt-h3 mt-4">{pillar.title}</h3>
                  <p className="mkt-body mt-2 max-w-sm">{pillar.body}</p>
                  <ul className="mt-6 space-y-2">
                    {pillar.chips.map((chip) => (
                      <li key={chip}>
                        <Link
                          href={toolHref(chip)}
                          className="mkt-link inline-flex items-center gap-1"
                        >
                          {chip}{" "}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Journey — ink, open rows */}
      <section className="reveal-section mkt-section bg-ink text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mkt-eyebrow reveal-item text-center text-accent">Journey</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3 text-center"
            text="From first inquiry to finished work"
          />
          <p className="reveal-item mkt-lede mkt-lede-invert mx-auto mt-4 max-w-xl text-center">
            A clear path so nothing stalls between hello and handoff.
          </p>
          <div className="reveal-item mt-12 grid gap-0 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {biz.journey.map((stage, i) => (
              <div key={stage.title} className="px-0 py-6 sm:px-5 sm:py-2">
                <p className="mkt-feature text-accent/80">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mkt-h3 mt-3 text-white">{stage.title}</h3>
                <p className="mkt-body mt-2 text-white/65">{stage.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Related products */}
      <section className="reveal-section mkt-section bg-paper-2">
        <div className="mx-auto max-w-6xl">
          <p className="mkt-eyebrow reveal-item text-center">Toolkit</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3 text-center"
            text={`Product that powers ${biz.title}`}
          />
          <div className="reveal-item mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                className="group rounded-[var(--radius)] border border-line bg-paper p-5 shadow-[var(--shadow)] transition-[border-color] duration-[var(--motion-ui)] ease-out hover:border-accent/35"
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

      {/* 6. FAQ */}
      <section className="reveal-section mkt-section border-y border-line bg-paper">
        <div className="mx-auto max-w-3xl">
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 text-center"
            text={`${biz.title} FAQ`}
          />
          <div className="reveal-item mt-12">
            <FaqAccordion items={biz.faqs} />
          </div>
        </div>
      </section>

      {/* 7. Other verticals */}
      <section className="reveal-section mkt-section bg-paper-2">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mkt-eyebrow reveal-item">Studios</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Other verticals"
          />
          <ul className="reveal-item mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {otherVerticals.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/business-type/${v.slug}`}
                  className="mkt-link inline-flex items-center gap-1"
                >
                  {v.title} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
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
            text={`PortalKit for ${biz.title} — start free today`}
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
