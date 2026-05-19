import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, tryoutId, score, correct, wrong, answered, earnedPoints, maxPoints } = await request.json();

    if (!userId || !tryoutId) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const result = await prisma.tryoutResult.create({
      data: {
        userId,
        tryoutId,
        score: score || 0,
        correct: correct || 0,
        wrong: wrong || 0,
        answered: answered || 0,
        earnedPoints: earnedPoints || 0,
        maxPoints: maxPoints || 0,
      },
    });

    return NextResponse.json({ result }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
