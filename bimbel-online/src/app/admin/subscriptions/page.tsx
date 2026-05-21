"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useRouter } from "next/navigation";

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  activatedBy: string;
  notes: string | null;
  isExpired: boolean;
  user: { id: string; name: string; email: string };
  plan: { name: string; slug: string; price: number };
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activating, setActivating] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    planSlug: "PREMIUM",
    durationDays: 30,
    notes: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subRes, userRes] = await Promise.all([
        fetch("/api/admin/subscriptions"),
        fetch("/api/admin/users"),
      ]);
      const subData = await subRes.json();
      const userData = await userRes.json();
      setSubscriptions(subData.subscriptions || []);
      setUsers(userData.users || []);
    } catch {
      setMessage({ type: "error", text: "Gagal memuat data" });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleActivate = async () => {
    if (!form.userId) {
      setMessage({ type: "error", text: "Pilih pengguna terlebih dahulu" });
      return;
    }
    setActivating(true);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: "Langganan berhasil diaktifkan!" });
      setShowActivateModal(false);
      setForm({ userId: "", planSlug: "PREMIUM", durationDays: 30, notes: "" });
      loadData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal mengaktifkan" });
    }
    setActivating(false);
  };

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm("Batalkan langganan ini?")) return;
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, action: "cancel" }),
      });
      if (!res.ok) throw new Error();
      setMessage({ type: "success", text: "Langganan dibatalkan" });
      loadData();
    } catch {
      setMessage({ type: "error", text: "Gagal membatalkan" });
    }
  };

  const activeCount = subscriptions.filter((s) => s.status === "ACTIVE" && !s.isExpired).length;
  const revenue = subscriptions
    .filter((s) => s.status === "ACTIVE" && s.activatedBy === "PAYMENT_GATEWAY")
    .reduce((sum, s) => sum + (s.plan.price || 0), 0);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "Seumur Hidup";

  return (
    <>
      <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">💳 Manajemen Langganan</h1>
              <p className="text-gray-500 mt-1">Kelola subscriber dan aktifkan akses premium secara manual</p>
            </div>
            <button
              onClick={() => { setShowActivateModal(true); setMessage(null); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              + Aktifkan Langganan
            </button>
          </div>

          {/* Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.text}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-extrabold text-blue-600">{activeCount}</div>
              <div className="text-gray-500 mt-1">Subscriber Aktif</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-extrabold text-green-600">{subscriptions.length}</div>
              <div className="text-gray-500 mt-1">Total Semua Waktu</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-dashed">
              <div className="text-3xl font-extrabold text-yellow-600">
                {revenue > 0 ? `Rp ${(revenue / 1000).toFixed(0)}rb` : "Rp 0"}
              </div>
              <div className="text-gray-500 mt-1">Pendapatan (via PG)</div>
              <div className="text-xs text-gray-400 mt-1">Aktif setelah Payment Gateway</div>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Daftar Semua Langganan</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center text-gray-500">Memuat data...</div>
            ) : subscriptions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500">Belum ada subscriber. Aktifkan langganan pertama Anda!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                      <th className="p-4">Pengguna</th>
                      <th className="p-4">Paket</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Mulai</th>
                      <th className="p-4">Berakhir</th>
                      <th className="p-4">Aktivasi</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => {
                      const isActive = sub.status === "ACTIVE" && !sub.isExpired;
                      return (
                        <tr key={sub.id} className="border-t border-gray-50 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="font-semibold text-gray-800">{sub.user.name}</div>
                            <div className="text-xs text-gray-400">{sub.user.email}</div>
                          </td>
                          <td className="p-4">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                              {sub.plan.name}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              isActive
                                ? "bg-green-100 text-green-700"
                                : sub.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {isActive ? "Aktif" : sub.isExpired ? "Kedaluwarsa" : sub.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{formatDate(sub.startDate)}</td>
                          <td className="p-4 text-sm text-gray-600">{formatDate(sub.endDate)}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                              sub.activatedBy === "PAYMENT_GATEWAY"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-purple-50 text-purple-700"
                            }`}>
                              {sub.activatedBy === "PAYMENT_GATEWAY" ? "💳 Payment" : "👤 Manual"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {isActive && (
                              <button
                                onClick={() => handleCancel(sub.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Batalkan
                              </button>
                            )}
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

      {/* Activate Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold mb-6">Aktifkan Langganan Manual</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Pengguna</label>
                <select
                  value={form.userId}
                  onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Pengguna --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paket</label>
                <select
                  value={form.planSlug}
                  onChange={(e) => setForm((f) => ({ ...f, planSlug: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PREMIUM">Premium (99.000/bulan)</option>
                  <option value="ENTERPRISE">Enterprise (199.000/bulan)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (hari)</label>
                <input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => setForm((f) => ({ ...f, durationDays: Number(e.target.value) }))}
                  min={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">30 = 1 bulan, 365 = 1 tahun, 9999 = lifetime</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="contoh: promo batch pertama"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowActivateModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleActivate}
                disabled={activating}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {activating ? "Memproses..." : "Aktifkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
