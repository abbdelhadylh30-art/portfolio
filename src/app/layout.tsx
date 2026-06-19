import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { db } from "@/lib/db";

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
//  Set NEXT_PUBLIC_SITE_URL in your Vercel project settings, e.g.
//  https://portfolio-z258.vercel.app/
//  Falls back to localhost for local dev.
//
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

/* ------------------------------------------------------------------ */
/*  Static metadata                                                    */
/* ------------------------------------------------------------------ */
//
//  Note: per-page metadata (title, description, OpenGraph) is generated
//  dynamically in src/app/page.tsx via generateMetadata(), reading from
//  the profile row in the database. The values here act as a fallback
//  for any page that doesn't override them.
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
/*  JSON-LD structured data                                            */
/* ------------------------------------------------------------------ */
//
//  Builds a schema.org/Person JSON-LD block from the profile row in
//  the database. This gives Google rich, machine-readable information
//  about who Mohamed is — name, job title, contact info, etc. — which
//  improves indexing and the chance of earning a knowledge panel.
//
//  Rendered server-side so it's present in the initial HTML response.
//
async function buildPersonJsonLd() {
  let profile: Awaited<ReturnType<typeof db.profile.findFirst>> = null;
  try {
    profile = await db.profile.findFirst();
  } catch {
    // If the DB is unreachable (e.g. during build), fall back to static
    // defaults so the JSON-LD block is still emitted.
  }

  const name = profile?.name ?? "Mohamed Medhat Ahmed";
  const jobTitle =
    profile?.title ?? "Marketing & Business Development Specialist";
  const email = profile?.email ?? "";
  const phone = profile?.phone ?? "";
  const linkedin = profile?.linkedin ?? "";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    url: SITE_URL,
    description: profile?.bio ?? undefined,
    email: email || undefined,
    telephone: phone || undefined,
    sameAs: linkedin
      ? [`https://linkedin.com/in/${linkedin}`]
      : undefined,
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
  };
}

/* ------------------------------------------------------------------ */
/*  Root layout                                                        */
/* ------------------------------------------------------------------ */

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = await buildPersonJsonLd();

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

        {/* JSON-LD Person structured data — helps Google understand
            who this site is about, improving indexing and rich
            results eligibility. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
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
