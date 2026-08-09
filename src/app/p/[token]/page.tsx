import { BrandMark } from "@/components/BrandMark";
import { DEFAULT_BRANDING } from "@/lib/branding";
import { getProjectByShareToken } from "@/lib/projects-db";
import { getPortalPresentationByShareToken } from "@/lib/workspace-branding-db";
import { PortalView } from "./portal-view";

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [project, presentation] = await Promise.all([
    getProjectByShareToken(token),
    getPortalPresentationByShareToken(token).catch(() => ({
      branding: DEFAULT_BRANDING,
      showBadge: true,
    })),
  ]);

  if (!project) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-5">
        <div className="w-full rounded-3xl border border-line bg-white p-8 text-center shadow-lg">
          <BrandMark />
          <p className="mt-4 font-semibold">Portal not found</p>
          <p className="mt-2 text-sm text-muted">
            Ask your freelancer for a fresh link.
          </p>
        </div>
      </div>
    );
  }

  if (project.shareToken !== token) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-5">
        <div className="w-full rounded-3xl border border-line bg-white p-8 text-center shadow-lg">
          <BrandMark />
          <p className="mt-4 font-semibold">Portal not found</p>
          <p className="mt-2 text-sm text-muted">
            Ask your freelancer for a fresh link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PortalView
      project={project}
      branding={presentation.branding}
      showBadge={presentation.showBadge}
    />
  );
}
