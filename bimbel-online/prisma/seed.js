const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  await prisma.catAnswer.deleteMany();
  await prisma.catSession.deleteMany();
  await prisma.catAccess.deleteMany();
  await prisma.tryoutResult.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.question.deleteMany();
  await prisma.tryout.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const adminHashedPassword = await bcrypt.hash("Sukahaji27@", 12);
  const studentHashedPassword = await bcrypt.hash("password123", 12);

  await prisma.user.createMany({
    data: [
      { name: "Admin Bimbel", email: "admin@bimbel.com", password: adminHashedPassword, role: "ADMIN" },
      { name: "Ahmad Siswa", email: "ahmad@siswa.com", password: studentHashedPassword, role: "STUDENT" },
    ],
  });

  await prisma.course.createMany({
    data: [
      { title: "Persiapan UTBK Saintek 2026", slug: "utbk-saintek-2026", description: "Kursus lengkap untuk persiapan UTBK Sains & Teknologi.", category: "UTBK", price: 299000, instructor: "Tim Pengajar Bimbel", lessons: 10, students: 1250, rating: 4.8, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500" },
      { title: "Persiapan SKD CPNS 2026", slug: "skd-cpns-2026", description: "Bimbel online untuk Seleksi Kompetensi Dasar CPNS. TWK, TIU, dan TKP lengkap.", category: "SKD", price: 199000, instructor: "Tim CPNS Expert", lessons: 12, students: 2100, rating: 4.9, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" },
    ],
  });

  const tryouts = await prisma.tryout.createManyAndReturn({
    data: [
      { title: "Tryout UTBK Saintek #1", slug: "tryout-utbk-saintek-1", description: "Simulasi UTBK Sains & Teknologi.", category: "UTBK", duration: 15, questionCount: 10, price: 0, passingGrade: 70, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" },
      { title: "Tryout SKD CPNS - TWK", slug: "tryout-skd-twk-1", description: "Simulasi TWK untuk SKD CPNS.", category: "SKD", duration: 15, questionCount: 10, price: 0, passingGrade: 65, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" },
      { title: "Tryout SKD CPNS - TIU", slug: "tryout-skd-tiu-1", description: "Simulasi TIU untuk SKD CPNS.", category: "SKD", duration: 15, questionCount: 10, price: 0, passingGrade: 65, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" },
      { title: "Tryout SKD CPNS - TKP", slug: "tryout-skd-tkp-1", description: "Simulasi Tes Kemampuan Potensial (TKP) untuk SKD CPNS dengan sistem penilaian 5-4-3-2-1.", category: "SKD", duration: 15, questionCount: 10, price: 0, passingGrade: 70, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" },
      { title: "Simulasi CAT SKD CPNS 2026", slug: "cat-cpns-2026-1", description: "Simulasi CAT SKD CPNS 2026 - 110 soal (35 TWK + 30 TIU + 45 TKP)", category: "SKD", duration: 90, questionCount: 110, price: 0, passingGrade: 0, catPassingGradePoints: 285, catAvailableFrom: new Date("2026-04-01"), catAvailableUntil: new Date("2026-12-31"), image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" },
    ],
  });

  console.log("Tryouts created:", tryouts.length);

  const saintekQuestions = [
    { question: "Jika x = 2 dan y = 3, maka nilai dari x² + 2xy + y² adalah...", optionA: "16", optionB: "25", optionC: "36", optionD: "49", optionE: "64", answer: "B", explanation: "x² + 2xy + y² = (x + y)² = (2 + 3)² = 5² = 25" },
    { question: "Luas segitiga dengan alas 10 cm dan tinggi 8 cm adalah...", optionA: "20 cm²", optionB: "30 cm²", optionC: "40 cm²", optionD: "50 cm²", optionE: "60 cm²", answer: "C", explanation: "Luas = ½ × alas × tinggi = 40 cm²" },
    { question: "Hukum Newton yang menyatakan aksi-reaksi adalah hukum ke...", optionA: "I Newton", optionB: "II Newton", optionC: "III Newton", optionD: "Gravitasi", optionE: "Kelembaman", answer: "C", explanation: "Hukum III Newton: aksi = reaksi" },
    { question: "Unsur dengan nomor atom 6 adalah...", optionA: "Nitrogen", optionB: "Oksigen", optionC: "Karbon", optionD: "Boron", optionE: "Fluor", answer: "C", explanation: "Karbon memiliki nomor atom 6" },
    { question: "Organel sel sebagai pusat pengendalian adalah...", optionA: "Mitokondria", optionB: "Ribosom", optionC: "Nukleus", optionD: "RE", optionE: "Golgi", answer: "C", explanation: "Nukleus sebagai pusat kendali sel" },
    { question: "Turunan f(x) = 3x³ - 2x + 5 adalah...", optionA: "9x² - 2", optionB: "6x² - 2", optionC: "9x² + 2", optionD: "3x² - 2", optionE: "9x³ - 2", answer: "A", explanation: "f'(x) = 9x² - 2" },
    { question: "Gerak lurus beraturan kecepatan 10 m/s, jarak 5 detik = ...", optionA: "25 m", optionB: "30 m", optionC: "40 m", optionD: "50 m", optionE: "60 m", answer: "D", explanation: "s = v × t = 50 m" },
    { question: "Fotosintesis menghasilkan...", optionA: "CO₂ dan H₂O", optionB: "C₆H₁₂O₆ dan O₂", optionC: "O₂ dan CO₂", optionD: "C₆H₁₂O₆ dan CO₂", optionE: "H₂O dan O₂", answer: "B", explanation: "Fotosintesis menghasilkan glukosa dan oksigen" },
    { question: "Nilai sin 30° adalah...", optionA: "½", optionB: "½√2", optionC: "½√3", optionD: "1", optionE: "0", answer: "A", explanation: "sin 30° = ½" },
    { question: "Energi kinetik massa 2 kg, kecepatan 4 m/s adalah...", optionA: "8 J", optionB: "12 J", optionC: "16 J", optionD: "24 J", optionE: "32 J", answer: "C", explanation: "Ek = ½mv² = 16 Joule" },
  ];

  // 35 TWK Questions
  const twkQuestions = [
    { question: "Pancasila sebagai dasar negara tercantum dalam...", optionA: "Alinea 1", optionB: "Alinea 4", optionC: "Batang tubuh", optionD: "Pasal 1", optionE: "Penjelasan UUD", answer: "B", explanation: "Pancasila dalam Pembukaan UUD 1945 alinea ke-4" },
    { question: "Sila pertama Pancasila dilambangkan...", optionA: "Rantai", optionB: "Pohon beringin", optionC: "Kepala banteng", optionD: "Bintang", optionE: "Padi kapas", answer: "D", explanation: "Bintang = Ketuhanan YME" },
    { question: "Semboyan negara Indonesia...", optionA: "Garuda Pancasila", optionB: "Bhinneka Tunggal Ika", optionC: "Tut Wuri", optionD: "Ing Ngarsa", optionE: "Gotong Royong", answer: "B", explanation: "Bhinneka Tunggal Ika = berbeda-beda tetap satu" },
    { question: "Presiden dan Wapres dipilih melalui...", optionA: "Sidang MPR", optionB: "Sidang DPR", optionC: "Pemilu", optionD: "Musyawarah", optionE: "Penunjukan", answer: "C", explanation: "Pemilu langsung oleh rakyat" },
    { question: "Indonesia di antara dua samudra...", optionA: "Hindia & Atlantik", optionB: "Hindia & Pasifik", optionC: "Pasifik & Atlantik", optionD: "Arktik & Hindia", optionE: "Pasifik & Arktik", answer: "B", explanation: "Samudra Hindia dan Pasifik" },
    { question: "KAA 1955 diadakan di...", optionA: "Jakarta", optionB: "Surabaya", optionC: "Bandung", optionD: "Yogyakarta", optionE: "Semarang", answer: "C", explanation: "Konferensi Asia Afrika di Bandung" },
    { question: "Lembaga penguji UU terhadap UUD...", optionA: "DPR", optionB: "MPR", optionC: "MK", optionD: "MA", optionE: "KPK", answer: "C", explanation: "Mahkamah Konstitusi = judicial review" },
    { question: "NKRI singkatan dari...", optionA: "Negara Kesatuan RI", optionB: "Negara Kepulauan RI", optionC: "Negara Konstitusi RI", optionD: "Nusantara Kesatuan RI", optionE: "Negara Kedaulatan RI", answer: "A", explanation: "Negara Kesatuan Republik Indonesia" },
    { question: "HAM di UUD 1945 pasal...", optionA: "27-34", optionB: "28A-28J", optionC: "1-3", optionD: "30-34", optionE: "10-15", answer: "B", explanation: "Pasal 28A-28J tentang HAM" },
    { question: "Tugas TNI adalah...", optionA: "Menegakkan hukum", optionB: "Keamanan dalam negeri", optionC: "Mempertahankan kedaulatan", optionD: "Mengatur pemerintahan", optionE: "Ketertiban umum", answer: "C", explanation: "TNI mempertahankan kedaulatan NKRI" },
    { question: "Bendera Indonesia dikibarkan pertama kali pada...", optionA: "17 Agustus 1945", optionB: "18 Agustus 1945", optionC: "28 Oktober 1928", optionD: "20 Mei 1908", optionE: "1 Juni 1945", answer: "A", explanation: "Bendera Merah Putih dikibarkan 17 Agustus 1945" },
    { question: "Pasal dalam UUD 1945 yang mengatur kebebasan beragama...", optionA: "Pasal 27", optionB: "Pasal 28E", optionC: "Pasal 29", optionD: "Pasal 31", optionE: "Pasal 30", answer: "C", explanation: "Pasal 29 UUD 1945 menjamin kebebasan beragama" },
    { question: "Lembaga negara yang memegang kekuasaan yudikatif...", optionA: "DPR", optionB: "Presiden", optionC: "MA dan MK", optionD: "BPK", optionE: "MPR", answer: "C", explanation: "Yudikatif dipegang MA dan MK" },
    { question: "Sumpah Pemuda pada tanggal...", optionA: "28 Oktober 1928", optionB: "20 Mei 1908", optionC: "17 Agustus 1945", optionD: "1 Juni 1945", optionE: "10 November 1945", answer: "A", explanation: "Sumpah Pemuda 28 Oktober 1928" },
    { question: "Pembukaan UUD 1945 terdiri dari... alinea", optionA: "3", optionB: "4", optionC: "5", optionD: "6", optionE: "2", answer: "B", explanation: "Pembukaan UUD 1945 terdiri dari 4 alinea" },
    { question: "Kedaulatan berada di tangan rakyat dan dilaksanakan menurut UUD tercantum dalam pasal...", optionA: "1 ayat 2", optionB: "2 ayat 1", optionC: "1 ayat 1", optionD: "3", optionE: "4 ayat 1", answer: "A", explanation: "Pasal 1 ayat 2 UUD 1945" },
    { question: "Warna merah pada bendera Indonesia melambangkan...", optionA: "Keberanian", optionB: "Kesucian", optionC: "Kekayaan", optionD: "Persatuan", optionE: "Ketuhanan", answer: "A", explanation: "Merah = berani" },
    { question: "Bahasa Indonesia diresmikan sebagai bahasa negara pada...", optionA: "28 Oktober 1928", optionB: "17 Agustus 1945", optionC: "18 Agustus 1945", optionD: "25 Oktober 1928", optionE: "20 Mei 1908", answer: "C", explanation: "18 Agustus 1945 bahasa Indonesia sebagai bahasa negara" },
    { question: "Batas wilayah Indonesia sebelah utara berbatasan dengan...", optionA: "Australia", optionB: "Malaysia, Filipina, Papua Nugini", optionC: "Timor Leste", optionD: "Samudra Hindia", optionE: "Samudra Pasifik", answer: "B", explanation: "Utara: Malaysia, Filipina, Papua Nugini" },
    { question: "Sistem pemerintahan Indonesia adalah...", optionA: "Parlementer", optionB: "Presidensial", optionC: "Semipresidensial", optionD: "Monarki", optionE: "Federal", answer: "B", explanation: "Indonesia menganut sistem presidensial" },
    { question: "Piagam Jakarta disahkan pada tanggal...", optionA: "22 Juni 1945", optionB: "17 Agustus 1945", optionC: "18 Agustus 1945", optionD: "1 Juni 1945", optionE: "29 Mei 1945", answer: "A", explanation: "Piagam Jakarta 22 Juni 1945" },
    { question: "BPUPKI dibentuk pada tanggal...", optionA: "1 Maret 1945", optionB: "29 April 1945", optionC: "7 Agustus 1945", optionD: "14 Agustus 1945", optionE: "17 Agustus 1945", answer: "A", explanation: "BPUPKI dibentuk 1 Maret 1945" },
    { question: "Lambang sila ke-3 Pancasila adalah...", optionA: "Bintang", optionB: "Rantai", optionC: "Pohon beringin", optionD: "Kepala banteng", optionE: "Padi dan kapas", answer: "C", explanation: "Pohon beringin = Persatuan Indonesia" },
    { question: "Hak budget DPR diatur dalam pasal...", optionA: "Pasal 20", optionB: "Pasal 23", optionC: "Pasal 22", optionD: "Pasal 21", optionE: "Pasal 24", answer: "B", explanation: "Pasal 23 tentang APBN" },
    { question: "Lembaga yang berwenang memberhentikan Presiden...", optionA: "DPR", optionB: "MK", optionC: "MPR", optionD: "MA", optionE: "KY", answer: "C", explanation: "MPR berwenang memberhentikan Presiden" },
    { question: "Indonesia menganut sistem ekonomi...", optionA: "Kapitalis", optionB: "Sosialis", optionC: "Pancasila", optionD: "Liberalis", optionE: "Komunis", answer: "C", explanation: "Sistem ekonomi Pancasila" },
    { question: "Persatuan Indonesia merupakan sila ke...", optionA: "1", optionB: "2", optionC: "3", optionD: "4", optionE: "5", answer: "C", explanation: "Sila ke-3 = Persatuan Indonesia" },
    { question: "Pertempuran 10 November 1945 terjadi di...", optionA: "Bandung", optionB: "Surabaya", optionC: "Semarang", optionD: "Yogyakarta", optionE: "Jakarta", answer: "B", explanation: "Pertempuran Surabaya 10 November 1945" },
    { question: "Otonomi daerah diatur dalam UU No...", optionA: "32 Tahun 2004", optionB: "23 Tahun 2014", optionC: "12 Tahun 2011", optionD: "5 Tahun 2014", optionE: "25 Tahun 1999", answer: "A", explanation: "UU 32/2004 tentang Pemerintahan Daerah" },
    { question: "Lembaga yang melakukan audit keuangan negara...", optionA: "BPK", optionB: "BPKP", optionC: "KPK", optionD: "DPR", optionE: "MK", answer: "A", explanation: "Badan Pemeriksa Keuangan" },
    { question: "Hari Kebangkitan Nasional diperingati setiap tanggal...", optionA: "28 Oktober", optionB: "20 Mei", optionC: "1 Juni", optionD: "17 Agustus", optionE: "10 November", answer: "B", explanation: "20 Mei 1908 = Hari Kebangkitan Nasional" },
    { question: "Wilayah Indonesia terbentang dari...", optionA: "Sabang sampai Merauke", optionB: "Anyer sampai Panarukan", optionC: "Miangas sampai Rote", optionD: "Kepulauan Riau sampai Papua", optionE: "Sumatra sampai Papua", answer: "A", explanation: "Sabang sampai Merauke" },
    { question: "UUD 1945 mengalami amandemen sebanyak...", optionA: "2 kali", optionB: "3 kali", optionC: "4 kali", optionD: "5 kali", optionE: "1 kali", answer: "C", explanation: "Amandemen UUD 1945 sebanyak 4 kali (1999-2002)" },
    { question: "GBHN dihapuskan setelah amandemen UUD 1945, digantikan oleh...", optionA: "APBN", optionB: "RPJPN", optionC: "UUD", optionD: "Perpres", optionE: "Tap MPR", answer: "B", explanation: "Rencana Pembangunan Jangka Panjang Nasional" },
    { question: "Pasal 33 UUD 1945 mengatur tentang...", optionA: "HAM", optionB: "Pertahanan", optionC: "Perekonomian", optionD: "Pendidikan", optionE: "Agama", answer: "C", explanation: "Pasal 33 tentang perekonomian dan kesejahteraan sosial" },
  ];

  // 30 TIU Questions
  const tiuQuestions = [
    { question: "Jika 3x + 7 = 22, x = ...", optionA: "3", optionB: "4", optionC: "5", optionD: "6", optionE: "7", answer: "C", explanation: "3x = 15 → x = 5" },
    { question: "Deret: 2, 6, 18, 54, ... berikutnya?", optionA: "72", optionB: "108", optionC: "162", optionD: "216", optionE: "324", answer: "C", explanation: "Rasio 3 → 54×3 = 162" },
    { question: "Semua mahasiswa lulus. Budi mahasiswa. Maka...", optionA: "Budi tidak lulus", optionB: "Mungkin lulus", optionC: "Budi lulus", optionD: "Tidak bisa simpulkan", optionE: "Bukan mahasiswa", answer: "C", explanation: "Silogisme: Budi lulus" },
    { question: "Harga Rp120.000 setelah diskon 20%. Harga awal?", optionA: "Rp140.000", optionB: "Rp144.000", optionC: "Rp150.000", optionD: "Rp160.000", optionE: "Rp200.000", answer: "C", explanation: "120.000 ÷ 0,8 = 150.000" },
    { question: "Antonim 'gagal' adalah...", optionA: "Ragu", optionB: "Berhasil", optionC: "Lemah", optionD: "Hancur", optionE: "Kalah", answer: "B", explanation: "Lawan kata gagal = berhasil" },
    { question: "A > B dan B > C, maka...", optionA: "A < C", optionB: "A = C", optionC: "A > C", optionD: "A ≤ C", optionE: "Tidak tahu", answer: "C", explanation: "Sifat transitif: A > C" },
    { question: "Rata-rata 4, 8, 12, 16, 20 adalah...", optionA: "8", optionB: "10", optionC: "12", optionD: "14", optionE: "16", answer: "C", explanation: "60 ÷ 5 = 12" },
    { question: "Sinonim 'pandai' adalah...", optionA: "Bodoh", optionB: "Cerdas", optionC: "Malas", optionD: "Lambat", optionE: "Kurang", answer: "B", explanation: "Persamaan kata pandai = cerdas" },
    { question: "Persegi luas 144 cm². Panjang sisi?", optionA: "10 cm", optionB: "11 cm", optionC: "12 cm", optionD: "13 cm", optionE: "14 cm", answer: "C", explanation: "s = √144 = 12 cm" },
    { question: "Semua kucing berkaki empat. Beberapa hewan kucing. Maka...", optionA: "Semua hewan berkaki 4", optionB: "Beberapa hewan berkaki 4", optionC: "Tidak ada", optionD: "Semua berkaki 4 kucing", optionE: "Kucing bukan hewan", answer: "B", explanation: "Beberapa hewan berkaki empat" },
    { question: "Jika a = 5, b = 3, maka a² - 2ab + b² = ...", optionA: "2", optionB: "4", optionC: "6", optionD: "8", optionE: "10", answer: "B", explanation: "(a - b)² = (5-3)² = 4" },
    { question: "Deret: 1, 4, 9, 16, 25, ... berikutnya?", optionA: "30", optionB: "35", optionC: "36", optionD: "42", optionE: "49", answer: "C", explanation: "Pola n² → 6² = 36" },
    { question: "Sebuah mobil menempuh 180 km dalam 3 jam. Kecepatan rata-rata?", optionA: "40 km/jam", optionB: "50 km/jam", optionC: "60 km/jam", optionD: "70 km/jam", optionE: "80 km/jam", answer: "C", explanation: "180/3 = 60 km/jam" },
    { question: "Sinonim 'dedikasi' adalah...", optionA: "Pengabdian", optionB: "Pengetahuan", optionC: "Kekayaan", optionD: "Keahlian", optionE: "Kehormatan", answer: "A", explanation: "Dedikasi = pengabdian" },
    { question: "Semua P adalah Q. Sebagian P adalah R. Maka...", optionA: "Semua Q adalah R", optionB: "Sebagian Q adalah R", optionC: "Semua R adalah Q", optionD: "Sebagian R adalah P", optionE: "Tidak dapat disimpulkan", answer: "B", explanation: "Sebagian Q (yaitu P) adalah R" },
    { question: "Nilai dari 25% dari 200 adalah...", optionA: "25", optionB: "40", optionC: "50", optionD: "75", optionE: "100", answer: "C", explanation: "25/100 × 200 = 50" },
    { question: "Antonim 'progresif' adalah...", optionA: "Modern", optionB: "Regresif", optionC: "Aktif", optionD: "Kreatif", optionE: "Inovatif", answer: "B", explanation: "Lawan progresif = regresif (mundur)" },
    { question: "Jika x < y dan y < z, maka...", optionA: "x > z", optionB: "x = z", optionC: "x < z", optionD: "x ≥ z", optionE: "Tidak bisa ditentukan", answer: "C", explanation: "Transitif: x < z" },
    { question: "Berapa sisi yang dimiliki segi delapan?", optionA: "6", optionB: "7", optionC: "8", optionD: "9", optionE: "10", answer: "C", explanation: "Segi delapan = 8 sisi" },
    { question: "Sinonim 'kontemporer' adalah...", optionA: "Kuno", optionB: "Modern", optionC: "Klasik", optionD: "Tradisional", optionE: "Lampau", answer: "B", explanation: "Kontemporer = modern/masa kini" },
    { question: "Seorang pedagang membeli 50 kg beras seharga Rp500.000. Ia menjualnya Rp12.000/kg. Untung?", optionA: "Rp50.000", optionB: "Rp75.000", optionC: "Rp100.000", optionD: "Rp125.000", optionE: "Rp150.000", answer: "C", explanation: "Jual = 50×12.000 = 600.000. Untung = 100.000" },
    { question: "Deret: 100, 95, 85, 70, 50, ... berikutnya?", optionA: "25", optionB: "30", optionC: "35", optionD: "40", optionE: "45", answer: "A", explanation: "-5, -10, -15, -20, -25 → 50-25 = 25" },
    { question: "Jika 2x + 5 = 13, maka x + 3 = ...", optionA: "5", optionB: "6", optionC: "7", optionD: "8", optionE: "9", answer: "C", explanation: "2x = 8 → x = 4 → x+3 = 7" },
    { question: "Antonim 'mayoritas' adalah...", optionA: "Sebagian", optionB: "Minoritas", optionC: "Banyak", optionD: "Umum", optionE: "Rata-rata", answer: "B", explanation: "Lawan mayoritas = minoritas" },
    { question: "Semua karyawan hadir. Sebagian karyawan sakit. Maka...", optionA: "Semua sakit hadir", optionB: "Sebagian yang hadir sakit", optionC: "Tidak ada yang sakit", optionD: "Semua tidak sakit", optionE: "Karyawan sakit tidak hadir", answer: "B", explanation: "Sebagian yang hadir adalah yang sakit" },
    { question: "Volume kubus dengan panjang sisi 5 cm adalah...", optionA: "25 cm³", optionB: "100 cm³", optionC: "125 cm³", optionD: "150 cm³", optionE: "250 cm³", answer: "C", explanation: "V = s³ = 125 cm³" },
    { question: "Sinonim 'apresiasi' adalah...", optionA: "Kritik", optionB: "Penghargaan", optionC: "Hukuman", optionD: "Abai", optionE: "Celaan", answer: "B", explanation: "Apresiasi = penghargaan" },
    { question: "Jika 3 pekerja bisa menyelesaikan dalam 6 hari, berapa hari untuk 9 pekerja?", optionA: "1 hari", optionB: "2 hari", optionC: "3 hari", optionD: "4 hari", optionE: "5 hari", answer: "B", explanation: "3×6 = 18 hari-pekerja ÷ 9 = 2 hari" },
    { question: "Deret: 1, 1, 2, 3, 5, 8, ... berikutnya?", optionA: "10", optionB: "11", optionC: "12", optionD: "13", optionE: "14", answer: "D", explanation: "Bilangan Fibonacci: 8+5 = 13" },
    { question: "Seorang peternak punya 120 ekor ayam. 15% mati. Berapa sisanya?", optionA: "98", optionB: "100", optionC: "102", optionD: "105", optionE: "108", answer: "C", explanation: "Mati = 18. Sisa = 120-18 = 102" },
  ];

  // 45 TKP Questions with point values 5-4-3-2-1
  const tkpQuestions = [
    {
      question: "Anda sedang mengerjakan proyek tim yang deadline-nya besok. Tiba-tiba rekan Anda sakit. Yang akan Anda lakukan...",
      optionA: "Mengerjakan sendiri semua pekerjaan rekan saya",
      optionB: "Membagi ulang pekerjaan dengan anggota tim lain dan membantu yang kesulitan",
      optionC: "Melapor ke atasan dan meminta tambahan waktu",
      optionD: "Meminta rekan lain mengerjakan tugas rekan yang sakit",
      optionE: "Menunggu rekan tersebut sembuh",
      answer: "B", optionPoints: '{"A":3,"B":5,"C":4,"D":2,"E":1}',
      questionType: "tkp",
      explanation: "Membagi ulang pekerjaan dan membantu yang kesulitan adalah tindakan paling efektif dan solutif.",
    },
    {
      question: "Ketika atasan Anda memberikan tugas yang tidak sesuai dengan job description Anda, sikap Anda...",
      optionA: "Menolak tegas karena bukan tugas saya",
      optionB: "Menerima dan berusaha menyelesaikan dengan baik sambil belajar",
      optionC: "Menerima tapi mengerjakan setengah hati",
      optionD: "Meminta atasan menunjuk orang lain",
      optionE: "Pura-pura sakit agar tidak diberi tugas",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Menerima dengan positif dan berusaha belajar adalah sikap profesional terbaik.",
    },
    {
      question: "Rekan kerja Anda sering terlambat masuk kantor. Yang Anda lakukan...",
      optionA: "Melaporkan ke atasan langsung",
      optionB: "Menegur secara pribadi dan menanyakan kendalanya",
      optionC: "Membiarkan saja karena bukan urusan saya",
      optionD: "Menggosipkan dengan rekan lain",
      optionE: "Ikut-ikutan terlambat agar tidak dianggap sok suci",
      answer: "B", optionPoints: '{"A":3,"B":5,"C":2,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Menegur secara pribadi adalah langkah paling bijaksana dan profesional.",
    },
    {
      question: "Anda memiliki ide bagus untuk meningkatkan efisiensi kerja. Yang akan Anda lakukan...",
      optionA: "Menyimpan ide untuk diri sendiri",
      optionB: "Menyampaikan ide kepada atasan dengan data pendukung",
      optionC: "Memberitahu rekan kerja terdekat saja",
      optionD: "Menunggu diminta pendapat",
      optionE: "Menerapkan diam-diam tanpa memberi tahu siapapun",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Menyampaikan ide dengan data pendukung menunjukkan inisiatif dan profesionalisme.",
    },
    {
      question: "Ketika ada konflik antara dua rekan kerja Anda, sikap Anda...",
      optionA: "Memihak salah satu yang benar",
      optionB: "Menjadi mediator dan mendamaikan keduanya",
      optionC: "Tidak peduli dan membiarkan",
      optionD: "Membicarakan di belakang mereka",
      optionE: "Ikut campur dan memperkeruh suasana",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Menjadi mediator adalah sikap dewasa dan profesional.",
    },
    {
      question: "Anda menemukan barang berharga milik rekan kerja terjatuh. Yang Anda lakukan...",
      optionA: "Menyimpannya sendiri",
      optionB: "Segera mengambil dan mengembalikan kepada pemiliknya",
      optionC: "Memberi tahu orang lain agar pemiliknya tahu",
      optionD: "Menaruh di tempat barang hilang",
      optionE: "Pura-pura tidak melihat",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":3,"D":4,"E":2}',
      questionType: "tkp",
      explanation: "Mengembalikan langsung ke pemilik adalah tindakan paling jujur dan terpuji.",
    },
    {
      question: "Suatu hari Anda diminta lembur di hari libur. Sikap Anda...",
      optionA: "Menolak dengan tegas",
      optionB: "Bersedia lembur karena pekerjaan penting, dengan kompensasi sesuai aturan",
      optionC: "Terpaksa menerima tapi ngambek",
      optionD: "Minta lembur sendiri agar dapat uang lebih",
      optionE: "Mengajak rekan lain protes",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":4,"D":1,"E":3}',
      questionType: "tkp",
      explanation: "Bersedia lembur dengan profesional adalah sikap terbaik.",
    },
    {
      question: "Anda melihat rekan kerja melakukan pelanggaran kecil. Yang Anda lakukan...",
      optionA: "Melaporkan ke atasan",
      optionB: "Menegur secara langsung dengan cara baik",
      optionC: "Membiarkan karena kecil",
      optionD: "Ikut melanggar",
      optionE: "Menyebarkan ke rekan lain",
      answer: "B", optionPoints: '{"A":4,"B":5,"C":3,"D":1,"E":2}',
      questionType: "tkp",
      explanation: "Teguran langsung secara baik adalah langkah paling tepat.",
    },
    {
      question: "Atasan Anda memutuskan kebijakan yang menurut Anda kurang tepat. Sikap Anda...",
      optionA: "Mematuhi meskipun kurang setuju",
      optionB: "Menyampaikan masukan secara sopan dan profesional, lalu tetap menjalankan keputusan",
      optionC: "Menolak menjalankan kebijakan",
      optionD: "Mengkritik di depan rekan kerja",
      optionE: "Diam saja dan tidak menjalankan",
      answer: "B", optionPoints: '{"A":3,"B":5,"C":1,"D":2,"E":4}',
      questionType: "tkp",
      explanation: "Menyampaikan masukan dengan sopan lalu tetap menjalankan keputusan adalah sikap profesional.",
    },
    {
      question: "Teman Anda meminta bantuan di saat Anda sedang sibuk. Yang Anda lakukan...",
      optionA: "Menolak karena sedang sibuk",
      optionB: "Membantu semampu saya atau menjadwalkan waktu lain untuk membantu",
      optionC: "Membantu tapi dengan perasaan kesal",
      optionD: "Pura-pura tidak mendengar",
      optionE: "Menyuruh orang lain untuk membantu",
      answer: "B", optionPoints: '{"A":3,"B":5,"C":2,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Membantu semampu atau menjadwalkan ulang menunjukkan kepedulian dan manajemen waktu baik.",
    },
    {
      question: "Anda mendapat kritikan dari atasan atas pekerjaan Anda. Sikap Anda...",
      optionA: "Marah dan tersinggung",
      optionB: "Menerima kritik dan memperbaiki kekurangan",
      optionC: "Mencari alasan pembenaran",
      optionD: "Menyalahkan pihak lain",
      optionE: "Mengabaikan kritik tersebut",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":3,"D":2,"E":4}',
      questionType: "tkp",
      explanation: "Menerima kritik dan memperbaiki diri adalah sikap dewasa dan profesional.",
    },
    {
      question: "Ketika Anda diminta memimpin rapat mendadak, sikap Anda...",
      optionA: "Menolak karena tidak siap",
      optionB: "Menerima dan mempersiapkan sebaik mungkin",
      optionC: "Menerima tapi pasif selama rapat",
      optionD: "Meminta orang lain menggantikan",
      optionE: "Datang terlambat agar tidak diminta",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Menerima tantangan dan berusaha maksimal adalah sikap kepemimpinan yang baik.",
    },
    {
      question: "Rekan kerja Anda berhasil meraih penghargaan. Sikap Anda...",
      optionA: "Iri dan dengki",
      optionB: "Memberikan selamat dan termotivasi untuk berprestasi",
      optionC: "Biasa saja",
      optionD: "Meremehkan pencapaiannya",
      optionE: "Mencari-cari kekurangannya",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":3,"D":2,"E":4}',
      questionType: "tkp",
      explanation: "Memberi selamat dan termotivasi menunjukkan sportivitas dan sikap positif.",
    },
    {
      question: "Anda dihadapkan pada tugas yang sangat sulit. Yang Anda lakukan...",
      optionA: "Menyerah sebelum mencoba",
      optionB: "Mempelajari dan mencari solusi secara bertahap",
      optionC: "Mengerjakan asal-asalan",
      optionD: "Meminta orang lain mengerjakan",
      optionE: "Menunda-nunda pekerjaan",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":2,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Mempelajari dan mencari solusi bertahap menunjukkan ketekunan dan semangat belajar.",
    },
    {
      question: "Anda melihat pengunjung kantor kebingungan. Yang Anda lakukan...",
      optionA: "Membiarkan karena bukan urusan saya",
      optionB: "Menghampiri dan menawarkan bantuan",
      optionC: "Menunjuk ke bagian informasi",
      optionD: "Pura-pura tidak melihat",
      optionE: "Menyuruh satpam mengurusnya",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":4,"D":1,"E":3}',
      questionType: "tkp",
      explanation: "Menghampiri dan menawarkan bantuan adalah pelayanan publik yang baik.",
    },
    {
      question: "Ketika Anda mendapat tugas tambahan di luar jam kerja, sikap Anda...",
      optionA: "Menolak mentah-mentah",
      optionB: "Menerima dengan ikhlas sebagai tanggung jawab",
      optionC: "Menerima dengan syarat dibayar lembur",
      optionD: "Pura-pura sakit",
      optionE: "Mengerjakan setengah hati",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":4,"D":2,"E":3}',
      questionType: "tkp",
      explanation: "Menerima dengan ikhlas sebagai tanggung jawab menunjukkan dedikasi tinggi.",
    },
    {
      question: "Anda memiliki perbedaan pendapat dengan rekan tim. Sikap Anda...",
      optionA: "Memaksakan pendapat sendiri",
      optionB: "Berdiskusi dan mencari solusi terbaik bersama",
      optionC: "Diam dan tidak berpendapat",
      optionD: "Mengikuti pendapat rekan tanpa diskusi",
      optionE: "Membawa masalah ke atasan",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Berdiskusi mencari solusi terbaik adalah sikap kolaboratif dan dewasa.",
    },
    {
      question: "Anda menemukan kesalahan dalam laporan yang sudah disetujui atasan. Yang Anda lakukan...",
      optionA: "Diam saja karena sudah disetujui",
      optionB: "Melaporkan kesalahan tersebut ke atasan untuk diperbaiki",
      optionC: "Memperbaiki diam-diam tanpa bilang",
      optionD: "Menyalahkan rekan yang membuat",
      optionE: "Menutup-nutupi kesalahan",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":4,"D":1,"E":3}',
      questionType: "tkp",
      explanation: "Melaporkan kesalahan untuk diperbaiki menunjukkan integritas dan tanggung jawab.",
    },
    {
      question: "Dalam rapat, pendapat Anda ditolak oleh mayoritas. Sikap Anda...",
      optionA: "Marah dan walk out",
      optionB: "Menerima keputusan dengan lapang dada",
      optionC: "Memaksakan pendapat terus",
      optionD: "Diam dan tidak aktif lagi",
      optionE: "Mengadakan rapat tandingan",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":2,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Menerima keputusan bersama dengan lapang dada adalah sikap demokratis.",
    },
    {
      question: "Libur nasional tiba-tiba Anda diminta masuk kerja. Sikap Anda...",
      optionA: "Menolak dan tetap libur",
      optionB: "Masuk kerja karena panggilan tugas",
      optionC: "Masuk tapi tidak bersemangat",
      optionD: "Minta rekan lain menggantikan",
      optionE: "Pura-para tidak diberitahu",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":3,"D":2,"E":4}',
      questionType: "tkp",
      explanation: "Mendahulukan tugas menunjukkan tanggung jawab dan loyalitas.",
    },
    {
      question: "Masyarakat mengeluhkan pelayanan yang lambat. Sebagai ASN, Anda...",
      optionA: "Mengabaikan karena sudah prosedur",
      optionB: "Mengevaluasi dan memperbaiki sistem pelayanan",
      optionC: "Menyalahkan masyarakat yang tidak sabar",
      optionD: "Menambah persyaratan",
      optionE: "Meneruskan keluhan ke atasan tanpa tindak lanjut",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":1,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Mengevaluasi dan memperbaiki pelayanan adalah wujud orientasi pelayanan publik.",
    },
    {
      question: "Anda ditawari hadiah oleh masyarakat yang dibantu. Sikap Anda...",
      optionA: "Menerima karena sudah membantu",
      optionB: "Menolak dengan sopan karena tugas sudah menjadi kewajiban",
      optionC: "Menerima setengahnya",
      optionD: "Meminta lebih",
      optionE: "Menerima tapi lapor atasan",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Menolak dengan sopan karena sudah kewajiban menunjukkan integritas tinggi.",
    },
    {
      question: "Atasan memberikan instruksi yang kurang jelas. Yang Anda lakukan...",
      optionA: "Mengerjakan semampu saya",
      optionB: "Meminta klarifikasi dengan sopan",
      optionC: "Tidak mengerjakan",
      optionD: "Mengerjakan asal-asalan",
      optionE: "Bertanya ke rekan lain tanpa konfirmasi atasan",
      answer: "B", optionPoints: '{"A":3,"B":5,"C":1,"D":2,"E":4}',
      questionType: "tkp",
      explanation: "Meminta klarifikasi menunjukkan inisiatif dan tanggung jawab.",
    },
    {
      question: "Tiba-tiba terjadi bencana alam di daerah tugas Anda. Yang Anda lakukan...",
      optionA: "Mengungsi menyelamatkan diri",
      optionB: "Ikut serta dalam tim tanggap darurat membantu masyarakat",
      optionC: "Menunggu instruksi atasan",
      optionD: "Pulang ke rumah",
      optionE: "Melaporkan di media sosial",
      answer: "B", optionPoints: '{"A":3,"B":5,"C":4,"D":1,"E":2}',
      questionType: "tkp",
      explanation: "Ikut serta membantu masyarakat menunjukkan kepedulian dan jiwa pengabdian.",
    },
    {
      question: "Rekan kerja Anda mengambil kredit atas ide Anda. Sikap Anda...",
      optionA: "Marah dan konfrontasi",
      optionB: "Membicarakannya secara pribadi dengan baik-baik",
      optionC: "Membiarkan saja",
      optionD: "Melakukan hal sama padanya",
      optionE: "Mengadu ke atasan",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Membicarakannya secara pribadi adalah cara dewasa menyelesaikan masalah.",
    },
    {
      question: "Anda dipercaya memegang dana kantor. Yang Anda lakukan...",
      optionA: "Menggunakan untuk kebutuhan pribadi, akan diganti nanti",
      optionB: "Mengelola dengan transparan dan penuh tanggung jawab",
      optionC: "Meminjamkan ke rekan yang butuh",
      optionD: "Menitipkan di bank pribadi",
      optionE: "Tidak mau menerima tanggung jawab tersebut",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Mengelola dengan transparan menunjukkan integritas dan amanah.",
    },
    {
      question: "Saat apel pagi, atasan menyampaikan visi yang kurang realistis. Sikap Anda...",
      optionA: "Mencemooh dalam hati",
      optionB: "Mendukung dan berusaha menjalankan semampu mungkin",
      optionC: "Protes keras saat apel",
      optionD: "Tidak mendengarkan",
      optionE: "Menyebarkan ketidaksetujuan ke rekan lain",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":1,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Mendukung dan berusaha menjalankan adalah sikap loyal dan profesional.",
    },
    {
      question: "Anda bekerja dalam tim yang anggotanya sangat beragam. Sikap Anda...",
      optionA: "Hanya mau bekerja dengan yang sepaham",
      optionB: "Menghargai perbedaan dan bekerja sama dengan semua",
      optionC: "Menjauhi yang berbeda latar belakang",
      optionD: "Membeda-bedakan perlakuan",
      optionE: "Membentuk kelompok sendiri",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":1,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Menghargai perbedaan dan bekerja sama dengan semua adalah sikap inklusif.",
    },
    {
      question: "Waktu istirahat, masih ada masyarakat yang membutuhkan pelayanan. Sikap Anda...",
      optionA: "Tetap istirahat karena sudah jam istirahat",
      optionB: "Melayani dengan ikhlas sampai selesai baru istirahat",
      optionC: "Melayani dengan setengah hati",
      optionD: "Menyuruh datang lagi nanti",
      optionE: "Pura-pura tidak melihat",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Mendahulukan pelayanan publik menunjukkan dedikasi sebagai abdi negara.",
    },
    {
      question: "Anda menemukan data rekan kerja yang tidak sesuai fakta. Yang Anda lakukan...",
      optionA: "Membiarkan karena bukan urusan saya",
      optionB: "Mengingatkan secara pribadi dengan baik",
      optionC: "Melaporkan ke atasan",
      optionD: "Menyebarkan ke orang lain",
      optionE: "Memperbaiki sendiri tanpa bilang",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":4,"D":1,"E":3}',
      questionType: "tkp",
      explanation: "Mengingatkan secara pribadi dengan baik adalah langkah paling bijaksana.",
    },
    {
      question: "Anda memiliki banyak pekerjaan dengan deadline berdekatan. Yang Anda lakukan...",
      optionA: "Mengerjakan yang termudah dulu",
      optionB: "Membuat prioritas dan mengerjakan sesuai skala urgensi",
      optionC: "Stress dan tidak bisa bekerja",
      optionD: "Meminta rekan mengerjakan sebagian",
      optionE: "Mengabaikan deadline",
      answer: "B", optionPoints: '{"A":3,"B":5,"C":1,"D":4,"E":2}',
      questionType: "tkp",
      explanation: "Membuat prioritas menunjukkan kemampuan manajemen waktu yang baik.",
    },
    {
      question: "Rekan baru Anda berasal dari daerah berbeda dan kesulitan beradaptasi. Sikap Anda...",
      optionA: "Membiarkan beradaptasi sendiri",
      optionB: "Membantu dan memperkenalkan lingkungan kerja",
      optionC: "Menjauhi karena berbeda",
      optionD: "Menertawakan logatnya",
      optionE: "Acuh tak acuh",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":1,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Membantu rekan baru beradaptasi menunjukkan sikap kepedulian dan kebersamaan.",
    },
    {
      question: "Anda mendapat informasi bahwa akan ada pemotongan anggaran. Sikap Anda...",
      optionA: "Protes keras",
      optionB: "Mencari efisiensi tanpa mengurangi kualitas kerja",
      optionC: "Mengabaikan informasi tersebut",
      optionD: "Menghabiskan anggaran sebelum dipotong",
      optionE: "Mengeluh ke semua orang",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Mencari efisiensi adalah sikap adaptif dan bertanggung jawab.",
    },
    {
      question: "Anda diminta menjadi panitia kegiatan sosial kantor. Sikap Anda...",
      optionA: "Menolak karena merepotkan",
      optionB: "Menerima dan berpartisipasi aktif",
      optionC: "Menerima tapi pasif",
      optionD: "Ikut hanya agar terlihat baik",
      optionE: "Menyuruh orang lain mewakili",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":3,"D":2,"E":4}',
      questionType: "tkp",
      explanation: "Berpartisipasi aktif dalam kegiatan sosial menunjukkan kepedulian dan gotong royong.",
    },
    {
      question: "Tiba-tiba listrik padam saat Anda mengerjakan laporan penting. Yang Anda lakukan...",
      optionA: "Berhenti dan menunggu listrik nyala",
      optionB: "Mencari alternatif seperti menggunakan laptop atau menyalakan genset",
      optionC: "Panik dan stres",
      optionD: "Pulang karena tidak bisa bekerja",
      optionE: "Menyalahkan PLN",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":1,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Mencari alternatif solusi menunjukkan sikap proaktif dan tidak mudah menyerah.",
    },
    {
      question: "Anda diutus mengikuti pelatihan di luar kota. Sikap Anda...",
      optionA: "Menolak karena malas bepergian",
      optionB: "Antusias mengikuti dan menyerap ilmu untuk diterapkan",
      optionC: "Ikut tapi tidak serius",
      optionD: "Minta rekan lain yang berangkat",
      optionE: "Ikut hanya untuk jalan-jalan",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":3,"D":2,"E":4}',
      questionType: "tkp",
      explanation: "Antusias mengikuti pelatihan menunjukkan semangat belajar dan pengembangan diri.",
    },
    {
      question: "Anda melihat tawaran kerja sama yang menguntungkan pribadi tapi merugikan instansi. Sikap Anda...",
      optionA: "Menerima karena menguntungkan",
      optionB: "Menolak tegas karena bertentangan dengan kepentingan instansi",
      optionC: "Menerima dengan syarat tidak diketahui",
      optionD: "Mempertimbangkan dulu",
      optionE: "Membicarakan dengan rekan",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":2,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Menolak tegas demi kepentingan instansi menunjukkan integritas dan anti-korupsi.",
    },
    {
      question: "Organisasi Anda mengalami perubahan besar-besaran. Sikap Anda...",
      optionA: "Menolak perubahan",
      optionB: "Beradaptasi dengan perubahan dan tetap produktif",
      optionC: "Pasrah mengikuti arus",
      optionD: "Mengeluh terus menerus",
      optionE: "Mencari organisasi lain",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Beradaptasi dengan perubahan menunjukkan fleksibilitas dan ketahanan.",
    },
    {
      question: "Ada rekan yang menyebarkan gosip negatif tentang Anda. Sikap Anda...",
      optionA: "Menyebarkan gosip balik",
      optionB: "Mengklarifikasi secara langsung dengan baik-baik",
      optionC: "Mendiamkannya",
      optionD: "Melaporkan ke atasan",
      optionE: "Marah-marah di depan umum",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":4,"E":1}',
      questionType: "tkp",
      explanation: "Mengklarifikasi langsung dengan baik adalah sikap dewasa dan profesional.",
    },
    {
      question: "Anda adalah ketua tim yang anggotanya kurang disiplin. Yang Anda lakukan...",
      optionA: "Membiarkan karena sudah dewasa",
      optionB: "Memberi teguran dan contoh disiplin yang baik",
      optionC: "Melaporkan semua ke atasan",
      optionD: "Mengganti anggota tim",
      optionE: "Marah-marah saat rapat",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":1,"E":4}',
      questionType: "tkp",
      explanation: "Memberi teguran dan contoh disiplin adalah kepemimpinan yang efektif.",
    },
    {
      question: "Anda bertugas melayani masyarakat yang sedang marah. Sikap Anda...",
      optionA: "Melayani dengan emosi juga",
      optionB: "Tetap tenang dan berusaha memahami keluhannya",
      optionC: "Menghindar",
      optionD: "Memanggil satpam",
      optionE: "Menyuruh ke bagian lain",
      answer: "B", optionPoints: '{"A":1,"B":5,"C":2,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Tetap tenang dan memahami keluhan adalah pelayanan prima.",
    },
    {
      question: "Program kerja kantor Anda gagal mencapai target. Sikap Anda...",
      optionA: "Mencari kambing hitam",
      optionB: "Mengevaluasi dan memperbaiki untuk ke depannya",
      optionC: "Menyerah dan tidak mau mencoba lagi",
      optionD: "Menyembunyikan kegagalan",
      optionE: "Mengabaikan dan lanjut program lain",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":1,"D":3,"E":4}',
      questionType: "tkp",
      explanation: "Evaluasi dan perbaikan adalah sikap dewasa dalam menghadapi kegagalan.",
    },
    {
      question: "Anda memiliki hobi yang menyita waktu kerja. Yang Anda lakukan...",
      optionA: "Tetap menjalankan hobi saat kerja",
      optionB: "Memisahkan waktu kerja dan hobi dengan tegas",
      optionC: "Mengurangi hobi",
      optionD: "Berhenti kerja",
      optionE: "Menyembunyikan hobi",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":4,"D":1,"E":3}',
      questionType: "tkp",
      explanation: "Memisahkan waktu kerja dan hobi menunjukkan profesionalisme.",
    },
    {
      question: "Anda dianggap bersalah padahal tidak. Sikap Anda...",
      optionA: "Marah dan emosi",
      optionB: "Menjelaskan dengan tenang dan memberikan bukti",
      optionC: "Menerima saja",
      optionD: "Mengadu ke atasan",
      optionE: "Menunjuk orang lain sebagai pelaku",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":3,"D":4,"E":1}',
      questionType: "tkp",
      explanation: "Menjelaskan dengan tenang dan memberikan bukti adalah cara terbaik.",
    },
    {
      question: "Anda mewakili kantor mengikuti lomba dan mendapatkan juara 2. Sikap Anda...",
      optionA: "Menganggap prestasi itu kurang maksimal",
      optionB: "Bersyukur dan tetap berusaha meningkatkan prestasi ke depannya",
      optionC: "Merasa sudah cukup baik",
      optionD: "Menyalahkan faktor eksternal",
      optionE: "Berpuas diri dan tidak mau berusaha lagi",
      answer: "B", optionPoints: '{"A":2,"B":5,"C":4,"D":1,"E":3}',
      questionType: "tkp",
      explanation: "Bersyukur dan terus meningkatkan prestasi menunjukkan sikap positif dan pantang menyerah.",
    },
  ];

  for (let i = 0; i < saintekQuestions.length; i++) {
    await prisma.question.create({
      data: { ...saintekQuestions[i], tryoutId: tryouts[0].id, order: i + 1, questionType: "regular", optionPoints: "{}", subtest: null },
    });
  }

  for (let i = 0; i < twkQuestions.length; i++) {
    await prisma.question.create({
      data: { ...twkQuestions[i], tryoutId: tryouts[1].id, order: i + 1, questionType: "regular", optionPoints: "{}", subtest: "TWK" },
    });
  }

  for (let i = 0; i < tiuQuestions.length; i++) {
    await prisma.question.create({
      data: { ...tiuQuestions[i], tryoutId: tryouts[2].id, order: i + 1, questionType: "regular", optionPoints: "{}", subtest: "TIU" },
    });
  }

  for (let i = 0; i < tkpQuestions.length; i++) {
    await prisma.question.create({
      data: { ...tkpQuestions[i], tryoutId: tryouts[3].id, order: i + 1, subtest: "TKP" },
    });
  }

  // Combined CAT CPNS tryout (35 TWK + 30 TIU + 45 TKP = 110 questions)
  const catTryout = tryouts[4];
  const catQuestionData = [
    ...twkQuestions.map((q, i) => ({ ...q, subtest: "TWK", questionType: "regular", optionPoints: "{}" })),
    ...tiuQuestions.map((q, i) => ({ ...q, subtest: "TIU", questionType: "regular", optionPoints: "{}" })),
    ...tkpQuestions.map((q, i) => ({ ...q, subtest: "TKP" })),
  ];
  for (let i = 0; i < catQuestionData.length; i++) {
    await prisma.question.create({
      data: { ...catQuestionData[i], tryoutId: catTryout.id, order: i + 1 },
    });
  }

  console.log(`Questions created: ${saintekQuestions.length} Saintek + ${twkQuestions.length} TWK + ${tiuQuestions.length} TIU + ${tkpQuestions.length} TKP = ${saintekQuestions.length + twkQuestions.length + tiuQuestions.length + tkpQuestions.length} + ${catQuestionData.length} CAT = ${saintekQuestions.length + twkQuestions.length + tiuQuestions.length + tkpQuestions.length + catQuestionData.length}`);

  // Seed CAT Access
  await prisma.catAccess.createMany({
    data: [
      { email: "admin@bimbel.com", name: "Admin Bimbel", active: true },
      { email: "ahmad@siswa.com", name: "Ahmad Siswa", active: true },
    ],
  });
  console.log("CAT Access seeded");

  await prisma.module.createMany({
    data: [
      { title: "Matematika Dasar", courseId: (await prisma.course.findFirst({ where: { slug: "utbk-saintek-2026" } })).id, order: 1 },
      { title: "TWK - Tes Wawasan Kebangsaan", courseId: (await prisma.course.findFirst({ where: { slug: "skd-cpns-2026" } })).id, order: 1 },
      { title: "TIU - Tes Intelegensia Umum", courseId: (await prisma.course.findFirst({ where: { slug: "skd-cpns-2026" } })).id, order: 2 },
      { title: "TKP - Tes Kemampuan Potensial", courseId: (await prisma.course.findFirst({ where: { slug: "skd-cpns-2026" } })).id, order: 3 },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
