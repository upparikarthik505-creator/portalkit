import { SignIn } from "@clerk/nextjs";
import { AuthFallback, AuthShell } from "@/components/marketing/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { pageMeta } from "@/lib/seo";

/**
 * Sign-in — reuses tokens/components from design-system.md
 */

export const metadata = pageMeta(
  "Log in",
  "Sign in to your PortalKit workspace.",
  "/sign-in",
);

export default function SignInPage() {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <AuthShell
      title="Welcome back"
      lede="Log in to your PortalKit workspace — deals, portals, and payments."
      altHref="/sign-up"
      altLabel="Create an account"
    >
      {hasClerk ? (
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
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
