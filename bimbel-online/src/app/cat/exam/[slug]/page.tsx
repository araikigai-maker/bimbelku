"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string | null;
  answer: string;
  order: number;
  questionType: string;
  optionPoints: string;
  subtest: string | null;
}

export default function CatExamPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [ragu, setRagu] = useState<Record<string, boolean>>({});
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("active");
  const answerCount = Object.values(answers).filter((a) => a !== null).length;
  const syncRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/login"); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    if (!sessionId || !user) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/cat/sessions/${sessionId}`);
        const data = await res.json();
        if (!data.session) { router.push("/cat"); return; }

        setTimer(data.remaining || 0);
        setSessionStatus(data.session.status);

        if (data.session.status !== "active") {
          router.push(`/cat/result/${sessionId}`);
          return;
        }

        const answersMap: Record<string, string | null> = {};
        const raguMap: Record<string, boolean> = {};
        for (const a of data.session.answers || []) {
          answersMap[a.questionId] = a.answer;
          raguMap[a.questionId] = a.ragu || false;
        }
        setAnswers(answersMap);
        setRagu(raguMap);

        const tryoutRes = await fetch(`/api/tryouts/${params.slug}`);
        const tryoutData = await tryoutRes.json();
        if (tryoutData.tryout?.questions) {
          setQuestions(tryoutData.tryout.questions);
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, user, params.slug, router]);

  useEffect(() => {
    if (timer <= 0 || sessionStatus !== "active") return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, sessionStatus]);

  useEffect(() => {
    if (!sessionId || sessionStatus !== "active") return;
    const heartbeat = setInterval(async () => {
      try {
        const res = await fetch(`/api/cat/sessions/${sessionId}`);
        const data = await res.json();
        if (data.session && data.session.status !== "active") {
          router.push(`/cat/result/${sessionId}`);
          return;
        }
        if (typeof data.remaining === "number") {
          setTimer(data.remaining);
        }
      } catch {}
    }, 30000);
    return () => clearInterval(heartbeat);
  }, [sessionId, sessionStatus, router]);

  const handleTimeout = useCallback(async () => {
    if (!sessionId) return;
    setSessionStatus("timeout");
    try {
      await fetch(`/api/cat/sessions/${sessionId}/submit`, { method: "POST" });
    } catch {}
    router.push(`/cat/result/${sessionId}`);
  }, [sessionId, router]);

  const saveAnswer = useCallback(async (questionId: string, answer: string | null, raguValue: boolean) => {
    if (!sessionId) return;
    setSaving(true);
    try {
      await fetch(`/api/cat/sessions/${sessionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answer, ragu: raguValue }),
      });
    } catch {}
    setSaving(false);
  }, [sessionId]);

  const handleOptionClick = (questionId: string, option: string) => {
    const newVal = answers[questionId] === option ? null : option;
    setAnswers((prev) => ({ ...prev, [questionId]: newVal }));
    saveAnswer(questionId, newVal, ragu[questionId] || false);
  };

  const toggleRagu = (questionId: string) => {
    const newVal = !ragu[questionId];
    setRagu((prev) => ({ ...prev, [questionId]: newVal }));
    saveAnswer(questionId, answers[questionId] || null, newVal);
  };

  const handleSubmit = async () => {
    if (!confirm("Apakah Anda yakin ingin mengakhiri ujian?")) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/cat/sessions/${sessionId}/submit`, { method: "POST" });
      if (res.ok) {
        router.push(`/cat/result/${sessionId}`);
      }
    } catch {}
    setSubmitting(false);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-100"><p className="text-lg">Loading...</p></div>;

  const question = questions[currentIdx];
  if (!question) return <div className="flex items-center justify-center min-h-screen"><p>Soal tidak ditemukan</p></div>;

  const getSubtestBadge = (q: Question) => {
    switch (q.subtest) {
      case "TWK": return <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">TWK</span>;
      case "TIU": return <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">TIU</span>;
      case "TKP": return <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">TKP</span>;
      default: return null;
    }
  };

  const timerClass = timer < 60
    ? "text-red-600 animate-pulse"
    : timer < 300
    ? "text-orange-600"
    : "text-blue-600";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-blue-600">CAT CPNS 2026</span>
          {user && <span className="text-sm text-gray-500">| {user.name}</span>}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
            <span className="text-gray-500">Terjawab:</span>
            <span className="font-bold text-green-600">{answerCount}</span>
            <span className="text-gray-300">/</span>
            <span className="font-bold">{questions.length}</span>
          </div>
          <div className={`text-2xl font-bold font-mono tracking-wider ${timerClass}`}>
            {formatTime(timer)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Question Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-400">Soal #{currentIdx + 1}</span>
                {getSubtestBadge(question)}
              </div>
              <span className="text-xs text-gray-500">{currentIdx + 1}/{questions.length}</span>
            </div>

            <h2 className="text-lg font-medium mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: question.question }} />

            <div className="space-y-2.5">
              {[
                { key: "A", val: question.optionA },
                { key: "B", val: question.optionB },
                { key: "C", val: question.optionC },
                { key: "D", val: question.optionD },
                ...(question.optionE ? [{ key: "E" as const, val: question.optionE }] : []),
              ].map((opt) => {
                const isSelected = answers[question.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleOptionClick(question.id, opt.key)}
                    className={`w-full text-left p-3.5 rounded-lg border-2 transition flex items-center gap-3 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                      {opt.key}
                    </span>
                    <span className={isSelected ? "font-medium" : ""}>{opt.val}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleRagu(question.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition ${
                    ragu[question.id]
                      ? "bg-yellow-100 border-yellow-400 text-yellow-700 font-medium"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <span>{ragu[question.id] ? "✅" : "❓"}</span>
                  {ragu[question.id] ? "Ditandai" : "Ragu-ragu"}
                </button>
                {saving && <span className="text-xs text-gray-400">menyimpan...</span>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-40"
                >
                  ← Sebelumnya
                </button>
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((p) => Math.min(questions.length - 1, p + 1))}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? "..." : "Selesai ✓"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Navigation Panel */}
        <div className="w-72 bg-white border-l shadow-sm p-4 overflow-y-auto">
          <h3 className="font-bold text-sm mb-3">Navigasi Soal</h3>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, i) => {
              const ans = answers[q.id];
              const isRagu = ragu[q.id];
              let btnClass = "w-10 h-10 rounded-lg text-xs font-bold transition border ";
              if (i === currentIdx) {
                btnClass += "border-blue-600 bg-blue-600 text-white shadow-md";
              } else if (ans) {
                btnClass += isRagu
                  ? "border-yellow-400 bg-yellow-100 text-yellow-700"
                  : "border-green-500 bg-green-100 text-green-700";
              } else {
                btnClass += "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300";
              }
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={btnClass}
                  title={`Soal ${i + 1}${ans ? " (Terjawab)" : " (Belum)"}${isRagu ? " - Ragu" : ""}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-2 text-xs">
            <p className="font-semibold text-gray-500 mb-2">Keterangan:</p>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-green-500 bg-green-100" />
              <span>Terjawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-gray-200 bg-gray-50" />
              <span>Belum dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-yellow-400 bg-yellow-100" />
              <span>Ragu-ragu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-blue-600 bg-blue-600" />
              <span>Soal aktif</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t">
            <div className="text-xs text-gray-500 mb-2">Ringkasan:</div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Total Soal</span>
                <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Terjawab</span>
                <span className="font-bold">{answerCount}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Ragu-ragu</span>
                <span className="font-bold">{Object.values(ragu).filter(Boolean).length}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Belum</span>
                <span className="font-bold">{questions.length - answerCount}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-5 px-3 py-2.5 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition disabled:opacity-50"
          >
            {submitting ? "Memproses..." : "Selesai Ujian"}
          </button>
        </div>
      </div>
    </div>
  );
}
