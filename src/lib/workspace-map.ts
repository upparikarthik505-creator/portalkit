/**
 * PortalKit workspace IA — freelancer OS for Shopify delivery.
 * Internal checklist only; not shown in the UI.
 */
export const PK_NAV = [
  "Command",
  "Deal board",
  "Delivery",
  "People",
  "Offer packs",
  "Calendar",
  "Flows",
  "Tasks",
  "Intake",
] as const;

/** Deal board columns for theme / launch / retainer work */
export const PK_DEAL_STAGES = [
  { key: "signal", label: "Signal" },
  { key: "qualify", label: "Qualify" },
  { key: "offer_out", label: "Offer out" },
  { key: "locked", label: "Locked in" },
  { key: "in_build", label: "In build" },
  { key: "shipped", label: "Shipped" },
] as const;

export const PK_PROJECT_TABS = [
  "Pulse",
  "Docs",
  "Payouts",
  "Tasks",
  "Notes",
  "Portal",
] as const;

export const PK_PORTAL_SECTIONS = [
  "Overview",
  "Docs",
  "Invoices",
  "Tasks",
  "Messages",
] as const;

export const PK_OFFER_PACK_PARTS = [
  "Scope",
  "Agreement",
  "Deposit",
  "Brief",
  "Services menu",
  "Booking pack",
] as const;
