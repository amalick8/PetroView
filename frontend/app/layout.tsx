import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "PetroView | Energy Intelligence",
  description: "AI-powered energy intelligence and predictive analytics for oil markets."
};

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default async function RootLayout({ children }: { children: ReactNode }) {
  if (DEMO_MODE) {
    return (
      <html lang="en" className={`${display.variable} ${body.variable}`}>
        <body>{children}</body>
      </html>
    );
  }

  const { ClerkProvider } = await import("@clerk/nextjs");
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
}
