"use client";

import { DEMO_LEADS, type Lead } from "@/lib/demo-data";
import { formatMoney } from "@/lib/money";

const STAGES: { key: Lead["stage"]; label: string }[] = [
  { key: "inquiry", label: "Inquiry" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal sent" },
  { key: "booked", label: "Booked" },
];

export default function PipelinePage() {
  const total = DEMO_LEADS.reduce((s, l) => s + l.valueCents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#71717a]">
            Pipeline
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-syne)] text-[36px] tracking-[-0.035em]">
            Lead → booked
          </h1>
          <p className="mt-1 text-[15px] text-[#71717a]">
            HoneyBook-style CRM board for Shopify store work ·{" "}
            <span className="font-semibold text-[#ff4f1a]">{formatMoney(total)} open</span>
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#ff4f1a] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          + Add lead
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage) => {
          const leads = DEMO_LEADS.filter((l) => l.stage === stage.key);
          const sum = leads.reduce((s, l) => s + l.valueCents, 0);
          return (
            <div
              key={stage.key}
              className="rounded-2xl border border-[#e4e4e7] bg-[#ffffff] p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-[13px] font-bold">{stage.label}</p>
                <p className="text-[12px] font-semibold text-[#ff4f1a]">
                  {formatMoney(sum)}
                </p>
              </div>
              <div className="space-y-2">
                {leads.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-xl border border-[#e4e4e7] bg-white p-3.5 shadow-[0_8px_20px_rgba(16,35,28,0.04)]"
                  >
                    <p className="font-semibold">{lead.company}</p>
                    <p className="mt-0.5 text-[12px] text-[#71717a]">
                      {lead.name} · {lead.source}
                    </p>
                    <p className="mt-2 truncate text-[11px] text-[#a1a1aa]">
                      {lead.storeUrl}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#ff4f1a]">
                        {formatMoney(lead.valueCents)}
                      </span>
                      <span className="text-[11px] text-[#a1a1aa]">
                        {lead.lastTouch}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
