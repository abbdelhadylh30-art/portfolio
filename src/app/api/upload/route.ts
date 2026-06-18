import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "@/lib/auth";

/**
 * Image upload endpoint.
 *
 * On Vercel serverless there is no persistent filesystem, so we return the
 * uploaded image as a base64 data URL that can be stored directly in the
 * database (e.g. Project.imageUrl, Campaign.imageUrl).
 *
 * Limits:
 *   - Max body size: 4.5 MB (Vercel default for serverless functions)
 *   - We enforce a 2 MB soft cap below to keep DB rows small
 *   - Accepted MIME types: image/png, image/jpeg, image/webp, image/gif, image/svg+xml
 */
export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export async function POST(request: NextRequest) {
  // Auth check — only logged-in dashboard users can upload
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Expected multipart/form-data with a 'file' field." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error: `File too large. Max ${MAX_BYTES / 1024 / 1024}MB. Got ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
        },
        { status: 413 }
      );
    }

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES[mimeType]) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${mimeType}. Allowed: ${Object.keys(ALLOWED_TYPES).join(", ")}`,
        },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      imageUrl: dataUrl,
      size: file.size,
      type: mimeType,
      // Provide a friendly filename hint for the dashboard UI
      filename: file.name || `upload-${Date.now()}.${ALLOWED_TYPES[mimeType]}`,
    });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
