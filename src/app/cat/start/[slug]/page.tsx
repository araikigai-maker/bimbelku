"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CatStartPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const { slug } = params;

  const [tryout, setTryout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tryouts/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.tryout) setTryout(data.tryout);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleStart = () => {
    if (sessionId) {
      router.push(`/cat/exam/${slug}?session=${sessionId}`);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;
  if (!tryout) return <div className="flex justify-center py-20"><p>Tryout tidak ditemukan</p></div>;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{tryout.title}</h1>
            <p className="text-gray-600">Simulasi CAT CPNS 2026 - BKN Style</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-lg text-blue-800 mb-4">📋 Tata Tertib & Petunjuk</h2>
            <ul className="space-y-2 text-sm text-blue-900">
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">1.</span>
                <span>Soal terdiri dari <strong>TWK, TIU, dan TKP</strong> dengan total {tryout.questionCount} soal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">2.</span>
                <span>Waktu pengerjaan <strong>{tryout.duration} menit</strong>. Timer akan berjalan otomatis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">3.</span>
                <span>Pilih jawaban dengan mengklik opsi A, B, C, D, atau E.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">4.</span>
                <span>Jawaban akan <strong>otomatis tersimpan</strong> setiap kali Anda memilih opsi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">5.</span>
                <span>Gunakan tombol <strong>Ragu-ragu</strong> untuk menandai soal yang belum yakin.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">6.</span>
                <span>Navigasi soal di panel kanan: <span className="text-green-600 font-bold">Hijau</span> = terjawab, <span className="text-red-600 font-bold">Merah</span> = belum.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">7.</span>
                <span>Jika waktu habis, ujian akan <strong>berakhir otomatis</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">8.</span>
                <span>Nilai akan ditampilkan setelah ujian selesai beserta status <strong>LULUS/TIDAK LULUS</strong>.</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">⚡ Sistem Penilaian CAT CPNS</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>TWK & TIU:</strong> Benar = 5 poin, Salah/Kosong = 0 poin</p>
              <p><strong>TKP:</strong> Setiap opsi memiliki bobot 1-5, tidak ada jawaban salah</p>
              <p><strong>Passing Grade:</strong> {tryout.passingGrade}% dari nilai total</p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition"
          >
            🎯 Mulai Ujian
          </button>

          <div className="mt-4 text-center">
            <Link href="/cat" className="text-blue-600 hover:underline text-sm">
              ← Kembali ke daftar simulasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
