"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  users: number;
  courses: number;
  tryouts: number;
  questions: number;
  students: number;
  results: number;
}

interface RecentResult {
  id: string;
  score: number;
  user: { name: string };
  tryout: { title: string };
  createdAt: string;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentResults, setRecentResults] = useState<RecentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRecentResults(data.recentResults || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><p>Loading...</p></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Pengguna", value: stats?.users, color: "bg-blue-500", icon: "👥" },
          { label: "Total Siswa", value: stats?.students, color: "bg-green-500", icon: "🎓" },
          { label: "Total Kursus", value: stats?.courses, color: "bg-purple-500", icon: "📚" },
          { label: "Total Tryout", value: stats?.tryouts, color: "bg-orange-500", icon: "📝" },
          { label: "Total Soal", value: stats?.questions, color: "bg-red-500", icon: "❓" },
          { label: "Hasil Tryout", value: stats?.results, color: "bg-teal-500", icon: "📈" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{item.icon}</span>
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
            </div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm text-gray-600">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Aksi Cepat</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/courses/new" className="bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition text-center">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium text-sm">Tambah Kursus</div>
            </Link>
            <Link href="/admin/tryouts/new" className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition text-center">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium text-sm">Tambah Tryout</div>
            </Link>
            <Link href="/admin/courses" className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium text-sm">Kelola Kursus</div>
            </Link>
            <Link href="/admin/users" className="bg-orange-50 text-orange-700 p-4 rounded-lg hover:bg-orange-100 transition text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium text-sm">Kelola Pengguna</div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Hasil Tryout Terbaru</h3>
            <Link href="/admin/results" className="text-blue-600 text-sm hover:underline">Lihat semua →</Link>
          </div>
          {recentResults.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada hasil tryout</p>
          ) : (
            <div className="space-y-3">
              {recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div className="font-medium">{result.user.name}</div>
                    <div className="text-sm text-gray-600">{result.tryout.title}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.score >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {result.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
