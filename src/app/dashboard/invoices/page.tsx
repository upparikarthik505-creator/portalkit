import { DEMO_INVOICES } from "@/lib/demo-data";
import { formatMoney } from "@/lib/money";

const STATUS_STYLE = {
  draft: "bg-[#f4f4f5] text-[#50645a]",
  sent: "bg-[#e7eefc] text-[#2f4f9b]",
  paid: "bg-[#ffe8e0] text-[#09090b]",
  overdue: "bg-[#fde8e8] text-[#9b2c2c]",
};

export default function InvoicesPage() {
  const outstanding = DEMO_INVOICES.filter(
    (i) => i.status === "sent" || i.status === "overdue",
  ).reduce((s, i) => s + i.amountCents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#71717a]">
            Invoices
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-syne)] text-[36px] tracking-[-0.035em]">
            Get paid faster
          </h1>
          <p className="mt-1 text-[15px] text-[#71717a]">
            Outstanding{" "}
            <span className="font-semibold text-[#ff4f1a]">
              {formatMoney(outstanding)}
            </span>{" "}
            · deposits, milestones, retainers
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#ff4f1a] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          + Create invoice
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
        <div className="hidden grid-cols-[0.7fr_1fr_1.2fr_0.7fr_0.7fr_0.7fr] gap-3 border-b border-[#f4f4f5] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#a1a1aa] md:grid">
          <span>Invoice</span>
          <span>Client</span>
          <span>Project</span>
          <span>Due</span>
          <span>Status</span>
          <span>Amount</span>
        </div>
        {DEMO_INVOICES.map((inv) => (
          <div
            key={inv.id}
            className="grid gap-2 border-b border-[#f4f4f5] px-5 py-4 last:border-b-0 md:grid-cols-[0.7fr_1fr_1.2fr_0.7fr_0.7fr_0.7fr] md:items-center md:gap-3"
          >
            <p className="font-semibold">{inv.number}</p>
            <p className="text-[13px] text-[#71717a]">{inv.clientName}</p>
            <p className="truncate text-[13px] text-[#71717a]">{inv.projectName}</p>
            <p className="text-[13px] text-[#71717a]">{inv.dueDate}</p>
            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[inv.status]}`}
            >
              {inv.status}
            </span>
            <p className="font-bold">{formatMoney(inv.amountCents)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
