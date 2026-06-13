import { randomBytes, createHmac } from "crypto";

// Simple HMAC-based token system that doesn't require shared state
// In production, use proper JWT library with secure secret management

const TOKEN_SECRET = process.env.AUTH_SECRET || "portfolio-admin-secret-key-change-in-production";

interface TokenPayload {
  username: string;
  iat: number;
  exp: number;
}

function signToken(payload: TokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", TOKEN_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;

    // Verify signature
    const expectedSignature = createHmac("sha256", TOKEN_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    // Decode payload
    const payload: TokenPayload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf-8")
    );

    // Check expiration
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function generateToken(username: string): { token: string; expiresAt: number } {
  const iat = Date.now();
  const expiresAt = iat + 24 * 60 * 60 * 1000; // 24 hours

  const payload: TokenPayload = { username, iat, exp: expiresAt };
  const token = signToken(payload);

  return { token, expiresAt };
}

export function isRequestAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  return payload !== null;
}
