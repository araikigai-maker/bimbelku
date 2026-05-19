"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditCatSimulationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "SKD",
    duration: "90",
    price: "0",
    passingGrade: "0",
    image: "",
    catPassingGradePoints: "285",
    catAvailableFrom: "",
    catAvailableUntil: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    fetch(`/api/admin/tryouts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tryout) {
          const t = data.tryout;
          setForm({
            title: t.title,
            slug: t.slug,
            description: t.description,
            category: t.category,
            duration: t.duration.toString(),
            price: t.price.toString(),
            passingGrade: (t.passingGrade || 0).toString(),
            image: t.image || "",
            catPassingGradePoints: (t.catPassingGradePoints || 0).toString(),
            catAvailableFrom: t.catAvailableFrom
              ? new Date(t.catAvailableFrom).toISOString().slice(0, 10)
              : "",
            catAvailableUntil: t.catAvailableUntil
              ? new Date(t.catAvailableUntil).toISOString().slice(0, 10)
              : "",
          });
          setQuestionCount(t._count?.questions || t.questions?.length || 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/admin/tryouts/${id}`, {
        method: "PUT",
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
      router.push("/admin/cat-simulation");
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/cat-simulation" className="text-gray-600 hover:text-gray-800">← Kembali</Link>
        <h2 className="text-2xl font-bold">Edit Simulasi CAT</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm max-w-3xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Soal</label>
              <div className="px-4 py-2 border rounded-lg bg-gray-50 text-gray-700">{questionCount}</div>
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

          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">Informasi Tambahan</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="SKD">SKD</option>
                <option value="UTBK">UTBK</option>
                <option value="CPNS">CPNS</option>
              </select>
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
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link href="/admin/cat-simulation" className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition">Batal</Link>
          <Link href={`/admin/tryouts/${id}/questions`} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition ml-auto">
            Kelola Soal ({questionCount})
          </Link>
        </div>
      </form>
    </div>
  );
}
