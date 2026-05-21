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
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.title || !data.slug || !data.category) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

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
        catPassingGradePoints: parseInt(data.catPassingGradePoints) || 0,
        catAvailableFrom: data.catAvailableFrom ? new Date(data.catAvailableFrom) : null,
        catAvailableUntil: data.catAvailableUntil ? new Date(data.catAvailableUntil) : null,
        pgTwk: parseInt(data.pgTwk) || 65,
        pgTiu: parseInt(data.pgTiu) || 80,
        pgTkp: parseInt(data.pgTkp) || 166,
      },
    });
    return NextResponse.json({ tryout }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}
