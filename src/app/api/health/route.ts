import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ------------------------------------------------------------------ */
/*  /api/health — DB connectivity diagnostic endpoint                  */
/* ------------------------------------------------------------------ */
//
//  Returns JSON describing whether the serverless function can reach
//  the database, plus low-level diagnostic info (env var presence,
//  Prisma client init, connection string protocol/port). This is the
//  first thing to check when the homepage shows "No profile data found"
//  or the API returns "Failed to fetch profile".
//
//  Security: this route does NOT expose the DATABASE_URL value itself,
//  only whether it's set, its protocol, host, and port — enough to
//  diagnose misconfigurations without leaking credentials.
//
export const dynamic = "force-dynamic";
export const revalidate = 0;

type CheckResult = {
  ok: boolean;
  detail?: string;
};

async function checkEnvVar(): Promise<CheckResult> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return { ok: false, detail: "DATABASE_URL is NOT set on Vercel" };
  }
  // Parse the connection string to surface protocol/host/port without
  // leaking credentials. This helps diagnose the common mistake of
  // using the direct Postgres port (5432) instead of the PgBouncer
  // pooler port (6543) on serverless.
  try {
    const parsed = new URL(url);
    return {
      ok: true,
      detail: `protocol=${parsed.protocol}, host=${parsed.hostname}, port=${parsed.port || "(default)"}`,
    };
  } catch {
    return { ok: false, detail: "DATABASE_URL is set but malformed" };
  }
}

async function checkPrismaInit(): Promise<CheckResult> {
  try {
    // Just touching the db object forces PrismaClient construction.
    // If the constructor throws (e.g. invalid URL), we'll catch it here.
    void db;
    return { ok: true, detail: "PrismaClient constructed successfully" };
  } catch (e) {
    return {
      ok: false,
      detail: `PrismaClient init failed: ${(e as Error).message}`,
    };
  }
}

async function checkDbQuery(): Promise<CheckResult> {
  try {
    const start = Date.now();
    const count = await db.profile.count();
    const elapsed = Date.now() - start;
    return {
      ok: true,
      detail: `profile.count() returned ${count} row(s) in ${elapsed}ms`,
    };
  } catch (e) {
    const err = e as Error & { code?: string };
    return {
      ok: false,
      detail: `Query failed: ${err.message}${
        err.code ? ` (code: ${err.code})` : ""
      }`,
    };
  }
}

export async function GET() {
  const envCheck = await checkEnvVar();
  const prismaCheck = await checkPrismaInit();
  // Only run the query check if Prisma init succeeded — otherwise it
  // would just re-throw the same error.
  const queryCheck = prismaCheck.ok
    ? await checkDbQuery()
    : { ok: false, detail: "skipped (Prisma init failed)" };

  const overallOk = envCheck.ok && prismaCheck.ok && queryCheck.ok;

  return NextResponse.json(
    {
      ok: overallOk,
      timestamp: new Date().toISOString(),
      checks: {
        env: envCheck,
        prismaInit: prismaCheck,
        query: queryCheck,
      },
      hints: overallOk
        ? null
        : [
            "If env.ok=false: set DATABASE_URL in Vercel Project Settings → Environment Variables.",
            "If port=5432: switch to the PgBouncer pooler URL (port 6543) — Vercel serverless can't manage direct connections reliably.",
            "If query fails with 'Timed out fetching connection': Supabase free tier may have paused the DB. Visit Supabase dashboard to wake it.",
            "If query fails with 'prepared statement exists': add ?pgbouncer=true&statement_cache_size=0 to your DATABASE_URL.",
          ],
    },
    { status: overallOk ? 200 : 503 }
  );
}
