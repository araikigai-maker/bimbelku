import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const SUBTEST_PASSING_GRADES: Record<string, { points: number; label: string }> = {
  TWK: { points: 65, label: "Tes Wawasan Kebangsaan" },
  TIU: { points: 80, label: "Tes Intelegensia Umum" },
  TKP: { points: 166, label: "Tes Karakteristik Pribadi" },
};

async function calculateResult(sessionId: string, tryoutId: string) {
  const [questions, answers] = await Promise.all([
    prisma.question.findMany({
      where: { tryoutId },
      orderBy: { order: "asc" },
    }),
    prisma.catAnswer.findMany({
      where: { sessionId },
    }),
  ]);

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
    subtestScores: Object.entries(subtestScores).map(([name, data]) => {
      const pg = SUBTEST_PASSING_GRADES[name];
      return {
        name,
        label: pg?.label || name,
        earned: data.earned,
        max: data.max,
        score: data.max > 0 ? Math.round((data.earned / data.max) * 100) : 0,
        count: data.count,
        passingGradePoints: pg?.points || 0,
        passed: data.earned >= (pg?.points || 0),
      };
    }),
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    // Get userId from request body for ownership validation
    const body = await req.json().catch(() => ({}));
    const requestUserId = body?.userId;

    const session = await prisma.catSession.findUnique({
      where: { id: sessionId },
      include: { tryout: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }

    // Ownership check: if userId is provided, verify it matches the session owner
    // This prevents one user from submitting/tampering another user's session
    if (requestUserId && session.userId !== requestUserId) {
      console.warn(`[CAT/SUBMIT] Ownership mismatch: request userId=${requestUserId}, session userId=${session.userId}`);
      return NextResponse.json({ error: "Akses tidak diizinkan" }, { status: 403 });
    }

    const result = await calculateResult(sessionId, session.tryoutId);

    // Only update session & save result if this is the first submission
    if (session.status === "active") {
      await prisma.$transaction([
        prisma.catSession.update({
          where: { id: sessionId },
          data: { status: "submitted", endedAt: new Date() },
        }),
        prisma.tryoutResult.create({
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
        }),
      ]);
    }

    return NextResponse.json({
      ...result,
      passingGrade: session.tryout.passingGrade,
      catPassingGradePoints: session.tryout.catPassingGradePoints || 0,
    });
  } catch (error) {
    console.error(`[CAT/SESSIONS/${params.id}/SUBMIT] Error:`, error);
    return NextResponse.json({ error: "Gagal submit ujian" }, { status: 500 });
  }
}
