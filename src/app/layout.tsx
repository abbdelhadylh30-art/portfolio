import type { Metadata, Viewport } from "next";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Portfolio Dashboard",
  },
  openGraph: {
    title: "Mohamed Medhat Ahmed — Marketing & Business Development",
    description:
      "Marketing & Business Development Specialist with experience across FMCG, B2B, and digital industries.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B1120] text-white`}
      >
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
