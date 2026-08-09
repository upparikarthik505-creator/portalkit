import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { BUSINESS_TYPES, PRODUCT_LINKS } from "@/lib/marketing";

export function MarketingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink text-white">
      <div
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
        aria-hidden
      />
      <div className="mkt-on-dark relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <BrandMark light size="lg" />
          <p className="mkt-body mt-4 max-w-xs !text-white/65">
            The client HQ for Shopify freelancers — deals, delivery, and deposits
            in one place.
          </p>
          <Link href="/sign-up" className="btn btn-primary mt-5">
            Start free
          </Link>
        </div>
        <div>
          <p className="mkt-label">Tools</p>
          <ul className="mkt-body mt-3 space-y-2">
            {PRODUCT_LINKS.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <Link href={`/product/${p.slug}`} className="hover:text-white">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mkt-label">Studio</p>
          <ul className="mkt-body mt-3 space-y-2">
            {BUSINESS_TYPES.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/business-type/${b.slug}`}
                  className="hover:text-white"
                >
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mkt-label">Company</p>
          <ul className="mkt-body mt-3 space-y-2">
            <li>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/why" className="hover:text-white">
                Why PortalKit
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-white">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-white">
                Packs
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white">
                Demo
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mkt-chip relative border-t border-white/10 px-5 py-4 text-center text-white/40">
        © {new Date().getFullYear()} PortalKit · Freelancer OS for Shopify work
      </div>
    </footer>
  );
}
