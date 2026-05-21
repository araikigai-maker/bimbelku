import Link from "next/link";
import { features, pricingPlans } from "@/lib/constants";

const stats = [
  { value: "10.000+", label: "Siswa Aktif", icon: "👥" },
  { value: "500+", label: "Bank Soal", icon: "📝" },
  { value: "95%", label: "Tingkat Kelulusan", icon: "🎯" },
  { value: "CAT BKN", label: "Simulasi Standar", icon: "💻" },
];

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

export default function Home() {
  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white pt-20 pb-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-blue-100">Platform Bimbel Terpercaya No. 1</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Raih Mimpi Masuk{" "}
                <span className="text-yellow-300">PTN & CPNS</span>{" "}
                Impianmu
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
                Platform bimbel online dengan simulasi CAT standar BKN, tryout komprehensif, dan ribuan soal berkualitas. Belajar kapan saja, di mana saja.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-yellow-50 transition text-center shadow-lg shadow-blue-900/20 hover:scale-105 transform"
                >
                  🚀 Mulai Gratis Sekarang
                </Link>
                <Link
                  href="/cat"
                  className="border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition text-center backdrop-blur"
                >
                  📋 Coba Simulasi CAT
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Gratis untuk mulai
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Tanpa kartu kredit
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Akses seumur hidup
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-xs text-blue-200 ml-2">Simulasi CAT BKN</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded-full w-full"></div>
                    <div className="h-2 bg-white/20 rounded-full w-5/6"></div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {["A", "B", "C"].map((opt) => (
                      <div key={opt} className={`rounded-lg py-2 text-center text-sm font-bold ${opt === "B" ? "bg-blue-500 text-white" : "bg-white/20 text-white/70"}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-blue-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full">Program Kami</span>
            <h2 className="text-4xl font-extrabold mt-4 mb-4 text-gray-900">Program Tersedia</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Pilih program yang sesuai dengan jalur impianmu. Semua program dilengkapi materi, tryout, dan pembahasan mendalam.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "UTBK / SNBT", desc: "Persiapan masuk PTN favorit dengan soal terkini dan metode belajar terbukti efektif.", icon: "🎓", color: "from-blue-500 to-blue-700", link: "/tryouts?cat=UTBK" },
              { name: "SKD CPNS", desc: "Kuasai TWK, TIU, dan TKP sesuai standar BKN dengan simulasi CAT yang akurat.", icon: "📋", color: "from-emerald-500 to-green-700", link: "/cat" },
              { name: "Kedinasan", desc: "Persiapan khusus AKPOL, Akmil, IPDN, dan sekolah kedinasan lainnya.", icon: "🎖️", color: "from-purple-500 to-purple-700", link: "/tryouts?cat=Kedinasan" },
              { name: "SMP", desc: "Penguatan materi SMP dengan kurikulum terlengkap dan latihan soal interaktif.", icon: "📚", color: "from-orange-400 to-orange-600", link: "/tryouts?cat=SMP" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.link}
                className={`bg-gradient-to-br ${cat.color} text-white p-6 rounded-2xl hover:scale-105 transform transition shadow-lg hover:shadow-xl group`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transform transition">{cat.icon}</div>
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{cat.desc}</p>
                <div className="mt-4 text-white/60 text-sm font-medium">Pelajari lebih lanjut →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CAT Highlight Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-full">Unggulan Kami</span>
              <h2 className="text-4xl font-extrabold mt-4 mb-4 text-gray-900">Simulasi CAT Standar BKN</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Platform kami menyediakan simulasi Computer Assisted Test (CAT) yang identik dengan sistem BKN asli. Latih diri Anda hingga terbiasa dengan format, tekanan waktu, dan pola penilaian yang sebenarnya.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: "⏱️", title: "Timer Real-time", desc: "Waktu berjalan akurat seperti ujian asli BKN" },
                  { icon: "🎯", title: "Penilaian Akurat BKN", desc: "Poin 1-5 untuk TKP, dan 0/5 untuk TWK & TIU" },
                  { icon: "📊", title: "Analitik Mendalam", desc: "Lihat skor per subtes: TWK, TIU, dan TKP" },
                  { icon: "📖", title: "Pembahasan Lengkap", desc: "Setiap soal dilengkapi penjelasan detail" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="text-2xl bg-white rounded-xl p-2 shadow-sm">{item.icon}</div>
                    <div>
                      <div className="font-bold text-gray-800">{item.title}</div>
                      <div className="text-gray-500 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/cat" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition hover:scale-105 transform shadow-lg shadow-blue-200">
                Coba Simulasi CAT Sekarang →
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  <span className="text-xs text-gray-400 ml-2 font-mono">CAT CPNS 2026</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">TWK</span>
                    <span className="text-xl font-bold font-mono text-blue-700">01:23:45</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">Pancasila sebagai ideologi negara memiliki makna bahwa...</p>
                  <div className="space-y-2">
                    {["A. Pancasila menjadi dasar pedoman penyelenggaraan", "B. Semua warga negara harus menghafal Pancasila", "C. Pancasila hanya berlaku untuk lembaga pemerintah"].map((opt, i) => (
                      <div key={i} className={`text-xs rounded-lg px-3 py-2 ${i === 0 ? "bg-blue-500 text-white font-semibold" : "bg-white border border-gray-200 text-gray-600"}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-red-700">65</div>
                    <div className="text-xs text-red-500">TWK PG</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-green-700">80</div>
                    <div className="text-xs text-green-500">TIU PG</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-purple-700">166</div>
                    <div className="text-xs text-purple-500">TKP PG</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-2xl px-4 py-3 shadow-lg text-sm font-bold">
                🏆 Peringkat #3 Nasional
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="bg-green-50 text-green-600 text-sm font-semibold px-4 py-2 rounded-full">Kenapa BimbelKu?</span>
            <h2 className="text-4xl font-extrabold mt-4 mb-4 text-gray-900">Semua yang Kamu Butuhkan</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Kami menyediakan ekosistem belajar lengkap yang dirancang khusus untuk memaksimalkan peluang kelulusanmu.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-5xl mb-5 group-hover:scale-110 transform transition">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="bg-purple-50 text-purple-600 text-sm font-semibold px-4 py-2 rounded-full">FAQ</span>
            <h2 className="text-4xl font-extrabold mt-4 mb-4 text-gray-900">Pertanyaan yang Sering Diajukan</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Apakah simulasi CAT bisa dikerjakan di HP (Mobile)?",
                a: "Ya, bisa! Kami merancang sistem CAT BimbelKu agar responsif dan nyaman digunakan baik di Laptop, PC, maupun Smartphone Anda."
              },
              {
                q: "Bagaimana cara melakukan pembayaran?",
                a: "Saat ini kami sedang dalam tahap integrasi. Ke depannya, Anda bisa membayar menggunakan QRIS, GoPay, ShopeePay, Virtual Account, hingga Transfer Bank otomatis."
              },
              {
                q: "Apakah soal tryout selalu di-update?",
                a: "Tentu. Tim pengajar kami secara rutin menganalisa pola soal terbaru dari BKN dan LTMPT untuk memastikan bank soal kami selalu relevan dan up-to-date."
              },
              {
                q: "Apakah skor Simulasi CAT saya bisa dilihat orang lain?",
                a: "Skor Anda akan muncul di fitur Peringkat Nasional (Leaderboard) jika masuk Top 100 untuk memacu jiwa kompetitif. Namun data pribadi seperti Email atau Nomor HP tetap aman dan rahasia."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900">
                  <h2 className="font-semibold text-lg">{faq.q}</h2>
                  <span className="relative size-5 shrink-0">
                    <svg className="absolute inset-0 size-5 opacity-100 group-open:opacity-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg className="absolute inset-0 size-5 opacity-0 group-open:opacity-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full">Harga Terjangkau</span>
            <h2 className="text-4xl font-extrabold mt-4 mb-4 text-gray-900">Paket Langganan</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Investasi terbaik untuk masa depanmu. Mulai gratis, upgrade kapan saja.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 relative ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-200 scale-105"
                    : "bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-sm px-5 py-1.5 rounded-full font-bold shadow-md">
                    🔥 Paling Populer
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>{plan.description}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                    {formatPrice(plan.price)}
                  </span>
                  {plan.price > 0 && <span className={`text-sm ml-1 ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>/bulan</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${plan.highlighted ? "bg-white/20 text-white" : "bg-green-100 text-green-600"}`}>✓</span>
                      <span className={`text-sm ${plan.highlighted ? "text-blue-100" : "text-gray-600"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3.5 rounded-xl font-bold transition hover:scale-105 transform ${
                    plan.highlighted
                      ? "bg-white text-blue-700 hover:bg-yellow-50 shadow-lg"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Siap Meraih Mimpi?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Bergabung dengan lebih dari <strong className="text-yellow-300">10.000 siswa</strong> yang telah berhasil meraih PTN dan CPNS impian mereka bersama BimbelKu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition hover:scale-105 transform shadow-xl"
            >
              Mulai Belajar Gratis
            </Link>
            <Link
              href="/cat/login"
              className="border-2 border-white/50 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition"
            >
              Coba Simulasi CAT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
