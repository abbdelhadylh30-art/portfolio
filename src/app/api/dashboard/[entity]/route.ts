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
