import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  FolderKanban,
  Receipt,
  Sparkles,
  Star,
  Users,
  Workflow,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { LandingMotion } from "@/components/LandingMotion";

const FEATURES = [
  ["Pipeline CRM", "Inquiry → qualified → proposal → booked. Visual board, not a spreadsheet."],
  ["Proposals that close", "Scoped Shopify packages clients accept in one click."],
  ["Invoices & deposits", "Get paid before you open Figma. Milestones after."],
  ["Client portal", "One branded link for status, files, and pay — no Drive chaos."],
  ["Project delivery", "Theme builds and launches with progress your client can see."],
  ["Shopify-native language", "Stores, themes, launches — not wedding photographer fluff."],
];

export default function HomePage() {
  return (
    <LandingMotion>
      <div className="min-h-screen bg-paper text-ink">
        {/* Nav */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
            <BrandMark light />
            <nav className="hidden items-center gap-7 text-[14px] font-semibold text-white/65 md:flex">
              <a href="#product" className="hover:text-white">
                Product
              </a>
              <a href="#proof" className="hover:text-white">
                Why PortalKit
              </a>
              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="hidden rounded-full px-3 py-2 text-[14px] font-semibold text-white/70 sm:inline"
              >
                Log in
              </Link>
              <Link href="/dashboard" className="btn btn-primary !py-2.5 !text-[13px]">
                Start free
              </Link>
            </div>
          </div>
        </header>

        {/* Dark Godly-style hero */}
        <section className="relative overflow-hidden bg-ink text-white">
          <div className="noise pointer-events-none absolute inset-0 opacity-40" />
          <div className="orb absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/40 blur-[100px]" />
          <div className="orb absolute -right-16 top-40 h-80 w-80 rounded-full bg-signal/25 blur-[110px]" />
          <div className="orb absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[#2563eb]/30 blur-[90px]" />

          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 pb-10 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pt-24">
            <div className="pb-4">
              <p className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-signal">
                <Sparkles className="h-3.5 w-3.5" />
                All-in-one for Shopify freelancers
              </p>
              <h1 className="hero-title display max-w-[12ch] text-[52px] leading-[0.95] md:text-[72px]">
                Run clients like a studio. Not a group chat.
              </h1>
              <p className="hero-sub mt-6 max-w-md text-[18px] leading-relaxed text-white/65">
                Pipeline, proposals, invoices, and a branded portal — the best of
                HoneyBook, Bonsai, and Dubsado, rebuilt sharp for Shopify work.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/dashboard" className="hero-cta btn btn-primary">
                  Open the product
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/p/aurora-maya-7k2"
                  className="hero-cta btn border border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Preview client portal
                </Link>
              </div>
              <div className="hero-cta mt-6 flex items-center gap-2 text-[13px] text-white/50">
                <div className="flex text-signal">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                Designed to sell at $19/mo · first 20 get $99 lifetime
              </div>
            </div>

            {/* Floating product stage */}
            <div className="hero-stage relative pb-6">
              <div className="floaty relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-2 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/40">
                    portalkit.app / home
                  </span>
                  <span className="rounded-full bg-signal px-2 py-0.5 text-[10px] font-extrabold text-signal-ink">
                    LIVE
                  </span>
                </div>
                <div className="grid grid-cols-[64px_1fr]">
                  <div className="space-y-3 border-r border-white/10 px-2.5 py-4">
                    {[Workflow, Users, FolderKanban, FileText, Receipt].map(
                      (Icon, i) => (
                        <div
                          key={i}
                          className={`grid h-9 w-9 place-items-center rounded-xl ${
                            i === 0
                              ? "bg-accent text-white"
                              : "text-white/35"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      ),
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="display text-[22px]">Pipeline</p>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-signal">
                        $21.1k open
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ["Inquiry", "Lumen", "$4.5k"],
                        ["Proposal", "Cedar", "$2.8k"],
                        ["Booked", "Basecamp", "$5.1k"],
                      ].map(([a, b, c]) => (
                        <div
                          key={a}
                          className="rounded-2xl border border-white/10 bg-white/5 p-2.5"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40">
                            {a}
                          </p>
                          <p className="mt-2 text-[12px] font-bold">{b}</p>
                          <p className="mt-1 text-[12px] text-accent">{c}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-2xl border border-white/10 bg-gradient-to-br from-accent/30 to-transparent p-3">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-bold">Aurora Skincare</span>
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-[#9a3412]">
                          In progress
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-2/3 rounded-full bg-signal" />
                      </div>
                      <p className="mt-2 text-[11px] text-white/55">
                        Deposit paid · Milestone sent · Portal live
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logo/social proof strip */}
        <section className="border-b border-line bg-paper-2">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-[13px] font-semibold text-muted">
            <span>Replaces</span>
            {["HoneyBook sprawl", "Dubsado setup", "Bonsai + Drive", "Stripe links in email"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-ink"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </section>

        {/* Features — Land-book / Lapa section rhythm */}
        <section id="product" className="mx-auto w-full max-w-6xl px-5 py-20">
          <p className="reveal text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
            Product
          </p>
          <h2 className="reveal display mt-3 max-w-3xl text-[44px] leading-[1.02] md:text-[56px]">
            Everything from lead to paid delivery. Zero tab chaos.
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([title, body], i) => (
              <article
                key={title}
                className="reveal group relative overflow-hidden rounded-[24px] border border-line bg-paper-2 p-6 shadow-[0_20px_60px_rgba(9,9,11,0.04)] transition hover:-translate-y-1"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20" />
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-ink text-signal">
                  <span className="display text-[15px]">{i + 1}</span>
                </div>
                <h3 className="display text-[26px]">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Proof / workflow */}
        <section id="proof" className="border-y border-line bg-ink text-white">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-signal">
                Workflow
              </p>
              <h2 className="display mt-3 text-[44px] leading-[1.02] md:text-[52px]">
                Lead in. Deposit cleared. Portal live.
              </h2>
              <p className="mt-4 text-[17px] text-white/60">
                Steal the conversion psychology of the big tools — without their
                bloated setup. Ship a portal your client actually opens.
              </p>
            </div>
            <ol className="space-y-4">
              {[
                ["01", "Capture", "Lead hits pipeline with store URL + budget."],
                ["02", "Close", "Proposal + deposit invoice in one send."],
                ["03", "Deliver", "Client portal for files, status, milestones."],
              ].map(([n, t, b]) => (
                <li
                  key={n}
                  className="flex gap-4 rounded-[22px] border border-white/10 bg-white/5 p-5"
                >
                  <span className="display text-[28px] text-accent">{n}</span>
                  <div>
                    <p className="display text-[24px]">{t}</p>
                    <p className="mt-1 text-[15px] text-white/60">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pricing — Lapa style */}
        <section id="pricing" className="mx-auto w-full max-w-6xl px-5 py-20">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
            Pricing
          </p>
          <h2 className="display mt-3 max-w-2xl text-[44px] leading-[1.02] md:text-[56px]">
            Price like HoneyBook. Feel like a new category.
          </h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$0",
                detail: "Prove it with one client this week.",
                items: ["1 active project", "Pipeline board", "Client portal link"],
                cta: "Start free",
                dark: false,
              },
              {
                name: "Pro",
                price: "$19",
                suffix: "/mo",
                detail: "Unlimited freelancers who bill weekly.",
                items: [
                  "Unlimited clients & projects",
                  "Proposals + invoices",
                  "Branded portals",
                  "Stripe deposits",
                ],
                cta: "Go Pro",
                dark: true,
              },
              {
                name: "Founder",
                price: "$99",
                detail: "Lifetime Pro — first 20 only.",
                items: ["Everything in Pro", "Founding badge", "Priority roadmap"],
                cta: "Claim seat",
                dark: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-[28px] border p-7 ${
                  plan.dark
                    ? "border-ink bg-ink text-white shadow-[0_30px_80px_rgba(9,9,11,0.35)]"
                    : "border-line bg-paper-2"
                }`}
              >
                {plan.dark ? (
                  <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-accent/40 blur-3xl" />
                ) : null}
                <p
                  className={`text-[13px] font-bold ${
                    plan.dark ? "text-white/55" : "text-muted"
                  }`}
                >
                  {plan.name}
                </p>
                <p className="display mt-2 text-[52px]">
                  {plan.price}
                  {plan.suffix ? (
                    <span className="text-[20px] text-white/50">{plan.suffix}</span>
                  ) : null}
                </p>
                <p
                  className={`mt-2 text-[14px] ${
                    plan.dark ? "text-white/65" : "text-muted"
                  }`}
                >
                  {plan.detail}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[14px]">
                      <Check className="h-4 w-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`btn mt-8 w-full ${
                    plan.dark ? "btn-primary" : "btn-dark"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-20">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-accent px-8 py-14 text-white md:px-14">
            <div className="noise absolute inset-0 opacity-30" />
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-signal/40 blur-3xl" />
            <div className="relative">
              <h2 className="display max-w-xl text-[44px] leading-[1.02] md:text-[56px]">
                Stop sending Drive folders like it’s 2016.
              </h2>
              <p className="mt-4 max-w-lg text-[17px] text-white/85">
                Open the full workspace — home, pipeline, clients, proposals,
                invoices, projects, portal — and start selling today.
              </p>
              <Link href="/dashboard" className="btn btn-dark mt-8">
                Launch dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LandingMotion>
  );
}
