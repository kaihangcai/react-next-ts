import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const VALID_WINDOW_SIZES = ["s", "m", "l"];
const VALID_TIMERS = [15, 30, 45, 60];

export async function GET() {
  const records = await prisma.gameRecord.findMany({
    include: { user: true },
  });

  const formatted = records.map((r) => ({
    alias: r.user.alias,
    id: r.user.id,
    scores: {
      s_15: r.s_15, s_30: r.s_30, s_45: r.s_45, s_60: r.s_60,
      m_15: r.m_15, m_30: r.m_30, m_45: r.m_45, m_60: r.m_60,
      l_15: r.l_15, l_30: r.l_30, l_45: r.l_45, l_60: r.l_60,
    },
  }));

  return NextResponse.json({ records: formatted });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { score, state } = await request.json();

  const errors: Record<string, string> = {};
  if (typeof score !== "number") errors.score = `Invalid score of ${score}`;

  const parts = (state ?? "").split("_");
  const windowSize = parts[0];
  const timerStr = parts[1] ?? "";
  const timer = parseInt(timerStr);
  if (!/^\d+$/.test(timerStr) || !VALID_TIMERS.includes(timer)) {
    errors.timer = `Invalid timer of ${timerStr}`;
  }
  if (!VALID_WINDOW_SIZES.includes(windowSize)) {
    errors.window = `Invalid window size '${windowSize}'`;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "postScore() failed due to validation errors.", errors },
      { status: 422 }
    );
  }

  const existing = await prisma.gameRecord.findUnique({
    where: { userId: session.user.id },
  });

  const currentScore = existing ? ((existing as any)[state] as number) : 0;
  if (currentScore >= score) {
    return NextResponse.json({ message: "Not a new highscore." });
  }

  await prisma.gameRecord.update({
    where: { userId: session.user.id },
    data: { [state]: score },
  });

  return NextResponse.json({ message: "postScore() success!" });
}
