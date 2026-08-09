"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LayoutList, Plus } from "lucide-react";
import { HoverTiltCard } from "@/components/motion/HoverTiltCard";
import { MagneticChip } from "@/components/motion/MagneticChip";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { formatMoney } from "@/lib/money";
import { hydrateProjects, updateProjectStatus } from "@/lib/store";
import {
  PIPELINE_STAGES,
  type Project,
  type ProjectStatus,
} from "@/lib/types";

const STAGES = PIPELINE_STAGES;

function openValueCents(project: Project) {
  return project.payments
    .filter((p) => p.status !== "paid")
    .reduce((sum, p) => sum + p.amountCents, 0);
}

function relativeWhen(iso: string) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function PipelinePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    setProjects(await hydrateProjects());
  }

  useEffect(() => {
    void refresh();
  }, []);

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(
      STAGES.map((s) => [s.key, [] as Project[]]),
    ) as Record<ProjectStatus, Project[]>;
    for (const p of projects) {
      (map[p.status] ?? map.lead).push(p);
    }
    return map;
  }, [projects]);

  const totalOpen = projects
    .filter((p) => p.status !== "done" && p.status !== "lost")
    .reduce((sum, p) => sum + openValueCents(p), 0);

  function moveProject(id: string, status: ProjectStatus) {
    setBusyId(id);
    updateProjectStatus(id, status);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
    void hydrateProjects()
      .then(setProjects)
      .finally(() => setBusyId(null));
  }

  return (
    <div className="space-y-5">
      <div className="dash-rise flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted-2">
            Deal board
          </p>
          <SplitHeadline
            as="h1"
            text="From first ping to launch day"
            className="mt-1 text-[32px] font-extrabold tracking-[-0.035em] md:text-[38px]"
          />
          <p className="mt-2 text-[14px] text-muted">
            Live project status ·{" "}
            <span className="font-semibold text-accent">
              {formatMoney(totalOpen)} open
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <MagneticChip
            href="/dashboard/projects"
            className="btn btn-secondary !py-2.5 !text-[13px]"
          >
            <LayoutList className="h-4 w-4" />
            Delivery list
          </MagneticChip>
          <MagneticChip
            href="/dashboard/projects"
            className="btn btn-primary !py-2.5 !text-[13px]"
          >
            <Plus className="h-4 w-4" />
            Add deal
          </MagneticChip>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 [perspective:1600px]">
        {STAGES.map((stage, si) => {
          const cards = byStatus[stage.key];
          const sum = cards.reduce((s, p) => s + openValueCents(p), 0);
          return (
            <div
              key={stage.key}
              className="dash-rise w-[272px] shrink-0 rounded-2xl border border-line/80 bg-white/75 p-3 shadow-[0_12px_32px_rgba(31,31,35,0.05)] backdrop-blur-md"
              style={{
                transform: `rotateY(${(si - 1.5) * -1.4}deg) translateZ(0)`,
              }}
            >
              <div className="mb-1 flex items-center justify-between px-1">
                <p className="text-[13px] font-extrabold">{stage.label}</p>
                <p className="text-[12px] font-bold text-accent">
                  {formatMoney(sum)}
                </p>
              </div>
              <p className="mb-3 px-1 text-[11px] text-muted-2">{stage.hint}</p>
              <div className="space-y-2">
                {cards.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-line bg-paper/60 px-3 py-8 text-center text-[12px] text-muted-2">
                    No projects here
                  </div>
                ) : (
                  cards.map((project) => (
                    <HoverTiltCard key={project.id} intensity={1.2}>
                      <SpotlightCard className="rounded-xl">
                        <div className="dash-card-3d rounded-xl border border-line bg-white p-3 shadow-sm">
                          <Link
                            href={`/dashboard/projects/${project.id}`}
                            className="block"
                          >
                            <p className="text-[13px] font-bold">
                              {project.name}
                            </p>
                            <p className="mt-0.5 text-[12px] text-muted">
                              {project.clientName} · {project.storeUrl}
                            </p>
                            <div className="mt-2.5 flex items-center justify-between">
                              <span className="text-[13px] font-extrabold text-accent">
                                {formatMoney(openValueCents(project))}
                              </span>
                              <span className="text-[11px] text-muted-2">
                                {relativeWhen(project.updatedAt)}
                              </span>
                            </div>
                          </Link>
                          <label className="mt-2 block">
                            <span className="sr-only">Move status</span>
                            <select
                              className="w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-[11px] font-semibold outline-none ring-accent/30 focus:ring-2 disabled:opacity-60"
                              value={project.status}
                              disabled={busyId === project.id}
                              onChange={(e) =>
                                moveProject(
                                  project.id,
                                  e.target.value as ProjectStatus,
                                )
                              }
                            >
                              {STAGES.map((s) => (
                                <option key={s.key} value={s.key}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </SpotlightCard>
                    </HoverTiltCard>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dash-rise rounded-2xl border border-line bg-gradient-to-r from-lavender via-white to-accent-soft p-4 text-[13px]">
        <p className="font-bold text-lavender-ink">Deal stages</p>
        <p className="mt-1 text-ink-2">
          Lead → Offer sent → Signed → Deposit paid → In build → Done. Changes
          here sync to the project page and client portal.
        </p>
      </div>
    </div>
  );
}
