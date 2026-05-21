"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LeaderboardEntry {
  id: string;
  userName: string;
  earnedPoints: number;
  maxPoints: number;
  score: number;
}

export default function LeaderboardPage({
  params,
}: {
  params: { tryoutId: string };
}) {
  const router = useRouter();
  const { tryoutId } = params;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [title, setTitle] = useState("Memuat Peringkat...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/cat/leaderboard/${tryoutId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Gagal memuat leaderboard");
          setLoading(false);
          return;
        }
        setTitle(data.tryoutTitle);
        setEntries(data.leaderboard);
      } catch (e: any) {
        setError(e.message || "Terjadi kesalahan");
      }
      setLoading(false);
    };
    load();
  }, [tryoutId]);

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><p className="text-xl">Memuat Peringkat Nasional...</p></div>;
  
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <p className="text-red-500 mb-4 text-xl">{error}</p>
      <Link href="/cat" className="text-blue-600 hover:underline">Kembali ke Dashboard</Link>
    </div>
  );

  const getMedalStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300 font-extrabold text-lg shadow-sm"; // Gold
    if (rank === 2) return "bg-gray-200 text-gray-700 border-gray-300 font-bold text-lg shadow-sm"; // Silver
    if (rank === 3) return "bg-orange-100 text-orange-800 border-orange-300 font-bold text-lg shadow-sm"; // Bronze
    return "bg-white text-gray-600 border-gray-100";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="font-bold text-gray-500 w-8 inline-block text-center">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <Link href="/cat" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Kembali ke Dashboard CAT
          </Link>
          <div className="inline-block p-4 bg-yellow-50 rounded-full mb-4">
            <span className="text-6xl">🏆</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Peringkat Nasional</h1>
          <p className="text-xl text-gray-600">{title}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Top 100 Peserta</h2>
              <p className="text-blue-100 text-sm">Peserta terbaik se-Indonesia</p>
            </div>
            <div className="text-3xl font-bold text-blue-200 opacity-50">
              #LEADERBOARD
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Belum ada peserta yang menyelesaikan simulasi ini. Jadilah yang pertama!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="p-5 font-semibold text-center w-20">Peringkat</th>
                    <th className="p-5 font-semibold">Nama Peserta</th>
                    <th className="p-5 font-semibold text-right">Total Poin</th>
                    <th className="p-5 font-semibold text-right">Akurasi</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => {
                    const rank = index + 1;
                    return (
                      <tr 
                        key={entry.id} 
                        className={`border-b border-gray-50 transition hover:-translate-y-0.5 hover:shadow-md ${getMedalStyle(rank)}`}
                      >
                        <td className="p-5 text-center">
                          {getRankBadge(rank)}
                        </td>
                        <td className="p-5">
                          <div className={`font-bold ${rank <= 3 ? 'text-gray-900' : 'text-gray-700'}`}>
                            {entry.userName}
                          </div>
                        </td>
                        <td className="p-5 text-right font-bold text-blue-700 text-lg">
                          {entry.earnedPoints} <span className="text-sm font-normal text-gray-400">/ {entry.maxPoints}</span>
                        </td>
                        <td className="p-5 text-right">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                            entry.score >= 80 ? "bg-green-100 text-green-700" :
                            entry.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {entry.score}%
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
