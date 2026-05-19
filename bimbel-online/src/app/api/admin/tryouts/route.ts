import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tryouts = await prisma.tryout.findMany({
      include: {
        _count: { select: { questions: true, results: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ tryouts });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tryout = await prisma.tryout.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        category: data.category,
        duration: parseInt(data.duration) || 60,
        questionCount: 0,
        price: parseInt(data.price) || 0,
        image: data.image || "",
        passingGrade: parseInt(data.passingGrade) || 0,
      },
    });
    return NextResponse.json({ tryout }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
