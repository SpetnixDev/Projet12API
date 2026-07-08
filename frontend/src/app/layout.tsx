import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { resolveAuthViewState } from "@/lib/auth/session";
import AppHeader from "@/components/AppHeader";
import ScrollToTopOnPathChange from "@/components/ScrollToTopOnPathChange";
import "./globals.css";

export const dynamic = "force-dynamic"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Projet12",
    template: "%s | Projet12",
  },
  description: "Plateforme Next.js 16 pour consulter des associations et gerer l'authentification avec un backend Spring.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authState = await resolveAuthViewState()

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollToTopOnPathChange />
        <AppHeader isAuthenticated={authState.isAuthenticated} accountType={authState.accountType} />
        {children}
      </body>
    </html>
  );
}
