import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { questionId, answer, ragu } = await req.json();

    if (!questionId) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const session = await prisma.catSession.findUnique({
      where: { id: params.id },
    });

    if (!session || session.status !== "active") {
      return NextResponse.json({ error: "Sesi tidak aktif" }, { status: 400 });
    }

    const existing = await prisma.catAnswer.findUnique({
      where: { sessionId_questionId: { sessionId: params.id, questionId } },
    });

    let catAnswer;
    if (existing) {
      catAnswer = await prisma.catAnswer.update({
        where: { id: existing.id },
        data: { answer, ragu: ragu ?? existing.ragu },
      });
    } else {
      catAnswer = await prisma.catAnswer.create({
        data: { sessionId: params.id, questionId, answer, ragu: ragu ?? false },
      });
    }

    const answerCount = await prisma.catAnswer.count({
      where: { sessionId: params.id, answer: { not: null } },
    });

    return NextResponse.json({ answer: catAnswer, answered: answerCount }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan jawaban" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const answers = await prisma.catAnswer.findMany({
      where: { sessionId: params.id },
    });
    const counts = {
      answered: answers.filter((a) => a.answer !== null).length,
      unanswered: await prisma.question.count({
        where: {
          tryout: { catSessions: { some: { id: params.id } } },
          id: { notIn: answers.filter((a) => a.answer !== null).map((a) => a.questionId) },
        },
      }),
    };
    return NextResponse.json({ answers, counts });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
