import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function calculateResult(sessionId: string, tryoutId: string, userId: string) {
  const questions = await prisma.question.findMany({
    where: { tryoutId },
    orderBy: { order: "asc" },
  });

  const answers = await prisma.catAnswer.findMany({
    where: { sessionId },
  });

  const answerMap = new Map(answers.map((a) => [a.questionId, a]));
  let earnedPoints = 0;
  let maxPoints = 0;
  let correct = 0;
  let wrong = 0;
  let answered = 0;

  const subtestScores: Record<string, { earned: number; max: number; count: number }> = {};

  for (const q of questions) {
    const subtest = q.subtest || "Umum";
    if (!subtestScores[subtest]) {
      subtestScores[subtest] = { earned: 0, max: 0, count: 0 };
    }
    subtestScores[subtest].count++;

    const a = answerMap.get(q.id);
    const userAns = a?.answer;

    if (q.questionType === "tkp") {
      let pts: Record<string, number> = {};
      try { pts = JSON.parse(q.optionPoints || "{}"); } catch { pts = {}; }
      const earned = (userAns ? pts[userAns] : 0) || 0;
      earnedPoints += earned;
      maxPoints += 5;
      subtestScores[subtest].earned += earned;
      subtestScores[subtest].max += 5;
      if (userAns) {
        answered++;
        if (earned === 5) correct++;
        else wrong++;
      }
    } else {
      const earned = userAns !== null && userAns === q.answer ? 5 : 0;
      earnedPoints += earned;
      maxPoints += 5;
      subtestScores[subtest].earned += earned;
      subtestScores[subtest].max += 5;
      if (userAns) {
        answered++;
        if (userAns === q.answer) correct++;
        else wrong++;
      }
    }
  }

  const score = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

  return {
    score,
    correct,
    wrong,
    unanswered: questions.length - answered,
    earnedPoints,
    maxPoints,
    subtestScores: Object.entries(subtestScores).map(([name, data]) => ({
      name,
      earned: data.earned,
      max: data.max,
      score: Math.round((data.earned / data.max) * 100),
      count: data.count,
    })),
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.catSession.findUnique({
      where: { id: params.id },
      include: { tryout: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }

    const result = await calculateResult(params.id, session.tryoutId, session.userId);

    // Only update session & save result if this is the first submission
    if (session.status === "active") {
      await prisma.catSession.update({
        where: { id: params.id },
        data: { status: "submitted", endedAt: new Date() },
      });

      await prisma.tryoutResult.create({
        data: {
          userId: session.userId,
          tryoutId: session.tryoutId,
          score: result.score,
          correct: result.correct,
          wrong: result.wrong,
          answered: result.correct + result.wrong,
          earnedPoints: result.earnedPoints,
          maxPoints: result.maxPoints,
        },
      });
    }

    return NextResponse.json({
      ...result,
      passingGrade: session.tryout.passingGrade,
      catPassingGradePoints: session.tryout.catPassingGradePoints || 0,
    });
  } catch {
    return NextResponse.json({ error: "Gagal submit" }, { status: 500 });
  }
}
