import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "F3 Pipeline Intelligence",
  description:
    "Know your number before the quarter knows it for you. Predictive pipeline analytics: deal health scoring, multi-scenario forecasting, and slippage alerts.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${hanken.variable} ${inter.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
