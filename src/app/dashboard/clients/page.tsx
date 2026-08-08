import { DEMO_CLIENTS } from "@/lib/demo-data";
import { formatMoney } from "@/lib/money";

const STATUS_STYLE = {
  active: "bg-[#ffe8e0] text-[#09090b]",
  lead: "bg-[#fff4e3] text-[#8a5a12]",
  past: "bg-[#f4f4f5] text-[#50645a]",
};

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#71717a]">
            Clients
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-syne)] text-[36px] tracking-[-0.035em]">
            Your Shopify roster
          </h1>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#ff4f1a] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          + Add client
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
        <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.7fr_0.7fr] gap-3 border-b border-[#f4f4f5] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#a1a1aa] md:grid">
          <span>Client</span>
          <span>Store</span>
          <span>Email</span>
          <span>Lifetime</span>
          <span>Status</span>
        </div>
        {DEMO_CLIENTS.map((client) => (
          <div
            key={client.id}
            className="grid gap-2 border-b border-[#f4f4f5] px-5 py-4 last:border-b-0 md:grid-cols-[1.2fr_1fr_1fr_0.7fr_0.7fr] md:items-center md:gap-3"
          >
            <div>
              <p className="font-semibold">{client.name}</p>
              <p className="text-[12px] text-[#71717a]">{client.company}</p>
            </div>
            <p className="truncate text-[13px] text-[#71717a]">{client.storeUrl}</p>
            <p className="truncate text-[13px] text-[#71717a]">{client.email}</p>
            <p className="text-[13px] font-bold">
              {formatMoney(client.lifetimeCents)}
            </p>
            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[client.status]}`}
            >
              {client.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
