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

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const saveId = searchParams.get("saveId");

  if (!saveId) {
    return NextResponse.json({ message: "saveId is required" }, { status: 422 });
  }

  const save = await prisma.gameSave.findUnique({ where: { id: saveId } });
  if (!save || save.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const heroes = await prisma.rosterHero.findMany({
    where: { gameSaveId: saveId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ heroes: heroes.map(parseHero) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const errors: Record<string, string> = {};

  if (!body.gameSaveId || typeof body.gameSaveId !== "string") {
    errors.gameSaveId = "gameSaveId is required";
  }
  if (typeof body.heroClass !== "number") {
    errors.heroClass = "heroClass is required";
  }
  if (typeof body.level !== "number" || body.level < 0 || body.level > 6) {
    errors.level = "Level must be between 0 and 6";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ message: "Validation failed", errors }, { status: 422 });
  }

  const save = await prisma.gameSave.findUnique({ where: { id: body.gameSaveId } });
  if (!save || save.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const hero = await prisma.rosterHero.create({
    data: {
      gameSaveId: body.gameSaveId,
      heroClass: body.heroClass,
      customName: body.customName ?? "",
      level: body.level,
      positiveQuirks: JSON.stringify(body.positiveQuirks ?? []),
      negativeQuirks: JSON.stringify(body.negativeQuirks ?? []),
      diseases: JSON.stringify(body.diseases ?? []),
      trinket1: body.trinket1 ?? "",
      trinket2: body.trinket2 ?? "",
      notes: body.notes ?? "",
    },
  });

  return NextResponse.json({ message: "Hero added to roster.", hero: parseHero(hero) }, { status: 201 });
}
