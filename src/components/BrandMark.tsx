export function BrandMark({
  size = "md",
  light = false,
  name = "PortalKit",
}: {
  size?: "sm" | "md" | "lg";
  light?: boolean;
  /** Override wordmark (e.g. studio name on client portal). */
  name?: string;
}) {
  const box =
    size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const text =
    size === "lg"
      ? "text-[24px]"
      : size === "sm"
        ? "text-[17px]"
        : "text-[19px]";

  return (
    <div className="group inline-flex items-center gap-2.5 transition-transform duration-150 ease-out hover:-translate-y-px hover:scale-[1.02]">
      <span
        className={`grid place-items-center rounded-[11px] bg-gradient-to-br from-accent to-accent-deep text-white shadow-[0_8px_18px_rgba(255,90,95,0.28)] transition-shadow duration-150 ease-out group-hover:shadow-[0_10px_22px_rgba(255,90,95,0.34)] ${box}`}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="currentColor">
          <path d="M12 2.2 19.2 6.4v8.4L12 19.0 4.8 14.8V6.4L12 2.2Zm0 2.4L7.2 7.4v6.4L12 16.4l4.8-2.6V7.4L12 4.6Z" />
        </svg>
      </span>
      <span
        className={`font-display font-bold tracking-[-0.04em] ${text} ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {name}
      </span>
    </div>
  );
}
