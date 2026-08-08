"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { NewProjectModal } from "@/components/NewProjectModal";
import { loadProjects } from "@/lib/store";
import { STATUS_CLASS, STATUS_LABELS, type Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
  }, [open]);

  const filtered = projects.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.storeUrl.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#71717a]">
            Projects
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-syne)] text-[36px] tracking-[-0.035em]">
            Delivery workspace
          </h1>
          <p className="mt-1 text-[15px] text-[#71717a]">
            Theme builds, launches, and retainers — each with a live client portal.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#ff4f1a] px-4 py-2.5 text-[13px] font-bold text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New project
        </button>
      </div>

      <div className="rounded-2xl border border-[#e4e4e7] bg-white p-3 shadow-[0_10px_30px_rgba(16,35,28,0.04)]">
        <label className="flex items-center gap-2 rounded-xl border border-[#e4e4e7] bg-[#f4f4f5] px-3 py-2.5">
          <Search className="h-4 w-4 text-[#a1a1aa]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client, store, or project"
            className="w-full bg-transparent outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_10px_30px_rgba(16,35,28,0.04)] transition hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold leading-snug">{project.name}</h2>
                <p className="mt-1 text-[13px] text-[#71717a]">
                  {project.clientName} · {project.storeUrl}
                </p>
              </div>
              <span className={`status-pill ${STATUS_CLASS[project.status]}`}>
                {STATUS_LABELS[project.status]}
              </span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f4f4f5]">
              <div
                className="h-full rounded-full bg-[#ff4f1a]"
                style={{
                  width:
                    project.status === "done"
                      ? "100%"
                      : project.status === "in_review"
                        ? "75%"
                        : project.status === "in_progress"
                          ? "45%"
                          : "15%",
                }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-[13px] text-[#a1a1aa]">
              <span>{project.files.length} files</span>
              <span>{project.payments.length} payments</span>
              <span>Due {project.dueDate}</span>
            </div>
          </Link>
        ))}
      </div>

      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
