"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Receipt,
  Settings,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { BrandMark } from "./BrandMark";

const NAV = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/pipeline", label: "Pipeline", icon: Workflow },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/proposals", label: "Proposals", icon: FileText },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/billing", label: "Plan", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-line bg-paper-2 px-4 py-5 md:flex">
          <BrandMark />
          <p className="mt-2 px-1 text-[12px] leading-snug text-muted">
            Studio-grade client ops for Shopify freelancers
          </p>

          <nav className="mt-7 flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {NAV.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition ${
                    active
                      ? "bg-ink text-white"
                      : "text-muted hover:bg-paper hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative overflow-hidden rounded-2xl bg-ink p-4 text-white">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/50 blur-2xl" />
            <div className="relative">
              <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-signal">
                <Briefcase className="h-3.5 w-3.5" />
                Pro
              </div>
              <p className="display text-[18px] leading-snug">
                Unlimited clients, proposals & portals
              </p>
              <Link
                href="/dashboard/billing"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-accent px-3 py-2.5 text-[13px] font-bold text-white"
              >
                Upgrade — $19/mo
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper-2/90 px-4 py-3 backdrop-blur md:px-7">
            <div className="md:hidden">
              <BrandMark size="sm" />
            </div>
            <div className="hidden text-[13px] text-muted md:block">
              North Loop Studio · Shopify freelance workspace
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/p/aurora-maya-7k2"
                className="rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-bold text-ink"
              >
                Preview portal
              </Link>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-[12px] font-bold text-white">
                NL
              </div>
            </div>
          </header>
          <main className="px-4 py-5 md:px-7 md:py-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
