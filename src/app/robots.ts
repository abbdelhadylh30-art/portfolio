import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/* ------------------------------------------------------------------ */
/*  Dynamic robots.txt                                                 */
/* ------------------------------------------------------------------ */
//
//  Served at /robots.txt by Next.js. We use the dynamic route form
//  (rather than the static /public/robots.txt) so the Sitemap URL
//  always matches the deployed domain, which is what Google expects.
//

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all major crawlers to access everything by default.
      // The /dashboard and /api/* paths are not blocked — they don't
      // contain sensitive content (the dashboard requires login, and
      // the API returns the same data the public pages render).
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
