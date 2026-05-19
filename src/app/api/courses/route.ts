import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = courses.map((c) => ({
      ...c,
      lessons: c.modules.reduce((acc, m) => acc + m._count.lessons, 0),
    }));

    return NextResponse.json({ courses: formatted });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
