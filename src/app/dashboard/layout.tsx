import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/DashboardShell";

export const metadata: Metadata = {
  title: "Workspace",
  description: "PortalKit freelancer OS — deals, delivery, offers, and payouts.",
};

/**
 * When Clerk is configured, require sign-in by default.
 * Set PORTALKIT_PROTECT_DASHBOARD=0 to browse the demo workspace without auth.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkConfigured = !!process.env.CLERK_SECRET_KEY;
  const protect =
    clerkConfigured && process.env.PORTALKIT_PROTECT_DASHBOARD !== "0";

  if (protect) {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    if (!userId) {
      redirect("/sign-in");
    }
  }

  return <DashboardShell>{children}</DashboardShell>;
}
