export type ProjectStatus = "todo" | "in_progress" | "in_review" | "done";

export type ProjectFile = {
  id: string;
  name: string;
  sizeLabel: string;
  uploadedAt: string;
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
  files: ProjectFile[];
  payments: PaymentRequest[];
  updatedAt: string;
  createdAt: string;
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
};

export const STATUS_CLASS: Record<ProjectStatus, string> = {
  todo: "status-todo",
  in_progress: "status-progress",
  in_review: "status-review",
  done: "status-done",
};
