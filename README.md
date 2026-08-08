# PortalKit

Client portals for Shopify freelancers — status, files, and payment requests in one branded link.

**Stack:** Next.js · TypeScript · Tailwind · (Clerk / Stripe / Supabase next)

**Pricing target:** Free · Pro `$19/mo` · Early bird `$99` lifetime

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- Landing: `/`
- Dashboard: `/dashboard`
- Demo client portal: `/p/aurora-maya-7k2`

Demo data lives in `localStorage` so you can create projects, update status, add files, and send payment requests without API keys.

## What's shipped

- Landing + pricing
- Freelancer dashboard (overview, projects, project detail)
- Client portal by share token
- Branding settings preview
- Billing page (Stripe checkout next)

## Next wiring

1. Clerk auth on `/dashboard`
2. Supabase for projects + file uploads
3. Stripe Checkout for Pro + deposit links
