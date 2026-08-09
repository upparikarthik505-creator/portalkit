import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

/**
 * Auth chrome — design-system.md: paper-2 page, brand-first, mkt type.
 */
export function AuthShell({
  children,
  title,
  lede,
  altHref,
  altLabel,
}: {
  children: React.ReactNode;
  title: string;
  lede: string;
  altHref: string;
  altLabel: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-paper-2 text-ink">
      <div className="hero-stage-bg opacity-90" aria-hidden />
      <div className="hero-stage-grid opacity-50" aria-hidden />

      <div className="relative z-[1] mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-16">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex justify-center">
            <BrandMark size="lg" />
          </Link>
          <h1 className="mkt-h2-sm mt-6">{title}</h1>
          <p className="mkt-lede mt-3">{lede}</p>
        </div>

        {children}

        <p className="mkt-meta mt-8 text-center">
          <Link
            href={altHref}
            className="mkt-link underline-offset-2 hover:underline"
          >
            {altLabel}
          </Link>
          <span className="mx-2 text-muted">·</span>
          <Link
            href="/"
            className="text-muted transition-colors duration-[var(--motion-micro)] hover:text-ink"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export function AuthFallback() {
  return (
    <div className="rounded-[var(--radius)] border border-line bg-paper p-6 text-center shadow-[var(--shadow)]">
      <p className="mkt-h3">Clerk keys not configured</p>
      <p className="mkt-body mt-2">
        Add{" "}
        <code className="mkt-chip text-accent">
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        </code>{" "}
        and <code className="mkt-chip text-accent">CLERK_SECRET_KEY</code> to{" "}
        <code className="mkt-chip">.env.local</code>, then restart.
      </p>
      <Link href="/dashboard" className="btn btn-primary mt-5">
        Continue in demo mode (no auth)
      </Link>
    </div>
  );
}
