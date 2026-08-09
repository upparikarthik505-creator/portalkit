import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AmbientOrbs } from "@/components/motion/AmbientOrbs";
import { CountMetric } from "@/components/motion/CountMetric";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { WipeCompare } from "@/components/motion/WipeCompare";
import { pageMeta } from "@/lib/seo";

/**
 * Why — reuses tokens/components from design-system.md
 * Surfaces: hero → paper-2 → paper → paper-2 → paper → ink
 * Motion: HeroEnter + SplitRise (hero); SectionReveal elsewhere
 */

export const metadata = pageMeta(
  "Why freelancers switch",
  "One workspace for clients, proposals, payments, and portals — built for Shopify freelancers.",
  "/why",
);

const BEFORE = [
  "Inquiry buried in DMs and inbox",
  "Proposal in Docs, contract in another tool",
  "Invoice chase after the work starts",
  "Client asking “where’s the file?” weekly",
];

const AFTER = [
  "Inquiry lands as a project on your deal board",
  "Share one branded portal link with the client",
  "Payment asks + mark paid (portal Razorpay next)",
  "Notes and status in one client HQ",
];

const PILLARS = [
  {
    step: "01",
    title: "Manage clients",
    body: "Projects, pipeline, and contacts in one workspace — not five tabs.",
    products: [
      ["CRM", "/product/crm"],
      ["Pipeline", "/product/pipeline"],
      ["Proposals", "/product/proposals"],
    ],
  },
  {
    step: "02",
    title: "Get paid",
    body: "Payment asks and portal links inside the same client file. Full e-sign + Razorpay collect shipping next.",
    products: [
      ["Invoices", "/product/invoices"],
      ["Payments", "/product/payments"],
      ["Client portal", "/product/client-portal"],
    ],
  },
  {
    step: "03",
    title: "Grow without chaos",
    body: "Templates and a clear roadmap for automations and AI — claimed only when live.",
    products: [
      ["Templates", "/templates"],
      ["Automations", "/product/automations"],
      ["PortalKit AI", "/product/ai"],
    ],
  },
] as const;

export default function WhyPage() {
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
              text="Stop renting five tools for one freelance studio."
            />
            <p className="hero-anim mkt-lede mt-4 max-w-xl">
              Client HQ for theme rebuilds, launches, and retainers — so your
              energy goes to the store, not the stack.
            </p>
            <div className="hero-anim mt-8 flex flex-wrap items-center gap-3">
              <MagneticLink href="/sign-up" className="btn btn-primary px-6">
                Start free trial
              </MagneticLink>
              <MagneticLink href="/reviews" className="btn btn-secondary">
                Read reviews
              </MagneticLink>
            </div>
            <p className="hero-anim mkt-meta mt-4">
              No card · Built for Shopify freelancers
            </p>
          </div>
        </div>
      </section>

      {/* 2. Proof — open strip */}
      <section className="reveal-section border-y border-line bg-paper-2 px-5 py-16 md:py-[5.5rem]">
        <div className="proof-strip mx-auto max-w-6xl">
          <div className="proof-cell reveal-item">
            <CountMetric
              flat
              value={20}
              suffix=" hrs"
              label="Time back"
              hint="Saved weekly on admin"
              bar={0.8}
            />
          </div>
          <div className="proof-cell reveal-item">
            <CountMetric
              flat
              value={1}
              suffix=" link"
              label="Client path"
              hint="Project → portal → payment ask"
              bar={0.5}
            />
          </div>
          <div className="proof-cell reveal-item">
            <CountMetric
              flat
              value={0}
              prefix="$"
              label="To start"
              hint="Starter plan forever free"
              bar={0.15}
            />
          </div>
        </div>
      </section>

      {/* 3. Before / After */}
      <section className="reveal-section mkt-section bg-paper">
        <div className="mx-auto max-w-4xl">
          <p className="mkt-eyebrow reveal-item">The switch</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3 max-w-2xl"
            text="Same clients. Far less tab chaos."
          />
          <p className="reveal-item mkt-lede mt-4 max-w-xl">
            Drag the curtain — before is the stack scramble; after is one client
            HQ.
          </p>
          <div className="reveal-item mt-12">
            <WipeCompare
              beforeLabel="Before PortalKit"
              afterLabel="After PortalKit"
              before={
                <ul className="space-y-3">
                  {BEFORE.map((line) => (
                    <li key={line} className="mkt-body flex gap-3 text-muted">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted"
                        aria-hidden
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              }
              after={
                <ul className="space-y-3">
                  {AFTER.map((line) => (
                    <li key={line} className="mkt-body flex gap-3 text-ink">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        </div>
      </section>

      {/* 4. Pillars — open beats, not cards */}
      <section className="reveal-section mkt-section border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl">
          <p className="mkt-eyebrow reveal-item text-center">How freelancers use it</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3 text-center"
            text="Three jobs. One operating system."
          />
          <div className="beat-rail reveal-item mt-12">
            {PILLARS.map((p) => (
              <div key={p.title} className="beat-cell">
                <p className="mkt-feature text-accent/55">{p.step}</p>
                <h3 className="mkt-h3 mt-4">{p.title}</h3>
                <p className="mkt-body mt-2 max-w-sm">{p.body}</p>
                <ul className="mt-6 space-y-2">
                  {p.products.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="mkt-link inline-flex items-center gap-1"
                      >
                        {label}{" "}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Shopify focus */}
      <section className="reveal-section mkt-section bg-paper">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mkt-eyebrow reveal-item">Built for the work</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Shopify client work — not enterprise CRM theater."
          />
          <p className="reveal-item mkt-lede mx-auto mt-4 max-w-xl">
            Pipeline stages for inquiry → booked → launch → retainer. Portals
            merchants actually open. Pricing that doesn’t assume a 40-person
            agency.
          </p>
          <div className="reveal-item mt-8 flex flex-wrap justify-center gap-3">
            <MagneticLink
              href="/business-type/shopify-freelancers"
              className="btn btn-primary"
            >
              See Shopify freelancer flow
            </MagneticLink>
            <MagneticLink href="/pricing" className="btn btn-secondary">
              View pricing
            </MagneticLink>
          </div>
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
            text="Ready to simplify client ops?"
          />
          <MagneticLink href="/sign-up" className="btn btn-primary mt-8 px-8">
            Get started for free
          </MagneticLink>
        </div>
      </section>
    </MarketingShell>
  );
}
