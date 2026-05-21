"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SubtestScore {
  name: string;
  label: string;
  earned: number;
  max: number;
  score: number;
  count: number;
  passingGradePoints: number;
  passed: boolean;
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

const SUBTEST_INFO: Record<string, { color: string; bg: string }> = {
  TWK: { color: "text-red-700", bg: "bg-red-50" },
  TIU: { color: "text-green-700", bg: "bg-green-50" },
  TKP: { color: "text-purple-700", bg: "bg-purple-50" },
};

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

  const twk = result.subtestScores.find((s) => s.name === "TWK");
  const tiu = result.subtestScores.find((s) => s.name === "TIU");
  const tkp = result.subtestScores.find((s) => s.name === "TKP");

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-center mb-8">
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

            <div className={`inline-block px-8 py-3 rounded-full text-xl font-bold mb-4 ${
              passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {passed ? "LULUS" : "TIDAK LULUS"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">{result.correct}</div>
              <div className="text-sm text-green-800">Jawaban Sempurna</div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-red-600">{result.wrong}</div>
              <div className="text-sm text-red-800">Kurang Sempurna</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-gray-600">{result.unanswered}</div>
              <div className="text-sm text-gray-800">Tidak Dijawab</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Hasil per Subtes</h2>
            <div className="space-y-4">
              {[twk, tiu, tkp].filter(Boolean).map((st) => {
                if (!st) return null;
                const info = SUBTEST_INFO[st.name] || { color: "text-gray-700", bg: "bg-gray-50" };
                return (
                  <div key={st.name} className={`rounded-xl p-5 ${info.bg}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${info.color} bg-white`}>
                          {st.name}
                        </span>
                        <span className="text-sm text-gray-500 ml-3">{st.label}</span>
                      </div>
                      <span className="text-sm text-gray-500">{st.count} soal</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className={`text-xl font-bold ${st.passed ? "text-green-600" : "text-red-600"}`}>
                          {st.earned}
                        </div>
                        <div className="text-xs text-gray-500">Poin</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-gray-700">{st.max}</div>
                        <div className="text-xs text-gray-500">Maksimal</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-gray-700">{st.passingGradePoints}</div>
                        <div className="text-xs text-gray-500">Passing Grade</div>
                      </div>
                    </div>

                    <div className="w-full bg-white rounded-full h-3 mb-2">
                      <div
                        className={`h-3 rounded-full transition-all ${st.passed ? "bg-green-500" : "bg-red-400"}`}
                        style={{ width: `${Math.min((st.earned / st.max) * 100, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {st.earned} / {st.max} poin ({st.score}%)
                      </span>
                      <span className={`text-sm font-bold ${st.passed ? "text-green-600" : "text-red-600"}`}>
                        {st.passed ? "LULUS" : "TIDAK LULUS"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <h3 className="font-semibold mb-3">Ringkasan Penilaian SKD CPNS</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-medium">TWK (30 soal × 5 poin)</span>
                <span className={twk?.passed ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {twk?.earned || 0} / 150 poin — PG 65
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-medium">TIU (35 soal × 5 poin)</span>
                <span className={tiu?.passed ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {tiu?.earned || 0} / 175 poin — PG 80
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-medium">TKP (45 soal × 1-5 poin)</span>
                <span className={tkp?.passed ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {tkp?.earned || 0} / 225 poin — PG 166
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold">Total</span>
                <span className={passed ? "text-green-600 font-bold text-lg" : "text-red-600 font-bold text-lg"}>
                  {result.earnedPoints} / {result.maxPoints} poin — PG {pgPoints}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">Ketentuan Penilaian</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>TWK: Jawaban benar = 5 poin, salah/kosong = 0</li>
              <li>TIU: Jawaban benar = 5 poin, salah/kosong = 0</li>
              <li>TKP: Setiap opsi memiliki bobot 1-5 poin, tidak ada jawaban salah</li>
              <li>Passing grade masing-masing subtes harus terpenuhi untuk dinyatakan LULUS</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link href={`/cat/review/${sessionId}`} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition text-center">
              Lihat Pembahasan
            </Link>
            <Link href="/cat" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center">
              Dashboard CAT
            </Link>
            <Link href="/" className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-center">
              Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
