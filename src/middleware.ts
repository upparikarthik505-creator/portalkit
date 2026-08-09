import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Demo-safe: without Clerk keys, pass through (local marketing/demo).
 * With Clerk: protect dashboard (opt-out via PORTALKIT_PROTECT_DASHBOARD=0)
 * and hard-401 money-creating checkout (/api/checkout/plan). Deposit is a
 * public 503 stub (no orders created) so the client portal can surface the
 * honest “not available” message. /api/checkout/verify stays open for
 * Razorpay callbacks; plan activation still requires auth in-route.
 */

const clerkConfigured =
  Boolean(process.env.CLERK_SECRET_KEY) &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isCheckoutWriteRoute = createRouteMatcher(["/api/checkout/plan(.*)"]);
const isAuthedApiRoute = createRouteMatcher([
  "/api/projects(.*)",
  "/api/workspace(.*)",
  "/api/contacts(.*)",
  "/api/offers",
  "/api/lead-forms",
  "/api/payments(.*)",
  "/api/billing(.*)",
]);

const clerkAuthMiddleware = clerkMiddleware(async (auth, req) => {
  if (isCheckoutWriteRoute(req) || isAuthedApiRoute(req)) {
    const { userId } = await auth();
    if (!userId || userId === "demo-user") {
      return NextResponse.json(
        { error: "Sign in required." },
        { status: 401 },
      );
    }
    return;
  }

  const dashboardOptOut = process.env.PORTALKIT_PROTECT_DASHBOARD === "0";
  if (isDashboardRoute(req) && !dashboardOptOut) {
    await auth.protect();
  }
});

function passthrough(_req: NextRequest) {
  return NextResponse.next();
}

export default clerkConfigured ? clerkAuthMiddleware : passthrough;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
