"use client";

import { useState, useEffect } from "react";

interface Result {
  id: string;
  score: number;
  correct: number;
  wrong: number;
  answered: number;
  earnedPoints: number;
  maxPoints: number;
  createdAt: string;
  user: { name: string; email: string };
  tryout: { title: string; category: string; passingGrade: number };
}

export default function AdminResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/tryout-results")
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredResults = filter
    ? results.filter((r) =>
        r.tryout.title.toLowerCase().includes(filter.toLowerCase()) ||
        r.user.name.toLowerCase().includes(filter.toLowerCase())
      )
    : results;

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Hasil Tryout</h2>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
          placeholder="Cari nama atau tryout..."
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold">Siswa</th>
              <th className="text-left p-4 font-semibold">Tryout</th>
              <th className="text-left p-4 font-semibold">Skor</th>
              <th className="text-left p-4 font-semibold">PG</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Poin</th>
              <th className="text-left p-4 font-semibold">Benar</th>
              <th className="text-left p-4 font-semibold">Salah</th>
              <th className="text-left p-4 font-semibold">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result) => {
              const pg = result.tryout.passingGrade || 0;
              const passed = result.score >= pg;
              return (
                <tr key={result.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{result.user.name}</div>
                    <div className="text-sm text-gray-600">{result.user.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{result.tryout.title}</div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{result.tryout.category}</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
                      {result.score}%
                    </span>
                  </td>
                  <td className="p-4">{pg}%</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {passed ? "LULUS" : "GAGAL"}
                    </span>
                  </td>
                  <td className="p-4">{result.earnedPoints}/{result.maxPoints}</td>
                  <td className="p-4 text-green-600">{result.correct}</td>
                  <td className="p-4 text-red-600">{result.wrong}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(result.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">Belum ada hasil tryout</div>
        )}
      </div>
    </div>
  );
}
