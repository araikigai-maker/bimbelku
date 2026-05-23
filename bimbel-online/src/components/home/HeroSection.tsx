import Link from "next/link";

const stats = [
  { value: "10.000+", label: "Siswa Aktif", icon: "👥" },
  { value: "500+", label: "Bank Soal", icon: "📝" },
  { value: "95%", label: "Tingkat Kelulusan", icon: "🎯" },
  { value: "CAT BKN", label: "Simulasi Standar", icon: "💻" },
];

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white pt-20 pb-32 overflow-hidden">
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
  );
}
