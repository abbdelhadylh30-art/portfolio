import { db } from "@/lib/db";
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
/*  Dynamic SEO metadata (reads from the profile row in DB)            */
/* ------------------------------------------------------------------ */

export async function generateMetadata(): Promise<Metadata> {
  let profile: Awaited<ReturnType<typeof db.profile.findFirst>> = null;
  try {
    profile = await db.profile.findFirst();
  } catch {
    // Fall back to the static layout metadata if the DB is unreachable.
  }

  const name = profile?.name ?? "Mohamed Medhat Ahmed";
  const title = profile?.title ?? "Marketing & Business Development Specialist";
  const bio =
    profile?.bio ??
    "Marketing & Business Development Specialist with experience across FMCG, B2B, and digital industries.";
  const email = profile?.email ?? "";
  const phone = profile?.phone ?? "";
  const linkedin = profile?.linkedin ?? "";

  const metadataBase = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined;

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
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${title}`,
      description: bio,
    },
    other: {
      "profile:first_name": name.split(" ")[0] ?? "",
      "profile:last_name": name.split(" ").slice(1).join(" "),
      "profile:username": linkedin,
      "contact:email": email,
      "contact:phone": phone,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export default async function PortfolioPage() {
  // Fetch all entities in parallel — server-side, no client round-trips.
  // Each query is wrapped so that a failure on one entity (e.g. empty
  // table or DB cold-start) doesn't break the whole page.
  const [profile, projects, experiences, campaigns, skills, education] =
    await Promise.all([
      db.profile.findFirst().catch(() => null),
      db.project
        .findMany({ orderBy: { order: "asc" } })
        .catch(() => []),
      db.experience
        .findMany({ orderBy: { order: "asc" } })
        .catch(() => []),
      db.campaign
        .findMany({ orderBy: { order: "asc" } })
        .catch(() => []),
      db.skillCategory
        .findMany({ orderBy: { order: "asc" } })
        .catch(() => []),
      db.education
        .findMany({ orderBy: { order: "asc" } })
        .catch(() => []),
    ]);

  // Build a dynamic, profile-aware JSON-LD Person block. Falls back to
  // sane defaults if the DB is unreachable. Rendered in the page body
  // (HTML5 allows JSON-LD anywhere in the document).
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name ?? "Mohamed Medhat Ahmed",
    jobTitle:
      profile?.title ?? "Marketing & Business Development Specialist",
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
