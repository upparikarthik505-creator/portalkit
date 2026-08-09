"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { MagneticLink } from "@/components/motion/MagneticLink";
import {
  BUSINESS_TYPES,
  COMING_SOON_PRODUCT_SLUGS,
  PRODUCT_LINKS,
  RESOURCE_LINKS,
} from "@/lib/marketing";

function navLinkClass(active: boolean) {
  return `mkt-nav rounded-full px-3.5 py-2 transition ${
    active
      ? "bg-ink text-white"
      : "text-ink-2 hover:bg-paper hover:text-ink"
  }`;
}

type MenuKey = "studio" | "tools" | "guides" | null;

const TOOL_GROUPS = [
  {
    label: "Win the deal",
    slugs: ["pipeline", "crm", "proposals", "lead-forms"],
  },
  {
    label: "Get paid",
    slugs: ["invoices", "payments", "client-portal"],
  },
  {
    label: "On the roadmap",
    slugs: ["contracts", "automations", "ai", "tasks"],
  },
] as const;

export function MarketingHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const onStudio = pathname.startsWith("/business-type");
  const onTools = pathname.startsWith("/product");
  const onGuides =
    pathname.startsWith("/resources") ||
    pathname === "/why" ||
    pathname === "/reviews";
  const onPacks = pathname.startsWith("/templates");
  const onPricing = pathname.startsWith("/pricing");

  function toggle(key: MenuKey) {
    setOpen((prev) => (prev === key ? null : key));
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 px-3 pt-3 md:px-5">
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/70 bg-white/80 shadow-[0_12px_40px_rgba(31,31,35,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-5">
          <Link href="/" onClick={() => setOpen(null)} className="shrink-0">
            <span className="md:hidden">
              <BrandMark size="sm" />
            </span>
            <span className="hidden md:inline">
              <BrandMark />
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            <button
              type="button"
              aria-expanded={open === "studio"}
              className={`mkt-nav inline-flex items-center gap-1 rounded-full px-3.5 py-2 transition ${
                open === "studio" || onStudio
                  ? "bg-ink text-white"
                  : "text-ink-2 hover:bg-paper"
              }`}
              onClick={() => toggle("studio")}
            >
              Studio
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${open === "studio" ? "rotate-180" : ""}`}
              />
            </button>
            <button
              type="button"
              aria-expanded={open === "tools"}
              className={`mkt-nav inline-flex items-center gap-1 rounded-full px-3.5 py-2 transition ${
                open === "tools" || onTools
                  ? "bg-ink text-white"
                  : "text-ink-2 hover:bg-paper"
              }`}
              onClick={() => toggle("tools")}
            >
              Tools
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${open === "tools" ? "rotate-180" : ""}`}
              />
            </button>
            <Link
              href="/templates"
              className={navLinkClass(onPacks)}
              onClick={() => setOpen(null)}
            >
              Packs
            </Link>
            <Link
              href="/pricing"
              className={navLinkClass(onPricing)}
              onClick={() => setOpen(null)}
            >
              Pricing
            </Link>
            <button
              type="button"
              aria-expanded={open === "guides"}
              className={`mkt-nav inline-flex items-center gap-1 rounded-full px-3.5 py-2 transition ${
                open === "guides" || onGuides
                  ? "bg-ink text-white"
                  : "text-ink-2 hover:bg-paper"
              }`}
              onClick={() => toggle("guides")}
            >
              Guides
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${open === "guides" ? "rotate-180" : ""}`}
              />
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="mkt-nav hidden rounded-full border border-line px-3 py-2 text-ink-2 transition hover:-translate-y-0.5 sm:inline"
            >
              Demo
            </Link>
            <MagneticLink
              href="/sign-up"
              className="btn btn-primary btn-compact !px-3 sm:!px-4"
            >
              Start free
            </MagneticLink>
            <button
              type="button"
              className="rounded-xl p-2 lg:hidden"
              onClick={() => {
                setMobile((v) => !v);
                setOpen(null);
              }}
              aria-label="Menu"
            >
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-line/80 bg-white/95">
            <div className="hidden px-5 py-6 lg:block">
              {open === "studio" ? (
                <div>
                  <p className="mkt-label mb-3">
                    Built for how you sell Shopify work
                  </p>
                  <div className="grid gap-2 md:grid-cols-3">
                    {BUSINESS_TYPES.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/business-type/${item.slug}`}
                        className={`rounded-2xl border p-4 transition hover:border-accent/35 hover:bg-paper ${
                          pathname === `/business-type/${item.slug}`
                            ? "border-accent/40 bg-paper"
                            : "border-line"
                        }`}
                        onClick={() => setOpen(null)}
                      >
                        <p className="mkt-row">{item.title}</p>
                        <p className="mkt-meta mt-1">{item.blurb}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {open === "tools" ? (
                <div className="grid gap-8 md:grid-cols-3">
                  {TOOL_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="mkt-label">
                        {group.label}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {group.slugs.map((slug) => {
                          const item = PRODUCT_LINKS.find((p) => p.slug === slug);
                          if (!item) return null;
                          return (
                            <li key={slug}>
                              <Link
                                href={`/product/${item.slug}`}
                                className="block rounded-xl px-3 py-2.5 hover:bg-paper"
                                onClick={() => setOpen(null)}
                              >
                                <p className="mkt-row">
                                  {item.title}
                                  {COMING_SOON_PRODUCT_SLUGS.has(item.slug) ? (
                                    <span className="ml-2 mkt-chip text-muted">
                                      Soon
                                    </span>
                                  ) : null}
                                </p>
                                <p className="mkt-chip text-muted">
                                  {item.blurb}
                                </p>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}

              {open === "guides" ? (
                <div className="grid gap-2 md:grid-cols-2">
                  {RESOURCE_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl border border-line p-4 transition hover:border-accent/35 hover:bg-paper"
                      onClick={() => setOpen(null)}
                    >
                      <p className="mkt-row">{item.title}</p>
                      <p className="mkt-meta mt-1">{item.blurb}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {mobile ? (
          <div className="border-t border-line px-4 py-4 lg:hidden">
            <div className="mkt-nav space-y-1">
              <p className="mkt-label pt-1">
                Studio
              </p>
              {BUSINESS_TYPES.map((b) => (
                <Link
                  key={b.slug}
                  href={`/business-type/${b.slug}`}
                  onClick={() => setMobile(false)}
                  className="block py-2 text-ink-2"
                >
                  {b.title}
                </Link>
              ))}
              {TOOL_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mkt-label pt-3">
                    {group.label}
                  </p>
                  {group.slugs.map((slug) => {
                    const item = PRODUCT_LINKS.find((p) => p.slug === slug);
                    if (!item) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/product/${item.slug}`}
                        onClick={() => setMobile(false)}
                        className="block py-2 text-ink-2"
                      >
                        {item.title}
                        {COMING_SOON_PRODUCT_SLUGS.has(item.slug)
                          ? " · Soon"
                          : ""}
                      </Link>
                    );
                  })}
                </div>
              ))}
              <div className="mt-2 border-t border-line pt-2">
                <Link
                  href="/templates"
                  onClick={() => setMobile(false)}
                  className="block py-2"
                >
                  Packs
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobile(false)}
                  className="block py-2"
                >
                  Pricing
                </Link>
                <Link
                  href="/resources"
                  onClick={() => setMobile(false)}
                  className="block py-2"
                >
                  Guides
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobile(false)}
                  className="block py-2"
                >
                  Demo workspace
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobile(false)}
                  className="block py-2"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
