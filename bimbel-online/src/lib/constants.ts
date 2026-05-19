export const navItems = [
  { name: "Beranda", href: "/" },
  { name: "Kursus", href: "/courses" },
  { name: "Tryout", href: "/tryouts" },
  { name: "Simulasi CAT", href: "/cat" },
  { name: "Tentang", href: "/#about" },
];

export const categories = ["Semua", "UTBK", "SKD", "CPNS", "Kedinasan", "SMP", "Bahasa"];

export const features = [
  {
    title: "Tryout Online",
    description: "Simulasi ujian dengan soal-soal berkualitas dan pembahasan lengkap.",
    icon: "📝",
  },
  {
    title: "Video Pembelajaran",
    description: "Materi lengkap dalam bentuk video yang bisa diakses kapan saja.",
    icon: "🎬",
  },
  {
    title: "Mentor Berpengalaman",
    description: "Dibimbing oleh pengajar profesional dan berpengalaman.",
    icon: "👨‍🏫",
  },
  {
    title: "Tracking Progress",
    description: "Pantau perkembangan belajarmu dengan dashboard interaktif.",
    icon: "📊",
  },
  {
    title: "Forum Diskusi",
    description: "Diskusi dengan sesama siswa dan mentor untuk pemahaman lebih.",
    icon: "💬",
  },
  {
    title: "Sertifikat",
    description: "Dapatkan sertifikat setelah menyelesaikan kursus.",
    icon: "🏆",
  },
];

export const pricingPlans = [
  {
    name: "Gratis",
    price: 0,
    description: "Coba fitur dasar bimbel online",
    features: ["Akses 2 tryout gratis", "Materi dasar", "Forum diskusi", "1 kursus preview"],
    cta: "Mulai Gratis",
    highlighted: false,
  },
  {
    name: "Premium",
    price: 99000,
    description: "Akses penuh semua fitur bimbel",
    features: [
      "Semua tryout unlimited",
      "Semua kursus & video",
      "Konsultasi mentor",
      "Pembahasan lengkap",
      "Progress tracking",
      "Sertifikat",
    ],
    cta: "Berlangganan",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 199000,
    description: "Untuk sekolah dan institusi",
    features: [
      "Semua fitur Premium",
      "Multi-user management",
      "Laporan analitik",
      "Custom branding",
      "Support prioritas",
      "API access",
    ],
    cta: "Hubungi Kami",
    highlighted: false,
  },
];
