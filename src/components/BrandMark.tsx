export function BrandMark({
  size = "md",
  light = false,
}: {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const text =
    size === "lg" ? "text-[28px]" : size === "sm" ? "text-[17px]" : "text-[20px]";
  return (
    <div className="inline-flex items-center gap-2.5">
      <span
        className={`relative grid place-items-center overflow-hidden rounded-2xl bg-ink text-white ${
          size === "lg" ? "h-11 w-11" : size === "sm" ? "h-8 w-8" : "h-9 w-9"
        }`}
        aria-hidden
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,79,26,0.9),transparent_55%)]" />
        <span className="absolute bottom-0 right-0 h-4 w-4 rounded-tl-2xl bg-signal" />
        <span className="relative font-[family-name:var(--font-syne)] text-[13px] font-extrabold">
          Pk
        </span>
      </span>
      <span
        className={`font-[family-name:var(--font-syne)] font-800 tracking-[-0.05em] ${text} ${
          light ? "text-white" : "text-ink"
        }`}
        style={{ fontWeight: 800 }}
      >
        PortalKit
      </span>
    </div>
  );
}
