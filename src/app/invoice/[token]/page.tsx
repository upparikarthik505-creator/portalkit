import { BrandMark } from "@/components/BrandMark";
import { DEFAULT_BRANDING } from "@/lib/branding";
import { formatMoney } from "@/lib/money";
import { getProjectByShareToken } from "@/lib/projects-db";
import { getBrandingByShareToken } from "@/lib/workspace-branding-db";
import Link from "next/link";

/** Branded invoice page — payment asks for a shared project. */
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [project, branding] = await Promise.all([
    getProjectByShareToken(token),
    getBrandingByShareToken(token).catch(() => DEFAULT_BRANDING),
  ]);

  if (!project) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-5">
        <div className="w-full rounded-3xl border border-line bg-white p-8 text-center">
          <BrandMark />
          <p className="mt-4 font-semibold">Invoice not found</p>
        </div>
      </div>
    );
  }

  const studio = branding.studioName || "Studio";
  const accent = branding.accent || DEFAULT_BRANDING.accent;

  return (
    <div
      className="min-h-screen bg-paper px-4 py-10"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted-2">
            Invoice · {studio}
          </p>
          <BrandMark name={studio} />
        </div>
        <section className="rounded-[24px] border border-line bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-extrabold tracking-[-0.03em]">
            {project.name}
          </h1>
          <p className="mt-2 text-muted">
            Bill to {project.clientName} · {project.clientEmail}
          </p>
          <div className="mt-6 space-y-3">
            {project.payments.length === 0 ? (
              <p className="text-sm text-muted">No line items yet.</p>
            ) : (
              project.payments.map((pay) => (
                <div
                  key={pay.id}
                  className="flex items-center justify-between gap-3 border-b border-line py-3"
                >
                  <div>
                    <p className="font-medium">{pay.label}</p>
                    <p className="text-xs capitalize text-muted">{pay.status}</p>
                  </div>
                  <p className="font-extrabold">{formatMoney(pay.amountCents)}</p>
                </div>
              ))
            )}
          </div>
          <Link
            href={`/p/${token}`}
            className="btn btn-primary mt-8 inline-flex"
          >
            Open portal to pay
          </Link>
        </section>
      </div>
    </div>
  );
}
