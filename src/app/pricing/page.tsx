import { Check, Layers, PiggyBank, Timer } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PricingFounderHero } from "@/components/marketing/PricingFounderHero";
import { PricingPlans } from "@/components/marketing/PricingPlans";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { CountMetric } from "@/components/motion/CountMetric";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { PRICING_COMPARISON, PRICING_FAQS } from "@/lib/marketing";
import { pageMeta } from "@/lib/seo";

/**
 * Pricing — reuses tokens/components from design-system.md
 * Surfaces: hero → paper-2 → paper → ink → paper-2 → paper → ink
 * Motion: HeroEnter + SplitRise (hero); SectionReveal elsewhere
 */

export const metadata = pageMeta(
  "Pricing",
  "Free to start. Pro (best seller) at $19/mo. Founder lifetime $99 — cheaper than ~5 months of billing. Same price worldwide.",
  "/pricing",
);

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-accent" aria-label="Included" />
    ) : (
      <span className="text-muted">—</span>
    );
  }
  return <span className="font-semibold text-ink">{value}</span>;
}

const STACK_REPLACED = [
  ["Loose Docs + Notion", "hours/week"],
  ["Separate payment chase", "lost deposits"],
  ["CRM / pipeline tabs", "~$40/mo"],
  ["Client portal glue", "extra tools"],
] as const;

const BENEFITS = [
  {
    icon: Timer,
    title: "One client HQ",
    body: "Projects, portal link, and payment asks in one place — no demo clutter.",
  },
  {
    icon: PiggyBank,
    title: "Same price worldwide",
    body: "List prices are identical everywhere. Only the currency changes for your country.",
  },
  {
    icon: Layers,
    title: "Your own empty HQ",
    body: "Every new account starts with a clean workspace — no shared demo data.",
  },
] as const;

export default function PricingPage() {
  return (
    <MarketingShell motion>
      {/* 1. Hero — brand-first, no cards */}
      <section className="hero-stage">
        <div className="hero-stage-bg" aria-hidden />
        <div className="hero-stage-grid" aria-hidden />
        <AmbientOrbs variant="blush" className="z-[1]" />

        <div className="relative z-[2] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="max-w-xl">
            <div className="hero-anim hero-accent-rule mb-4" aria-hidden />
            <p className="hero-anim mkt-brand text-ink">PortalKit</p>
            <KineticHeadline
              as="h1"
              mode="words"
              className="mkt-h1 mt-3 text-ink"
              text="Shopify freelancer pricing — not agency software tax."
            />
            <p className="hero-anim mkt-lede mt-4 max-w-lg">
              Free to start with a 14-day Pro trial. Pro is the best seller.
              Founder lifetime is cheaper than staying on monthly billing. Same
              list price worldwide — only currency changes by country.
            </p>
            <div className="hero-anim mt-8 flex flex-wrap items-center gap-3">
              <MagneticLink href="/sign-up" className="btn btn-primary px-6">
                Start free trial
              </MagneticLink>
              <MagneticLink href="#compare" className="btn btn-secondary">
                Compare features
              </MagneticLink>
            </div>
            <p className="hero-anim mkt-meta mt-4">
              Cancel anytime · Razorpay · same USD list price worldwide
            </p>
          </div>

          <PricingFounderHero />
        </div>
      </section>

      {/* 2. Plans — paper-2 */}
      <section className="reveal-section mkt-section bg-paper-2">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mkt-eyebrow reveal-item">Plans</p>
            <SplitHeadline
              as="h2"
              scroll
              className="mkt-h2 mt-3"
              text="Pick the seat that matches your pipeline."
            />
            <p className="reveal-item mkt-lede mx-auto mt-4 max-w-lg">
              Start free. Upgrade when flows and AI earn their keep. Yearly Pro
              saves 16%.
            </p>
          </div>
          <div className="reveal-item mt-12">
            <PricingPlans />
          </div>
        </div>
      </section>

      {/* 3. Benefits — paper */}
      <section className="reveal-section mkt-section border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 md:gap-10">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="reveal-item">
              <div className="flex h-10 w-10 items-center justify-center rounded-[calc(var(--radius)-4px)] bg-accent-soft">
                <Icon className="h-5 w-5 text-accent" aria-hidden />
              </div>
              <h3 className="mkt-h3 mt-4">{title}</h3>
              <p className="mkt-body mt-2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Stack replacement — ink */}
      <section className="reveal-section mkt-section bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SplitHeadline
              as="h2"
              scroll
              className="mkt-h2"
              text="One workspace. Fewer subscriptions."
            />
            <p className="reveal-item mkt-lede mkt-lede-invert mt-4 max-w-md">
              Freelancers often stack forms, e-sign, invoicing, and CRM. PortalKit
              collapses that into Pro.
            </p>
            <div className="reveal-item mt-8">
              <CountMetric
                flat
                value={1.8}
                prefix="~$"
                suffix="k+/yr"
                decimals={1}
                label="Stack savings"
                hint="Potential tool-stack savings vs a typical four-app setup"
                bar={0.88}
                className="[&_.mkt-metric]:text-white [&_.mkt-eyebrow]:!text-white/55 [&_.mkt-meta]:text-white/55 [&_.bg-line\/80]:bg-white/15"
              />
            </div>
          </div>
          <div className="space-y-0 divide-y divide-white/10 border-y border-white/10">
            {STACK_REPLACED.map(([name, cost], i) => (
              <div
                key={name}
                className="reveal-item flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="mkt-chip w-6 text-white/40">{i + 1}</span>
                  <span className="mkt-row text-white">{name}</span>
                </div>
                <span className="mkt-meta text-white/45 line-through">{cost}</span>
              </div>
            ))}
            <div className="reveal-item flex items-center justify-between gap-4 py-4">
              <span className="mkt-row text-white">PortalKit Pro</span>
              <span className="mkt-meta text-accent">from $16/mo</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Compare — paper-2 */}
      <section
        id="compare"
        className="reveal-section mkt-section scroll-mt-24 bg-paper-2"
      >
        <div className="mx-auto max-w-6xl">
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 text-center"
            text="Compare features side by side"
          />
          <p className="reveal-item mkt-lede mx-auto mt-4 max-w-xl text-center">
            Starter for first clients. Pro when volume hits. Founder for lifetime
            lock-in.
          </p>
          <div className="reveal-item mt-12 overflow-x-auto rounded-[var(--radius)] border border-line bg-paper shadow-[var(--shadow)]">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  <th className="mkt-meta px-5 py-4 text-ink">Feature</th>
                  <th className="mkt-meta px-5 py-4 text-center text-ink">
                    Starter
                  </th>
                  <th className="mkt-meta px-5 py-4 text-center text-ink">Pro</th>
                  <th className="mkt-meta px-5 py-4 text-center text-ink">
                    Founder
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_COMPARISON.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-line last:border-0"
                  >
                    <td className="mkt-body px-5 py-3.5 text-ink-2">
                      {row.feature}
                    </td>
                    <td className="px-5 py-3.5 text-center text-muted">
                      <Cell value={row.starter} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-muted">
                      <Cell value={row.pro} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-muted">
                      <Cell value={row.founder} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. FAQ — paper */}
      <section className="reveal-section mkt-section border-y border-line bg-paper">
        <div className="mx-auto max-w-3xl">
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 text-center"
            text="Straight answers on cost"
          />
          <p className="reveal-item mkt-lede mx-auto mt-4 text-center">
            Trials, yearly billing, and what is included — no fine print theater.
          </p>
          <div className="reveal-item mt-12">
            <FaqAccordion items={PRICING_FAQS} />
          </div>
        </div>
      </section>

      {/* 7. Final CTA — ink */}
      <section className="final-cta cta-stage mkt-section text-center text-white">
        <div className="relative mx-auto max-w-2xl">
          <div className="hero-accent-rule mx-auto mb-6" aria-hidden />
          <p className="mkt-brand-sm">PortalKit</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2-sm mt-4"
            text="Start free — upgrade when the pipeline needs it"
          />
          <MagneticLink href="/sign-up" className="btn btn-primary mt-8 px-8">
            Get started for free
          </MagneticLink>
        </div>
      </section>
    </MarketingShell>
  );
}
