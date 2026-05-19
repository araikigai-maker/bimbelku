"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SubtestScore {
  name: string;
  earned: number;
  max: number;
  score: number;
  count: number;
}

interface ResultData {
  score: number;
  correct: number;
  wrong: number;
  unanswered: number;
  earnedPoints: number;
  maxPoints: number;
  passingGrade: number;
  catPassingGradePoints: number;
  subtestScores: SubtestScore[];
}

export default function CatResultPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const { sessionId } = params;
  const [result, setResult] = useState<ResultData | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const sessionRes = await fetch(`/api/cat/sessions/${sessionId}`);
        const sessionData = await sessionRes.json();
        if (!sessionData.session) { router.push("/cat"); return; }
        setSession(sessionData.session);

        const submitRes = await fetch(`/api/cat/sessions/${sessionId}/submit`, { method: "POST" });
        if (submitRes.ok) {
          const data = await submitRes.json();
          setResult(data);
        } else {
          const errData = await submitRes.json().catch(() => ({}));
          setError(errData.error || "Gagal memuat hasil");
        }
      } catch (e: any) {
        setError(e.message || "Terjadi kesalahan");
      }
      setLoading(false);
    };
    load();
  }, [sessionId, router]);

  if (loading) return <div className="flex justify-center py-20"><p>Memuat hasil...</p></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <Link href="/cat" className="text-blue-600 hover:underline">Kembali ke Dashboard CAT</Link>
    </div>
  );
  if (!result) return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-gray-500 mb-4">Hasil tidak ditemukan</p>
      <Link href="/cat" className="text-blue-600 hover:underline">Kembali ke Dashboard CAT</Link>
    </div>
  );

  const pgPoints = result.catPassingGradePoints || 0;
  const passed = result.earnedPoints >= pgPoints;

  const getSubtestPGName = (name: string) => {
    switch (name) {
      case "TWK": return 65;
      case "TIU": return 65;
      case "TKP": return 70;
      default: return 0;
    }
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold mb-1">Hasil Simulasi CAT</h1>
          <p className="text-gray-500 mb-6">{session?.tryout?.title || "CAT CPNS 2026"}</p>

          <div className="text-6xl font-bold mb-1">
            <span className={passed ? "text-green-600" : "text-red-600"}>{result.earnedPoints}</span>
            <span className="text-gray-300 text-4xl">/{result.maxPoints}</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Poin</p>
          <p className="text-gray-500 text-sm mb-4">
            Passing Grade: <span className="font-bold">{pgPoints} poin</span>
          </p>

          <div className={`inline-block px-8 py-3 rounded-full text-xl font-bold mb-8 ${
            passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {passed ? "🎉 LULUS" : "❌ TIDAK LULUS"}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{result.correct}</div>
              <div className="text-sm text-green-800">Jawaban Sempurna</div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{result.wrong}</div>
              <div className="text-sm text-red-800">Kurang Sempurna</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-600">{result.unanswered}</div>
              <div className="text-sm text-gray-800">Tidak Dijawab</div>
            </div>
          </div>

          {result.subtestScores && result.subtestScores.length > 0 && (
            <div className="mb-8 text-left">
              <h2 className="text-lg font-bold mb-4">Rincian per Subtes</h2>
              <div className="space-y-3">
                {result.subtestScores.map((st) => {
                  const pgPct = getSubtestPGName(st.name);
                  const stPassed = st.score >= pgPct;
                  return (
                    <div key={st.name} className="border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            st.name === "TWK" ? "bg-red-100 text-red-700" :
                            st.name === "TIU" ? "bg-green-100 text-green-700" :
                            "bg-purple-100 text-purple-700"
                          }`}>{st.name}</span>
                          <span className="text-sm text-gray-500">{st.count} soal | {st.earned}/{st.max} poin</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${stPassed ? "text-green-600" : "text-red-600"}`}>
                            {st.score}%
                          </div>
                          <div className={`text-xs font-semibold ${stPassed ? "text-green-600" : "text-red-600"}`}>
                            {stPassed ? "✓ LULUS" : "✗ GAGAL"} (PG {pgPct}%)
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full transition-all ${
                          stPassed ? "bg-green-500" : "bg-red-400"
                        }`} style={{ width: `${Math.min(st.score, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
            <h3 className="font-semibold mb-2">Ringkasan Penilaian</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• TWK & TIU: Setiap jawaban benar = 5 poin, salah/kosong = 0 poin</p>
              <p>• TKP: Setiap opsi memiliki bobot 1-5 poin, tidak ada jawaban salah</p>
              <p>• Passing Grade: Minimal <strong>{pgPoints} poin</strong> dari {result.maxPoints} poin maksimal</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/cat" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Dashboard CAT
            </Link>
            <Link href="/" className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
              Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
