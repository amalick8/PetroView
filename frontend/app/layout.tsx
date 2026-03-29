import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Assistant, IBM_Plex_Sans, Inter, Playfair_Display, Sora, Space_Grotesk } from "next/font/google";

import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-body" });
const displayDark = Sora({ subsets: ["latin"], variable: "--font-display-dark" });
const bodyDark = Inter({ subsets: ["latin"], variable: "--font-body-dark" });
const displayBerry = Playfair_Display({ subsets: ["latin"], variable: "--font-display-berry" });
const bodyBerry = Assistant({ subsets: ["latin"], variable: "--font-body-berry" });

export const metadata: Metadata = {
  title: "PetroView | Energy Intelligence",
  description: "AI-powered energy intelligence and predictive analytics for oil markets.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="florida"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${displayDark.variable} ${bodyDark.variable} ${displayBerry.variable} ${bodyBerry.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
