import type { Metadata } from "next";

const siteName = "PortalKit";

export function pageMeta(
  title: string,
  description: string,
  path = "/",
): Metadata {
  const url = path.startsWith("http") ? path : path;
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
    },
  };
}
