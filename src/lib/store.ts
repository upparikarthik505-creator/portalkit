"use client";

import { nanoid } from "nanoid";
import { DEMO_PROJECTS } from "./demo-data";
import { formatMoney } from "./money";
import type { PaymentRequest, Project, ProjectFile, ProjectStatus } from "./types";

export { formatMoney };

const STORAGE_KEY = "portalkit.projects.v1";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadProjects(): Project[] {
  if (!canUseStorage()) return DEMO_PROJECTS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PROJECTS));
    return DEMO_PROJECTS;
  }
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return DEMO_PROJECTS;
  }
}

export function saveProjects(projects: Project[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProject(id: string) {
  return loadProjects().find((p) => p.id === id);
}

export function getProjectByToken(token: string) {
  return loadProjects().find((p) => p.shareToken === token);
}

export function createProject(input: {
  name: string;
  clientName: string;
  clientEmail: string;
  storeUrl: string;
  dueDate: string;
}): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: `prj_${nanoid(8)}`,
    name: input.name,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    storeUrl: input.storeUrl,
    status: "todo",
    dueDate: input.dueDate,
    notes: "",
    shareToken: nanoid(10),
    files: [],
    payments: [],
    updatedAt: now,
    createdAt: now,
  };
  const projects = [project, ...loadProjects()];
  saveProjects(projects);
  return project;
}

export function updateProjectStatus(id: string, status: ProjectStatus) {
  const projects = loadProjects().map((p) =>
    p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p,
  );
  saveProjects(projects);
  return projects.find((p) => p.id === id);
}

export function updateProjectNotes(id: string, notes: string) {
  const projects = loadProjects().map((p) =>
    p.id === id ? { ...p, notes, updatedAt: new Date().toISOString() } : p,
  );
  saveProjects(projects);
  return projects.find((p) => p.id === id);
}

export function addDemoFile(id: string, name: string): ProjectFile | undefined {
  const file: ProjectFile = {
    id: `f_${nanoid(6)}`,
    name,
    sizeLabel: `${(Math.random() * 4 + 0.2).toFixed(1)} MB`,
    uploadedAt: new Date().toISOString().slice(0, 10),
  };
  const projects = loadProjects().map((p) =>
    p.id === id
      ? {
          ...p,
          files: [file, ...p.files],
          updatedAt: new Date().toISOString(),
        }
      : p,
  );
  saveProjects(projects);
  return file;
}

export function addPayment(
  id: string,
  label: string,
  amountCents: number,
): PaymentRequest | undefined {
  const payment: PaymentRequest = {
    id: `pay_${nanoid(6)}`,
    label,
    amountCents,
    status: "sent",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  const projects = loadProjects().map((p) =>
    p.id === id
      ? {
          ...p,
          payments: [payment, ...p.payments],
          updatedAt: new Date().toISOString(),
        }
      : p,
  );
  saveProjects(projects);
  return payment;
}
