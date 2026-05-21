"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Tryout {
  id: string;
  title: string;
  slug: string;
  category: string;
  duration: number;
  price: number;
  passingGrade: number;
  _count: {
    questions: number;
    results: number;
  };
}

export default function AdminTryoutsPage() {
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTryouts = () => {
    fetch("/api/admin/tryouts")
      .then((res) => res.json())
      .then((data) => {
        // Only show regular tryouts (catAvailableFrom = null means it's NOT a CAT simulation)
        const regular = (data.tryouts || []).filter((t: any) => !t.catAvailableFrom);
        setTryouts(regular);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTryouts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tryout ini? Semua soal akan ikut terhapus.")) return;
    await fetch(`/api/admin/tryouts/${id}`, { method: "DELETE" });
    fetchTryouts();
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><p>Loading...</p></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Tryout</h2>
        <Link href="/admin/tryouts/new" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          + Tambah Tryout
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold">Tryout</th>
              <th className="text-left p-4 font-semibold">Kategori</th>
              <th className="text-left p-4 font-semibold">Durasi</th>
              <th className="text-left p-4 font-semibold">PG</th>
              <th className="text-left p-4 font-semibold">Soal</th>
              <th className="text-left p-4 font-semibold">Harga</th>
              <th className="text-left p-4 font-semibold">Hasil</th>
              <th className="text-right p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tryouts.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-gray-600">{t.slug}</div>
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{t.category}</span>
                </td>
                <td className="p-4">{t.duration} menit</td>
                <td className="p-4">{t.passingGrade}%</td>
                <td className="p-4">{t._count.questions}</td>
                <td className="p-4">{formatPrice(t.price)}</td>
                <td className="p-4">{t._count.results}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/tryouts/${t.id}/questions`} className="text-blue-600 hover:underline mr-3">
                    Kelola Soal
                  </Link>
                  <Link href={`/admin/tryouts/edit/${t.id}`} className="text-blue-600 hover:underline mr-3">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tryouts.length === 0 && (
          <div className="text-center py-8 text-gray-500">Belum ada tryout</div>
        )}
      </div>
    </div>
  );
}
