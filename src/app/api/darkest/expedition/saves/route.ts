import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const saves = await prisma.gameSave.findMany({
    where: { userId: session.user.id },
    orderBy: { slot: "asc" },
  });

  return NextResponse.json({
    saves: saves.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const errors: Record<string, string> = {};

  if (![1, 2, 3].includes(body.slot)) {
    errors.slot = "Slot must be 1, 2, or 3";
  }
  if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ message: "Validation failed", errors }, { status: 422 });
  }

  const existing = await prisma.gameSave.findUnique({
    where: { userId_slot: { userId: session.user.id, slot: body.slot } },
  });
  if (existing) {
    return NextResponse.json({ message: "Slot already in use" }, { status: 409 });
  }

  const save = await prisma.gameSave.create({
    data: {
      userId: session.user.id,
      slot: body.slot,
      name: body.name.trim(),
    },
  });

  return NextResponse.json(
    { message: "Game save created.", save: { ...save, createdAt: save.createdAt.toISOString() } },
    { status: 201 }
  );
}
