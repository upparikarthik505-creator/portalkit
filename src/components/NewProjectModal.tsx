"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import type { Contact } from "@/lib/contacts-db";
import { createProjectGuarded } from "@/lib/store";

export function NewProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [upgradeHref, setUpgradeHref] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactId, setContactId] = useState("");
  const [form, setForm] = useState({
    name: "",
    clientName: "",
    clientEmail: "",
    storeUrl: "",
    dueDate: "",
  });

  useEffect(() => {
    if (!open) return;
    void fetch("/api/contacts")
      .then((r) => r.json())
      .then((data: { contacts?: Contact[] }) => {
        setContacts(data.contacts ?? []);
      })
      .catch(() => setContacts([]));
  }, [open]);

  if (!open) return null;

  function applyContact(id: string) {
    setContactId(id);
    const c = contacts.find((x) => x.id === id);
    if (!c) return;
    setForm((prev) => ({
      ...prev,
      clientName: c.name,
      clientEmail: c.email,
      storeUrl: c.storeUrl || prev.storeUrl,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUpgradeHref(null);
    setPending(true);
    const result = await createProjectGuarded({
      ...form,
      contactId: contactId || null,
    });
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      setUpgradeHref(result.upgradeHref ?? "/dashboard/billing");
      return;
    }
    onClose();
    router.push(`/dashboard/projects/${result.project.id}`);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm">
      <div className="surface w-full max-w-lg p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-extrabold tracking-[-0.02em] text-2xl">
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
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Link contact (optional)
            </span>
            <select
              value={contactId}
              onChange={(e) => applyContact(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
            >
              <option value="">New / enter manually</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.email}
                </option>
              ))}
            </select>
          </label>
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
                type={
                  key === "dueDate"
                    ? "date"
                    : key === "clientEmail"
                      ? "email"
                      : "text"
                }
                value={form[key]}
                placeholder={placeholder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
              />
            </label>
          ))}
          {error ? (
            <p className="rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-2">
              {error}{" "}
              {upgradeHref ? (
                <Link href={upgradeHref} className="font-semibold text-accent">
                  Upgrade
                </Link>
              ) : null}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary w-full !py-3"
          >
            {pending ? "Creating…" : "Create project"}
          </button>
        </form>
      </div>
    </div>
  );
}
