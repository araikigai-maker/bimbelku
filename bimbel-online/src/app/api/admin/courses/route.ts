import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { modules: true, enrollments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ courses });
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

    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        category: data.category,
        price: parseInt(data.price) || 0,
        instructor: data.instructor || "",
        image: data.image || "",
      },
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}
