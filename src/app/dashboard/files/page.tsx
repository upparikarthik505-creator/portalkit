"use client";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-2">
            Offer packs
          </p>
          <SplitHeadline
            as="h1"
            text="Scopes clients can say yes to"
            className="mt-1 text-[34px] font-extrabold tracking-[-0.04em] md:text-[40px]"
          />
          <p className="mt-2 text-[15px] text-muted">
            Booking packs and offer files will land here — this list starts empty.
          </p>
        </div>
        <MagneticButton
          type="button"
          className="btn btn-secondary !py-2.5 !text-[13px]"
          disabled
        >
          Coming soon
        </MagneticButton>
      </div>
      <div className="rounded-2xl border border-line bg-white/95 px-5 py-12 text-center shadow-[0_14px_34px_rgba(31,31,35,0.06)]">
        <p className="text-[16px] font-extrabold tracking-[-0.02em]">
          No offer packs yet
        </p>
        <p className="mt-2 text-[14px] text-muted">
          Nothing is preloaded. Create packs when you are ready.
        </p>
      </div>
    </div>
  );
}
