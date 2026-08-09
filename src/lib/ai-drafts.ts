"use client";

export type ProposalTemplateType =
  | "theme_rebuild"
  | "cro_speed"
  | "migration"
  | "headless_custom"
  | "retainer";

export type EmailTemplateType =
  | "kickoff"
  | "scope_pushback"
  | "payment_nudge"
  | "launch_handover"
  | "review_request"
  | "progress_update";

export type ChecklistType =
  | "launch_qa"
  | "seo_migration"
  | "speed_audit"
  | "app_cleanup";

export type ToneType = "warm" | "concise" | "agency" | "firm";

export const PROPOSAL_TEMPLATES: {
  key: ProposalTemplateType;
  title: string;
  defaultPrice: number;
  defaultDeposit: number;
  summary: string;
}[] = [
  {
    key: "theme_rebuild",
    title: "Shopify 2.0 Custom Theme Rebuild",
    defaultPrice: 3500,
    defaultDeposit: 1500,
    summary:
      "Full modern Shopify OS 2.0 theme architecture with modular sections, mobile drawer cart, and sub-second load times.",
  },
  {
    key: "cro_speed",
    title: "CRO & Core Web Vitals Speed Optimization",
    defaultPrice: 2000,
    defaultDeposit: 1000,
    summary:
      "Data-driven audit, JavaScript payload reduction, image compression pipeline, and checkout funnel friction removal.",
  },
  {
    key: "migration",
    title: "WooCommerce / Magento to Shopify Migration",
    defaultPrice: 4800,
    defaultDeposit: 2000,
    summary:
      "Complete catalog, customer, and order data transfer with 301 URL redirect mapping to preserve organic SEO rankings.",
  },
  {
    key: "headless_custom",
    title: "Custom Shopify App & Headless Integration",
    defaultPrice: 6500,
    defaultDeposit: 3000,
    summary:
      "Custom private Shopify app, bespoke API middleware, or Hydrogen storefront tailored to complex business logic.",
  },
  {
    key: "retainer",
    title: "Monthly Shopify Growth & Development Retainer",
    defaultPrice: 1800,
    defaultDeposit: 1800,
    summary:
      "Dedicated monthly developer bandwidth for landing pages, A/B testing, app integrations, and priority bug resolution.",
  },
];

export const EMAIL_TEMPLATES: {
  key: EmailTemplateType;
  label: string;
  description: string;
}[] = [
  {
    key: "kickoff",
    label: "Project Kickoff & Portal Access",
    description: "Welcome the client, share the portal link, and request collaborator access.",
  },
  {
    key: "scope_pushback",
    label: "Polite Scope Creep Pushback",
    description: "Protect your timeline while quoting out-of-scope requests professionally.",
  },
  {
    key: "payment_nudge",
    label: "Friendly Milestone Payment Nudge",
    description: "Gentle reminder for outstanding deposit or completion invoice.",
  },
  {
    key: "launch_handover",
    label: "Store Launch & Final Handover",
    description: "Celebrate launch, deliver theme documentation, and guide DNS cutover.",
  },
  {
    key: "review_request",
    label: "5-Star Review & Testimonial Ask",
    description: "Request a compelling review and case study quote for your portfolio.",
  },
  {
    key: "progress_update",
    label: "Weekly Sprint Progress Update",
    description: "Keep merchants calm with high-visibility weekly milestone accomplishments.",
  },
];

export function generateProposalScope(options: {
  type: ProposalTemplateType;
  clientName: string;
  storeName: string;
  niche: string;
  totalPrice: number;
  depositPrice: number;
  customNotes?: string;
}): {
  title: string;
  scopeText: string;
  timeline: string;
  deliverables: string[];
} {
  const { type, clientName, storeName, niche, totalPrice, depositPrice, customNotes } =
    options;

  let title = "";
  let deliverables: string[] = [];
  let scopeText = "";
  let timeline = "";
  const clientRef = clientName || "Merchant";
  const storeRef = storeName || "your store";
  const nicheRef = niche ? `${niche} brand` : "e-commerce brand";

  if (type === "theme_rebuild") {
    title = `${storeRef} — Shopify OS 2.0 Theme Rebuild`;
    timeline = "3–4 weeks from deposit & collaborator access";
    deliverables = [
      "Custom Shopify OS 2.0 theme built on clean, high-performance architecture",
      "Homepage, Collection grid, Product Detail Page (PDP), Cart Drawer, and 3 Content templates",
      "Dynamic sections everywhere (reusable custom liquid blocks and metafields)",
      "Mobile-first responsive QA across iOS Safari, Android Chrome, and tablets",
      "Speed optimization score target: 85+ mobile Google Lighthouse",
      "14 days post-launch hypercare & bug-fix warranty",
    ];
    scopeText = `PROJECT OVERVIEW:
Rebuilding ${storeRef} into a modern Shopify OS 2.0 flagship storefront tailored for ${clientRef} (${nicheRef}). 

KEY DELIVERABLES:
${deliverables.map((d) => `• ${d}`).join("\n")}

${customNotes ? `SPECIAL REQUIREMENTS:\n• ${customNotes}\n\n` : ""}COMMERCIAL TERMS:
• Total Investment: $${totalPrice.toLocaleString()} USD
• Kickoff Deposit (40%): $${depositPrice.toLocaleString()} USD
• Balance due upon staging approval prior to DNS launch

OUT OF SCOPE:
• Custom backend ERP integrations or third-party paid app subscription licenses
• New copywriting or video asset creation (provided by client)`;
  } else if (type === "cro_speed") {
    title = `${storeRef} — Speed & Conversion Rate Optimization`;
    timeline = "10–14 business days";
    deliverables = [
      "Deep technical speed audit and redundant script removal",
      "Image WebP compression pipeline and responsive lazy-loading configuration",
      "Mobile checkout funnel friction reduction (sticky Add-to-Cart, trust badges, instant upsells)",
      "Core Web Vitals remediation (LCP < 2.5s, CLS < 0.1, INP < 200ms)",
      "Before & after benchmark performance reporting",
    ];
    scopeText = `PROJECT OVERVIEW:
Turbocharging mobile performance and conversion metrics for ${storeRef} (${nicheRef}).

KEY DELIVERABLES:
${deliverables.map((d) => `• ${d}`).join("\n")}

${customNotes ? `SPECIAL REQUIREMENTS:\n• ${customNotes}\n\n` : ""}COMMERCIAL TERMS:
• Total Investment: $${totalPrice.toLocaleString()} USD (Deposit: $${depositPrice.toLocaleString()} USD)
• Balance payable upon delivery of verified speed benchmark results`;
  } else if (type === "migration") {
    title = `${storeRef} — Replatforming & Migration to Shopify`;
    timeline = "3–5 weeks";
    deliverables = [
      "Full export & import of product catalog, variants, images, and inventory counts",
      "Customer accounts and historical order record preservation",
      "Comprehensive 301 URL redirect mapping matrix for all legacy URLs to protect Google SEO",
      "Payment gateway setup (Shopify Payments / Razorpay / PayPal)",
      "Shipping profiles, tax zones, and transaction email template configuration",
      "Pre-launch DNS cutover and SSL certificate verification",
    ];
    scopeText = `PROJECT OVERVIEW:
Seamless zero-downtime replatforming of ${storeRef} to Shopify with full data and SEO integrity.

KEY DELIVERABLES:
${deliverables.map((d) => `• ${d}`).join("\n")}

${customNotes ? `SPECIAL REQUIREMENTS:\n• ${customNotes}\n\n` : ""}COMMERCIAL TERMS:
• Total Investment: $${totalPrice.toLocaleString()} USD (Deposit: $${depositPrice.toLocaleString()} USD)`;
  } else if (type === "retainer") {
    title = `${storeRef} — Monthly Growth & Dev Retainer`;
    timeline = "Ongoing monthly recurring retainer";
    deliverables = [
      "Up to 20 hours of dedicated Shopify development and design implementation per month",
      "High-converting campaign landing page builds and promo banners",
      "A/B testing implementation and custom section experimentation",
      "App integrations, custom liquid tweaks, and priority 24hr bug turnaround",
      "Monthly strategy call and technical audit report",
    ];
    scopeText = `RETAINER AGREEMENT:
Dedicated monthly engineering partner for ${storeRef}.

DELIVERABLES:
${deliverables.map((d) => `• ${d}`).join("\n")}

COMMERCIAL TERMS:
• Monthly Retainer: $${totalPrice.toLocaleString()}/month
• Billed at beginning of each 30-day billing cycle`;
  } else {
    title = `${storeRef} — Custom Shopify App & Engineering`;
    timeline = "4–6 weeks";
    deliverables = [
      "Custom Shopify application utilizing Shopify Admin GraphQL API",
      "Bespoke backend business logic and database webhooks",
      "Embedded Shopify admin app UI built with Polaris components",
      "Staging test environment and automated unit test suite",
      "Full API documentation and cloud deployment handover",
    ];
    scopeText = `PROJECT OVERVIEW:
Custom Shopify software engineering for ${storeRef}.

DELIVERABLES:
${deliverables.map((d) => `• ${d}`).join("\n")}

COMMERCIAL TERMS:
• Total Investment: $${totalPrice.toLocaleString()} USD (Deposit: $${depositPrice.toLocaleString()} USD)`;
  }

  return { title, scopeText, timeline, deliverables };
}

export function generateClientEmail(options: {
  type: EmailTemplateType;
  clientName: string;
  storeName: string;
  studioName: string;
  portalUrl?: string;
  tone: ToneType;
  extraContext?: string;
}): { subject: string; body: string } {
  const { type, clientName, storeName, studioName, portalUrl, tone, extraContext } =
    options;

  const client = clientName || "there";
  const store = storeName || "your store";
  const studio = studioName || "our studio";
  const portal = portalUrl || "https://portalkit.io/p/demo-portal";

  if (type === "kickoff") {
    if (tone === "concise") {
      return {
        subject: `Kickoff & next steps — ${store}`,
        body: `Hi ${client},

We're excited to begin work on ${store}.

1. Your private client portal is live: ${portal}
2. Please grant collaborator access in your Shopify Admin (code & theme permissions).
3. Upload your brand assets (logos, fonts, copy) to the portal Docs tab.

Let us know once collaborator access is approved and we'll dive right in.

Best,
${studio}`,
      };
    }

    if (tone === "agency") {
      return {
        subject: `Welcome to Phase 1: Onboarding & Architecture for ${store}`,
        body: `Dear ${client},

Welcome to the team! We are thrilled to officially inaugurate the build phase for ${store}.

To ensure a seamless development sprint, we have prepared your centralized workspace:
👉 Client Command Portal: ${portal}

Next immediate milestones:
• Shopify Collaborator Access authorization
• Brand identity & asset deposit
• Technical architecture review

You can track real-time deliverable statuses, files, and milestones directly in your portal.

Warm regards,
${studio}`,
      };
    }

    return {
      subject: `🎉 We're ready to kick off ${store}!`,
      body: `Hi ${client},

Thank you for choosing ${studio}! We are super excited to partner with you on building ${store}.

Here is your private project HQ where you can track progress, download files, and view milestones:
🔗 Portal Link: ${portal}

To get started today, please:
1. Accept our Shopify Collaborator request in your Shopify Admin.
2. Check the Portal Checklist for initial asset requirements.

Feel free to reply here or leave a note on the portal anytime. Let's make this store amazing!

Cheers,
${studio}`,
    };
  }

  if (type === "scope_pushback") {
    return {
      subject: `Regarding your request for ${store} — scope & timeline update`,
      body: `Hi ${client},

Thanks for reaching out about adding ${extraContext || "these additional custom features"}.

This sounds like a great enhancement for ${store}! Because this falls outside our agreed initial scope, we can approach this in two ways so we don't delay our target launch date:

Option A: We can implement this immediately as an add-on sprint for an additional estimate (we can add a quick milestone on the portal).
Option B: We can complete the primary scope as scheduled and queue this up for Phase 2 immediately after launch.

Let me know which direction works best for you and we'll adjust accordingly!

Best regards,
${studio}`,
    };
  }

  if (type === "payment_nudge") {
    return {
      subject: `Friendly reminder: milestone invoice for ${store}`,
      body: `Hi ${client},

Hope you're having a productive week!

Just sending a quick reminder regarding the milestone invoice for ${store}. You can view the invoice details and complete payment directly on your portal:

💳 Pay securely here: ${portal}

Let me know if you need any adjustments or receipt copies.

Thank you!
${studio}`,
    };
  }

  if (type === "launch_handover") {
    return {
      subject: `🚀 ${store} is live! Theme handover & documentation`,
      body: `Hi ${client},

Huge congratulations! ${store} is officially deployed and ready to welcome customers.

All final theme files, backup archives, and video training walk-throughs are published on your portal:
🔗 ${portal}

Your 14-day post-launch hypercare warranty is now active. If you spot anything that needs fine-tuning, just drop a message in the portal.

Wishing you record-breaking sales!

Warmly,
${studio}`,
    };
  }

  if (type === "review_request") {
    return {
      subject: `How was your experience building ${store}? ⭐`,
      body: `Hi ${client},

Now that ${store} has launched, we wanted to thank you again for being such a wonderful partner throughout this project.

Could you take 60 seconds to share a brief testimonial or review of working with ${studio}? A few words on your experience and the results mean the world to our independent studio.

Thank you so much, and we'd love to continue supporting your brand as you scale!

Best,
${studio}`,
    };
  }

  // Progress update
  return {
    subject: `Weekly sprint update for ${store}`,
    body: `Hi ${client},

Here is a quick snapshot of what our team shipped on ${store} this week:

✅ Completed homepage dynamic liquid sections
✅ Integrated mobile drawer cart with threshold shipping calculator
✅ Configured custom product metafields

Next sprint focus:
• Completing collection filtering & pagination
• Mobile QA & checkout flow testing

You can review the live preview on your portal: ${portal}

Have a wonderful weekend!
${studio}`,
  };
}

export function generateChecklist(type: ChecklistType, storeName: string): string[] {
  const store = storeName || "Shopify Store";
  if (type === "launch_qa") {
    return [
      `[${store}] Place test order using Shopify Payments test mode / 100% discount code`,
      `[${store}] Verify order confirmation transactional email triggers correctly`,
      `[${store}] Test mobile drawer cart checkout button on iOS Safari & Android Chrome`,
      `[${store}] Verify Google Analytics 4 (GA4) & Meta Pixel purchase event tracking`,
      `[${store}] Audit 404 page, favicon, legal policies (Privacy, Terms, Refunds)`,
      `[${store}] Verify custom domain DNS cutover (A record @ 23.227.38.65, CNAME www)`,
      `[${store}] Remove storefront password and enable live payments`,
    ];
  }

  if (type === "seo_migration") {
    return [
      `[${store}] Export legacy URL sitemap and catalog paths`,
      `[${store}] Build 301 URL redirect table in Shopify Navigation -> URL Redirects`,
      `[${store}] Verify canonical tags are configured across product & collection templates`,
      `[${store}] Optimize meta title and meta descriptions on top 20 revenue products`,
      `[${store}] Submit new XML sitemap to Google Search Console (sitemap.xml)`,
      `[${store}] Verify structured schema data (Product, Offer, Review markup)`,
    ];
  }

  if (type === "speed_audit") {
    return [
      `[${store}] Audit third-party apps and eliminate unused scripts in theme.liquid`,
      `[${store}] Implement native lazy loading for images below the fold (loading="lazy")`,
      `[${store}] Replace heavy GIF animations with modern compressed WebP/MP4 assets`,
      `[${store}] Defer non-critical analytics and chat widget JavaScript`,
      `[${store}] Verify Mobile Lighthouse performance benchmark score > 80`,
    ];
  }

  return [
    `[${store}] Review installed app permissions in Shopify App settings`,
    `[${store}] Remove orphaned app snippets and unused CSS files`,
    `[${store}] Migrate legacy script tags to Shopify App Embeds (OS 2.0)`,
    `[${store}] Test checkout stability with existing discount apps`,
  ];
}
