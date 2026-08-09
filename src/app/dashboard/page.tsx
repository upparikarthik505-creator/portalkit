"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, FileStack, Plus } from "lucide-react";
import { NewProjectModal } from "@/components/NewProjectModal";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { CountMetric } from "@/components/motion/CountMetric";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { formatMoney, hydrateProjects } from "@/lib/store";
import { STATUS_CLASS, STATUS_LABELS, type Project } from "@/lib/types";

/**
 * Command — reuses tokens/components from design-system.md
 */

function greetingLabel() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setGreeting(greetingLabel());
    void hydrateProjects().then((list) => {
      setProjects(list);
      setLoaded(true);
    });
  }, [open]);

  const stats = useMemo(() => {
    const awaiting = projects
      .flatMap((p) => p.payments)
      .filter((pay) => pay.status === "sent")
      .reduce((s, pay) => s + pay.amountCents, 0);
    const paid = projects
      .flatMap((p) => p.payments)
      .filter((pay) => pay.status === "paid")
      .reduce((s, pay) => s + pay.amountCents, 0);
    return {
      pipeline: 0,
      awaiting,
      paid,
      active: projects.filter((p) => p.status !== "done").length,
    };
  }, [projects]);

  const empty = loaded && projects.length === 0;

  return (
    <div className="space-y-8">
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mkt-eyebrow">Command</p>
          <SplitHeadline
            as="h1"
            text={`${greeting}`}
            className="mkt-h2 mt-2"
          />
          <p className="mkt-lede mt-3">
            {empty
              ? "Your workspace is empty and private to you. Start a build to open the first client portal."
              : "Your Shopify client HQ — deals warming up, builds in flight, cash on the way."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MagneticLink
            href="/dashboard/files"
            className="btn btn-secondary btn-compact"
          >
            <FileStack className="h-4 w-4" aria-hidden />
            New offer pack
          </MagneticLink>
          <MagneticButton
            type="button"
            className="btn btn-primary btn-compact"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Start a build
          </MagneticButton>
        </div>
      </div>

      <OnboardingChecklist />

      <div className="dash-rise grid gap-6 border-y border-line py-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
        {(
          [
            [
              "Open deal value",
              stats.pipeline / 100,
              empty ? "Add your first deal" : "On the board",
              "/dashboard/pipeline",
              empty ? 0 : 0.75,
            ],
            [
              "Cash waiting",
              stats.awaiting / 100,
              empty ? "No invoices yet" : "Invoices out",
              "/dashboard/invoices",
              empty ? 0 : 0.45,
            ],
            [
              "Banked this cycle",
              stats.paid / 100,
              empty ? "Nothing paid yet" : "Marked paid",
              "/dashboard/invoices",
              empty ? 0 : 0.35,
            ],
            [
              "Builds live",
              stats.active,
              empty ? "Start your first build" : "In delivery",
              "/dashboard/projects",
              empty ? 0 : 0.6,
            ],
          ] as const
        ).map(([label, value, hint, href, bar], i) => (
          <Link
            key={label}
            href={href}
            className={`block xl:px-5 ${i > 0 ? "xl:border-l xl:border-line" : ""} ${i === 0 ? "xl:pl-0" : ""} ${i === 3 ? "xl:pr-0" : ""}`}
          >
            <CountMetric
              flat
              value={value}
              prefix={label === "Builds live" ? "" : "$"}
              decimals={0}
              label={label}
              hint={hint}
              bar={bar}
            />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="dash-rise overflow-hidden rounded-[var(--radius)] border border-line bg-paper-2 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="mkt-h3">Delivery queue</h2>
              <p className="mkt-meta mt-1 text-muted">
                Theme rebuilds, launches, and retainers in motion
              </p>
            </div>
            <MagneticLink
              href="/dashboard/projects"
              className="mkt-link inline-flex items-center gap-1"
            >
              All builds <ArrowUpRight className="h-4 w-4" aria-hidden />
            </MagneticLink>
          </div>
          {projects.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="mkt-row">No projects yet</p>
              <p className="mkt-meta mt-2 text-muted">
                This account starts with a clean database — nothing shared from
                demos or other users.
              </p>
              <MagneticButton
                type="button"
                className="btn btn-primary btn-compact mt-5"
                onClick={() => setOpen(true)}
              >
                <Plus className="h-4 w-4" aria-hidden />
                Create your first project
              </MagneticButton>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="dash-row flex flex-col gap-3 px-5 py-4 transition-colors duration-[var(--motion-micro)] hover:bg-paper md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="mkt-row">{project.name}</p>
                    <p className="mkt-meta mt-1 text-muted">
                      {project.clientName} · {project.storeUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`status-pill ${STATUS_CLASS[project.status]}`}
                    >
                      {STATUS_LABELS[project.status]}
                    </span>
                    <span className="mkt-meta text-muted">
                      Due {project.dueDate}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="dash-rise rounded-[var(--radius)] border border-line bg-ink p-5 text-white shadow-[var(--shadow)]">
            <p className="mkt-label text-white/55">Focus</p>
            <h2 className="mkt-h3 mt-1 text-white">
              {empty ? "First moves in your HQ" : "Three moves that unstick cash"}
            </h2>
            <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {(empty
                ? [
                    {
                      title: "Create your first client build",
                      hint: "Opens a private portal link",
                      href: "/dashboard/projects",
                    },
                    {
                      title: "Add a contact",
                      hint: "Keep Shopify store owners in one place",
                      href: "/dashboard/contacts",
                    },
                    {
                      title: "Review your plan",
                      hint: "14-day Pro trial included",
                      href: "/dashboard/billing",
                    },
                  ]
                : [
                    {
                      title: "Send a proposal",
                      hint: "Turn a warm lead into a signed scope",
                      href: "/dashboard/proposals",
                    },
                    {
                      title: "Request a milestone",
                      hint: "Attach payment asks to a live build",
                      href: "/dashboard/invoices",
                    },
                    {
                      title: "Share a client portal",
                      hint: "One link for files, status, and pay",
                      href: "/dashboard/projects",
                    },
                  ]
              ).map((a) => (
                <li key={a.title}>
                  <Link
                    href={a.href}
                    className="dash-row block py-3 transition-colors duration-[var(--motion-micro)] hover:text-accent"
                  >
                    <p className="mkt-row text-white">{a.title}</p>
                    <p className="mkt-meta mt-0.5 text-white/55">{a.hint}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="dash-rise rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="mkt-h3">Offers in flight</h2>
              <MagneticLink href="/dashboard/proposals" className="mkt-link">
                Open
              </MagneticLink>
            </div>
            <p className="mkt-meta text-muted">
              No proposals yet — they appear here when you create them.
            </p>
          </section>

          <section className="dash-rise rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="mkt-h3">Payout pulse</h2>
              <MagneticLink href="/dashboard/invoices" className="mkt-link">
                Open
              </MagneticLink>
            </div>
            {stats.awaiting + stats.paid === 0 ? (
              <p className="mkt-meta text-muted">
                No payment requests yet — add them on a project.
              </p>
            ) : (
              <p className="mkt-meta text-muted">
                Waiting {formatMoney(stats.awaiting)} · paid{" "}
                {formatMoney(stats.paid)}
              </p>
            )}
          </section>
        </div>
      </div>

      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
