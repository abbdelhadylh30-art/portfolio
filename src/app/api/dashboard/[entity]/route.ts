import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isRequestAuthorized } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// Entity type mapping to Prisma model delegates
type EntityName = "profile" | "projects" | "experiences" | "campaigns" | "skills" | "education";

interface EntityConfig {
  delegate: Record<string, unknown>;
  hasOrder: boolean;
}

const ENTITY_MAP: Record<EntityName, EntityConfig> = {
  profile: { delegate: db.profile, hasOrder: false },
  projects: { delegate: db.project, hasOrder: true },
  experiences: { delegate: db.experience, hasOrder: true },
  campaigns: { delegate: db.campaign, hasOrder: true },
  skills: { delegate: db.skillCategory, hasOrder: true },
  education: { delegate: db.education, hasOrder: true },
};

const VALID_ENTITIES = Object.keys(ENTITY_MAP) as EntityName[];

function validateEntity(entity: string): entity is EntityName {
  return VALID_ENTITIES.includes(entity as EntityName);
}

// Slugify a title into a URL-safe slug
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Ensure data has a unique slug for project entities
async function ensureProjectSlug(
  data: Record<string, unknown>,
  excludeId?: string
): Promise<void> {
  if (!("slug" in data) || !data.slug) {
    const base = slugify(String(data.title || "untitled-project"));
    data.slug = base;
  }
  // Verify uniqueness — append -2, -3, etc. if needed
  const candidate = String(data.slug);
  const existing = await db.project.findFirst({
    where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });
  if (existing) {
    let suffix = 2;
    let unique = `${candidate}-${suffix}`;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const clash = await db.project.findFirst({
        where: { slug: unique, ...(excludeId ? { id: { not: excludeId } } : {}) },
        select: { id: true },
      });
      if (!clash) break;
      suffix += 1;
      unique = `${candidate}-${suffix}`;
    }
    data.slug = unique;
  }
}

// Coerce known Boolean fields from string to actual boolean
// (HTML forms and JSON payloads from the dashboard may send "true"/"false" strings)
function coerceProjectBooleans(data: Record<string, unknown>): void {
  if ("featured" in data) {
    const v = data.featured;
    if (typeof v === "string") {
      data.featured = v === "true" || v === "1" || v.toLowerCase() === "yes";
    } else if (typeof v !== "boolean") {
      data.featured = Boolean(v);
    }
  }
  // Coerce numeric fields that may arrive as strings
  if ("order" in data && typeof data.order === "string" && data.order !== "") {
    const n = parseInt(data.order, 10);
    if (!Number.isNaN(n)) data.order = n;
  }
}

// Strip empty strings for fields that have sensible DB defaults — this lets the
// dashboard send an empty input without overwriting existing values with "".
// (We keep "" for fields where empty is meaningful, e.g. tags/description.)
function normalizeProjectData(data: Record<string, unknown>): void {
  coerceProjectBooleans(data);
  // Ensure required fields exist (Prisma would 400 otherwise)
  if (!("title" in data) || !data.title || String(data.title).trim() === "") {
    throw new Error("Title is required");
  }
  if (!("description" in data) || data.description === undefined || data.description === null) {
    data.description = "";
  }
}

// GET - List all items or get a single item by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;

    if (!validateEntity(entity)) {
      return NextResponse.json(
        { error: `Invalid entity: ${entity}. Valid entities: ${VALID_ENTITIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!isRequestAuthorized(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const model = ENTITY_MAP[entity];

    if (id) {
      // Get single item
      const item = await model.delegate.findUnique({
        where: { id },
      });

      if (!item) {
        return NextResponse.json(
          { error: `${entity} item not found` },
          { status: 404 }
        );
      }

      return NextResponse.json(item);
    }

    // Get all items
    const items = model.hasOrder
      ? await model.delegate.findMany({
          orderBy: { order: "asc" },
        })
      : await model.delegate.findMany();

    return NextResponse.json(items);
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// POST - Create a new item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;

    if (!validateEntity(entity)) {
      return NextResponse.json(
        { error: `Invalid entity: ${entity}. Valid entities: ${VALID_ENTITIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!isRequestAuthorized(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be a valid JSON object" },
        { status: 400 }
      );
    }

    // Remove id if provided - let Prisma auto-generate
    const { id: _id, ...data } = body;
    void _id;

    // For projects, ensure a unique slug exists
    if (entity === "projects") {
      try {
        normalizeProjectData(data);
      } catch (e: unknown) {
        return NextResponse.json(
          { error: e instanceof Error ? e.message : "Validation failed" },
          { status: 400 }
        );
      }
      await ensureProjectSlug(data);
    }

    const model = ENTITY_MAP[entity];
    const item = await model.delegate.create({
      data,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[DASHBOARD_POST]", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;

    if (!validateEntity(entity)) {
      return NextResponse.json(
        { error: `Invalid entity: ${entity}. Valid entities: ${VALID_ENTITIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!isRequestAuthorized(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body?.id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 }
      );
    }

    const { id, ...data } = body;

    // Check if item exists
    const model = ENTITY_MAP[entity];
    const existing = await model.delegate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: `${entity} item not found` },
        { status: 404 }
      );
    }

    // For projects, ensure slug is set and remains unique (excluding this id)
    if (entity === "projects") {
      coerceProjectBooleans(data);
      // "featured" can be omitted on PUT (partial update) — that's fine, leave it
      if ("order" in data && typeof data.order === "string" && data.order !== "") {
        const n = parseInt(data.order, 10);
        if (!Number.isNaN(n)) data.order = n;
      }
      await ensureProjectSlug(data, id);
    }

    const item = await model.delegate.update({
      where: { id },
      data,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[DASHBOARD_PUT]", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;

    if (!validateEntity(entity)) {
      return NextResponse.json(
        { error: `Invalid entity: ${entity}. Valid entities: ${VALID_ENTITIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!isRequestAuthorized(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body?.id) {
      return NextResponse.json(
        { error: "ID is required for deletion" },
        { status: 400 }
      );
    }

    const { id } = body;

    // Check if item exists
    const model = ENTITY_MAP[entity];
    const existing = await model.delegate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: `${entity} item not found` },
        { status: 404 }
      );
    }

    await model.delegate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: `${entity} item deleted` });
  } catch (error) {
    console.error("[DASHBOARD_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
