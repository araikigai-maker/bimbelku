import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tryouts = await prisma.tryout.findMany({
      where: { catAvailableFrom: null },
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = tryouts.map((t) => ({
      ...t,
      questionCount: t._count.questions,
    }));

    return NextResponse.json({ tryouts: formatted });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
