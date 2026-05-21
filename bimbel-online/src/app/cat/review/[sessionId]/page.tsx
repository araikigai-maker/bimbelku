"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ReviewQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string | null;
  answer: string;
  optionPoints: string;
  explanation: string | null;
  questionType: string;
  subtest: string | null;
  order: number;
  userAnswer: string | null;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
}

export default function CatReviewPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const { sessionId } = params;
  const [data, setData] = useState<any>(null);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/cat/sessions/${sessionId}/review`);
        const result = await res.json();
        
        if (!res.ok) {
          setError(result.error || "Gagal memuat pembahasan");
          setLoading(false);
          return;
        }

        setData(result);
        setQuestions(result.reviewData || []);
      } catch (e: any) {
        setError(e.message || "Terjadi kesalahan");
      }
      setLoading(false);
    };
    load();
  }, [sessionId]);

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><p className="text-xl">Memuat Pembahasan...</p></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <p className="text-red-500 mb-4 text-xl">{error}</p>
      <Link href="/cat" className="text-blue-600 hover:underline">Kembali ke Dashboard</Link>
    </div>
  );
  if (questions.length === 0) return <div className="text-center py-20">Data soal tidak ditemukan</div>;

  const currentQ = questions[currentIndex];
  const isTKP = currentQ.questionType === "tkp";
  let tkpPoints: Record<string, number> = {};
  if (isTKP) {
    try { tkpPoints = JSON.parse(currentQ.optionPoints || "{}"); } catch { tkpPoints = {}; }
  }

  const getOptionStyle = (optLetter: string) => {
    const isUserChoice = currentQ.userAnswer === optLetter;
    const isCorrectChoice = !isTKP && currentQ.answer === optLetter;
    
    if (isTKP) {
      if (isUserChoice) return "border-blue-500 bg-blue-50 ring-2 ring-blue-200";
      return "border-gray-200 bg-white";
    }

    if (isCorrectChoice && isUserChoice) return "border-green-500 bg-green-50 ring-2 ring-green-200";
    if (isCorrectChoice && !isUserChoice) return "border-green-500 bg-green-50 ring-2 ring-green-200"; // Always highlight correct answer
    if (isUserChoice && !isCorrectChoice) return "border-red-500 bg-red-50 ring-2 ring-red-200";
    
    return "border-gray-200 bg-white opacity-60";
  };

  const getNavButtonClass = (q: ReviewQuestion) => {
    if (!q.userAnswer) return "bg-gray-200 text-gray-500 border-gray-300"; // Kosong
    if (q.questionType === "tkp") {
      return q.pointsEarned === 5 ? "bg-green-500 text-white border-green-600" : "bg-orange-400 text-white border-orange-500";
    }
    return q.isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar - Navigasi Soal */}
      <div className="w-full md:w-80 bg-white border-r flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-800 line-clamp-1">{data?.tryout?.title}</h2>
          </div>
          <Link href={`/cat/result/${sessionId}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <span>←</span> Kembali ke Hasil
          </Link>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Navigasi Pembahasan</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-10 h-10 rounded flex items-center justify-center text-sm font-bold border transition-all ${
                  currentIndex === i ? "ring-2 ring-blue-600 ring-offset-1" : ""
                } ${getNavButtonClass(q)}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-2 text-xs text-gray-600 border-t pt-4">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-500"></div> Benar (Poin Maksimal)</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500"></div> Salah (Poin 0)</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-400"></div> Kurang Sempurna (TKP 1-4)</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-200"></div> Tidak Dijawab</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
          {/* Header Soal */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-lg">Soal {currentIndex + 1}</span>
              <span className="text-gray-500 font-medium">{currentQ.subtest || "Umum"}</span>
            </div>
            <div className={`px-4 py-1.5 rounded-full font-bold text-sm border ${
              currentQ.isCorrect ? "bg-green-100 text-green-700 border-green-200" : 
              (!currentQ.userAnswer ? "bg-gray-100 text-gray-700 border-gray-200" : "bg-red-100 text-red-700 border-red-200")
            }`}>
              Skor Kamu: {currentQ.pointsEarned} / {currentQ.maxPoints} poin
            </div>
          </div>

          {/* Konten Soal */}
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 text-lg text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentQ.question }} />

          {/* Opsi Jawaban */}
          <div className="space-y-3 mb-8">
            {["A", "B", "C", "D", "E"].map((opt) => {
              const optText = currentQ[`option${opt}` as keyof ReviewQuestion] as string | null;
              if (!optText) return null;
              
              const isUserChoice = currentQ.userAnswer === opt;
              const isCorrectChoice = !isTKP && currentQ.answer === opt;

              return (
                <div key={opt} className={`p-4 border rounded-xl flex gap-4 relative transition-all ${getOptionStyle(opt)}`}>
                  <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-sm
                    ${isCorrectChoice ? "bg-green-500 text-white" : 
                      (isUserChoice ? (isTKP ? "bg-blue-500 text-white" : "bg-red-500 text-white") : "bg-gray-100 text-gray-600")}
                  `}>
                    {opt}
                  </div>
                  <div className="flex-1 pt-1" dangerouslySetInnerHTML={{ __html: optText }} />
                  
                  {isTKP && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tkpPoints[opt] === 5 ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600"}`}>
                        {tkpPoints[opt] || 0} Poin
                      </span>
                    </div>
                  )}

                  {!isTKP && isCorrectChoice && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-bold flex items-center gap-1">
                      <span>✓</span> Jawaban Benar
                    </div>
                  )}
                  {!isTKP && isUserChoice && !isCorrectChoice && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 font-bold flex items-center gap-1">
                      <span>✗</span> Jawaban Kamu
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Kotak Pembahasan */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-400"></div>
            <h3 className="font-bold text-yellow-800 text-lg mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span> Penjelasan / Pembahasan
            </h3>
            {currentQ.explanation ? (
              <div className="text-gray-800 prose prose-yellow max-w-none" dangerouslySetInnerHTML={{ __html: currentQ.explanation }} />
            ) : (
              <p className="text-gray-500 italic">Belum ada pembahasan untuk soal ini.</p>
            )}
          </div>

          {/* Tombol Next/Prev Bawah */}
          <div className="flex items-center justify-between pt-6 border-t pb-12">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-3 rounded-xl font-bold bg-white border shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Soal Sebelumnya
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Soal Selanjutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
