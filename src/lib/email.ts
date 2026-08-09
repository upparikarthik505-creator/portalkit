/** Minimal transactional email via Resend HTTP API (no SDK). */

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  fromName?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email:skip]", input.subject, "→", input.to);
    return { ok: false as const, skipped: true as const };
  }
  const from =
    process.env.RESEND_FROM ||
    `${input.fromName || "PortalKit"} <onboarding@resend.dev>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[email:fail]", err);
    return { ok: false as const, skipped: false as const };
  }
  return { ok: true as const, skipped: false as const };
}
