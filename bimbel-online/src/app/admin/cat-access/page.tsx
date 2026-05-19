"use client";

import { useState, useEffect } from "react";

interface Access {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  grantedAt: string;
}

export default function AdminCatAccessPage() {
  const [accessList, setAccessList] = useState<Access[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const fetchAll = async () => {
    const res = await fetch("/api/admin/cat-access");
    const data = await res.json();
    setAccessList(data.accessList || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAdd = async () => {
    if (!email) return;
    const res = await fetch("/api/cat/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    if (res.ok) {
      setEmail("");
      setName("");
      fetchAll();
    }
  };

  const toggleActive = async (access: Access) => {
    await fetch("/api/cat/access", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: access.email, active: !access.active }),
    });
    fetchAll();
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Hapus akses untuk ${email}?`)) return;
    await fetch("/api/cat/access", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    fetchAll();
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kelola Akses CAT CPNS</h2>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="font-bold mb-4">Tambah Akses</h3>
        <div className="flex gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email peserta"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama (opsional)"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Beri Akses
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Nama</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Tanggal</th>
              <th className="text-right p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accessList.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{a.email}</td>
                <td className="p-4">{a.name || "-"}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(a)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      a.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.active ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(a.grantedAt).toLocaleDateString("id-ID")}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(a.email)} className="text-red-600 hover:underline text-sm">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {accessList.length === 0 && (
          <div className="text-center py-8 text-gray-500">Belum ada akses diberikan</div>
        )}
      </div>
    </div>
  );
}
