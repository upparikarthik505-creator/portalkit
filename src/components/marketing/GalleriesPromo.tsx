import { HoverTiltCard } from "@/components/motion/HoverTiltCard";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";

export function GalleriesPromo() {
  return (
    <section className="reveal-section mkt-section bg-paper-2">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[var(--radius)] border border-line bg-paper shadow-[var(--shadow)] md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 sm:p-8 md:p-11">
          <p className="mkt-eyebrow reveal-item">What&apos;s new</p>
          <SplitHeadline
            as="h2"
            scroll
            className="mkt-h2 mt-3"
            text="Client portals that feel like a branded delivery HQ"
          />
          <p className="mkt-lede reveal-item mt-4">
            Share files, invoices, and milestones in one link — so clients stop
            hunting through email threads.
          </p>
          <div className="reveal-item mt-7 flex flex-wrap gap-3 md:mt-8">
            <MagneticLink href="/product/client-portal" className="btn btn-primary">
              See client portal
            </MagneticLink>
            <MagneticLink href="/p/aurora-maya-7k2" className="btn btn-secondary">
              Open sample portal
            </MagneticLink>
          </div>
        </div>
        <div className="border-t border-line bg-hero p-5 sm:p-6 md:border-l md:border-t-0 md:p-7">
          <HoverTiltCard
            intensity={0.6}
            className="rounded-[var(--radius)] border border-line bg-paper-2 p-4 shadow-[var(--shadow)] sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="mkt-row">Aurora Skincare portal</p>
              <span className="mkt-chip shrink-0 rounded-full bg-mint px-2 py-0.5 text-mint-ink">
                Live
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Mockups", "Brand.zip", "INV-1042"].map((f) => (
                <div
                  key={f}
                  className="mkt-chip rounded-[calc(var(--radius)-4px)] border border-line bg-paper px-1 py-5 text-center text-ink-2 sm:px-2 sm:py-6"
                >
                  {f}
                </div>
              ))}
            </div>
            <div className="mkt-chip mt-4 rounded-[calc(var(--radius)-4px)] bg-accent-soft px-3 py-2 text-accent-deep">
              Deposit paid · Next: homepage revisions
            </div>
          </HoverTiltCard>
        </div>
      </div>
    </section>
  );
}
