/** Tilted framing panels — product/atmosphere stills (not competitor assets). */
const LEFT =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=640&q=80";
const RIGHT =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=640&q=80";

export function HeroPhotos() {
  return (
    <>
      <div
        aria-hidden
        className="hero-float pointer-events-none absolute -left-8 top-20 hidden w-[200px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_40px_rgba(31,31,35,0.08)] md:block lg:-left-4 lg:w-[240px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LEFT}
          alt=""
          className="h-56 w-full object-cover"
          loading="eager"
        />
        <div className="border-t border-line bg-white px-3 py-2">
          <p className="text-[11px] font-bold text-ink">Client kickoff</p>
          <p className="text-[10px] text-muted">Shopify theme rebuild</p>
        </div>
      </div>
      <div
        aria-hidden
        className="hero-float hero-float-delay pointer-events-none absolute -right-8 top-28 hidden w-[200px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_40px_rgba(31,31,35,0.08)] md:block lg:-right-4 lg:w-[240px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={RIGHT}
          alt=""
          className="h-64 w-full object-cover"
          loading="eager"
        />
        <div className="border-t border-line bg-white px-3 py-2">
          <p className="text-[11px] font-bold text-ink">Deposit paid</p>
          <p className="text-[10px] text-muted">$1,920 · Razorpay</p>
        </div>
      </div>
    </>
  );
}
