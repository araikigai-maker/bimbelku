import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const tryoutCount = await prisma.tryout.count();
    const questionCount = await prisma.question.count();
    const tryoutResultCount = await prisma.tryoutResult.count();

    const totalStudents = await prisma.user.count({
      where: { role: "STUDENT" },
    });

    const recentResults = await prisma.tryoutResult.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        tryout: { select: { title: true } },
      },
    });

    const avgScores = await prisma.tryoutResult.groupBy({
      by: ["tryoutId"],
      _avg: { score: true },
      _count: { score: true },
    });

    return NextResponse.json({
      stats: {
        users: userCount,
        courses: courseCount,
        tryouts: tryoutCount,
        questions: questionCount,
        students: totalStudents,
        results: tryoutResultCount,
      },
      recentResults,
      avgScores,
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
