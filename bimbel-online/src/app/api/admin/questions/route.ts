import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { tryoutId, question, optionA, optionB, optionC, optionD, optionE, answer, explanation, questionType, optionPoints, subtest } = await request.json();
    
    if (!tryoutId || !question || !optionA || !optionB || !optionC || !optionD || !answer) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

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
        subtest: subtest || null,
      },
    });

    await prisma.tryout.update({
      where: { id: tryoutId },
      data: { questionCount: { increment: 1 } },
    });

    return NextResponse.json({ question: q }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}
