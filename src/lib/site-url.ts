/* ------------------------------------------------------------------ */
/*  Site URL resolver                                                  */
/* ------------------------------------------------------------------ */
//
//  Single source of truth for the canonical production URL of the site.
//  Used by layout.tsx, page.tsx, sitemap.ts, robots.ts so that every
//  SEO surface (canonical, og:url, JSON-LD url, sitemap <loc>, robots
//  Host/Sitemap) agrees on the same value.
//
//  Resolution order (first non-empty wins):
//    1. NEXT_PUBLIC_SITE_URL  — explicit override (set in Vercel project
//                               settings to https://portfolio-z258.vercel.app)
//    2. VERCEL_URL            — auto-injected by Vercel on every deploy,
//                               e.g. "portfolio-z258.vercel.app" (no protocol)
//                               or "portfolio-abc123-foo.vercel.app" for
//                               preview deployments. We prepend https://.
//    3. http://localhost:3000 — local development fallback.
//
//  Trailing slash is stripped so callers can safely do `${SITE_URL}/path`.
//
//  Why VERCEL_URL matters: if the user forgets to set NEXT_PUBLIC_SITE_URL
//  on Vercel (a very common mistake), the site would otherwise emit
//  localhost URLs in its sitemap, robots.txt, canonical, and JSON-LD —
//  which Google treats as broken/invalid. Falling back to VERCEL_URL
//  ensures the deployed site always emits its real public URL.
//
function buildSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    // VERCEL_URL comes without a protocol; prepend https://.
    // It may already include a protocol in rare cases, so guard for that.
    const withProto = vercelUrl.startsWith("http")
      ? vercelUrl
      : `https://${vercelUrl}`;
    return withProto.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export const SITE_URL = buildSiteUrl();
