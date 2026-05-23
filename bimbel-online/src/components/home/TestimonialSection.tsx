const testimonials = [
  {
    name: "Rizky Aditya",
    result: "Lulus CPNS Kemenkeu 2024",
    quote: "Simulasi CAT-nya sangat mirip aslinya. Skor saya meningkat dari 280 menjadi 418 setelah latihan rutin di sini.",
    avatar: "R",
    color: "bg-blue-500",
  },
  {
    name: "Sari Melinda",
    result: "Diterima UI - Kedokteran",
    quote: "Tryout UTBK-nya komprehensif banget. Pembahasannya membantu saya memahami pola soal dengan cepat.",
    avatar: "S",
    color: "bg-purple-500",
  },
  {
    name: "Budi Santoso",
    result: "Lolos Taruna Akpol 2024",
    quote: "Program Kedinasan-nya lengkap. Mulai dari SKD sampai persiapan fisik, semua ada modulnya.",
    avatar: "B",
    color: "bg-green-500",
  },
];

export function TestimonialSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="bg-yellow-50 text-yellow-600 text-sm font-semibold px-4 py-2 rounded-full">Testimoni</span>
          <h2 className="text-4xl font-extrabold mt-4 mb-4 text-gray-900">Mereka Sudah Membuktikan</h2>
          <p className="text-gray-500">Bergabung dengan ribuan siswa yang telah sukses meraih impian mereka</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-xl`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-xs text-green-600 font-semibold">{t.result}</div>
                </div>
              </div>
              <div className="text-yellow-400 mb-3 text-lg">★★★★★</div>
              <p className="text-gray-600 italic leading-relaxed">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
