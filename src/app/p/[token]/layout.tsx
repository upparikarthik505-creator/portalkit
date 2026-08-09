import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client portal",
  description: "Shared project files, invoices, and status for your PortalKit client.",
  robots: { index: false, follow: false },
};

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
