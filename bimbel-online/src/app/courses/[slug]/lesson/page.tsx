"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
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

// Parse YouTube/Vimeo to embed URL
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0`;
  return url;
}

export default function LessonPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { lessonId: string };
}) {
  const { slug } = params;
  const lessonId = searchParams?.lessonId;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.course) {
          setCourse(data.course);
          const allLessons = data.course.modules.flatMap((m: Module) => m.lessons);
          const lesson = allLessons.find((l: Lesson) => l.id === lessonId);
          setCurrentLesson(lesson || allLessons[0] || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, lessonId]);

  const allLessons = course?.modules.flatMap((m) => m.lessons) || [];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const markComplete = () => {
    if (currentLesson) setCompleted((prev) => new Set([...prev, currentLesson.id]));
  };

  const getLessonModule = (lesson: Lesson) =>
    course?.modules.find((m) => m.id === lesson.moduleId);

  const embedUrl = currentLesson?.videoUrl ? getEmbedUrl(currentLesson.videoUrl) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Memuat materi...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Materi tidak ditemukan</h2>
          <Link href={`/courses/${slug}`} className="text-blue-400 hover:underline">
            Kembali ke kursus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/courses/${slug}`}
            className="text-gray-400 hover:text-white transition shrink-0 text-sm font-medium flex items-center gap-1"
          >
            ← Kembali
          </Link>
          <span className="text-gray-600 hidden sm:block">|</span>
          <span className="text-white font-semibold text-sm truncate hidden sm:block">{course.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs font-medium hidden sm:block">
            {currentIndex + 1} / {allLessons.length} materi
          </span>
          {/* Progress bar */}
          <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / allLessons.length) * 100}%` }}
            />
          </div>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-400 hover:text-white text-sm font-medium bg-gray-800 px-3 py-1.5 rounded-lg"
          >
            Daftar Materi
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player Area */}
          {embedUrl ? (
            <div className="bg-black w-full aspect-video max-h-[65vh]">
              <iframe
                key={currentLesson.id}
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          ) : (
            <div className="bg-gray-900 w-full aspect-video max-h-[65vh] flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-4xl">
                📄
              </div>
              <p className="text-gray-400 text-sm">Materi ini tidak memiliki video</p>
            </div>
          )}

          {/* Lesson Info */}
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
            {/* Breadcrumb */}
            <div className="text-xs text-blue-400 font-semibold mb-3 uppercase tracking-wide">
              {getLessonModule(currentLesson)?.title}
            </div>

            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {currentLesson.title}
              </h1>
              <button
                onClick={markComplete}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
                  completed.has(currentLesson.id)
                    ? "bg-green-900 text-green-400 cursor-default"
                    : "bg-gray-800 text-gray-300 hover:bg-green-900 hover:text-green-400"
                }`}
              >
                {completed.has(currentLesson.id) ? "✓ Selesai" : "Tandai Selesai"}
              </button>
            </div>

            {/* Content / Notes */}
            {currentLesson.content && (
              <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">📝 Catatan Materi</h3>
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-3 text-sm">
                  {currentLesson.content.split("\n").map((line, i) => {
                    if (!line.trim()) return <br key={i} />;
                    if (line.startsWith("- ")) return (
                      <li key={i} className="ml-4 text-gray-300">
                        {line.substring(2)}
                      </li>
                    );
                    return <p key={i} className="text-gray-300">{line}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lesson?lessonId=${prevLesson.id}`}
                  className="flex-1 bg-gray-800 text-gray-200 py-3 px-4 rounded-xl text-center text-sm font-semibold hover:bg-gray-700 transition truncate"
                >
                  ← {prevLesson.title}
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lesson?lessonId=${nextLesson.id}`}
                  onClick={markComplete}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl text-center text-sm font-bold hover:bg-blue-700 transition truncate"
                >
                  {nextLesson.title} →
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl text-center text-sm font-bold hover:bg-green-700 transition"
                >
                  🎉 Selesai! Kembali ke Kursus
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Desktop */}
        <div className="w-80 hidden lg:flex flex-col bg-gray-900 border-l border-gray-800 shrink-0">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-bold text-white text-sm">Daftar Materi</h3>
            <p className="text-xs text-gray-500 mt-1">{completed.size} dari {allLessons.length} selesai</p>
            <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${(completed.size / allLessons.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {course.modules.map((module, mIdx) => (
              <div key={module.id} className="mb-2">
                <div className="px-3 py-2 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                  Bab {mIdx + 1}: {module.title}
                </div>
                {module.lessons.map((lesson, lIdx) => {
                  const isActive = lesson.id === currentLesson.id;
                  const isDone = completed.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lesson?lessonId=${lesson.id}`}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition group ${
                        isActive
                          ? "bg-blue-600/20 text-blue-300"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isDone
                          ? "bg-green-900 text-green-400"
                          : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-500"
                      }`}>
                        {isDone ? "✓" : lesson.videoUrl ? "▶" : lIdx + 1}
                      </div>
                      <span className="truncate text-xs">{lesson.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-gray-900 overflow-y-auto">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Daftar Materi</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white text-xl">×</button>
              </div>
              <div className="p-2">
                {course.modules.map((module, mIdx) => (
                  <div key={module.id} className="mb-2">
                    <div className="px-3 py-2 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                      Bab {mIdx + 1}: {module.title}
                    </div>
                    {module.lessons.map((lesson, lIdx) => {
                      const isActive = lesson.id === currentLesson.id;
                      const isDone = completed.has(lesson.id);
                      return (
                        <Link
                          key={lesson.id}
                          href={`/courses/${slug}/lesson?lessonId=${lesson.id}`}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${
                            isActive ? "bg-blue-600/20 text-blue-300" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            isDone ? "bg-green-900 text-green-400" : isActive ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500"
                          }`}>
                            {isDone ? "✓" : lesson.videoUrl ? "▶" : lIdx + 1}
                          </div>
                          <span className="truncate text-xs">{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
