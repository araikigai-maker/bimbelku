"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    enrollments: number;
    tryoutResults: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "STUDENT", password: "" });
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "STUDENT" });
  const [createError, setCreateError] = useState("");

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pengguna ini?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role, password: "" });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await fetch(`/api/admin/users/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchUsers();
  };

  const handleCreate = async () => {
    setCreateError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setCreateError(data.error);
      return;
    }
    setShowCreate(false);
    setCreateForm({ name: "", email: "", password: "", role: "STUDENT" });
    fetchUsers();
  };

  if (loading) return <div className="flex justify-center py-20"><p>Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Kelola Pengguna</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          + Pengguna
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Tambah Pengguna</h3>
            {createError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{createError}</div>
            )}
            <div className="space-y-3">
              <input
                type="text" placeholder="Nama"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
              <input
                type="email" placeholder="Email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
              <input
                type="password" placeholder="Password (min 6 karakter)"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg text-sm"
              >
                <option value="STUDENT">Siswa</option>
                <option value="INSTRUCTOR">Instruktur</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => { setShowCreate(false); setCreateError(""); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold">Nama</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Role</th>
              <th className="text-left p-4 font-semibold">Kursus</th>
              <th className="text-left p-4 font-semibold">Tryout</th>
              <th className="text-right p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  {editingId === user.id ? (
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="STUDENT">Siswa</option>
                      <option value="ADMIN">Admin</option>
                      <option value="INSTRUCTOR">Instruktur</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "ADMIN" ? "bg-red-100 text-red-700" :
                      user.role === "INSTRUCTOR" ? "bg-purple-100 text-purple-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role === "ADMIN" ? "Admin" : user.role === "INSTRUCTOR" ? "Instruktur" : "Siswa"}
                    </span>
                  )}
                </td>
                <td className="p-4">{user._count.enrollments}</td>
                <td className="p-4">{user._count.tryoutResults}</td>
                <td className="p-4 text-right">
                  {editingId === user.id ? (
                    <div className="flex gap-2 justify-end">
                      <button onClick={handleUpdate} className="text-green-600 hover:underline text-sm">Simpan</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-600 hover:underline text-sm">Batal</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => startEdit(user)} className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline text-sm">Hapus</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
