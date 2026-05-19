"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CatDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { slug } = params;
  const [tryout, setTryout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [starting, setStarting] = useState(false);
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/cat/login"); return; }
    setUser(JSON.parse(stored));
    fetch(`/api/tryouts/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.tryout) setTryout(data.tryout);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, router]);

  const twk = tryout?.questions?.filter((q: any) => q.subtest === "TWK").length || 0;
  const tiu = tryout?.questions?.filter((q: any) => q.subtest === "TIU").length || 0;
  const tkp = tryout?.questions?.filter((q: any) => q.subtest === "TKP").length || 0;

  const handleStart = async () => {
    if (!user || !tryout) return;
    setStarting(true);
    try {
      const res = await fetch("/api/cat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tryoutId: tryout.id, userId: user.id }),
      });
      const data = await res.json();
      if (data.session) {
        if (data.existing) {
          setExistingSessionId(data.session.id);
          setShowConfirm(false);
          setStarting(false);
          return;
        }
        setShowConfirm(false);
        router.push(`/cat/exam/${slug}?session=${data.session.id}`);
      }
    } catch {
      alert("Gagal memulai ujian");
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;
  if (!tryout) return <div className="flex justify-center py-20"><p>Tryout tidak ditemukan</p></div>;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/cat" className="hover:underline">Dashboard CAT</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Detail Simulasi</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">CAT CPNS 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{tryout.title}</h1>
            <p className="text-gray-500 mb-6">{tryout.description}</p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{tryout.duration}</div>
                <div className="text-sm text-blue-600">Durasi</div>
                <div className="text-xs text-blue-400">menit</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{tryout.questionCount}</div>
                <div className="text-sm text-green-600">Total Soal</div>
                <div className="text-xs text-green-400">110 soal</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">{tryout.catPassingGradePoints || tryout.passingGrade}</div>
                <div className="text-sm text-orange-600">Passing Grade</div>
                <div className="text-xs text-orange-400">nilai minimal</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {tryout.catAvailableFrom ? `${formatDate(tryout.catAvailableFrom)} - ${tryout.catAvailableUntil ? formatDate(tryout.catAvailableUntil) : ""}` : "-"}
                </div>
                <div className="text-sm text-purple-600">Masa Berlaku</div>
                <div className="text-xs text-purple-400">tersedia</div>
              </div>
            </div>

            {/* Materi Ujian */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Materi Ujian</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-red-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">TWK</span>
                    <div>
                      <div className="font-semibold">Tes Wawasan Kebangsaan</div>
                      <div className="text-sm text-gray-500">Pengetahuan kebangsaan, UUD 1945, Pancasila</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{twk || 0}</div>
                </div>
                <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">TIU</span>
                    <div>
                      <div className="font-semibold">Tes Intelegensia Umum</div>
                      <div className="text-sm text-gray-500">Kemampuan verbal, numerik, logika</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{tiu || 0}</div>
                </div>
                <div className="flex items-center justify-between bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">TKP</span>
                    <div>
                      <div className="font-semibold">Tes Karakteristik Pribadi</div>
                      <div className="text-sm text-gray-500">Integritas, profesionalisme, pelayanan publik</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{tkp || 0}</div>
                </div>
              </div>
            </div>

            {/* Perhatian Penting */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">
              <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <span>⚠️</span> Perhatian Penting
              </h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">• Pastikan koneksi internet stabil selama ujian berlangsung</li>
                <li className="flex items-start gap-2">• Siapkan alat tulis untuk coret-coretan</li>
                <li className="flex items-start gap-2">• Jawaban akan tersimpan secara otomatis</li>
                <li className="flex items-start gap-2">• Jangan refresh atau tutup browser selama ujian</li>
                <li className="flex items-start gap-2 font-semibold">• Ujian hanya dapat dikerjakan 1 (satu) kali</li>
                <li className="flex items-start gap-2">• Waktu akan berjalan otomatis setelah klik "Mulai Ujian"</li>
              </ul>
            </div>

            {existingSessionId && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                <p className="text-orange-700 font-medium">
                  ⚠️ Anda sudah memiliki sesi ujian yang belum selesai. Lanjutkan ujian Anda.
                </p>
              </div>
            )}

            {/* Tombol Mulai */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={starting || !!existingSessionId}
                className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {starting ? "Memulai..." : "Mulai Ujian Sekarang"}
              </button>
              <Link
                href={existingSessionId ? `/cat/exam/${slug}?session=${existingSessionId}` : "/cat"}
                className="px-6 py-3.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                {existingSessionId ? "Lanjutkan Ujian" : "Kembali"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold">Konfirmasi Mulai Ujian</h3>
              <p className="text-gray-500 mt-2">
                Apakah Anda yakin ingin memulai ujian sekarang?
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
              <p className="font-semibold mb-1">⚠️ Peringatan:</p>
              <ul className="space-y-1">
                <li>• Timer akan berjalan setelah ujian dimulai</li>
                <li>• Ujian tidak dapat diulang</li>
                <li>• Pastikan koneksi internet stabil</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStart}
                disabled={starting}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
              >
                {starting ? "Memulai..." : "Ya, Mulai Ujian"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
