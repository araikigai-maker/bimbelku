import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tryout = await prisma.tryout.findUnique({
      where: { id: params.id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!tryout) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ tryout });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const updateData: any = {};

    // Only include fields that are explicitly provided
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.duration !== undefined) updateData.duration = parseInt(data.duration);
    if (data.price !== undefined) updateData.price = parseInt(data.price);
    if (data.image !== undefined) updateData.image = data.image;
    if (data.passingGrade !== undefined) updateData.passingGrade = parseInt(data.passingGrade) || 0;
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
    if (data.catPassingGradePoints !== undefined) {
      updateData.catPassingGradePoints = parseInt(data.catPassingGradePoints) || 0;
    }
    if (data.catAvailableFrom !== undefined) {
      updateData.catAvailableFrom = data.catAvailableFrom ? new Date(data.catAvailableFrom) : null;
    }
    if (data.catAvailableUntil !== undefined) {
      updateData.catAvailableUntil = data.catAvailableUntil ? new Date(data.catAvailableUntil) : null;
    }

    const tryout = await prisma.tryout.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json({ tryout });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tryout.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: `Terjadi kesalahan: ${err.message}` }, { status: 500 });
  }
}
