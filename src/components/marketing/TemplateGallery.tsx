"use client";

import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { TEMPLATE_CATEGORIES, TEMPLATES } from "@/lib/marketing";
import { MagneticLink } from "@/components/motion/MagneticLink";

const TONE_BG = {
  accent: "bg-accent-soft",
  mint: "bg-mint",
  hero: "bg-hero",
} as const;

/** Template browse grid — interactive cards OK (design-system §5). */
export function TemplateGallery() {
  const [category, setCategory] = useState<(typeof TEMPLATE_CATEGORIES)[number]>(
    "All",
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      const catOk = category === "All" || t.category === category;
      const qOk =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.blurb.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [category, query]);

  return (
    <div>
      <div className="sticky top-[57px] z-40 border-b border-line bg-paper-2/95 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-0 flex-1 md:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates"
              className="mkt-body w-full rounded-[14px] border border-line bg-paper-2 py-2.5 pl-10 pr-4 text-ink outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`mkt-chip shrink-0 rounded-full px-3 py-1.5 transition-[color,background-color,border-color] duration-[var(--motion-micro)] ease-out ${
                  category === cat
                    ? "bg-ink text-white"
                    : "border border-line bg-paper-2 text-ink-2 hover:bg-paper"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <article
            key={t.name}
            className="group overflow-hidden rounded-[var(--radius)] border border-line bg-paper-2 shadow-[var(--shadow)] transition-[border-color,box-shadow] duration-[var(--motion-ui)] ease-out hover:border-accent/35"
          >
            <div
              className={`relative flex h-28 items-end p-4 ${TONE_BG[t.tone]}`}
            >
              <div className="rounded-[calc(var(--radius)-4px)] border border-line bg-paper-2 p-3">
                <FileText className="h-5 w-5 text-accent" aria-hidden />
              </div>
              {t.featured ? (
                <span className="mkt-chip absolute right-3 top-3 rounded-full bg-paper-2 px-2.5 py-1 text-ink">
                  Featured
                </span>
              ) : null}
            </div>
            <div className="p-5">
              <p className="mkt-eyebrow">{t.category}</p>
              <h3 className="mkt-h3 mt-2">{t.name}</h3>
              <p className="mkt-body mt-2">{t.blurb}</p>
              <MagneticLink
                href="/sign-up"
                className="btn btn-secondary btn-compact mt-4"
              >
                Use in PortalKit
              </MagneticLink>
            </div>
          </article>
        ))}
        {filtered.length === 0 ? (
          <p className="mkt-lede col-span-full py-12 text-center">
            No templates match that filter. Try another category or search.
          </p>
        ) : null}
      </section>
    </div>
  );
}
