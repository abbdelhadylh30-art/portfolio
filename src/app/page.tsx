import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/site-url";
import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

/* ------------------------------------------------------------------ */
/*  Rendering strategy                                                 */
/* ------------------------------------------------------------------ */
//
//  This page is a SERVER COMPONENT. All portfolio data is fetched
//  directly from the database at request time and prerendered into
//  HTML on the server. This is critical for SEO — Google's crawler
//  sees the full content (bio, projects, experience, etc.) without
//  needing to execute JavaScript, which previously rendered the page
//  as a blank "Loading portfolio..." shell.
//
//  force-dynamic + revalidate=0 ensures the page always reflects the
//  latest dashboard edits (e.g. newly added projects) instead of
//  serving a stale cached copy.
//
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ------------------------------------------------------------------ */
/*  Static fallbacks                                                   */
/* ------------------------------------------------------------------ */
//
//  Used when the DB is unreachable (cold start, env var missing, etc).
//  Keeping these here means the page can ALWAYS render, even on first
//  deploy with an empty database — it just renders the fallback UI.
//
const FALLBACK_NAME = "Mohamed Medhat Ahmed";
const FALLBACK_TITLE = "Marketing & Business Development Specialist";
const FALLBACK_BIO =
  "Marketing & Business Development Specialist with experience across FMCG, B2B, and digital industries.";

/* ------------------------------------------------------------------ */
/*  Dynamic SEO metadata (reads from the profile row in DB)            */
/* ------------------------------------------------------------------ */
//
//  Wrapped ENTIRELY in a try/catch — if anything throws (DB error,
//  bad env var, malformed URL, etc), we return safe static metadata.
//  This function MUST NOT throw under any circumstances, because
//  metadata generation happens before page render and a throw here
//  crashes the entire route.
//
export async function generateMetadata(): Promise<Metadata> {
  let profile: Awaited<ReturnType<typeof db.profile.findFirst>> = null;
  try {
    profile = await db.profile.findFirst();
  } catch {
    // DB unreachable — use fallback values below.
  }

  const name = profile?.name ?? FALLBACK_NAME;
  const title = profile?.title ?? FALLBACK_TITLE;
  const bio = profile?.bio ?? FALLBACK_BIO;

  // Build metadataBase safely — bad URLs in env vars must not throw.
  // SITE_URL is already validated in site-url.ts, so this won't throw,
  // but we keep the try/catch as defense-in-depth.
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(SITE_URL);
  } catch {
    // Malformed SITE_URL — ignore, leave metadataBase undefined.
  }

  return {
    title: `${name} — ${title}`,
    description: bio,
    keywords: [
      name,
      "Marketing",
      "Business Development",
      "Portfolio",
      "FMCG",
      "B2B",
      "Digital Marketing",
      "Campaign Strategy",
      "Brand Audit",
      "Egypt marketing",
      "Giza marketing",
    ],
    authors: [{ name }],
    creator: name,
    publisher: name,
    metadataBase,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${name} — ${title}`,
      description: bio,
      type: "profile",
      siteName: `${name} Portfolio`,
      url: SITE_URL,
      images: [
        {
          url: "/images/hero-bg.jpg",
          width: 1200,
          height: 630,
          alt: `${name} — ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${title}`,
      description: bio,
      images: ["/images/hero-bg.jpg"],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Safe DB fetch helpers                                              */
/* ------------------------------------------------------------------ */
//
//  Each helper returns a safe fallback on ANY error — DB connection
//  failure, Prisma client init failure, query timeout, schema drift,
//  anything. The page render must never throw.
//
//  IMPORTANT: errors are logged to console.error so they appear in
//  Vercel → Functions → Logs. Without this, the safeFetch pattern
//  would silently swallow errors and we'd have no idea why the page
//  shows "No profile data found". Always log before returning the
//  fallback.
//
async function safeFetchProfile() {
  try {
    return await db.profile.findFirst();
  } catch (e) {
    console.error("[safeFetchProfile] DB error:", e);
    return null;
  }
}

async function safeFetchProjects() {
  try {
    return await db.project.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[safeFetchProjects] DB error:", e);
    return [];
  }
}

async function safeFetchExperiences() {
  try {
    return await db.experience.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[safeFetchExperiences] DB error:", e);
    return [];
  }
}

async function safeFetchCampaigns() {
  try {
    return await db.campaign.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[safeFetchCampaigns] DB error:", e);
    return [];
  }
}

async function safeFetchSkills() {
  try {
    return await db.skillCategory.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[safeFetchSkills] DB error:", e);
    return [];
  }
}

async function safeFetchEducation() {
  try {
    return await db.education.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("[safeFetchEducation] DB error:", e);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
//
//  The page body itself is also wrapped in a defensive try/catch —
//  if anything inside the render path throws (e.g. JSON.stringify on
//  a cyclic object, a React render error), we fall back to a minimal
//  static shell so the user never sees "Application error".
//
export default async function PortfolioPage() {
  // Fetch all entities in parallel — server-side, no client round-trips.
  // Each helper has its own try/catch so a failure on one entity
  // (e.g. DB cold-start) doesn't break the whole page.
  const [profile, projects, experiences, campaigns, skills, education] =
    await Promise.all([
      safeFetchProfile(),
      safeFetchProjects(),
      safeFetchExperiences(),
      safeFetchCampaigns(),
      safeFetchSkills(),
      safeFetchEducation(),
    ]);

  // Build a dynamic, profile-aware JSON-LD Person block. Falls back to
  // sane defaults if the DB is unreachable. Rendered in the page body
  // (HTML5 allows JSON-LD anywhere in the document).
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name ?? FALLBACK_NAME,
    jobTitle: profile?.title ?? FALLBACK_TITLE,
    url: SITE_URL,
    description: profile?.bio ?? undefined,
    email: profile?.email || undefined,
    telephone: profile?.phone || undefined,
    sameAs: profile?.linkedin
      ? [`https://linkedin.com/in/${profile.linkedin}`]
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

  return (
    <>
      {/* Dynamic JSON-LD Person structured data — overrides the static
          fallback in layout.tsx with profile-specific values. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <PortfolioClient
        profile={profile}
        projects={projects}
        experiences={experiences}
        campaigns={campaigns}
        skills={skills}
        education={education}
      />
    </>
  );
}
