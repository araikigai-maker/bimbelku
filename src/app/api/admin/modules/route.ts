import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { courseId, title } = await request.json();
    const maxOrder = await prisma.module.count({ where: { courseId } });
    const module = await prisma.module.create({
      data: { courseId, title, order: maxOrder + 1 },
      include: { lessons: true },
    });
    return NextResponse.json({ module }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
