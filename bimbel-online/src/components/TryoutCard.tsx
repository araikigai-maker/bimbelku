import Link from "next/link";

interface TryoutCardProps {
  tryout: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    duration: number;
    questionCount: number;
    price: number;
    image: string | null;
  };
}

export default function TryoutCard({ tryout }: TryoutCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 relative">
        {tryout.image ? (
          <img
            src={tryout.image}
            alt={tryout.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            📝
          </div>
        )}
        <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
          {tryout.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2">{tryout.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tryout.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>⏱️ {tryout.duration} menit</span>
          <span>❓ {tryout.questionCount} soal</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(tryout.price)}
          </span>
        </div>

        <Link
          href={`/tryouts/${tryout.slug}/exam`}
          className="w-full block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Mulai Tryout
        </Link>
      </div>
    </div>
  );
}
