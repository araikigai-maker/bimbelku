import { prisma } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: Request) {
  try {
    const { moduleId, title, content, videoUrl } = await request.json();
    
    if (!moduleId || !title) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const maxOrder = await prisma.lesson.count({ where: { moduleId } });
    const lesson = await prisma.lesson.create({
      data: { moduleId, title, content, videoUrl: videoUrl || null, order: maxOrder + 1 },
    });
    return NextResponse.json({ lesson }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, content, videoUrl } = await request.json();
    
    if (!id || !title) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: { title, content, videoUrl: videoUrl || null },
    });
    return NextResponse.json({ lesson });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    await prisma.lesson.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}
