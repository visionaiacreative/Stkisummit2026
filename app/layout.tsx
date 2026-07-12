import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/components/LanguageProvider";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin", "hebrew"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "STKI Summit 2026 | IT Knowledge Integrators",
  description:
    "The most significant annual event for Israel's IT community. November 9, 2026, Ronit Farm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} antialiased`}>
      <body>
        <SmoothScroll>
          <LanguageProvider>
            <SiteHeader />
            {children}
          </LanguageProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
