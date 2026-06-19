import type { MetadataRoute } from "next";

/* ------------------------------------------------------------------ */
/*  Dynamic sitemap                                                    */
/* ------------------------------------------------------------------ */
//
//  Served at /sitemap.xml by Next.js. Lists the homepage plus every
//  project detail page (/projects/[slug]) so Google can discover and
//  index them all automatically.
//
//  force-dynamic ensures the sitemap reflects newly added projects
//  from the dashboard instead of being frozen at build time.
//
//  IMPORTANT: db is imported lazily inside the function so that a
//  Prisma client init failure doesn't crash the route — we just
//  return the homepage entry instead.
//
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Homepage — highest priority, fresh content (dashboard edits flow here)
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Project detail pages — fetch lazily and defend against any error.
  try {
    const { db } = await import("@/lib/db");
    const projects = await db.project.findMany({
      where: { slug: { not: "" } },
      orderBy: { order: "asc" },
      select: { slug: true, updatedAt: true },
    });

    for (const p of projects) {
      entries.push({
        url: `${SITE_URL}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  } catch {
    // If the DB is unreachable, still return the homepage entry so
    // Google can at least index the root.
  }

  return entries;
}
