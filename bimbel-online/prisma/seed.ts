import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("password123", 12);

  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Admin Bimbel",
        email: "admin@bimbel.com",
        password: hashedPassword,
        role: "ADMIN",
      },
      {
        name: "Ahmad Siswa",
        email: "ahmad@siswa.com",
        password: hashedPassword,
        role: "STUDENT",
      },
    ],
  });

  await prisma.course.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Persiapan UTBK Saintek 2026",
        slug: "utbk-saintek-2026",
        description: "Kursus lengkap untuk persiapan UTBK Sains & Teknologi. Materi matematika, fisika, kimia, dan biologi.",
        category: "UTBK",
        price: 299000,
        instructor: "Tim Pengajar Bimbel",
        lessons: 48,
        students: 1250,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500",
      },
      {
        title: "Persiapan UTBK Soshum 2026",
        slug: "utbk-soshum-2026",
        description: "Kursus lengkap untuk persiapan UTBK Sosial & Humaniora. Materi sejarah, geografi, ekonomi, dan sosiologi.",
        category: "UTBK",
        price: 299000,
        instructor: "Tim Pengajar Bimbel",
        lessons: 42,
        students: 980,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
      },
      {
        title: "Persiapan SKD CPNS 2026",
        slug: "skd-cpns-2026",
        description: "Bimbel online untuk Seleksi Kompetensi Dasar CPNS. TWK, TIU, dan TKP lengkap.",
        category: "SKD",
        price: 199000,
        instructor: "Tim CPNS Expert",
        lessons: 36,
        students: 2100,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500",
      },
      {
        title: "Persiapan Tes Kedinasan",
        slug: "tes-kedinasan-2026",
        description: "Kursus persiapan tes kedinasan AKPOL, Akmil, IPDN, dan lainnya.",
        category: "Kedinasan",
        price: 249000,
        instructor: "Tim Kedinasan Pro",
        lessons: 30,
        students: 750,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=500",
      },
      {
        title: "Matematika Dasar SMP",
        slug: "matematika-smp",
        description: "Kursus matematika untuk siswa SMP kelas 7-9. Dari dasar hingga mahir.",
        category: "SMP",
        price: 149000,
        instructor: "Bu Sari, S.Pd",
        lessons: 24,
        students: 560,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500",
      },
      {
        title: "Bahasa Inggris TOEFL Prep",
        slug: "toefl-prep",
        description: "Persiapan TOEFL ITP dan iBT. Listening, Structure, Reading lengkap.",
        category: "Bahasa",
        price: 179000,
        instructor: "Mr. John, M.Ed",
        lessons: 28,
        students: 890,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1543109740-4bdb38fda72c?w=500",
      },
    ],
  });

  await prisma.tryout.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Tryout UTBK Saintek #1",
        slug: "tryout-utbk-saintek-1",
        description: "Simulasi UTBK Sains & Teknologi dengan soal-soal prediksi 2026.",
        category: "UTBK",
        duration: 120,
        questionCount: 60,
        price: 0,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500",
      },
      {
        title: "Tryout UTBK Soshum #1",
        slug: "tryout-utbk-soshum-1",
        description: "Simulasi UTBK Sosial & Humaniora dengan soal-soal prediksi 2026.",
        category: "UTBK",
        duration: 120,
        questionCount: 60,
        price: 0,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500",
      },
      {
        title: "Tryout SKD CPNS #1 - TWK",
        slug: "tryout-skd-twk-1",
        description: "Simulasi TWK untuk SKD CPNS dengan passing grade terbaru.",
        category: "SKD",
        duration: 90,
        questionCount: 45,
        price: 0,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500",
      },
      {
        title: "Tryout SKD CPNS #2 - TIU",
        slug: "tryout-skd-tiu-1",
        description: "Simulasi TIU untuk SKD CPNS dengan soal logika dan numerik.",
        category: "SKD",
        duration: 90,
        questionCount: 40,
        price: 0,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500",
      },
    ],
  });

  // ============================================================
  // MONETIZATION: Seed Plan data
  // ============================================================
  const plans = [
    {
      slug: "FREE",
      name: "Gratis",
      description: "Coba fitur dasar bimbel online",
      price: 0,
      durationDays: 0,
      features: JSON.stringify(["Akses 2 tryout gratis", "Materi dasar", "Lihat Leaderboard", "Lihat Pembahasan"]),
      isActive: true,
      highlighted: false,
      order: 1,
    },
    {
      slug: "PREMIUM",
      name: "Premium",
      description: "Akses penuh semua fitur bimbel",
      price: 99000,
      durationDays: 30,
      features: JSON.stringify([
        "Semua tryout unlimited",
        "Semua simulasi CAT",
        "Pembahasan lengkap",
        "Leaderboard Nasional",
        "Semua kursus & video",
        "Progress tracking",
        "Sertifikat",
      ]),
      isActive: true,
      highlighted: true,
      order: 2,
    },
    {
      slug: "ENTERPRISE",
      name: "Enterprise",
      description: "Untuk sekolah dan institusi",
      price: 199000,
      durationDays: 30,
      features: JSON.stringify([
        "Semua fitur Premium",
        "Multi-user management",
        "Laporan analitik sekolah",
        "Custom branding",
        "Support prioritas",
      ]),
      isActive: true,
      highlighted: false,
      order: 3,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
