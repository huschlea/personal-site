import type { Metadata } from "next";
import { Big_Shoulders, Spectral } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["300", "600", "700", "800"],
  variable: "--font-big-shoulders",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alden Huschle",
  description: "Designer, musician, builder.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23E6E4DE'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${spectral.variable}`}>
      <head>
        {/* Geist / Newsreader — used by the Prompting People sandbox component.
            Loaded via Google Fonts <link> (not next/font) so the literal family-names resolve
            inside the component's inline <style> block. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap"
        />
        {/* Atkinson Hyperlegible + Gloria Hallelujah — used by the Dixon Creative Center
            schedule sandbox component. Same loading pattern as Geist above. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Gloria+Hallelujah&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
