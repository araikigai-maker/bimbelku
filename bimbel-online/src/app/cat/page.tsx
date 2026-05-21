"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Tryout {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  questionCount: number;
  passingGrade: number;
  catPassingGradePoints: number;
  catAvailableFrom: string | null;
  catAvailableUntil: string | null;
  image: string | null;
  questions: { id: string; subtest: string | null }[];
}

export default function CatDashboardPage() {
  const router = useRouter();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/cat/login"); return; }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);
    fetch("/api/cat/sessions")
      .then((r) => r.json())
      .then((data) => { 
        setTryouts(data.tryouts || []); 
        setLoading(false); 
        // Fetch history using userId (more secure than email)
        fetch(`/api/cat/history?userId=${encodeURIComponent(parsedUser.id)}`)
          .then(r => r.json())
          .then(histData => setHistory(histData.sessions || []));
      })
      .catch(() => setLoading(false));
  }, [router]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Simulasi CAT CPNS 2026</h1>
              <p className="text-gray-500 mt-1">Selamat datang, {user?.name || "Peserta"}</p>
            </div>
            <button
              onClick={() => { localStorage.removeItem("user"); window.dispatchEvent(new Event("user-updated")); router.push("/cat/login"); }}
              className="text-sm text-red-500 hover:underline"
            >
              Keluar
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {tryouts.filter(t => t.catAvailableFrom).map((t) => {
            const twk = t.questions.filter((q) => q.subtest === "TWK").length;
            const tiu = t.questions.filter((q) => q.subtest === "TIU").length;
            const tkp = t.questions.filter((q) => q.subtest === "TKP").length;

            return (
              <div key={t.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-blue-100">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                      CAT CPNS 2026
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      Tersedia
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">{t.title}</h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-700">{t.duration}</div>
                      <div className="text-xs text-blue-600">Menit</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {t.catAvailableFrom ? formatDate(t.catAvailableFrom) : "-"}
                      </div>
                      <div className="text-xs text-green-600">Tanggal Tersedia</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-700">{t.questionCount}</div>
                      <div className="text-xs text-purple-600">Total Soal</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-orange-700">{t.catPassingGradePoints || t.passingGrade}</div>
                      <div className="text-xs text-orange-600">Passing Grade</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded">TWK: {twk} soal</span>
                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded">TIU: {tiu} soal</span>
                    <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded">TKP: {tkp} soal</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/cat/detail/${t.slug}`}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
                    >
                      Lihat Detail & Mulai Ujian →
                    </Link>
                    <Link
                      href={`/cat/leaderboard/${t.id}`}
                      className="bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-yellow-600 transition inline-flex items-center gap-2"
                    >
                      🏆 Lihat Leaderboard
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {tryouts.filter(t => t.catAvailableFrom).length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-gray-500">Belum ada simulasi CAT CPNS yang tersedia.</p>
            </div>
          )}
        </div>

        {/* Riwayat Ujian Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Riwayat Ujian Saya</h2>
          
          {history.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-600">Simulasi</th>
                    <th className="p-4 font-semibold text-gray-600">Tanggal & Waktu</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">{h.tryout?.title}</td>
                      <td className="p-4 text-gray-500">
                        {new Date(h.endedAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                      </td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          Selesai
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/cat/result/${h.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Lihat Hasil & Pembahasan →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 border-dashed">
              <p className="text-gray-400">Belum ada riwayat ujian yang diselesaikan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
