"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Tryout {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  duration: number;
  questionCount: number;
  price: number;
  image: string | null;
  passingGrade: number;
}

export default function TryoutDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [tryout, setTryout] = useState<Tryout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tryouts")
      .then((res) => res.json())
      .then((data) => {
        const found = (data.tryouts || []).find((t: Tryout) => t.slug === slug);
        setTryout(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!tryout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Tryout tidak ditemukan</h2>
          <Link href="/tryouts" className="text-blue-600 hover:underline">
            Kembali ke tryout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/tryouts" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Kembali ke Tryout
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-64 bg-gray-200 relative">
            {tryout.image ? (
              <img src={tryout.image} alt={tryout.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                📝
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {tryout.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{tryout.title}</h1>
            <p className="text-gray-600 mb-6">{tryout.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{tryout.duration}</div>
                <div className="text-sm text-gray-600">Menit</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{tryout.questionCount}</div>
                <div className="text-sm text-gray-600">Soal</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{tryout.passingGrade || 0}%</div>
                <div className="text-sm text-gray-600">Passing Grade</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatPrice(tryout.price)}</div>
                <div className="text-sm text-gray-600">Harga</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Instruksi:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Pastikan koneksi internet stabil</li>
                <li>• Kerjakan soal sesuai waktu yang ditentukan</li>
                <li>• Tidak bisa kembali ke soal sebelumnya setelah selesai</li>
                <li>• Skor akan ditampilkan setelah selesai</li>
              </ul>
            </div>

            <Link
              href={`/tryouts/${tryout.slug}/exam`}
              className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Mulai Tryout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
