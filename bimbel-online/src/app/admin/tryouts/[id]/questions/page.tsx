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
  subtest: string | null;
}

interface Tryout {
  id: string;
  title: string;
  slug: string;
  duration: number;
  catAvailableFrom?: string | null;
  pgTwk?: number;
  pgTiu?: number;
  pgTkp?: number;
}

const EMPTY_FORM = {
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
  subtest: "TWK",
};

const SUBTEST_LABELS: Record<string, { label: string; color: string; target: number; desc: string }> = {
  TWK: { label: "TWK", color: "blue", target: 30, desc: "Tes Wawasan Kebangsaan" },
  TIU: { label: "TIU", color: "green", target: 35, desc: "Tes Intelejensi Umum" },
  TKP: { label: "TKP", color: "purple", target: 45, desc: "Tes Karakteristik Pribadi" },
};

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
  const [activeSubtest, setActiveSubtest] = useState<"all" | "TWK" | "TIU" | "TKP">("all");
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const fetchQuestions = () => {
    fetch(`/api/admin/tryouts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tryout) {
          const t = data.tryout;
          // Parse subtest PG config from description suffix
          const desc = t.description || "";
          const catPgMatch = desc.match(/\|\|CATPG:(\{.*?\})/);
          if (catPgMatch) {
            try {
              const cfg = JSON.parse(catPgMatch[1]);
              t.pgTwk = cfg.pgTwk || 65;
              t.pgTiu = cfg.pgTiu || 80;
              t.pgTkp = cfg.pgTkp || 166;
            } catch {}
          } else {
            t.pgTwk = 65; t.pgTiu = 80; t.pgTkp = 166;
          }
          setTryout(t);
          setQuestions(t.questions || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchQuestions(); }, [id]);

  const counts = {
    TWK: questions.filter((q) => q.subtest === "TWK").length,
    TIU: questions.filter((q) => q.subtest === "TIU").length,
    TKP: questions.filter((q) => q.subtest === "TKP").length,
    all: questions.length,
  };

  const filteredQuestions = activeSubtest === "all"
    ? questions
    : questions.filter((q) => q.subtest === activeSubtest);

  const handleAdd = async () => {
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tryoutId: id }),
    });
    if (res.ok) {
      setForm({ ...EMPTY_FORM });
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
      subtest: q.subtest || "TWK",
    });
    setShowForm(true);
  };

  const handleBulkDelete = async () => {
    const targetText = activeSubtest === "all" ? "SEMUA soal" : `semua soal ${activeSubtest}`;
    if (!confirm(`⚠️ PERINGATAN!\n\nApakah Anda yakin ingin menghapus ${targetText} dalam simulasi ini?\nSoal yang dihapus tidak dapat dikembalikan.`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/questions?tryoutId=${id}&subtest=${activeSubtest}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Berhasil menghapus ${data.deleted} soal.`);
        fetchQuestions();
      } else {
        alert("Gagal menghapus soal");
        setLoading(false);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/admin/questions/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ ...EMPTY_FORM });
      setEditingId(null);
      setShowForm(false);
      fetchQuestions();
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true); setImportType("excel"); setImportMsg(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`/api/admin/tryouts/${id}/import-questions`, { method: "POST", body: formData });
      const data = await res.json();
      setImportMsg(res.ok
        ? { ok: true, text: data.message || `Berhasil import ${data.success} soal` }
        : { ok: false, text: data.error || "Gagal import" }
      );
      if (res.ok) fetchQuestions();
    } catch {
      setImportMsg({ ok: false, text: "Gagal memproses file" });
    } finally {
      setImporting(false); setImportType(null);
      if (excelRef.current) excelRef.current.value = "";
    }
  };

  const handleWordImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true); setImportType("word"); setImportMsg(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`/api/admin/tryouts/${id}/import-word`, { method: "POST", body: formData });
      const data = await res.json();
      setImportMsg(res.ok
        ? { ok: true, text: data.message || `Berhasil import ${data.success} soal dengan ${data.images || 0} gambar` }
        : { ok: false, text: data.error || "Gagal import" }
      );
      if (res.ok) fetchQuestions();
    } catch {
      setImportMsg({ ok: false, text: "Gagal memproses file" });
    } finally {
      setImporting(false); setImportType(null);
      if (wordRef.current) wordRef.current.value = "";
    }
  };

  const isCat = !!tryout?.catAvailableFrom || true; // treat as CAT for subtest filter

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/tryouts" className="text-gray-600 hover:text-gray-800">← Kembali</Link>
          <div>
            <h2 className="text-2xl font-bold">Kelola Soal — {tryout?.title}</h2>
            <p className="text-gray-600">Total: {questions.length} soal | Durasi: {tryout?.duration} menit</p>
          </div>
        </div>
        <div className="flex gap-2">
          {filteredQuestions.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-2 text-sm font-medium"
            >
              🗑️ Hapus {activeSubtest === "all" ? "Semua Soal" : `Semua ${activeSubtest}`}
            </button>
          )}
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...EMPTY_FORM, subtest: activeSubtest !== "all" ? activeSubtest : "TWK" }); }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Tambah Soal
          </button>
        </div>
      </div>

      {/* Subtest Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(["TWK", "TIU", "TKP"] as const).map((st) => {
          const info = SUBTEST_LABELS[st];
          const count = counts[st];
          const pct = Math.min(100, Math.round((count / info.target) * 100));
          const colorMap = { blue: "bg-blue-600", green: "bg-green-600", purple: "bg-purple-600" };
          const bgMap = { blue: "bg-blue-50 border-blue-200", green: "bg-green-50 border-green-200", purple: "bg-purple-50 border-purple-200" };
          const textMap = { blue: "text-blue-700", green: "text-green-700", purple: "text-purple-700" };
          return (
            <button
              key={st}
              onClick={() => setActiveSubtest(activeSubtest === st ? "all" : st)}
              className={`border rounded-xl p-4 text-left transition hover:shadow-md ${bgMap[info.color as keyof typeof bgMap]} ${activeSubtest === st ? "ring-2 ring-offset-1 " + `ring-${info.color}-500` : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`font-bold text-lg ${textMap[info.color as keyof typeof textMap]}`}>{st}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${textMap[info.color as keyof typeof textMap]} bg-white border`}>{count}/{info.target}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{info.desc}</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all ${colorMap[info.color as keyof typeof colorMap]}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{pct}% lengkap</p>
              {tryout?.pgTwk && st === "TWK" && <p className="text-xs font-medium text-blue-600 mt-1">PG: {tryout.pgTwk} poin</p>}
              {tryout?.pgTiu && st === "TIU" && <p className="text-xs font-medium text-green-600 mt-1">PG: {tryout.pgTiu} poin</p>}
              {tryout?.pgTkp && st === "TKP" && <p className="text-xs font-medium text-purple-600 mt-1">PG: {tryout.pgTkp} poin</p>}
            </button>
          );
        })}
        <button
          onClick={() => setActiveSubtest("all")}
          className={`border rounded-xl p-4 text-left transition hover:shadow-md bg-gray-50 border-gray-200 ${activeSubtest === "all" ? "ring-2 ring-gray-400 ring-offset-1" : ""}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-bold text-lg text-gray-700">Semua</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-gray-700 bg-white border">{counts.all}/110</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">Total keseluruhan soal</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-gray-500 transition-all" style={{ width: `${Math.min(100, Math.round((counts.all / 110) * 100))}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{Math.min(100, Math.round((counts.all / 110) * 100))}% lengkap</p>
        </button>
      </div>

      {importMsg && (
        <div className={`p-4 rounded-lg mb-4 ${importMsg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {importMsg.text}
        </div>
      )}

      {/* Import Panel */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-dashed border-blue-200">
        <h3 className="font-bold text-lg mb-1">📥 Import Soal Massal</h3>
        <p className="text-xs text-gray-500 mb-3">
          Kolom: No | Pertanyaan | Opsi A | Opsi B | Opsi C | Opsi D | Opsi E | Jawaban | Pembahasan | Tipe (Regular/TKP) |
          <strong className="text-blue-600"> Subtest (TWK/TIU/TKP)</strong> | Poin A-E (untuk TKP)
        </p>
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
              <a href="/api/admin/template" className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-xs flex items-center gap-1">
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
              <a href="/api/admin/template-word" className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-xs flex items-center gap-1">
                📄 Download Template
              </a>
              <label className={`bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition text-xs cursor-pointer flex items-center gap-1 ${importing && importType === "word" ? "opacity-50" : ""}`}>
                {importing && importType === "word" ? "⏳" : "📤"} Upload
                <input ref={wordRef} type="file" accept=".docx" className="hidden" onChange={handleWordImport} disabled={importing} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Subtest Filter Tab */}
      <div className="flex gap-2 mb-4">
        {(["all", "TWK", "TIU", "TKP"] as const).map((st) => {
          const colorClass = st === "TWK" ? "bg-blue-600 text-white" : st === "TIU" ? "bg-green-600 text-white" : st === "TKP" ? "bg-purple-600 text-white" : "bg-gray-800 text-white";
          return (
            <button
              key={st}
              onClick={() => setActiveSubtest(st)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeSubtest === st ? colorClass : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {st === "all" ? "Semua" : st} ({counts[st]})
            </button>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border-l-4 border-blue-500">
          <h3 className="font-bold mb-4">{editingId ? "Edit Soal" : "Tambah Soal Baru"}</h3>
          <div className="space-y-4">
            {/* Subtest selector */}
            <div className="grid grid-cols-3 gap-3">
              {(["TWK", "TIU", "TKP"] as const).map((st) => {
                const colors = { TWK: "border-blue-500 bg-blue-50 text-blue-700", TIU: "border-green-500 bg-green-50 text-green-700", TKP: "border-purple-500 bg-purple-50 text-purple-700" };
                const inactive = "border-gray-200 bg-white text-gray-600";
                return (
                  <button
                    key={st} type="button"
                    onClick={() => setForm({ ...form, subtest: st, questionType: st === "TKP" ? "tkp" : "regular" })}
                    className={`border-2 rounded-lg p-3 text-center font-semibold transition ${form.subtest === st ? colors[st] : inactive}`}
                  >
                    {st}
                    <div className="text-xs font-normal mt-0.5">{SUBTEST_LABELS[st].desc}</div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
              <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2 border rounded-lg font-mono text-sm" rows={3} />
              <p className="text-xs text-gray-500 mt-1">Gunakan tag HTML untuk gambar: {`<img src="/uploads/questions/namafile.png" />`}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(["A", "B", "C", "D"] as const).map((letter) => (
                <div key={letter}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opsi {letter}</label>
                  <input value={(form as any)[`option${letter}`]} onChange={(e) => setForm({ ...form, [`option${letter}`]: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opsi E (opsional)</label>
                <input value={form.optionE} onChange={(e) => setForm({ ...form, optionE: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban Benar</label>
                <select value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  {["A", "B", "C", "D", "E"].map((l) => <option key={l} value={l}>{l}</option>)}
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

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, i) => {
          const subtestColor: Record<string, string> = {
            TWK: "bg-blue-100 text-blue-700",
            TIU: "bg-green-100 text-green-700",
            TKP: "bg-purple-100 text-purple-700",
          };
          return (
            <div key={q.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="font-medium flex-1" dangerouslySetInnerHTML={{ __html: q.question }} />
                  {q.subtest && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2 ${subtestColor[q.subtest] || "bg-gray-100 text-gray-600"}`}>
                      {q.subtest}
                    </span>
                  )}
                  {q.questionType === "tkp" && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-1">TKP</span>
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
              <div className="ml-11 mt-2 flex items-start gap-3">
                <span className="text-sm shrink-0">Jawaban: <span className="font-bold text-green-600">{q.answer}</span></span>
                {q.explanation && (
                  <div className="text-sm text-gray-600 flex gap-2 w-full">
                    <span className="shrink-0">-</span>
                    <div className="w-full" dangerouslySetInnerHTML={{ __html: q.explanation }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-500">
            {activeSubtest === "all"
              ? "Belum ada soal. Tambah manual, import Excel, atau import Word."
              : `Belum ada soal ${activeSubtest}. Klik "+ Tambah Soal" atau import file.`}
          </p>
        </div>
      )}
    </div>
  );
}
