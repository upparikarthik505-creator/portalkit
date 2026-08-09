/**
 * Clerk appearance — PortalKit design-system.md tokens only.
 * Accent coral, paper surfaces, Syne/Figtree, 16px radius.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#FF5A5F",
    colorDanger: "#E8464C",
    colorSuccess: "#1F8A5B",
    colorWarning: "#B7791F",
    colorNeutral: "#1F1F23",
    colorText: "#1F1F23",
    colorTextSecondary: "#6D6A73",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#1F1F23",
    borderRadius: "16px",
    fontFamily: "var(--font-figtree), ui-sans-serif, system-ui, sans-serif",
    fontFamilyButtons: "var(--font-figtree), ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    rootBox: "mx-auto w-full",
    cardBox: "shadow-none",
    card: "border border-[var(--line)] bg-[var(--paper-2)] shadow-[var(--shadow)] rounded-[var(--radius)]",
    headerTitle:
      "font-[family-name:var(--font-syne)] font-bold tracking-[-0.03em] text-[var(--ink)]",
    headerSubtitle: "text-[var(--muted)] font-medium",
    socialButtonsBlockButton:
      "border border-[var(--line)] hover:bg-[var(--paper)] transition-colors",
    formButtonPrimary:
      "bg-[var(--accent)] hover:bg-[var(--accent-deep)] text-white shadow-none !rounded-[14px] font-bold",
    footerActionLink:
      "text-[var(--accent)] hover:text-[var(--accent-deep)] font-bold",
    identityPreviewEditButton: "text-[var(--accent)]",
    formFieldInput:
      "border border-[var(--line)] rounded-[14px] focus:ring-2 focus:ring-[var(--accent)]",
    formFieldLabel: "text-[var(--ink-2)] font-semibold text-[13px]",
    dividerLine: "bg-[var(--line)]",
    dividerText: "text-[var(--muted)]",
  },
};
