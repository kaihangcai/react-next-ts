import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RosterHero } from "@/models/expedition";

function parseHero(h: {
  id: string;
  gameSaveId: string;
  heroClass: number;
  customName: string;
  level: number;
  positiveQuirks: string;
  negativeQuirks: string;
  diseases: string;
  trinket1: string;
  trinket2: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}): RosterHero {
  return {
    ...h,
    positiveQuirks: JSON.parse(h.positiveQuirks),
    negativeQuirks: JSON.parse(h.negativeQuirks),
    diseases: JSON.parse(h.diseases),
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const hero = await prisma.rosterHero.findUnique({
    where: { id },
    include: { gameSave: true },
  });
  if (!hero || hero.gameSave.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const errors: Record<string, string> = {};

  if (body.level !== undefined && (typeof body.level !== "number" || body.level < 0 || body.level > 6)) {
    errors.level = "Level must be between 0 and 6";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ message: "Validation failed", errors }, { status: 422 });
  }

  const updated = await prisma.rosterHero.update({
    where: { id },
    data: {
      ...(body.heroClass !== undefined && { heroClass: body.heroClass }),
      ...(body.customName !== undefined && { customName: body.customName }),
      ...(body.level !== undefined && { level: body.level }),
      ...(body.positiveQuirks !== undefined && { positiveQuirks: JSON.stringify(body.positiveQuirks) }),
      ...(body.negativeQuirks !== undefined && { negativeQuirks: JSON.stringify(body.negativeQuirks) }),
      ...(body.diseases !== undefined && { diseases: JSON.stringify(body.diseases) }),
      ...(body.trinket1 !== undefined && { trinket1: body.trinket1 }),
      ...(body.trinket2 !== undefined && { trinket2: body.trinket2 }),
      ...(body.notes !== undefined && { notes: body.notes }),
    },
  });

  return NextResponse.json({ hero: parseHero(updated) });
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
  const hero = await prisma.rosterHero.findUnique({
    where: { id },
    include: { gameSave: true },
  });
  if (!hero || hero.gameSave.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.rosterHero.delete({ where: { id } });
  return NextResponse.json({ message: "Hero removed from roster." });
}
