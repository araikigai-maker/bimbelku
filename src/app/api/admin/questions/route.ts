import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { tryoutId, question, optionA, optionB, optionC, optionD, optionE, answer, explanation, questionType, optionPoints } = await request.json();
    const maxOrder = await prisma.question.count({ where: { tryoutId } });

    const q = await prisma.question.create({
      data: {
        tryoutId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        optionE,
        answer,
        explanation,
        questionType: questionType || "regular",
        optionPoints: optionPoints || "{}",
        order: maxOrder + 1,
      },
    });

    await prisma.tryout.update({
      where: { id: tryoutId },
      data: { questionCount: { increment: 1 } },
    });

    return NextResponse.json({ question: q }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
