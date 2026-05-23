import { features } from "@/lib/constants";

export function FeaturesSection() {
  return (
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
  );
}
