import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import {
  createProjectForUser,
  listProjectsForUser,
} from "@/lib/projects-db";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { getPlanInfoForUser } from "@/lib/workspace-branding-db";
import {
  canAddActiveProject,
  isActiveProjectStatus,
} from "@/lib/workspace-plan";

async function requireUser() {
  const userId = await requireAuthenticatedUserId();
  if (!userId) {
    return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  }
  return { userId };
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        source: "local",
        projects: [],
        message: "Supabase not configured — client uses localStorage.",
      });
    }

    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    const projects = await listProjectsForUser(auth.userId);
    return NextResponse.json({ source: "supabase", projects });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      id?: string;
      shareToken?: string;
      name?: string;
      clientName?: string;
      clientEmail?: string;
      storeUrl?: string;
      dueDate?: string;
      contactId?: string | null;
    };

    if (!body.name || !body.clientName || !body.clientEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        source: "local",
        project: null,
        message: "Supabase not configured — create via client store.",
      });
    }

    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    const [plan, existing] = await Promise.all([
      getPlanInfoForUser(auth.userId),
      listProjectsForUser(auth.userId),
    ]);
    const activeCount = existing.filter((p) =>
      isActiveProjectStatus(p.status),
    ).length;
    if (!canAddActiveProject(plan, activeCount)) {
      return NextResponse.json(
        {
          error:
            "Starter allows 1 active project. Mark one Done or upgrade to Pro.",
          code: "PLAN_LIMIT_ACTIVE_PROJECTS",
          upgradeHref: "/dashboard/billing",
        },
        { status: 403 },
      );
    }

    const project = await createProjectForUser(auth.userId, {
      id: body.id,
      shareToken: body.shareToken,
      name: body.name,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      storeUrl: body.storeUrl ?? "",
      dueDate: body.dueDate ?? "",
      contactId: body.contactId ?? null,
    });

    return NextResponse.json({ source: "supabase", project });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
