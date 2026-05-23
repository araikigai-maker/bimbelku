import Link from "next/link";

export function CatHighlightSection() {
  return (
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
  );
}
