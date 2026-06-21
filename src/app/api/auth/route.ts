import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  POST /api/auth — Admin login                                       */
/* ------------------------------------------------------------------ */
//
//  SECURITY MODEL
//  --------------
//  Credentials are read from environment variables, NOT from the
//  database. This is a deliberate choice with three benefits:
//
//  1. No plaintext password in the DB or repo. The .env file (and
//     Vercel env vars) store only a bcrypt hash. Even if the DB is
//     leaked, the password cannot be recovered.
//
//  2. Auth works even when the DB is down. The previous implementation
//     did a db.adminUser.findUnique() lookup, which meant login failed
//     whenever the DB was unreachable (e.g. today's DATABASE_URL
//     incident). Env-var auth is always available.
//
//  3. No plaintext in version control. The old prisma/seed.ts had
//     `password: 'admin123'` hardcoded — visible to anyone with repo
//     access. Now the seed script doesn't touch auth at all.
//
//  ENV VARS (set in Vercel Project Settings → Environment Variables):
//    ADMIN_USERNAME      — e.g. "admin" (or any username you choose)
//    ADMIN_PASSWORD_HASH — bcrypt hash of the password, generated via:
//                            npx tsx scripts/generate-password-hash.ts
//
//  FALLBACK: if ADMIN_PASSWORD_HASH is not set, we use a hash of the
//  old default password "admin123" so the site isn't locked out during
//  the transition. The user is expected to set ADMIN_PASSWORD_HASH
//  to a strong hash ASAP.
//

// bcrypt hash of "admin123" — used as a transition fallback ONLY.
// This is the password from the old prisma/seed.ts that was already
// visible in the repo, so exposing its hash here is no worse than the
// prior state. Replace it by setting ADMIN_PASSWORD_HASH env var to
// a strong hash generated via:
//   npx tsx scripts/generate-password-hash.ts
//
// Verified via bcrypt.compareSync('admin123', hash) === true.
const FALLBACK_PASSWORD_HASH =
  "$2b$10$criHAFtpcGojstc1L9ZgbO7KMAZ61Mv.VmxJenKgCoBkwA90548fK";

interface LoginBody {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Resolve credentials from env vars. Fall back to legacy defaults
    // only if the env vars are not set — this keeps the site accessible
    // during the transition period.
    const expectedUsername = process.env.ADMIN_USERNAME ?? "admin";
    const passwordHash =
      process.env.ADMIN_PASSWORD_HASH ?? FALLBACK_PASSWORD_HASH;

    // Verify username (constant-time comparison would be overkill here
    // since usernames are typically not secret, but bcrypt's compare
    // for the password is the security-critical part).
    if (username !== expectedUsername) {
      // Always run a bcrypt compare even on username mismatch to avoid
      // timing-based user enumeration. The result is discarded.
      await bcrypt.compare(password, passwordHash);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password against the bcrypt hash. bcrypt.compare is
    // constant-time and handles the salt internally.
    const passwordMatches = await bcrypt.compare(password, passwordHash);
    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Issue a signed JWT-like token (HMAC-SHA256, see src/lib/auth.ts).
    const { token, expiresAt } = generateToken(username);

    return NextResponse.json({
      token,
      username,
      expiresAt,
    });
  } catch (error) {
    console.error("[AUTH_POST]", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
