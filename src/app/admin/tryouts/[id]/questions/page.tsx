"use client";

import { useState, useEffect, useRef } from "react";
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
}

export default function QuestionsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const excelRef = useRef<HTMLInputElement>(null);
  const wordRef = useRef<HTMLInputElement>(null);
  const [tryout, setTryout] = useState<Tryout | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importType, setImportType] = useState<"excel" | "word" | null>(null);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [form, setForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    optionE: "",
    answer: "A",
    explanation: "",
    questionType: "regular",
    optionPoints: '{"A":5,"B":4,"C":3,"D":2,"E":1}',
  });

  const fetchQuestions = () => {
    fetch(`/api/admin/tryouts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tryout) {
          setTryout(data.tryout);
          setQuestions(data.tryout.questions || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  const handleAdd = async () => {
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tryoutId: id }),
    });
    if (res.ok) {
      setForm({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", optionE: "", answer: "A", explanation: "", questionType: "regular", optionPoints: '{"A":5,"B":4,"C":3,"D":2,"E":1}' });
      setShowForm(false);
      fetchQuestions();
    }
  };

  const handleDelete = async (qid: string) => {
    if (!confirm("Hapus soal ini?")) return;
    await fetch(`/api/admin/questions/${qid}`, { method: "DELETE" });
    fetchQuestions();
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      optionE: q.optionE || "",
      answer: q.answer,
      explanation: q.explanation || "",
      questionType: q.questionType || "regular",
      optionPoints: q.optionPoints || '{"A":5,"B":4,"C":3,"D":2,"E":1}',
    });
    setShowForm(true);
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/admin/questions/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", optionE: "", answer: "A", explanation: "", questionType: "regular", optionPoints: '{"A":5,"B":4,"C":3,"D":2,"E":1}' });
      setEditingId(null);
      setShowForm(false);
      fetchQuestions();
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportType("excel");
    setImportMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/admin/tryouts/${id}/import-questions`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImportMsg(res.ok
        ? { ok: true, text: data.message || `Berhasil import ${data.success} soal` }
        : { ok: false, text: data.error || "Gagal import" }
      );
      if (res.ok) fetchQuestions();
    } catch {
      setImportMsg({ ok: false, text: "Gagal memproses file" });
    } finally {
      setImporting(false);
      setImportType(null);
      if (excelRef.current) excelRef.current.value = "";
    }
  };

  const handleWordImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportType("word");
    setImportMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/admin/tryouts/${id}/import-word`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImportMsg(res.ok
        ? { ok: true, text: data.message || `Berhasil import ${data.success} soal dengan ${data.images || 0} gambar` }
        : { ok: false, text: data.error || "Gagal import" }
      );
      if (res.ok) fetchQuestions();
    } catch {
      setImportMsg({ ok: false, text: "Gagal memproses file" });
    } finally {
      setImporting(false);
      setImportType(null);
      if (wordRef.current) wordRef.current.value = "";
    }
  };

  const renderHtml = (html: string) => {
    return { __html: html };
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/tryouts" className="text-gray-600 hover:text-gray-800">← Kembali</Link>
          <div>
            <h2 className="text-2xl font-bold">Kelola Soal - {tryout?.title}</h2>
            <p className="text-gray-600">Total: {questions.length} soal | Durasi: {tryout?.duration} menit</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", optionE: "", answer: "A", explanation: "", questionType: "regular", optionPoints: '{"A":5,"B":4,"C":3,"D":2,"E":1}' }); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Tambah Soal
        </button>
      </div>

      {importMsg && (
        <div className={`p-4 rounded-lg mb-4 ${importMsg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {importMsg.text}
        </div>
      )}

      {/* Import Panel */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-dashed border-blue-200">
        <h3 className="font-bold text-lg mb-3">📥 Import Soal Massal</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Excel Import */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold">Import dari Excel</h4>
                <p className="text-xs text-gray-500">Untuk soal teks tanpa gambar</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="/api/admin/template"
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-xs flex items-center gap-1"
              >
                📄 Download Template
              </a>
              <label className={`bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-xs cursor-pointer flex items-center gap-1 ${importing && importType === "excel" ? "opacity-50" : ""}`}>
                {importing && importType === "excel" ? "⏳" : "📤"} Upload
                <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcelImport} disabled={importing} />
              </label>
            </div>
          </div>

          {/* Word Import */}
          <div className="border rounded-lg p-4 border-purple-200 bg-purple-50/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📄</span>
              <div>
                <h4 className="font-semibold">Import dari Word</h4>
                <p className="text-xs text-gray-500">Mendukung teks + <span className="text-purple-600 font-medium">gambar</span></p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="/api/admin/template-word"
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-xs flex items-center gap-1"
              >
                📄 Download Template
              </a>
              <label className={`bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition text-xs cursor-pointer flex items-center gap-1 ${importing && importType === "word" ? "opacity-50" : ""}`}>
                {importing && importType === "word" ? "⏳" : "📤"} Upload
                <input ref={wordRef} type="file" accept=".docx" className="hidden" onChange={handleWordImport} disabled={importing} />
              </label>
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          <span className="font-medium">Format tabel:</span> No | Pertanyaan | Opsi A-E | Jawaban | Pembahasan | Tipe (Regular/TKP) | Poin A-E (hanya untuk TKP)
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-bold mb-4">{editingId ? "Edit Soal" : "Tambah Soal Baru"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
              <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2 border rounded-lg font-mono text-sm" rows={2} />
              <p className="text-xs text-gray-500 mt-1">Gunakan tag HTML untuk gambar: {`<img src="/uploads/questions/namafile.png" />`}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opsi A</label>
                <input value={form.optionA} onChange={(e) => setForm({ ...form, optionA: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opsi B</label>
                <input value={form.optionB} onChange={(e) => setForm({ ...form, optionB: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opsi C</label>
                <input value={form.optionC} onChange={(e) => setForm({ ...form, optionC: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opsi D</label>
                <input value={form.optionD} onChange={(e) => setForm({ ...form, optionD: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opsi E (opsional)</label>
                <input value={form.optionE} onChange={(e) => setForm({ ...form, optionE: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban Benar</label>
                <select value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Soal</label>
                <select value={form.questionType} onChange={(e) => setForm({ ...form, questionType: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="regular">Regular</option>
                  <option value="tkp">TKP</option>
                </select>
              </div>
            </div>
            {form.questionType === "tkp" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poin Tiap Opsi (1-5)</label>
                <div className="grid grid-cols-5 gap-3">
                  {["A", "B", "C", "D", "E"].map((letter) => {
                    const pts = (() => { try { return JSON.parse(form.optionPoints); } catch { return {}; } })();
                    return (
                      <div key={letter}>
                        <label className="block text-xs text-gray-500 mb-1">Opsi {letter}</label>
                        <input
                          type="number" min={1} max={5}
                          value={pts[letter] || ""}
                          onChange={(e) => {
                            const v = parseInt(e.target.value) || 0;
                            const updated = { ...pts, [letter]: v };
                            setForm({ ...form, optionPoints: JSON.stringify(updated) });
                          }}
                          className="w-full px-3 py-2 border rounded-lg text-center"
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">Soal TKP dinilai berdasarkan bobot jawaban. Pilihan terbaik=5, terburuk=1.</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pembahasan (opsional)</label>
              <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={2} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={editingId ? handleUpdate : handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              {editingId ? "Update Soal" : "Simpan Soal"}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition">
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="font-medium flex-1" dangerouslySetInnerHTML={{ __html: q.question }} />
                {q.questionType === "tkp" && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2">TKP</span>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(q)} className="text-blue-600 text-sm hover:underline">Edit</button>
                <button onClick={() => handleDelete(q.id)} className="text-red-600 text-sm hover:underline">Hapus</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm ml-11">
              {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isCorrect = q.answer === letter;
                const pts = (() => { try { return JSON.parse(q.optionPoints || "{}"); } catch { return {}; } })();
                const poin = pts[letter];
                return (
                  <span key={letter} className={`${isCorrect ? "text-green-600 font-bold" : ""} flex items-center gap-1`}>
                    {letter}. {opt}
                    {q.questionType === "tkp" && poin && <span className="text-xs text-purple-500 font-normal">({poin} pt)</span>}
                  </span>
                );
              })}
              {q.optionE && (() => {
                const pts = (() => { try { return JSON.parse(q.optionPoints || "{}"); } catch { return {}; } })();
                const poin = pts["E"];
                return (
                  <span className={`${q.answer === "E" ? "text-green-600 font-bold" : ""} flex items-center gap-1`}>
                    E. {q.optionE}
                    {q.questionType === "tkp" && poin && <span className="text-xs text-purple-500 font-normal">({poin} pt)</span>}
                  </span>
                );
              })()}
            </div>
            <div className="ml-11 mt-2 flex items-center gap-3">
              <span className="text-sm">Jawaban: <span className="font-bold text-green-600">{q.answer}</span></span>
              {q.explanation && <span className="text-sm text-gray-600">- {q.explanation}</span>}
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-500">Belum ada soal. Tambah manual, import Excel, atau import Word.</p>
        </div>
      )}
    </div>
  );
}
