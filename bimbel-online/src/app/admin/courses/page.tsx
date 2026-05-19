"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  instructor: string;
  students: number;
  _count: {
    modules: number;
    enrollments: number;
  };
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kursus ini?")) return;
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><p>Loading...</p></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Kursus</h2>
        <Link
          href="/admin/courses/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Kursus
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold">Kursus</th>
              <th className="text-left p-4 font-semibold">Kategori</th>
              <th className="text-left p-4 font-semibold">Harga</th>
              <th className="text-left p-4 font-semibold">Modul</th>
              <th className="text-left p-4 font-semibold">Siswa</th>
              <th className="text-right p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{course.title}</div>
                  <div className="text-sm text-gray-600">{course.slug}</div>
                </td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {course.category}
                  </span>
                </td>
                <td className="p-4">{formatPrice(course.price)}</td>
                <td className="p-4">{course._count.modules}</td>
                <td className="p-4">{course._count.enrollments}</td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/courses/edit/${course.id}`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="text-center py-8 text-gray-500">Belum ada kursus</div>
        )}
      </div>
    </div>
  );
}
