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
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
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
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
