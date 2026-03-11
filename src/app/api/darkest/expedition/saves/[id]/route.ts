import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const save = await prisma.gameSave.findUnique({ where: { id } });
  if (!save || save.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
    return NextResponse.json(
      { message: "Validation failed", errors: { name: "Name is required" } },
      { status: 422 }
    );
  }

  const updated = await prisma.gameSave.update({
    where: { id },
    data: { name: body.name.trim() },
  });

  return NextResponse.json({ save: { ...updated, createdAt: updated.createdAt.toISOString() } });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const save = await prisma.gameSave.findUnique({ where: { id } });
  if (!save || save.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // Cascade: delete logs + roster heroes first (SQLite has no cascade by default)
  await prisma.expeditionLog.deleteMany({ where: { gameSaveId: id } });
  await prisma.rosterHero.deleteMany({ where: { gameSaveId: id } });
  await prisma.gameSave.delete({ where: { id } });

  return NextResponse.json({ message: "Game save deleted." });
}
