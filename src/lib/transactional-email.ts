import { appUrl } from "@/lib/razorpay";
import { sendEmail } from "@/lib/email";
import { formatMoney } from "@/lib/money";

/** Soft-fail transactional emails for the booking loop. */

export async function emailOfferSent(input: {
  to: string;
  studioName: string;
  offerTitle: string;
  shareToken: string;
  clientName: string;
}) {
  const link = `${appUrl()}/offer/${input.shareToken}`;
  return sendEmail({
    to: input.to,
    fromName: input.studioName,
    subject: `Offer from ${input.studioName}: ${input.offerTitle}`,
    text: `Hi ${input.clientName},\n\n${input.studioName} sent you an offer: ${input.offerTitle}.\n\nReview & accept: ${link}\n`,
  });
}

export async function emailOfferSigned(input: {
  to: string;
  studioName: string;
  offerTitle: string;
  acceptedName: string;
  portalToken: string;
}) {
  const portal = `${appUrl()}/p/${input.portalToken}`;
  return sendEmail({
    to: input.to,
    fromName: "PortalKit",
    subject: `Signed: ${input.offerTitle}`,
    text: `${input.acceptedName} accepted “${input.offerTitle}”.\n\nPortal: ${portal}\n`,
  });
}

export async function emailPayLink(input: {
  to: string;
  studioName: string;
  clientName: string;
  label: string;
  amountCents: number;
  portalToken: string;
}) {
  const portal = `${appUrl()}/p/${input.portalToken}`;
  return sendEmail({
    to: input.to,
    fromName: input.studioName,
    subject: `Pay ${formatMoney(input.amountCents)} — ${input.label}`,
    text: `Hi ${input.clientName},\n\nPlease pay “${input.label}” (${formatMoney(input.amountCents)}) for ${input.studioName}.\n\nPay here: ${portal}\n`,
  });
}

export async function emailPaymentReceipt(input: {
  to: string;
  studioName: string;
  clientName: string;
  label: string;
  amountCents: number;
}) {
  return sendEmail({
    to: input.to,
    fromName: input.studioName,
    subject: `Receipt: ${input.label}`,
    text: `Hi ${input.clientName},\n\nWe received ${formatMoney(input.amountCents)} for “${input.label}”.\n\nThanks,\n${input.studioName}\n`,
  });
}
