"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  image: string | null;
  instructor: string;
  lessons: number;
  students: number;
  rating: number;
  modules: Module[];
}

export default function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data.course || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Kursus tidak ditemukan</h2>
          <Link href="/courses" className="text-blue-600 hover:underline">
            Kembali ke kursus
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/courses" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Kembali ke Kursus
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-64 bg-gray-200 relative">
            {course.image ? (
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                📚
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {course.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
                <div className="text-sm text-gray-600">Lessons</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{course.students}</div>
                <div className="text-sm text-gray-600">Siswa</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">⭐ {course.rating}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatPrice(course.price)}</div>
                <div className="text-sm text-gray-600">Harga</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Pengajar</h2>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{course.instructor}</div>
                  <div className="text-sm text-gray-600">Pengajar Profesional</div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Daftar Materi</h2>
              <div className="space-y-4">
                {course.modules.map((module, mIdx) => (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 font-semibold">
                      Modul {mIdx + 1}: {module.title}
                    </div>
                    <div className="divide-y">
                      {module.lessons.map((lesson, lIdx) => (
                        <Link
                          key={lesson.id}
                          href={`/courses/${course.slug}/lesson?lessonId=${lesson.id}`}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">
                              {mIdx + 1}.{lIdx + 1}
                            </span>
                            <span>{lesson.title}</span>
                          </div>
                          <span className="text-blue-600">▶</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/courses/${course.slug}/lesson?lessonId=${course.modules[0]?.lessons[0]?.id}`}
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Mulai Belajar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
