"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function Providers({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const tree = <CurrencyProvider>{children}</CurrencyProvider>;

  if (!publishableKey) {
    return tree;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={clerkAppearance}
    >
      {tree}
    </ClerkProvider>
  );
}
