"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string | null;
  answer: string;
  explanation: string | null;
  order: number;
  questionType: string;
  optionPoints: string;
}

interface Tryout {
  id: string;
  title: string;
  slug: string;
  duration: number;
  questionCount: number;
  passingGrade: number;
}

export default function TryoutExamPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { slug } = params;
  const [tryout, setTryout] = useState<Tryout | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    score: number;
    correct: number;
    wrong: number;
    unanswered: number;
    earned: number;
    max: number;
    passed: boolean;
    passingGrade: number;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/tryouts/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tryout) {
          setTryout(data.tryout);
          setQuestions(data.tryout.questions || []);
          setTimeLeft((data.tryout.duration || 15) * 60);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (timeLeft <= 0 || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: option }));
  };

  const finishExam = () => {
    setIsFinished(true);
    let correct = 0;
    let wrong = 0;
    let earnedPoints = 0;
    let maxPoints = 0;

    questions.forEach((q, i) => {
      const isTkp = q.questionType === "tkp";
      const userAns = answers[i];

      if (isTkp) {
        let pts: Record<string, number> = {};
        try { pts = JSON.parse(q.optionPoints || "{}"); } catch { pts = {}; }
        const earned = (userAns ? pts[userAns] : 0) || 0;
        earnedPoints += earned;
        maxPoints += 5;
        if (userAns) {
          if (earned === 5) correct++;
          else wrong++;
        }
      } else {
        const earned = userAns !== undefined && userAns === q.answer ? 5 : 0;
        earnedPoints += earned;
        maxPoints += 5;
        if (userAns === q.answer) correct++;
        else if (userAns) wrong++;
      }
    });

    const unanswered = questions.length - correct - wrong;
    const score = Math.round((earnedPoints / maxPoints) * 100);
    const pg = tryout?.passingGrade || 0;
    const passed = score >= pg;

    setResult({ score, correct, wrong, unanswered, earned: earnedPoints, max: maxPoints, passed, passingGrade: pg });

    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      fetch("/api/tryout-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parsedUser.id,
          tryoutId: tryout?.id,
          score,
          correct,
          wrong,
          answered: correct + wrong,
          earnedPoints,
          maxPoints,
        }),
      }).catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!tryout || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Soal tidak ditemukan</h2>
          <Link href="/tryouts" className="text-blue-600 hover:underline">
            Kembali ke tryout
          </Link>
        </div>
      </div>
    );
  }

  if (isFinished && result) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Hasil Tryout</h1>
            <p className="text-gray-600 mb-6">{tryout.title}</p>

            <div className={`text-6xl font-bold mb-2 ${
              result.passed ? "text-green-600" : "text-red-600"
            }`}>
              {result.score}
            </div>
            <p className="text-gray-500 text-sm mb-1">Nilai Akhir</p>
            <p className="text-gray-500 text-sm mb-6">
              Passing Grade: {result.passingGrade}%
            </p>

            <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold mb-8 ${
              result.passed
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {result.passed ? "🎉 LULUS" : "❌ TIDAK LULUS"}
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.correct}</div>
                <div className="text-sm text-green-800">Benar</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.wrong}</div>
                <div className="text-sm text-red-800">Salah</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{result.unanswered}</div>
                <div className="text-sm text-gray-800">Kosong</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.earned}/{result.max}</div>
                <div className="text-sm text-blue-800">Poin</div>
              </div>
            </div>

            <div className="text-left mb-8">
              <h2 className="text-xl font-bold mb-4">Pembahasan</h2>
              <div className="space-y-6">
                {questions.map((q, i) => {
                  const userAnswer = answers[i] || "-";
                  const isTkp = q.questionType === "tkp";
                  const pts = (() => { try { return JSON.parse(q.optionPoints || "{}"); } catch { return {}; } })();
                  const earnedPts = pts[userAnswer] || 0;
                  const isCorrect = isTkp ? earnedPts === 5 : userAnswer === q.answer;
                  return (
                    <div key={q.id} className={`p-4 rounded-lg border ${
                      isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium flex-1" dangerouslySetInnerHTML={{ __html: q.question }}></p>
                        {isTkp && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold shrink-0">TKP</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-sm mb-2">
                        {["A", "B", "C", "D", "E"].map((letter) => {
                          if (letter === "E" && !q.optionE) return null;
                          const optKey = `option${letter}` as keyof Question;
                          const optVal = q[optKey] as string;
                          const poin = pts[letter];
                          const isUserAnswer = userAnswer === letter;
                          const isBest = isTkp && poin === 5;
                          return (
                            <span key={letter} className={`${isUserAnswer ? (isCorrect || (isTkp && isBest) ? "text-green-600 font-bold" : "text-red-600 font-bold") : ""} flex items-center gap-1`}>
                              {letter}. {optVal}
                              {isTkp && poin !== undefined && <span className="text-xs text-purple-500">({poin}pt)</span>}
                              {isUserAnswer && isTkp && <span className="text-xs">← pilihanmu</span>}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Jawaban: {q.answer}</span>
                        {isTkp && <span className="text-purple-600 ml-2">| Poin: {earnedPts}/5</span>}
                        {q.explanation && <span className="text-gray-600 ml-2">- {q.explanation}</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href="/tryouts"
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Tryout Lainnya
              </Link>
              <button
                onClick={() => {
                  setIsFinished(false);
                  setResult(null);
                  setAnswers({});
                  setCurrentQ(0);
                  setTimeLeft(tryout.duration * 60);
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Ulangi Tryout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-bold">{tryout.title}</h1>
            <div className={`text-xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-blue-600"}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {Object.keys(answers).length} dari {questions.length} soal dijawab
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Question Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">
                Soal {currentQ + 1} dari {questions.length}
              </p>
              <h2 className="text-lg font-medium mb-6" dangerouslySetInnerHTML={{ __html: question.question }} />

              <div className="space-y-3">
                {[
                  { key: "A", value: question.optionA },
                  { key: "B", value: question.optionB },
                  { key: "C", value: question.optionC },
                  { key: "D", value: question.optionD },
                  ...(question.optionE ? [{ key: "E", value: question.optionE }] : []),
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleAnswer(opt.key)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers[currentQ] === opt.key
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <span className="font-bold mr-3">{opt.key}.</span>
                    {opt.value}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCurrentQ((prev) => Math.max(0, prev - 1))}
                  disabled={currentQ === 0}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
                >
                  ← Sebelumnya
                </button>
                {currentQ < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    onClick={finishExam}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Selesai ✓
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Panel */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
              <h3 className="font-bold mb-3">Navigasi Soal</h3>
              <div className="grid grid-cols-5 md:grid-cols-3 gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                      i === currentQ
                        ? "bg-blue-600 text-white"
                        : answers[i]
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded" />
                  <span>Soal aktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded" />
                  <span>Sudah dijawab</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                  <span>Belum dijawab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
