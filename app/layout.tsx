import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Körjournal",
  description: "Svensk körjournal för milersättning och export",
  manifest: "/manifest.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <meta name="description" content="Gratis körjournal för milersättning och bokföring. Open source, modern och enkel att använda." />
        <meta name="keywords" content="gratis körjournal, milersättning, opensource, körjournal, milersättning, bokföring, skatteverket, export, PDF, CSV" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
} 