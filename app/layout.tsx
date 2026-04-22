import type { Metadata } from "next";
import { Big_Shoulders, Spectral, Nova_Mono } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

const novaMono = Nova_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-nova-mono",
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
    <html lang="en" className={`${bigShoulders.variable} ${spectral.variable} ${novaMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
