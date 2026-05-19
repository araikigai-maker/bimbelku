import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const d = await req.json();
    const q = await prisma.question.update({
      where: { id: params.id },
      data: {
        question: d.question,
        optionA: d.optionA,
        optionB: d.optionB,
        optionC: d.optionC,
        optionD: d.optionD,
        optionE: d.optionE,
        answer: d.answer,
        explanation: d.explanation,
        questionType: d.questionType || "regular",
        optionPoints: d.optionPoints || "{}",
      },
    });
    return NextResponse.json({ question: q });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const q = await prisma.question.findUnique({ where: { id: params.id } });
    if (q) {
      await prisma.tryout.update({
        where: { id: q.tryoutId },
        data: { questionCount: { decrement: 1 } },
      });
    }
    await prisma.question.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
