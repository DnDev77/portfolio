import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import { SmoothScroll } from "@/components/ui/mouse/smooth-scroll";
import { LocaleProvider } from "@/providers/localeProvider";
import { LanguageToggle } from "@/components/ui/locale/lang-toggle";
import "./globals.css";

/* -------------------------------------------------------------------------- */
/*                                   Fonts                                    */
/* -------------------------------------------------------------------------- */

const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

const fontDisplay = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

/* -------------------------------------------------------------------------- */
/*                                  Metadata                                  */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Daniel Angelo — Developer",
  description:
    "Desenvolvedor Fullstack especializado em aplicações performáticas, arquitetura sólida e experiências digitais bem construídas.",
  icons: {
    icon: [
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: "/icon.png",
  },
};

/* -------------------------------------------------------------------------- */
/*                                 RootLayout                                 */
/* -------------------------------------------------------------------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-background">
      <body
        className={`
          ${fontSans.variable}
          ${fontMono.variable}
          ${fontDisplay.variable}
          font-sans
          antialiased
          overflow-x-hidden
        `}
      >
        <div className="noise-overlay" aria-hidden />
        <LocaleProvider>
          <div className="fixed top-5 right-5 z-50">
            <LanguageToggle />
          </div>
          <SmoothScroll>{children}</SmoothScroll>
        </LocaleProvider>
      </body>
    </html>
  );
}
