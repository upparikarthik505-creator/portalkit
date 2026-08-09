# PortalKit

Client portals for Shopify freelancers — CRM, proposals, invoices, and branded client links.

**Stack:** Next.js · Clerk · Stripe · Supabase · Vercel  
**Pricing:** Free · Pro `$19/mo` · Founder lifetime `$99` (first 20)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

| Route | Purpose |
| --- | --- |
| `/` | Marketing site |
| `/sign-in` · `/sign-up` | Clerk auth (or demo fallback) |
| `/dashboard` | Freelancer workspace |
| `/p/[token]` | Client portal |

Without API keys the UI runs in **demo mode** (localStorage + mock CRM screens).

## Env setup

Copy `.env.example` → `.env.local` and fill:

1. **Clerk** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`  
   Dashboard routes are protected once the secret key is set.
2. **Supabase** — run `supabase/schema.sql` in the SQL editor, then set URL + service role key.  
   Projects hydrate from `/api/projects` instead of local-only storage.
3. **Stripe** — secret key + `STRIPE_PRICE_PRO_MONTHLY` + `STRIPE_PRICE_LIFETIME`.  
   Plan checkout: `/dashboard/billing` → `/api/checkout/plan`  
   Deposits: project Payments tab → `/api/checkout/deposit`  
   Webhook: `POST /api/webhooks/stripe`

## What's shipped

- HoneyBook-style marketing nav, landing, templates, pricing, product, business-type pages
- Dashboard IA: pipeline, projects, contacts, files, proposals, invoices, calendar, automations, tasks, lead forms, plan
- Clerk-ready auth shell + optional dashboard protection
- Supabase schema + project API (workspace per Clerk user)
- Stripe Checkout for Pro / Founder + deposit pay links
