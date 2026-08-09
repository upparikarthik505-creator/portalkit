import crypto from "crypto";
import Razorpay from "razorpay";

let platformClient: Razorpay | null = null;

export function isRazorpayConfigured() {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getRazorpay() {
  if (!isRazorpayConfigured()) return null;
  if (!platformClient) {
    platformClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return platformClient;
}

/** Per-freelancer Razorpay (client deposits) — not the PortalKit plan keys. */
export function getRazorpayWithKeys(keyId: string, keySecret: string) {
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function razorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
}

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function verifyPaymentSignature(
  input: {
    orderId: string;
    paymentId: string;
    signature: string;
  },
  secret = process.env.RAZORPAY_KEY_SECRET,
) {
  if (!secret) return false;
  const body = `${input.orderId}|${input.paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === input.signature;
}

/** Checkout.js subscription handler signature. */
export function verifySubscriptionPaymentSignature(
  input: {
    paymentId: string;
    subscriptionId: string;
    signature: string;
  },
  secret = process.env.RAZORPAY_KEY_SECRET,
) {
  if (!secret) return false;
  const body = `${input.paymentId}|${input.subscriptionId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === input.signature;
}

export function razorpayProPlanId(interval: "monthly" | "yearly") {
  return interval === "yearly"
    ? process.env.RAZORPAY_PLAN_PRO_YEARLY || ""
    : process.env.RAZORPAY_PLAN_PRO_MONTHLY || "";
}

export function isRazorpaySubscriptionsConfigured(
  interval: "monthly" | "yearly",
) {
  return !!razorpayProPlanId(interval);
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  // Fail closed — never accept unsigned webhooks in any environment.
  if (!secret || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}
