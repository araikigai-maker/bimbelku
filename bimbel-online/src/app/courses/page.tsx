"use client";

import { useState, useEffect, useMemo } from "react";
import CourseCard from "@/components/CourseCard";
import { categories } from "@/lib/constants";

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
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchCat = selectedCategory === "Semua" || c.category === selectedCategory;
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  // Group courses by category for Swimlanes (only when not searching/filtering specific cat)
  const showSwimlanes = selectedCategory === "Semua" && searchQuery === "";
  const swimlanes = useMemo(() => {
    if (!showSwimlanes) return [];
    const lanes: { title: string; items: Course[] }[] = [];
    
    // Custom logic to build engaging lanes
    const cpnsCourses = courses.filter(c => c.category === "CPNS");
    if (cpnsCourses.length > 0) lanes.push({ title: "🔥 Persiapan CPNS Terpanas", items: cpnsCourses });
    
    const utbkCourses = courses.filter(c => c.category === "UTBK");
    if (utbkCourses.length > 0) lanes.push({ title: "🎓 Pejuang Kampus Impian (UTBK)", items: utbkCourses });
    
    const otherCourses = courses.filter(c => c.category !== "CPNS" && c.category !== "UTBK");
    if (otherCourses.length > 0) lanes.push({ title: "⭐ Pilihan Favorit Lainnya", items: otherCourses });
    
    return lanes;
  }, [courses, showSwimlanes]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 pt-16 pb-24 overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-400 opacity-20 blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 text-blue-50 text-sm font-semibold mb-5 border border-blue-400/30 backdrop-blur-sm">
            🚀 Diskon Spesial s.d 50% Hari Ini
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Mulai Perjalanan Karir <br className="hidden md:block"/>& Pendidikan Impianmu
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Belajar langsung dari Master Teacher berpengalaman. Kuasai materinya, taklukkan ujiannya, dan wujudkan cita-citamu bersama BimbelKu.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari kursus CPNS, UTBK, BUMN..."
              className="block w-full pl-12 pr-4 py-4 rounded-2xl border-0 ring-4 ring-white/20 focus:ring-white bg-white/95 focus:bg-white text-gray-900 placeholder-gray-500 shadow-2xl focus:outline-none transition-all duration-300 text-lg font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Category Quick Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-2 md:p-4 mb-12 flex items-center gap-2 md:gap-4 overflow-x-auto hide-scrollbar border border-gray-100">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider pl-4 hidden md:block shrink-0">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchQuery(""); // Reset search when clicking category
              }}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-96">
                <div className="h-44 bg-gray-200 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Belum ada kursus tersedia</h3>
            <p className="text-gray-500">Silakan kembali lagi nanti untuk melihat penawaran kelas terbaru kami.</p>
          </div>
        ) : !showSwimlanes ? (
          /* Search / Filter Results Grid */
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <span>Hasil Pencarian</span>
              <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{filteredCourses.length}</span>
            </h2>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-500 font-medium">Tidak menemukan kursus yang cocok dengan pencarianmu.</p>
                <button onClick={() => {setSearchQuery(""); setSelectedCategory("Semua");}} className="mt-4 text-blue-600 font-bold hover:underline">
                  Tampilkan semua kursus
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Swimlanes Layout (Default View) */
          <div className="space-y-12">
            {swimlanes.map((lane, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {lane.title}
                  </h2>
                  <button className="text-blue-600 font-bold text-sm hover:text-blue-800 transition hidden sm:block">
                    Lihat Semua →
                  </button>
                </div>
                
                {/* Horizontal Scroll Area */}
                <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                  {lane.items.map((course) => (
                    <div key={course.id} className="w-[85vw] sm:w-[350px] shrink-0 snap-center sm:snap-start">
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Style for hiding scrollbar but keeping functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
