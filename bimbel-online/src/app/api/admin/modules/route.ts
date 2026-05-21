import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { courseId, title } = await request.json();
    
    if (!courseId || !title) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const maxOrder = await prisma.module.count({ where: { courseId } });
    const module = await prisma.module.create({
      data: { courseId, title, order: maxOrder + 1 },
      include: { lessons: true },
    });
    return NextResponse.json({ module }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}
