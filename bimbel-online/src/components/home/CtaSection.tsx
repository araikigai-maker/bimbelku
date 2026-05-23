import Link from "next/link";

export function CtaSection() {
  return (
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
  );
}
