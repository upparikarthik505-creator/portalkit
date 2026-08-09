/**
 * Actor identity for API routes.
 * - Demo workspace id is ONLY for local browsing without Clerk.
 * - Payment write paths must use `requireAuthenticatedUserId` — never
 *   `getActorUserId` (that helper may return demo-user).
 */

export const DEMO_USER_ID = "demo-user";

/** Clerk user id when signed in; demo workspace when Clerk is absent (local demo only). */
export async function getActorUserId(): Promise<string> {
  if (!process.env.CLERK_SECRET_KEY) {
    return DEMO_USER_ID;
  }
  const { auth } = await import("@clerk/nextjs/server");
  const session = await auth();
  return session.userId ?? DEMO_USER_ID;
}

/**
 * Real signed-in Clerk user for money-moving routes (/api/checkout/*).
 * Returns null if Clerk is missing, session is anonymous, or id is demo-user.
 * Never returns DEMO_USER_ID.
 */
export async function requireAuthenticatedUserId(): Promise<string | null> {
  if (!process.env.CLERK_SECRET_KEY) {
    return null;
  }
  const { auth } = await import("@clerk/nextjs/server");
  const session = await auth();
  const userId = session.userId;
  if (!userId || userId === DEMO_USER_ID) {
    return null;
  }
  return userId;
}

export function isDemoUserId(userId: string | null | undefined): boolean {
  return !userId || userId === DEMO_USER_ID;
}
