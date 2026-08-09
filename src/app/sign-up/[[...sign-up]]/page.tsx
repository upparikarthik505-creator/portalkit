import { SignUp } from "@clerk/nextjs";
import { AuthFallback, AuthShell } from "@/components/marketing/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { pageMeta } from "@/lib/seo";

/**
 * Sign-up — reuses tokens/components from design-system.md
 */

export const metadata = pageMeta(
  "Get started",
  "Create your free PortalKit workspace for clients, proposals, and payments.",
  "/sign-up",
);

export default function SignUpPage() {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <AuthShell
      title="Start free — 14-day Pro trial"
      lede="Create your PortalKit workspace. Every new account gets a clean database and a 14-day Pro trial — no card required."
      altHref="/sign-in"
      altLabel="Already have an account? Log in"
    >
      {hasClerk ? (
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          appearance={clerkAppearance}
        />
      ) : (
        <AuthFallback />
      )}
    </AuthShell>
  );
}
