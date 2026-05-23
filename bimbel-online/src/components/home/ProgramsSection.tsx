import Link from "next/link";

export function ProgramsSection() {
  return (
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
  );
}
