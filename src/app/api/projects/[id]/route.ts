import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth";
import {
  addPaymentForUser,
  getProjectById,
  listProjectsForUser,
  markPaymentPaidForUser,
  updateProjectForUser,
} from "@/lib/projects-db";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import type { ProjectStatus } from "@/lib/types";
import { normalizeProjectStatus, PIPELINE_STAGES } from "@/lib/types";
import { getPlanInfoForUser } from "@/lib/workspace-branding-db";
import {
  canAddActiveProject,
  isActiveProjectStatus,
} from "@/lib/workspace-plan";

const ALLOWED_STATUS = new Set(PIPELINE_STAGES.map((s) => s.key));

async function requireUser() {
  const userId = await requireAuthenticatedUserId();
  if (!userId) {
    return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  }
  return { userId };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as {
      status?: ProjectStatus;
      notes?: string;
    };

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        source: "local",
        project: null,
        message: "Supabase not configured — update via client store.",
      });
    }

    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    if (body.status) {
      const status = normalizeProjectStatus(body.status);
      if (!ALLOWED_STATUS.has(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      body.status = status;
    }

    if (body.status && isActiveProjectStatus(body.status)) {
      const [plan, existing, current] = await Promise.all([
        getPlanInfoForUser(auth.userId),
        listProjectsForUser(auth.userId),
        getProjectById(auth.userId, id),
      ]);
      if (!current) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const activeCount = existing.filter(
        (p) => p.id !== id && isActiveProjectStatus(p.status),
      ).length;
      if (
        !isActiveProjectStatus(current.status) &&
        !canAddActiveProject(plan, activeCount)
      ) {
        return NextResponse.json(
          {
            error:
              "Starter allows 1 active project. Upgrade to Pro to reopen another.",
            code: "PLAN_LIMIT_ACTIVE_PROJECTS",
            upgradeHref: "/dashboard/billing",
          },
          { status: 403 },
        );
      }
    }

    const project = await updateProjectForUser(auth.userId, id, body);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ source: "supabase", project });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as {
      action?: string;
      label?: string;
      amountCents?: number;
      paymentId?: string;
    };

    const auth = await requireUser();
    if ("error" in auth) return auth.error;

    if (body.action === "mark_payment_paid") {
      if (!body.paymentId) {
        return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
      }
      if (!isSupabaseConfigured()) {
        return NextResponse.json({
          source: "local",
          payment: null,
          message: "Supabase not configured — update via client store.",
        });
      }
      const payment = await markPaymentPaidForUser(
        auth.userId,
        id,
        body.paymentId,
      );
      if (!payment) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ source: "supabase", payment });
    }

    if (body.action !== "add_payment") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
    if (!body.label || typeof body.amountCents !== "number" || body.amountCents < 0) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        source: "local",
        payment: null,
        message: "Supabase not configured — create via client store.",
      });
    }

    const payment = await addPaymentForUser(
      auth.userId,
      id,
      body.label,
      body.amountCents,
      body.paymentId,
    );
    if (!payment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ source: "supabase", payment });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add payment" },
      { status: 500 },
    );
  }
}
