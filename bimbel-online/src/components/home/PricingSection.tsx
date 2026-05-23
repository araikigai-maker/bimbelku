import Link from "next/link";
import { pricingPlans } from "@/lib/constants";

export function PricingSection() {
  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
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
  );
}
