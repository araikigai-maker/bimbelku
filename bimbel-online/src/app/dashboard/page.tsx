"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TryoutResult {
  id: string;
  score: number;
  correct: number;
  wrong: number;
  answered: number;
  createdAt: string;
  tryout: {
    title: string;
    slug: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<TryoutResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    fetch(`/api/tryout-results?userId=${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.results) setResults(data.results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-updated"));
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Selamat datang, {user.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Keluar
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600">6</div>
            <div className="text-gray-600 text-sm md:text-base">Kursus Tersedia</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600">4</div>
            <div className="text-gray-600 text-sm md:text-base">Tryout Tersedia</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 relative bg-blue-50">
            <div className="text-3xl font-bold text-blue-800">2</div>
            <div className="text-blue-900 font-medium text-sm md:text-base">Simulasi CAT</div>
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{results.length}</div>
            <div className="text-gray-600 text-sm md:text-base">Tryout Selesai</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{avgScore}%</div>
            <div className="text-gray-600 text-sm md:text-base">Rata-rata Skor</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Kursus</h2>
            <div className="space-y-3 flex-1">
              {[
                { name: "Persiapan UTBK Saintek", slug: "utbk-saintek-2026", lessons: 5 },
                { name: "Persiapan SKD CPNS", slug: "skd-cpns-2026", lessons: 4 },
                { name: "Matematika Dasar SMP", slug: "matematika-smp", lessons: 3 },
              ].map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <div className="font-medium">{course.name}</div>
                    <div className="text-sm text-gray-500">{course.lessons} materi</div>
                  </div>
                  <span className="text-blue-600">→</span>
                </Link>
              ))}
            </div>
            <Link href="/courses" className="mt-4 text-blue-600 hover:underline inline-block">
              Lihat semua kursus →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Tryout Online</h2>
            <div className="space-y-3 flex-1">
              {[
                { name: "Tryout UTBK Saintek", slug: "tryout-utbk-saintek-1", qs: 10 },
                { name: "Tryout SKD TWK", slug: "tryout-skd-twk-1", qs: 10 },
                { name: "Tryout SKD TIU", slug: "tryout-skd-tiu-1", qs: 10 },
              ].map((tryout) => (
                <Link
                  key={tryout.slug}
                  href={`/tryouts/${tryout.slug}/exam`}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <div className="font-medium">{tryout.name}</div>
                    <div className="text-sm text-gray-500">{tryout.qs} soal</div>
                  </div>
                  <span className="text-green-600">Mulai →</span>
                </Link>
              ))}
            </div>
            <Link href="/tryouts" className="mt-4 text-blue-600 hover:underline inline-block">
              Lihat semua tryout →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col border-2 border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              PRO
            </div>
            <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
              <span>📋</span> Simulasi CAT BKN
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Uji kemampuan Anda dengan simulasi Computer Assisted Test (CAT) standar BKN yang dilengkapi dengan manajemen waktu dan perhitungan skor asli.
            </p>
            <div className="space-y-3 flex-1">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-500 mt-1">✓</div>
                <div>
                  <div className="font-medium text-sm text-blue-900">Format Asli BKN</div>
                  <div className="text-xs text-blue-700">Tampilan dan waktu sesuai aslinya</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-500 mt-1">✓</div>
                <div>
                  <div className="font-medium text-sm text-blue-900">Pembahasan Lengkap</div>
                  <div className="text-xs text-blue-700">Evaluasi jawaban setelah ujian</div>
                </div>
              </div>
            </div>
            <Link href="/cat" className="mt-6 block text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">
              Masuk ke Portal CAT →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
