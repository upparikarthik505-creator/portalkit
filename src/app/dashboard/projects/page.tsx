"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { NewProjectModal } from "@/components/NewProjectModal";
import { HoverTiltCard } from "@/components/motion/HoverTiltCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { hydrateProjects } from "@/lib/store";
import { STATUS_CLASS, STATUS_LABELS, type Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void hydrateProjects().then(setProjects);
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
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-2">
            Delivery
          </p>
          <SplitHeadline
            as="h1"
            text="Builds with a live client portal"
            className="mt-1 text-[34px] font-extrabold tracking-[-0.04em] md:text-[40px]"
          />
          <p className="mt-2 text-[15px] text-muted">
            Theme rebuilds, launches, and retainers — one workspace per store.
          </p>
        </div>
        <MagneticButton
          type="button"
          className="btn btn-primary !py-2.5 !text-[13px]"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Start a build
        </MagneticButton>
      </div>

      <div className="dash-rise rounded-2xl border border-line bg-white/95 p-3 shadow-[0_14px_34px_rgba(31,31,35,0.06)]">
        <label className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client, store, or project"
            className="w-full bg-transparent outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="dash-rise col-span-full rounded-2xl border border-line bg-white/95 px-5 py-12 text-center shadow-[0_14px_34px_rgba(31,31,35,0.06)]">
            <p className="text-[16px] font-extrabold tracking-[-0.02em]">
              No builds yet
            </p>
            <p className="mt-2 text-[14px] text-muted">
              Your delivery board starts empty — create the first project for
              this account.
            </p>
            <MagneticButton
              type="button"
              className="btn btn-primary !py-2.5 !text-[13px] mt-5"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Start a build
            </MagneticButton>
          </div>
        ) : (
          filtered.map((project) => (
          <HoverTiltCard key={project.id} intensity={0.95} className="dash-rise">
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="dash-card-3d block rounded-2xl border border-line bg-white/95 p-5 shadow-[0_14px_34px_rgba(31,31,35,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold leading-snug">{project.name}</h2>
                  <p className="mt-1 text-[13px] text-muted">
                    {project.clientName} · {project.storeUrl}
                  </p>
                </div>
                <span className={`status-pill ${STATUS_CLASS[project.status]}`}>
                  {STATUS_LABELS[project.status]}
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{
                    width:
                      project.status === "done"
                        ? "100%"
                        : project.status === "in_build"
                          ? "80%"
                          : project.status === "deposit_paid"
                            ? "65%"
                            : project.status === "signed"
                              ? "50%"
                              : project.status === "offer_sent"
                                ? "35%"
                                : project.status === "lost"
                                  ? "0%"
                                  : "15%",
                  }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-[13px] text-muted-2">
                <span>{project.files.length} files</span>
                <span>{project.payments.length} payments</span>
                <span>Due {project.dueDate}</span>
              </div>
            </Link>
          </HoverTiltCard>
        ))
        )}
      </div>

      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
