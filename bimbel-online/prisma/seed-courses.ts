const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Menghapus data kursus lama...')
  await prisma.course.deleteMany()

  console.log('Menambahkan kursus baru...')
  
  const courses = [
    {
      title: 'Mastercamp SKD CPNS 2026 - Batch 1',
      slug: 'mastercamp-skd-cpns-2026-batch-1',
      description: 'Persiapan intensif SKD CPNS 2026 bersama Master Teacher berpengalaman. Kuasai TWK, TIU, dan TKP dalam 30 hari dengan ribuan latihan soal Hots.',
      category: 'CPNS',
      price: 299000,
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      instructor: 'Kak Budi (Alumni STAN)',
      lessons: 45,
      students: 12450,
      rating: 4.9,
    },
    {
      title: 'Bootcamp Kedinasan (STAN & IPDN) Lengkap',
      slug: 'bootcamp-kedinasan-stan-ipdn',
      description: 'Jalur cepat lulus sekolah kedinasan favoritmu. Diajarkan langsung oleh taruna dan alumni lulusan terbaik.',
      category: 'Kedinasan',
      price: 499000,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      instructor: 'Kak Siti (Alumni IPDN)',
      lessons: 60,
      students: 8200,
      rating: 4.8,
    },
    {
      title: 'Trik Cepat Jawab TIU CPNS Tanpa Rumus',
      slug: 'trik-cepat-tiu-cpns',
      description: 'Bongkar rahasia menjawab soal TIU (Tes Intelegensia Umum) kurang dari 30 detik per soal. Cocok untuk yang lemah di matematika.',
      category: 'CPNS',
      price: 149000,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      instructor: 'Master Dedi',
      lessons: 20,
      students: 23100,
      rating: 4.9,
    },
    {
      title: 'Persiapan Tes BUMN (TKD & AKHLAK) 2026',
      slug: 'persiapan-tes-bumn-tkd-akhlak',
      description: 'Lolos rekrutmen bersama BUMN tahun ini. Kupas tuntas materi Core Values AKHLAK dan Tes Kemampuan Dasar (TKD).',
      category: 'BUMN',
      price: 249000,
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      instructor: 'Kak Andi (Ex-BUMN)',
      lessons: 35,
      students: 5400,
      rating: 4.7,
    },
    {
      title: 'Pejuang UTBK SNBT - Paket Saintek',
      slug: 'pejuang-utbk-snbt-saintek',
      description: 'Belajar asyik dan terarah untuk menembus PTN impianmu. Video animasi menarik dan pembahasan soal UTBK 5 tahun terakhir.',
      category: 'UTBK',
      price: 399000,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      instructor: 'Kak Fitri',
      lessons: 80,
      students: 45000,
      rating: 4.9,
    },
    {
      title: 'Pejuang UTBK SNBT - Paket Soshum',
      slug: 'pejuang-utbk-snbt-soshum',
      description: 'Pahami konsep Soshum tanpa perlu menghafal mati! Belajar sejarah, sosiologi, dan geografi seperti menonton film.',
      category: 'UTBK',
      price: 399000,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      instructor: 'Kak Risa',
      lessons: 75,
      students: 38000,
      rating: 4.8,
    }
  ]

  for (const course of courses) {
    await prisma.course.create({
      data: course
    })
    console.log(`Dibuat: ${course.title}`)
  }

  console.log('Seeding kursus selesai!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
