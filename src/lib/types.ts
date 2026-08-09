export type ProjectStatus =
  | "lead"
  | "offer_sent"
  | "signed"
  | "deposit_paid"
  | "in_build"
  | "done"
  | "lost";

/** Legacy statuses from earlier MVP — normalized on read. */
const LEGACY_STATUS: Record<string, ProjectStatus> = {
  todo: "lead",
  in_progress: "in_build",
  in_review: "signed",
  done: "done",
  lead: "lead",
  offer_sent: "offer_sent",
  signed: "signed",
  deposit_paid: "deposit_paid",
  in_build: "in_build",
  lost: "lost",
};

export function normalizeProjectStatus(raw: string): ProjectStatus {
  return LEGACY_STATUS[raw] ?? "lead";
}

export type ProjectFile = {
  id: string;
  name: string;
  sizeLabel: string;
  uploadedAt: string;
  storagePath?: string | null;
};

export type PaymentRequest = {
  id: string;
  label: string;
  amountCents: number;
  status: "draft" | "sent" | "paid";
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  storeUrl: string;
  status: ProjectStatus;
  dueDate: string;
  notes: string;
  shareToken: string;
  contactId?: string | null;
  files: ProjectFile[];
  payments: PaymentRequest[];
  updatedAt: string;
  createdAt: string;
};

export const PIPELINE_STAGES: {
  key: ProjectStatus;
  label: string;
  hint: string;
}[] = [
  { key: "lead", label: "Lead", hint: "Inquiry · not quoted" },
  { key: "offer_sent", label: "Offer sent", hint: "Proposal shared" },
  { key: "signed", label: "Signed", hint: "Contract accepted" },
  { key: "deposit_paid", label: "Deposit paid", hint: "Funded kickoff" },
  { key: "in_build", label: "In build", hint: "Theme work in flight" },
  { key: "done", label: "Done", hint: "Shipped · closed" },
  { key: "lost", label: "Lost", hint: "Did not book" },
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  lead: "Lead",
  offer_sent: "Offer sent",
  signed: "Signed",
  deposit_paid: "Deposit paid",
  in_build: "In build",
  done: "Done",
  lost: "Lost",
};

export const STATUS_CLASS: Record<ProjectStatus, string> = {
  lead: "status-todo",
  offer_sent: "status-review",
  signed: "status-progress",
  deposit_paid: "status-progress",
  in_build: "status-progress",
  done: "status-done",
  lost: "status-lost",
};
