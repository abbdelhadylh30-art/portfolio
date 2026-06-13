import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohamed Medhat Ahmed — Marketing & Business Development",
  description:
    "Portfolio of Mohamed Medhat Ahmed — Marketing & Business Development Specialist with experience across FMCG, B2B, and digital industries.",
  keywords: [
    "Mohamed Medhat Ahmed",
    "Marketing",
    "Business Development",
    "Portfolio",
    "FMCG",
    "B2B",
    "Digital Marketing",
  ],
  authors: [{ name: "Mohamed Medhat Ahmed" }],
  openGraph: {
    title: "Mohamed Medhat Ahmed — Marketing & Business Development",
    description:
      "Marketing & Business Development Specialist with experience across FMCG, B2B, and digital industries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#faf8f5] text-[#1a1816]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
