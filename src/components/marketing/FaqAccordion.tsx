"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqAccordion({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(items.length ? 0 : null);

  if (!items.length) return null;

  return (
    <div className="divide-y divide-line rounded-[var(--radius)] border border-line bg-paper-2 shadow-[var(--shadow)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.q}>
            <button
              type="button"
              id={buttonId}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-[var(--motion-micro)] ease-out hover:bg-paper/60"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="mkt-row text-ink">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-muted transition-transform duration-[var(--motion-micro)] ease-out ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={isOpen ? "px-5 pb-5" : undefined}
            >
              {isOpen ? (
                <p className="mkt-body text-muted">{item.a}</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
