"use client";

import { useState, useEffect } from "react";
import TryoutCard from "@/components/TryoutCard";
import { categories } from "@/lib/constants";

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
}

export default function TryoutsPage() {
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tryouts")
      .then((res) => res.json())
      .then((data) => {
        setTryouts(data.tryouts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTryouts =
    selectedCategory === "Semua"
      ? tryouts
      : tryouts.filter((t) => t.category === selectedCategory);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tryout Online</h1>
          <p className="text-gray-600">Latihan soal untuk persiapan ujian</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredTryouts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredTryouts.map((tryout) => (
              <TryoutCard key={tryout.id} tryout={tryout} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada tryout untuk kategori ini</p>
          </div>
        )}
      </div>
    </div>
  );
}
