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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/cat/login"); return; }
    setUser(JSON.parse(stored));
    fetch("/api/cat/sessions")
      .then((r) => r.json())
      .then((data) => { setTryouts(data.tryouts || []); setLoading(false); })
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
              onClick={() => { localStorage.removeItem("user"); router.push("/cat/login"); }}
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
      </div>
    </div>
  );
}
