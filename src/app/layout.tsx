import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

/** Expressive display — headlines, heroes, metrics */
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

/** Clear UI body — CRM chrome, forms, paragraphs */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "PortalKit — Client HQ for Shopify freelancers",
    template: "%s | PortalKit",
  },
  description:
    "PortalKit is the freelancer OS for theme rebuilds, launches, and retainers — deals, delivery, and deposits in one workspace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
