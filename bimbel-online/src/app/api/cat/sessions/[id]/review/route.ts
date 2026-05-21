import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.catSession.findUnique({
      where: { id: params.id },
      include: {
        tryout: true,
        answers: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }

    if (session.status !== "submitted") {
      return NextResponse.json(
        { error: "Review hanya tersedia setelah ujian selesai" },
        { status: 403 }
      );
    }

    const questions = await prisma.question.findMany({
      where: { tryoutId: session.tryoutId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        question: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        optionE: true,
        answer: true,
        optionPoints: true,
        explanation: true,
        questionType: true,
        subtest: true,
        order: true,
      },
    });

    // Merge answers into questions for easier client processing
    const reviewData = questions.map((q) => {
      const catAnswer = session.answers.find((a) => a.questionId === q.id);
      
      let pointsEarned = 0;
      let maxPoints = 5;
      const userAns = catAnswer?.answer;

      if (q.questionType === "tkp") {
        let pts: Record<string, number> = {};
        try { pts = JSON.parse(q.optionPoints || "{}"); } catch { pts = {}; }
        pointsEarned = (userAns ? pts[userAns] : 0) || 0;
      } else {
        pointsEarned = userAns !== null && userAns === q.answer ? 5 : 0;
      }

      return {
        ...q,
        userAnswer: userAns || null,
        isCorrect: q.questionType === "tkp" ? pointsEarned === 5 : userAns === q.answer,
        pointsEarned,
        maxPoints,
      };
    });

    return NextResponse.json({
      session: {
        id: session.id,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
      },
      tryout: {
        title: session.tryout.title,
        slug: session.tryout.slug,
      },
      reviewData,
    });
  } catch (error) {
    console.error("Review API Error:", error);
    return NextResponse.json({ error: "Gagal memuat data review" }, { status: 500 });
  }
}
