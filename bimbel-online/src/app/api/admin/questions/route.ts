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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tryoutId = searchParams.get("tryoutId");
    const subtest = searchParams.get("subtest");

    if (!tryoutId) {
      return NextResponse.json({ error: "tryoutId harus disertakan" }, { status: 400 });
    }

    const whereClause: any = { tryoutId };
    if (subtest && subtest !== "all") {
      whereClause.subtest = subtest;
    }

    // Delete questions matching criteria
    const deleted = await prisma.question.deleteMany({
      where: whereClause,
    });

    // Sync questionCount
    const remainingCount = await prisma.question.count({
      where: { tryoutId },
    });
    
    await prisma.tryout.update({
      where: { id: tryoutId },
      data: { questionCount: remainingCount },
    });

    return NextResponse.json({ success: true, deleted: deleted.count });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}
