"use client";

import { useCallback, useEffect, useState } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import type { Contact } from "@/lib/contacts-db";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  storeUrl: "",
  notes: "",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts");
      const data = (await res.json()) as { contacts?: Contact[]; error?: string };
      if (!res.ok) {
        setError(data.error || "Could not load contacts");
        return;
      }
      setContacts(data.contacts ?? []);
      setError(null);
    } catch {
      setError("Could not load contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function startEdit(c: Contact) {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      storeUrl: c.storeUrl,
      notes: c.notes,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/contacts", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setOpen(false);
      await load();
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function archive(id: string) {
    const res = await fetch("/api/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, archive: true }),
    });
    if (res.ok) await load();
  }

  return (
    <div className="space-y-5">
      <div className="dash-rise flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted-2">
            People
          </p>
          <SplitHeadline
            as="h1"
            text="Everyone around the store"
            className="mt-1 text-[32px] font-extrabold tracking-[-0.035em] md:text-[38px]"
          />
          <p className="mt-2 max-w-xl text-[14px] text-muted">
            Merchants and ops contacts — link them when you create a project.
          </p>
        </div>
        <MagneticButton
          type="button"
          className="btn btn-primary !py-2.5 !text-[13px]"
          onClick={startCreate}
        >
          + Add person
        </MagneticButton>
      </div>

      {error ? (
        <p className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink-2">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : contacts.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white/95 px-5 py-12 text-center shadow-[0_14px_34px_rgba(31,31,35,0.06)]">
          <p className="text-[16px] font-extrabold tracking-[-0.02em]">
            No people yet
          </p>
          <p className="mt-2 text-[14px] text-muted">
            Your workspace starts empty — contacts you add stay private to this
            account.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-semibold">{c.name}</p>
                <p className="truncate text-sm text-muted">
                  {c.email}
                  {c.company ? ` · ${c.company}` : ""}
                  {c.phone ? ` · ${c.phone}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-secondary !py-2 !text-[12px]"
                  onClick={() => startEdit(c)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary !py-2 !text-[12px]"
                  onClick={() => void archive(c.id)}
                >
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm">
          <form
            onSubmit={save}
            className="surface w-full max-w-lg space-y-3 p-6"
          >
            <h2 className="text-xl font-extrabold">
              {editing ? "Edit contact" : "New contact"}
            </h2>
            {(
              [
                ["name", "Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["company", "Company"],
                ["storeUrl", "Shopify store"],
                ["notes", "Notes"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-sm font-medium">{label}</span>
                <input
                  required={key === "name" || key === "email"}
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none ring-accent/30 focus:ring-2"
                />
              </label>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
