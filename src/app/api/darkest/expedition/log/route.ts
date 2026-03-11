import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ExpeditionLogEntry } from "@/models/expedition";

function parseLog(log: {
  id: string;
  gameSaveId: string;
  dungeon: string;
  duration: string;
  difficulty: number;
  gameDifficulty: number | null;
  heroes: string;
  provisions: string;
  outcome: string;
  casualties: string;
  loot: string;
  stressNotes: string;
  notes: string;
  rating: number;
  createdAt: Date;
}): ExpeditionLogEntry {
  return {
    ...log,
    gameDifficulty: log.gameDifficulty ?? undefined,
    heroes: JSON.parse(log.heroes),
    provisions: JSON.parse(log.provisions),
    casualties: JSON.parse(log.casualties),
    loot: JSON.parse(log.loot),
    createdAt: log.createdAt.toISOString(),
  } as ExpeditionLogEntry;
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

  const logs = await prisma.expeditionLog.findMany({
    where: { gameSaveId: saveId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ logs: logs.map(parseLog) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const errors: Record<string, string> = {};

  const VALID_DUNGEONS = [
    "Ruins", "Warrens", "Weald", "Cove",
    "Courtyard", "Farmstead", "Darkest Dungeon",
  ];
  const VALID_DURATIONS = ["short", "medium", "long"];
  const VALID_DIFFICULTIES = [1, 2, 3];
  const VALID_OUTCOMES = ["success", "failure", "retreat"];

  if (!body.gameSaveId || typeof body.gameSaveId !== "string") {
    errors.gameSaveId = "gameSaveId is required";
  }
  if (!body.dungeon || !VALID_DUNGEONS.includes(body.dungeon)) {
    errors.dungeon = `Invalid dungeon: ${body.dungeon}`;
  }
  if (!body.duration || !VALID_DURATIONS.includes(body.duration)) {
    errors.duration = `Invalid duration: ${body.duration}`;
  }
  if (!VALID_DIFFICULTIES.includes(body.difficulty)) {
    errors.difficulty = `Invalid difficulty: ${body.difficulty}`;
  }
  if (
    body.gameDifficulty !== undefined &&
    body.gameDifficulty !== null &&
    !VALID_DIFFICULTIES.includes(body.gameDifficulty)
  ) {
    errors.gameDifficulty = `Invalid game difficulty: ${body.gameDifficulty}`;
  }
  if (!Array.isArray(body.heroes) || body.heroes.length < 1 || body.heroes.length > 4) {
    errors.heroes = "Heroes must be an array of 1–4 items";
  }
  if (!body.outcome || !VALID_OUTCOMES.includes(body.outcome)) {
    errors.outcome = `Invalid outcome: ${body.outcome}`;
  }
  if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
    errors.rating = "Rating must be between 1 and 5";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ message: "Validation failed", errors }, { status: 422 });
  }

  const save = await prisma.gameSave.findUnique({ where: { id: body.gameSaveId } });
  if (!save || save.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const log = await prisma.expeditionLog.create({
    data: {
      gameSaveId: body.gameSaveId,
      dungeon: body.dungeon,
      duration: body.duration,
      difficulty: body.difficulty,
      gameDifficulty: body.gameDifficulty ?? null,
      heroes: JSON.stringify(body.heroes),
      provisions: JSON.stringify(body.provisions ?? {}),
      outcome: body.outcome,
      casualties: JSON.stringify(body.casualties ?? []),
      loot: JSON.stringify(body.loot ?? {}),
      stressNotes: body.stressNotes ?? "",
      notes: body.notes ?? "",
      rating: body.rating,
    },
  });

  return NextResponse.json({ message: "Expedition log saved.", id: log.id }, { status: 201 });
}
