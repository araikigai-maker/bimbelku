import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ allowed: false, error: "Email diperlukan" }, { status: 400 });
    }

    const access = await prisma.catAccess.findUnique({
      where: { email: email.toLowerCase() },
    });

    return NextResponse.json({
      allowed: !!access && access.active,
      access: access ? { name: access.name, grantedAt: access.grantedAt } : null,
    });
  } catch {
    return NextResponse.json({ allowed: false, error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email diperlukan" }, { status: 400 });
    }

    const access = await prisma.catAccess.upsert({
      where: { email: email.toLowerCase() },
      update: { name: name || null, active: true },
      create: { email: email.toLowerCase(), name: name || null, active: true },
    });

    return NextResponse.json({ access }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { email, active } = await req.json();
    const access = await prisma.catAccess.update({
      where: { email: email.toLowerCase() },
      data: { active },
    });
    return NextResponse.json({ access });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    await prisma.catAccess.delete({ where: { email: email.toLowerCase() } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
