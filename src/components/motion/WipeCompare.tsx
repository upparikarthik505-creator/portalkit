"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Before/After wipe — interactive surface (card OK).
 * Tokens from design-system.md only.
 */
export function WipeCompare({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(52);
  const dragging = useRef(false);

  function setFromClientX(clientX: number) {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.min(92, Math.max(8, next)));
  }

  return (
    <div
      ref={root}
      className={`wipe-compare relative overflow-hidden rounded-[var(--radius)] border border-line bg-paper-2 shadow-[var(--shadow)] select-none ${className}`.trim()}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        setFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <div className="relative min-h-[220px] p-5 md:min-h-[260px] md:p-7">
        <div className="pr-6">{after}</div>
        <div
          className="absolute inset-0 overflow-hidden bg-paper"
          style={{ width: `${pct}%` }}
        >
          <div className="h-full w-[100vw] max-w-[720px] p-5 md:p-7">{before}</div>
        </div>
        <div
          className="absolute inset-y-0 z-10 w-0.5 bg-accent"
          style={{ left: `${pct}%` }}
        >
          <div
            className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-paper-2 bg-accent mkt-chip text-white shadow-[var(--shadow)]"
            aria-hidden
          >
            ⟷
          </div>
        </div>
      </div>
      <div className="flex justify-between border-t border-line px-4 py-2">
        <span className="mkt-label text-muted">{beforeLabel}</span>
        <span className="mkt-label text-muted">{afterLabel}</span>
      </div>
    </div>
  );
}
