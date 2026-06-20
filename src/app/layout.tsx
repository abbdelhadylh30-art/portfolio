import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ------------------------------------------------------------------ */
/*  Site URL (used for canonical URLs, sitemap, OpenGraph, JSON-LD)    */
/* ------------------------------------------------------------------ */
//
//  SITE_URL is resolved centrally in src/lib/site-url.ts, with the
//  fallback chain: NEXT_PUBLIC_SITE_URL → VERCEL_URL → localhost.
//  Set NEXT_PUBLIC_SITE_URL in your Vercel project settings to
//  https://portfolio-z258.vercel.app for the cleanest URLs.
//

/* ------------------------------------------------------------------ */
/*  Static metadata                                                    */
/* ------------------------------------------------------------------ */
//
//  Note: per-page metadata (title, description, OpenGraph) is generated
//  dynamically in src/app/page.tsx via generateMetadata(), reading from
//  the profile row in the database. The values here act as a fallback
//  for any page that doesn't override them (e.g. /dashboard, /api/*).
//
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
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Medhat Ahmed — Marketing & Business Development",
    description:
      "Marketing & Business Development Specialist with experience across FMCG, B2B, and digital industries.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/* ------------------------------------------------------------------ */
/*  Root layout                                                        */
/* ------------------------------------------------------------------ */
//
//  IMPORTANT: the root layout must NOT make any database calls.
//  It wraps every route — including /dashboard, /api/*, and 404s — so
//  any DB error here would crash the entire site. Dynamic data (e.g.
//  the JSON-LD Person block) is generated per-page in src/app/page.tsx
//  where it can fail gracefully without taking down unrelated routes.
//
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

        {/* Google Fonts for Syne (display) + DM Sans (body) — loaded
            in <head> so they apply to every page, including SSR ones. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />

        {/* Static fallback JSON-LD. The dynamic, profile-aware version
            is rendered inside src/app/page.tsx for the homepage only. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mohamed Medhat Ahmed",
              jobTitle: "Marketing & Business Development Specialist",
              url: SITE_URL,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Giza",
                addressCountry: "Egypt",
              },
              knowsAbout: [
                "Marketing",
                "Business Development",
                "Campaign Strategy",
                "Brand Audit",
                "Digital Marketing",
                "FMCG",
                "B2B",
              ],
            }),
          }}
        />
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
