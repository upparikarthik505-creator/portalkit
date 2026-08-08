import { DEMO_PROPOSALS } from "@/lib/demo-data";
import { formatMoney } from "@/lib/money";

const STATUS_STYLE = {
  draft: "bg-[#f4f4f5] text-[#50645a]",
  sent: "bg-[#e7eefc] text-[#2f4f9b]",
  viewed: "bg-[#fff4e3] text-[#8a5a12]",
  accepted: "bg-[#ffe8e0] text-[#09090b]",
};

export default function ProposalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#71717a]">
            Proposals
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-syne)] text-[36px] tracking-[-0.035em]">
            Send offers clients accept
          </h1>
          <p className="mt-1 text-[15px] text-[#71717a]">
            Bonsai-style proposals scoped for Shopify theme & launch packages.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#ff4f1a] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          + New proposal
        </button>
      </div>

      <div className="grid gap-3">
        {DEMO_PROPOSALS.map((proposal) => (
          <article
            key={proposal.id}
            className="flex flex-col gap-4 rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_10px_30px_rgba(16,35,28,0.04)] md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold">{proposal.title}</p>
              <p className="mt-1 text-[13px] text-[#71717a]">
                {proposal.clientName} · Sent {proposal.sentAt}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[proposal.status]}`}
              >
                {proposal.status}
              </span>
              <p className="font-[family-name:var(--font-syne)] text-[24px]">
                {formatMoney(proposal.amountCents)}
              </p>
              <button
                type="button"
                className="rounded-full border border-[#e4e4e7] px-3 py-2 text-[12px] font-bold"
              >
                Open
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
