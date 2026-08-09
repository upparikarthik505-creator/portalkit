"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type { WorkspacePlanInfo } from "@/lib/workspace-plan";
import {
  CalendarDays,
  FileStack,
  FileText,
  FolderKanban,
  FormInput,
  LayoutDashboard,
  Menu,
  Receipt,
  Settings,
  Sparkles,
  SquareCheckBig,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { BrandMark } from "./BrandMark";
import { DashboardMotion } from "./dashboard/DashboardMotion";
import { MagneticLink } from "./motion/MagneticLink";

/**
 * Dashboard chrome — reuses tokens/components from design-system.md
 * Surfaces: paper-2 shell, paper sidebar cards, accent active nav
 */

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const NAV_GROUPS = [
  {
    label: "Run the day",
    items: [
      { href: "/dashboard", label: "Command", icon: LayoutDashboard },
      { href: "/dashboard/pipeline", label: "Deal board", icon: Workflow },
      { href: "/dashboard/projects", label: "Delivery", icon: FolderKanban },
      {
        href: "/dashboard/tasks",
        label: "Tasks",
        icon: SquareCheckBig,
      },
      {
        href: "/dashboard/calendar",
        label: "Calendar",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "Win work",
    items: [
      { href: "/dashboard/contacts", label: "People", icon: Users },
      {
        href: "/dashboard/lead-forms",
        label: "Intake",
        icon: FormInput,
      },
      {
        href: "/dashboard/proposals",
        label: "Offers",
        icon: FileText,
      },
      {
        href: "/dashboard/ai",
        label: "AI drafts",
        icon: Sparkles,
      },
      {
        href: "/dashboard/projects",
        label: "Files",
        icon: FileStack,
      },
    ],
  },
  {
    label: "Get paid",
    items: [
      { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
      {
        href: "/dashboard/automations",
        label: "Flows",
        icon: Zap,
      },
      { href: "/dashboard/billing", label: "Plan", icon: Sparkles },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="mkt-label px-3 pb-1.5 text-muted">{group.label}</p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`mkt-nav flex items-center gap-2.5 rounded-[calc(var(--radius)-4px)] px-3 py-2.5 transition-[color,background-color,transform] duration-[var(--motion-micro)] ease-out ${
                    active
                      ? "bg-accent text-white"
                      : "text-ink-2 hover:bg-paper"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${active ? "text-white" : "text-accent"}`}
                    aria-hidden
                  />
                  <span className="flex-1">{item.label}</span>
                  {"soon" in item && item.soon ? (
                    <span
                      className={`mkt-chip text-[10px] ${
                        active ? "text-white/80" : "text-muted"
                      }`}
                    >
                      Soon
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function WorkspaceCard() {
  const [plan, setPlan] = useState<WorkspacePlanInfo | null>(null);

  useEffect(() => {
    void fetch("/api/workspace/branding")
      .then((r) => r.json())
      .then(
        (data: {
          plan?: WorkspacePlanInfo;
          branding?: { studioName?: string };
        }) => {
          if (data.plan) {
            setPlan(data.plan);
            return;
          }
          setPlan({
            plan: "starter",
            studioName: data.branding?.studioName || "My studio",
            onTrial: true,
            trialDaysLeft: 14,
            label: "Pro trial · 14 days left",
          });
        },
      )
      .catch(() => {
        setPlan({
          plan: "starter",
          studioName: "My studio",
          onTrial: false,
          trialDaysLeft: 0,
          label: "Starter",
        });
      });
  }, []);

  const studio = plan?.studioName ?? "My studio";
  const label = plan?.label ?? "Pro trial";
  const showUpgrade = !plan || (plan.plan === "starter" && !plan.onTrial);
  const slots =
    plan &&
    (plan.plan === "pro" || plan.plan === "founder" || plan.onTrial)
      ? "Unlimited active projects"
      : "Starter · 1 active project";

  return (
    <div className="mx-1 rounded-[var(--radius)] border border-line bg-paper p-4 shadow-[var(--shadow)]">
      <p className="mkt-label text-muted">Workspace</p>
      <p className="mkt-row mt-1">{studio}</p>
      <p className="mkt-meta mt-1 text-muted">{label}</p>
      <p className="mkt-chip mt-1 text-muted">{slots}</p>
      {showUpgrade ? (
        <MagneticLink
          href="/dashboard/billing"
          className="btn btn-primary btn-compact mt-3 w-full"
        >
          {plan?.onTrial ? "Keep Pro after trial" : "Unlock Pro"}
        </MagneticLink>
      ) : null}
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dash-root min-h-screen text-ink">
      <div className="dash-ambient" aria-hidden />
      <div className="relative mx-auto flex w-full max-w-[1520px]">
        <aside className="sticky top-0 z-30 hidden h-screen w-[252px] shrink-0 flex-col border-r border-line bg-paper-2/90 px-3 py-4 backdrop-blur-xl md:flex">
          <div className="px-2 pb-3">
            <Link href="/">
              <BrandMark />
            </Link>
            <p className="mkt-meta mt-2 text-muted">
              Freelancer OS for Shopify work
            </p>
          </div>

          <nav className="mt-2 flex-1 overflow-y-auto px-0.5" aria-label="Workspace">
            <NavLinks pathname={pathname} />
          </nav>

          <WorkspaceCard />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-paper-2/90 px-4 py-3 backdrop-blur-xl md:px-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-[calc(var(--radius)-4px)] border border-line bg-paper-2 md:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-4 w-4" aria-hidden />
              </button>
              <div className="md:hidden">
                <BrandMark size="sm" />
              </div>
              <div className="hidden md:block">
                <p className="mkt-label text-muted">PortalKit workspace</p>
                <p className="mkt-meta mt-0.5 text-ink-2">
                  Themes · launches · retainers — one client HQ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasClerk ? (
                <UserButton />
              ) : (
                <div
                  className="grid h-9 w-9 place-items-center rounded-full bg-ink mkt-chip text-white"
                  aria-label="Demo user"
                >
                  FS
                </div>
              )}
            </div>
          </header>

          <main className="px-4 py-5 md:px-6 md:py-7">
            <DashboardMotion key={pathname}>{children}</DashboardMotion>
          </main>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-line bg-paper-2 p-4 shadow-[var(--shadow)]">
            <div className="mb-4 flex items-center justify-between">
              <BrandMark size="sm" />
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-[calc(var(--radius)-4px)] border border-line"
                aria-label="Close"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto" aria-label="Workspace">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
