import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "PetroView | Energy Intelligence",
  description: "AI-powered energy intelligence and predictive analytics for oil markets."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
}
