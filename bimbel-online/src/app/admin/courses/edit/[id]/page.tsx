"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

// --- Helper: parse YouTube/Vimeo URL to embed URL ---
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url; // assume already an embed url
}

// --- Lesson Form Modal ---
function LessonModal({
  moduleId,
  lesson,
  onClose,
  onSaved,
}: {
  moduleId: string;
  lesson: Lesson | null;
  onClose: () => void;
  onSaved: (lesson: Lesson) => void;
}) {
  const [title, setTitle] = useState(lesson?.title || "");
  const [content, setContent] = useState(lesson?.content || "");
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || "");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const embedUrl = getEmbedUrl(videoUrl);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      let res;
      if (lesson) {
        res = await fetch("/api/admin/lessons", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: lesson.id, title, content, videoUrl }),
        });
      } else {
        res = await fetch("/api/admin/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId, title, content, videoUrl }),
        });
      }
      const data = await res.json();
      if (data.lesson) onSaved(data.lesson);
    } catch {
      alert("Gagal menyimpan materi");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {lesson ? "✏️ Edit Materi" : "➕ Tambah Materi Baru"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Materi *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Contoh: Pengenalan Soal TWK"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              🎬 Link Video (YouTube / Vimeo)
            </label>
            <div className="flex gap-2">
              <input
                value={videoUrl}
                onChange={(e) => { setVideoUrl(e.target.value); setPreview(false); }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
                >
                  {preview ? "Tutup" : "Preview"}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Tempel link YouTube (Unlisted) atau Vimeo. Sistem akan otomatis mengubahnya menjadi video player.
            </p>

            {/* Video Preview */}
            {preview && embedUrl && (
              <div className="mt-3 rounded-xl overflow-hidden bg-black aspect-video">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
          </div>

          {/* Content / Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              📝 Catatan / Deskripsi Materi (Opsional)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              placeholder="Tulis rangkuman, poin penting, atau catatan tambahan untuk materi ini..."
            />
          </div>
        </div>

        <div className="p-6 border-t flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : lesson ? "Simpan Perubahan" : "Tambah Materi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState({
    title: "", slug: "", description: "",
    category: "CPNS", price: "0", instructor: "", image: "",
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lesson modal state
  const [lessonModal, setLessonModal] = useState<{ moduleId: string; lesson: Lesson | null } | null>(null);

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
      setModules([...modules, { ...data.module, lessons: [] }]);
      setNewModuleTitle("");
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Hapus modul beserta semua materi di dalamnya?")) return;
    await fetch(`/api/admin/modules/${moduleId}`, { method: "DELETE" });
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Hapus materi ini?")) return;
    await fetch(`/api/admin/lessons?id=${lessonId}`, { method: "DELETE" });
    setModules(modules.map((m) =>
      m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
    ));
  };

  const onLessonSaved = (moduleId: string, savedLesson: Lesson) => {
    setModules((prev) => prev.map((m) => {
      if (m.id !== moduleId) return m;
      const exists = m.lessons.find((l) => l.id === savedLesson.id);
      if (exists) {
        return { ...m, lessons: m.lessons.map((l) => l.id === savedLesson.id ? savedLesson : l) };
      }
      return { ...m, lessons: [...m.lessons, savedLesson] };
    }));
    setLessonModal(null);
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div>
      {/* Lesson Modal */}
      {lessonModal && (
        <LessonModal
          moduleId={lessonModal.moduleId}
          lesson={lessonModal.lesson}
          onClose={() => setLessonModal(null)}
          onSaved={(l) => onLessonSaved(lessonModal.moduleId, l)}
        />
      )}

      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/courses" className="text-gray-500 hover:text-gray-800 text-sm">← Kembali</Link>
        <h2 className="text-2xl font-bold">Edit Kursus</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Course Info Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5">📋 Informasi Kursus</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="CPNS">CPNS</option>
                  <option value="BUMN">BUMN</option>
                  <option value="Kedinasan">Kedinasan</option>
                  <option value="UTBK">UTBK</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengajar</label>
              <input name="instructor" value={form.instructor} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar Thumbnail</label>
              <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
              {form.image && (
                <img src={form.image} alt="preview" className="mt-2 h-24 rounded-lg object-cover w-full" />
              )}
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
            {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
          </button>
        </form>

        {/* Modules & Lessons */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5">🗂️ Modul & Materi Video</h3>

          {/* Add Module */}
          <div className="flex gap-2 mb-5">
            <input
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addModule()}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nama modul baru (misal: Modul 1 - TWK Dasar)..."
            />
            <button onClick={addModule} className="bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition font-bold text-sm">
              + Bab
            </button>
          </div>

          {/* Module List */}
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {modules.length === 0 && (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                <p className="text-3xl mb-2">📂</p>
                <p className="text-sm">Belum ada modul. Tambahkan modul/bab di atas.</p>
              </div>
            )}
            {modules.map((mod, mIdx) => (
              <div key={mod.id} className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Module Header */}
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-800">
                    Bab {mIdx + 1}: {mod.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLessonModal({ moduleId: mod.id, lesson: null })}
                      className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1"
                    >
                      🎬 + Materi
                    </button>
                    <button onClick={() => deleteModule(mod.id)} className="text-xs text-red-500 hover:text-red-700">
                      Hapus Bab
                    </button>
                  </div>
                </div>

                {/* Lesson List */}
                <div className="divide-y divide-gray-50">
                  {mod.lessons.length === 0 && (
                    <p className="text-xs text-gray-400 px-4 py-3">Belum ada materi. Klik "+ Materi" untuk menambahkan.</p>
                  )}
                  {mod.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${lesson.videoUrl ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                          {lesson.videoUrl ? "▶" : lIdx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                          {lesson.videoUrl && (
                            <p className="text-[10px] text-green-600 font-medium mt-0.5">✓ Video tersedia</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setLessonModal({ moduleId: mod.id, lesson })}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteLesson(mod.id, lesson.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
