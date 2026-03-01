import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dungeonId = parseInt(id);

  const rec = await prisma.dungeonRecommendation.findUnique({
    where: { dungeonId },
  });

  if (!rec) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(JSON.parse(rec.data));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dungeonId = parseInt(id);
  const data = await request.json();

  await prisma.dungeonRecommendation.upsert({
    where: { dungeonId },
    update: { data: JSON.stringify(data) },
    create: { dungeonId, data: JSON.stringify(data) },
  });

  return NextResponse.json({ message: "Successfully updated dungeon recommendations!" });
}
