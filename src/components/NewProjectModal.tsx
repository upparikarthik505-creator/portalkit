"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createProject } from "@/lib/store";

export function NewProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    clientName: "",
    clientEmail: "",
    storeUrl: "",
    dueDate: "",
  });

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const project = createProject(form);
    onClose();
    router.push(`/dashboard/projects/${project.id}`);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm">
      <div className="surface w-full max-w-lg p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="display text-2xl">
              New client project
            </h2>
            <p className="mt-1 text-sm text-muted">
              Create a portal your Shopify client can open in one link.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-paper"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {(
            [
              ["name", "Project name", "Aurora Skincare — Theme rebuild"],
              ["clientName", "Client name", "Maya Chen"],
              ["clientEmail", "Client email", "maya@brand.com"],
              ["storeUrl", "Shopify store", "brand.myshopify.com"],
              ["dueDate", "Due date", ""],
            ] as const
          ).map(([key, label, placeholder]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                {label}
              </span>
              <input
                required
                type={key === "dueDate" ? "date" : key === "clientEmail" ? "email" : "text"}
                value={form[key]}
                placeholder={placeholder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
              />
            </label>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
