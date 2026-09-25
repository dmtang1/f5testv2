import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { site } from "@/data/config";
import { t } from "@/data/locale/en";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const sans = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: t.meta.siteTitle, template: "%s · F5 Test" },
  description: t.meta.siteDescription,
  openGraph: { title: t.meta.siteTitle, description: t.meta.siteDescription, type: "website" },
  twitter: { card: "summary_large_image", title: t.meta.siteTitle, description: t.meta.siteDescription },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0e6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <body>
        <Header />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
