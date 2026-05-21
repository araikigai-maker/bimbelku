"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CatTryout {
  id: string;
  title: string;
  slug: string;
  duration: number;
  questionCount: number;
  catPassingGradePoints: number;
  catAvailableFrom: string | null;
  catAvailableUntil: string | null;
  _count: {
    questions: number;
    results: number;
  };
}

// Active = catAvailableUntil is null OR catAvailableUntil is in the future
const isSimulationActive = (t: CatTryout): boolean => {
  if (!t.catAvailableUntil) return true;
  return new Date(t.catAvailableUntil) > new Date();
};

export default function AdminCatSimulationPage() {
  const [tryouts, setTryouts] = useState<CatTryout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTryouts = () => {
    fetch("/api/admin/tryouts")
      .then((res) => res.json())
      .then((data) => {
        const all = data.tryouts || [];
        // Only proper CAT simulations: catAvailableFrom is set
        setTryouts(all.filter((t: any) => !!t.catAvailableFrom));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTryouts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus simulasi ini? Semua data sesi dan jawaban akan ikut terhapus.")) return;
    await fetch(`/api/admin/tryouts/${id}`, { method: "DELETE" });
    fetchTryouts();
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    // To DEACTIVATE: set catAvailableUntil to past date
    // To ACTIVATE: set catAvailableUntil to far future
    const newUntil = active
      ? "1970-01-01" // deactivate
      : new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // activate for 5 years

    await fetch(`/api/admin/tryouts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catAvailableUntil: newUntil }),
    });
    fetchTryouts();
  };

  const formatDate = (d: string | null) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Simulasi CAT CPNS</h2>
        <Link href="/admin/cat-simulation/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1">
          <span className="text-lg leading-none">+</span> Simulasi CAT
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold">Simulasi</th>
              <th className="text-left p-4 font-semibold">Durasi</th>
              <th className="text-left p-4 font-semibold">PG (Poin)</th>
              <th className="text-left p-4 font-semibold">Soal</th>
              <th className="text-left p-4 font-semibold">Tersedia</th>
              <th className="text-left p-4 font-semibold">Sampai</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-right p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tryouts.map((t) => {
              const active = isSimulationActive(t);
              return (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-sm text-gray-600">{t.slug}</div>
                  </td>
                  <td className="p-4">{t.duration} menit</td>
                  <td className="p-4">{t.catPassingGradePoints || "-"}</td>
                  <td className="p-4">{t._count.questions}</td>
                  <td className="p-4">{formatDate(t.catAvailableFrom)}</td>
                  <td className="p-4">{formatDate(t.catAvailableUntil)}</td>
                  <td className="p-4">
                    {/* Toggle Active/Inactive */}
                    <button
                      onClick={() => handleToggleActive(t.id, active)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                      title={active ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                    >
                      {active ? "🟢 Aktif" : "⚫ Nonaktif"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/cat-simulation/${t.id}`} className="text-blue-600 hover:underline mr-3">
                      Edit
                    </Link>
                    <Link href={`/admin/tryouts/${t.id}/questions`} className="text-blue-600 hover:underline mr-3">
                      Kelola Soal
                    </Link>
                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {tryouts.length === 0 && (
          <div className="text-center py-8 text-gray-500">Belum ada simulasi CAT</div>
        )}
      </div>
    </div>
  );
}
