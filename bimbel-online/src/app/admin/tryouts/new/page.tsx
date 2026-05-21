"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTryoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "UTBK",
    duration: "60",
    price: "0",
    passingGrade: "70",
    image: "",
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
        body: JSON.stringify({ ...form, duration: parseInt(form.duration), price: parseInt(form.price) }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      router.push("/admin/tryouts");
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/tryouts" className="text-gray-600 hover:text-gray-800">← Kembali</Link>
        <h2 className="text-2xl font-bold">Tambah Tryout Baru</h2>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tryout</label>
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
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Tryout</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="UTBK">UTBK</option>
                <option value="SKD">SKD (CPNS)</option>
                <option value="CPNS">CPNS Umum</option>
                <option value="Kedinasan">Kedinasan</option>
                <option value="SMP">SMP</option>
                <option value="Bahasa">Bahasa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
              <input name="duration" type="number" value={form.duration} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
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
            {loading ? "Menyimpan..." : "Simpan Tryout"}
          </button>
          <Link href="/admin/tryouts" className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition">Batal</Link>
        </div>
      </form>
    </div>
  );
}
