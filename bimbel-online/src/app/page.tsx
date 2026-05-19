import Link from "next/link";
import { features, pricingPlans } from "@/lib/constants";

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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Raih Mimpi Masuk PTN & CPNS Impianmu
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Bimbel online dengan tryout, video pembelajaran, dan mentor berpengalaman. 
                Belajar kapan saja, di mana saja.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                >
                  Daftar Sekarang - Gratis
                </Link>
                <Link
                  href="/courses"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-center"
                >
                  Lihat Kursus
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">10,000+</div>
                    <div className="text-blue-100">Siswa Aktif</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-blue-100">Video Materi</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">50+</div>
                    <div className="text-blue-100">Mentor</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-blue-100">Lulus PTN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kenapa Memilih BimbelKu?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform belajar online terlengkap dengan fitur-fitur unggulan untuk memaksimalkan persiapan ujianmu.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Program Tersedia</h2>
            <p className="text-gray-600">Pilih program yang sesuai dengan kebutuhanmu</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "UTBK", desc: "Persiapan masuk PTN favorit", icon: "🎓", color: "bg-blue-500" },
              { name: "SKD CPNS", desc: "Lolos seleksi CPNS", icon: "📋", color: "bg-green-500" },
              { name: "Kedinasan", desc: "AKPOL, Akmil, IPDN", icon: "🎖️", color: "bg-purple-500" },
              { name: "SMP", desc: "Kursus SMP lengkap", icon: "📚", color: "bg-orange-500" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/courses?cat=${cat.name}`}
                className={`${cat.color} text-white p-6 rounded-xl hover:opacity-90 transition`}
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Paket Langganan</h2>
            <p className="text-gray-600">Pilih paket yang sesuai dengan kebutuhan belajar</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-8 ${
                  plan.highlighted
                    ? "ring-2 ring-blue-600 shadow-lg relative"
                    : "shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-1 rounded-full">
                    Populer
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.price > 0 && <span className="text-gray-500">/bulan</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-lg font-semibold transition ${
                    plan.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
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
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Meraih Mimpi?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabung dengan ribuan siswa yang telah berhasil meraih PTN dan CPNS impian
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
          >
            Mulai Belajar Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
