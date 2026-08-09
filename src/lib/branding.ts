export type WorkspaceBranding = {
  studioName: string;
  accent: string;
  supportEmail: string;
};

export const DEFAULT_BRANDING: WorkspaceBranding = {
  studioName: "My studio",
  accent: "#FF5A5F",
  supportEmail: "",
};

export const BRANDING_STORAGE_KEY = "portalkit.branding.v1";

const ACCENT_RE = /^#[0-9A-Fa-f]{6}$/;

export function normalizeBranding(
  input: Partial<WorkspaceBranding>,
): WorkspaceBranding | { error: string } {
  const studioName = (input.studioName ?? "").trim();
  const supportEmail = (input.supportEmail ?? "").trim();
  const accent = (input.accent ?? "").trim();

  if (!studioName) return { error: "Studio name is required." };
  if (studioName.length > 80) return { error: "Studio name is too long." };
  if (!ACCENT_RE.test(accent)) {
    return { error: "Accent must be a hex color like #FF5A5F." };
  }
  if (supportEmail.length > 120) return { error: "Support email is too long." };
  if (supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
    return { error: "Support email looks invalid." };
  }

  return { studioName, accent: accent.toUpperCase(), supportEmail };
}

export function readLocalBranding(): WorkspaceBranding {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = window.localStorage.getItem(BRANDING_STORAGE_KEY);
    if (!raw) return DEFAULT_BRANDING;
    const parsed = JSON.parse(raw) as Partial<WorkspaceBranding>;
    const normalized = normalizeBranding({
      studioName: parsed.studioName ?? DEFAULT_BRANDING.studioName,
      accent: parsed.accent ?? DEFAULT_BRANDING.accent,
      supportEmail: parsed.supportEmail ?? DEFAULT_BRANDING.supportEmail,
    });
    if ("error" in normalized) return DEFAULT_BRANDING;
    return normalized;
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function writeLocalBranding(branding: WorkspaceBranding) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(branding));
}
