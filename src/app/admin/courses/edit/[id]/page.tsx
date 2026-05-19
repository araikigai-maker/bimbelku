"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: {
    id: string;
    title: string;
    content: string | null;
    order: number;
  }[];
}

export default function EditCoursePage({
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
    category: "UTBK",
    price: "0",
    instructor: "",
    image: "",
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.course) {
          setForm({
            title: data.course.title,
            slug: data.course.slug,
            description: data.course.description,
            category: data.course.category,
            price: data.course.price.toString(),
            instructor: data.course.instructor,
            image: data.course.image || "",
          });
          setModules(data.course.modules || []);
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
      await fetch(`/api/admin/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseInt(form.price) }),
      });

      router.push("/admin/courses");
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const addModule = async () => {
    if (!newModuleTitle.trim()) return;
    const res = await fetch("/api/admin/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: id, title: newModuleTitle }),
    });
    const data = await res.json();
    if (data.module) {
      setModules([...modules, data.module]);
      setNewModuleTitle("");
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Hapus modul beserta semua lessons?")) return;
    await fetch(`/api/admin/modules/${moduleId}`, { method: "DELETE" });
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><p>Loading...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/courses" className="text-gray-600 hover:text-gray-800">← Kembali</Link>
        <h2 className="text-2xl font-bold">Edit Kursus</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Informasi Kursus</h3>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="UTBK">UTBK</option>
                  <option value="SKD">SKD</option>
                  <option value="CPNS">CPNS</option>
                  <option value="Kedinasan">Kedinasan</option>
                  <option value="SMP">SMP</option>
                  <option value="Bahasa">Bahasa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pengajar</label>
              <input name="instructor" value={form.instructor} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
              <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Modul & Materi</h3>

          <div className="flex gap-2 mb-4">
            <input
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="Judul modul baru..."
            />
            <button onClick={addModule} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              +
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {modules.map((mod) => (
              <div key={mod.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{mod.title}</span>
                  <div className="flex gap-2">
                    <Link href={`/admin/tryouts/${id}/questions`} className="text-sm text-blue-600 hover:underline">
                      + Tambah Lesson
                    </Link>
                    <button onClick={() => deleteModule(mod.id)} className="text-sm text-red-600 hover:underline">
                      Hapus
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {mod.lessons.length} materi
                  {mod.lessons.map((l) => (
                    <div key={l.id} className="ml-4 py-1">• {l.title}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {modules.length === 0 && (
            <p className="text-gray-500 text-center py-4">Belum ada modul</p>
          )}
        </div>
      </div>
    </div>
  );
}
