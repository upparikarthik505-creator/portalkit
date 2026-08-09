import Link from "next/link";
import { LandingMotion } from "@/components/LandingMotion";
import { MarketingFooter } from "./MarketingFooter";
import { MarketingHeader } from "./MarketingHeader";

export function MarketingShell({
  children,
  promo = false,
  motion = false,
}: {
  children: React.ReactNode;
  /** Optional thin founder strip — off by default (avoids generic promo-bar clone) */
  promo?: boolean;
  motion?: boolean;
}) {
  const body = motion ? <LandingMotion>{children}</LandingMotion> : children;

  return (
    <div className="mkt min-h-screen bg-paper-2 text-ink">
      {promo ? (
        <div className="mkt-chip border-b border-line bg-ink px-4 py-2 text-center text-white/85">
          Founder seats open · lifetime cheaper than billing ·{" "}
          <Link href="/pricing" className="underline underline-offset-2">
            Claim a seat
          </Link>
        </div>
      ) : null}
      <MarketingHeader />
      <main>{body}</main>
      <MarketingFooter />
    </div>
  );
}
