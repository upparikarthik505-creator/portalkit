"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  FolderKanban,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { generateChecklist } from "@/lib/ai-drafts";
import { hydrateProjects } from "@/lib/store";
import type { Project } from "@/lib/types";

export type WorkspaceTask = {
  id: string;
  projectId?: string | null;
  projectName?: string;
  title: string;
  done: boolean;
  dueDate?: string;
  createdAt: string;
};

const STORAGE_KEY_TASKS = "portalkit.workspace.tasks.v2";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

const INITIAL_TASKS: WorkspaceTask[] = [
  {
    id: "tsk_1",
    title: "Verify Shopify Payments test order transaction & tax zones",
    done: false,
    projectName: "Aura Skincare 2.0 Theme Rebuild",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tsk_2",
    title: "Configure 301 URL redirect table in Shopify Admin",
    done: false,
    projectName: "Nomad Roasters Replatform",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tsk_3",
    title: "Mobile drawer cart speed & Lighthouse 85+ audit",
    done: true,
    projectName: "Kith Apparel Rebuild",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tsk_4",
    title: "Request collaborator access for client store theme files",
    done: true,
    projectName: "Velvet Home Speed Audit",
    createdAt: new Date().toISOString(),
  },
];

export default function TasksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => {
    if (canUseStorage()) {
      const raw = localStorage.getItem(STORAGE_KEY_TASKS);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          /* fallback */
        }
      }
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
    }
    return INITIAL_TASKS;
  });
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "done">(
    "all",
  );
  const [newTitle, setNewTitle] = useState("");
  const [newProjectId, setNewProjectId] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    hydrateProjects().then(setProjects);
  }, []);

  function saveTaskList(list: WorkspaceTask[]) {
    setTasks(list);
    if (canUseStorage()) {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(list));
    }
  }

  function handleToggle(id: string) {
    const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveTaskList(next);
  }

  function handleDelete(id: string) {
    const next = tasks.filter((t) => t.id !== id);
    saveTaskList(next);
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const prj = projects.find((p) => p.id === newProjectId);
    const newTask: WorkspaceTask = {
      id: `tsk_${Date.now()}`,
      title: newTitle.trim(),
      projectId: newProjectId || null,
      projectName: prj?.name,
      done: false,
      createdAt: new Date().toISOString(),
    };

    saveTaskList([newTask, ...tasks]);
    setNewTitle("");
  }

  function handleAiGenerateChecklist() {
    const prj = projects.find((p) => p.id === newProjectId);
    const store = prj?.name || "Shopify Store";
    const generated = generateChecklist("launch_qa", store);

    const newGeneratedTasks: WorkspaceTask[] = generated.map((title, i) => ({
      id: `tsk_ai_${Date.now()}_${i}`,
      title,
      projectId: newProjectId || null,
      projectName: prj?.name,
      done: false,
      createdAt: new Date().toISOString(),
    }));

    saveTaskList([...newGeneratedTasks, ...tasks]);
    setToast(`✓ Added ${generated.length} Launch QA tasks`);
    setTimeout(() => setToast(null), 3000);
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterProject !== "all") {
        if (filterProject === "unassigned" && t.projectId) return false;
        if (filterProject !== "unassigned" && t.projectId !== filterProject)
          return false;
      }
      if (filterStatus === "pending" && t.done) return false;
      if (filterStatus === "done" && !t.done) return false;
      return true;
    });
  }, [tasks, filterProject, filterStatus]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>{toast}</span>
        </div>
      ) : null}

      {/* Header */}
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mkt-eyebrow">Execution HQ</p>
          <SplitHeadline
            as="h1"
            text="What needs doing next"
            className="mkt-h2 mt-1"
          />
          <p className="mkt-lede mt-2 max-w-2xl">
            Centralized task manager for theme QA, client collaborator
            checklists, and pre-launch checklists across all active builds.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAiGenerateChecklist}
            className="btn btn-secondary btn-compact"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            AI Launch Checklist
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-4 shadow-[var(--shadow)]">
          <p className="mkt-label text-muted">Pending Tasks</p>
          <p className="mkt-metric mt-1 text-ink">{stats.pending}</p>
        </div>
        <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-4 shadow-[var(--shadow)]">
          <p className="mkt-label text-muted">Completed</p>
          <p className="mkt-metric mt-1 text-mint-ink">{stats.completed}</p>
        </div>
        <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-4 shadow-[var(--shadow)]">
          <p className="mkt-label text-muted">Total Tasks</p>
          <p className="mkt-metric mt-1 text-muted">{stats.total}</p>
        </div>
      </div>

      {/* Quick Task Add Form */}
      <form
        onSubmit={handleAddTask}
        className="flex flex-col gap-2 rounded-[var(--radius)] border border-line bg-paper-2 p-4 shadow-[var(--shadow)] md:flex-row md:items-center"
      >
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task (e.g. Test mobile cart drawer on Safari)..."
          className="flex-1 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent"
        />
        <select
          value={newProjectId}
          onChange={(e) => setNewProjectId(e.target.value)}
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-xs text-ink-2"
        >
          <option value="">No project (General task)</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary btn-compact">
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted uppercase">
            Filter by:
          </span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink-2"
          >
            <option value="all">All Projects</option>
            <option value="unassigned">General / No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1">
          {(["all", "pending", "done"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition-colors ${
                filterStatus === st
                  ? "bg-ink text-white"
                  : "bg-paper text-muted hover:text-ink"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-paper-2 shadow-[var(--shadow)]">
        {filteredTasks.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted">
            <CheckCircle2 className="mx-auto h-8 w-8 text-muted opacity-40" />
            <p className="mkt-row mt-2">No tasks found</p>
            <p className="text-xs text-muted mt-1">
              Add a new task or generate a launch QA checklist above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-paper/50"
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggle(t.id)}
                    className="mt-0.5 text-muted hover:text-accent transition-colors"
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-5 w-5 text-mint-ink" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted" />
                    )}
                  </button>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        t.done ? "text-muted line-through" : "text-ink"
                      }`}
                    >
                      {t.title}
                    </p>
                    {t.projectName ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent mt-0.5">
                        <FolderKanban className="h-3 w-3" />
                        {t.projectName}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {t.projectId ? (
                    <Link
                      href={`/dashboard/projects/${t.projectId}`}
                      className="text-muted hover:text-ink p-1"
                      title="Open project portal"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="text-muted hover:text-accent-deep p-1"
                    title="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
