"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  moduleId: string;
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
  modules: Module[];
}

export default function LessonPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { lessonId: string };
}) {
  const router = useRouter();
  const { slug } = params;
  const lessonId = searchParams?.lessonId;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.course) {
          setCourse(data.course);
          const allLessons = data.course.modules.flatMap((m: Module) => m.lessons);
          const lesson = allLessons.find((l: Lesson) => l.id === lessonId);
          if (lesson) {
            setCurrentLesson(lesson);
          } else if (allLessons.length > 0) {
            setCurrentLesson(allLessons[0]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, lessonId]);

  const allLessons = course?.modules.flatMap((m) => m.lessons) || [];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const getLessonModule = (lesson: Lesson) => {
    return course?.modules.find((m) => m.id === lesson.moduleId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Materi tidak ditemukan</h2>
          <Link href={`/courses/${slug}`} className="text-blue-600 hover:underline">
            Kembali ke kursus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={`/courses/${slug}`} className="text-blue-600 hover:underline">
            ← {course.title}
          </Link>
          <span className="text-sm text-gray-500">
            Materi {currentIndex + 1} dari {allLessons.length}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-6 p-4">
        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <span className="text-sm text-blue-600 mb-2 block">
              {getLessonModule(currentLesson)?.title}
            </span>
            <h1 className="text-2xl font-bold mb-6">{currentLesson.title}</h1>

            <div className="prose max-w-none">
              {currentLesson.content?.split("\n").map((paragraph, i) => {
                if (!paragraph.trim()) return <br key={i} />;
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={i} className="ml-4 text-gray-700">
                      {paragraph.substring(2)}
                    </li>
                  );
                }
                if (/^\d+\./.test(paragraph)) {
                  return (
                    <li key={i} className="ml-4 text-gray-700 list-decimal">
                      {paragraph}
                    </li>
                  );
                }
                return (
                  <p key={i} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lesson?lessonId=${prevLesson.id}`}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg text-center font-medium hover:bg-gray-200 transition"
                >
                  ← {prevLesson.title}
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lesson?lessonId=${nextLesson.id}`}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-center font-medium hover:bg-blue-700 transition"
                >
                  {nextLesson.title} →
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg text-center font-medium hover:bg-green-700 transition"
                >
                  Selesai ✓
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
            <h3 className="font-bold mb-3">Daftar Materi</h3>
            <div className="space-y-1">
              {course.modules.map((module, mIdx) => (
                <div key={module.id}>
                  <div className="text-xs text-gray-500 font-semibold mt-3 mb-1">
                    Modul {mIdx + 1}: {module.title}
                  </div>
                  {module.lessons.map((lesson, lIdx) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lesson?lessonId=${lesson.id}`}
                      className={`flex items-center gap-2 p-2 rounded text-sm transition ${
                        lesson.id === currentLesson.id
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xs">{mIdx + 1}.{lIdx + 1}</span>
                      <span className="truncate">{lesson.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
