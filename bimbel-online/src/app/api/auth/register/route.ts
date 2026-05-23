import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();

    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Stricter password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }
    
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password harus mengandung huruf kapital dan angka" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Automatically log in the user by creating a session
    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[AUTH/REGISTER] Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
