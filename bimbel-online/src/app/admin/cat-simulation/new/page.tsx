"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCatSimulationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "Simulasi CAT SKD CPNS 2026",
    slug: "",
    description: "Simulasi CAT SKD CPNS 2026 - 110 soal (30 TWK + 35 TIU + 45 TKP)",
    category: "SKD",
    duration: "100",
    price: "0",
    passingGrade: "0",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500",
    catPassingGradePoints: "285",
    catAvailableFrom: "",
    catAvailableUntil: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/tryouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration: parseInt(form.duration),
          price: parseInt(form.price),
          passingGrade: parseInt(form.passingGrade),
          catPassingGradePoints: parseInt(form.catPassingGradePoints),
          catAvailableFrom: form.catAvailableFrom || null,
          catAvailableUntil: form.catAvailableUntil || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Gagal membuat simulasi"); return; }

      router.push(`/admin/cat-simulation/${data.tryout.id}`);
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/cat-simulation" className="text-gray-600 hover:text-gray-800">← Kembali</Link>
        <h2 className="text-2xl font-bold">Buat Simulasi CAT Baru</h2>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm max-w-3xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" rows={3} required />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Pengaturan Simulasi CAT</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
              <input name="duration" type="number" value={form.duration} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passing Grade (poin)</label>
              <input name="catPassingGradePoints" type="number" value={form.catPassingGradePoints} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="SKD">SKD</option>
                <option value="UTBK">UTBK</option>
                <option value="CPNS">CPNS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tersedia Mulai</label>
              <input name="catAvailableFrom" type="date" value={form.catAvailableFrom} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tersedia Sampai</label>
              <input name="catAvailableUntil" type="date" value={form.catAvailableUntil} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
            <strong>Format Soal CAT CPNS:</strong> TWK 30 soal (PG 65), TIU 35 soal (PG 80), TKP 45 soal (PG 166) — Total 110 soal (PG 285 poin)
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passing Grade (%)</label>
              <input name="passingGrade" type="number" min="0" max="100" value={form.passingGrade} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
            <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
            {loading ? "Menyimpan..." : "Buat Simulasi"}
          </button>
          <Link href="/admin/cat-simulation" className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition">Batal</Link>
        </div>
      </form>
    </div>
  );
}
