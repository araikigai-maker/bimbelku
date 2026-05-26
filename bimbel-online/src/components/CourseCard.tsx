import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  course: {
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
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Generate original price (fake discount for premium look)
  const originalPrice = course.price > 0 ? course.price * 1.5 : 0;
  
  // Choose gradient based on category
  const getCategoryGradient = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "CPNS": return "from-blue-500 to-blue-700";
      case "BUMN": return "from-emerald-500 to-emerald-700";
      case "UTBK": return "from-purple-500 to-purple-700";
      case "KEDINASAN": return "from-orange-500 to-red-600";
      default: return "from-gray-600 to-gray-800";
    }
  };

  const getInstructorInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1 && parts[0].toLowerCase() === "kak") {
      return parts[1].charAt(0).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="h-44 relative bg-gray-100 overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center text-white text-5xl opacity-90 group-hover:opacity-100 transition-opacity`}>
            🎓
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`bg-gradient-to-r ${getCategoryGradient(course.category)} text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm`}>
            {course.category}
          </span>
          {course.price > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-sm shadow-sm inline-block w-max animate-pulse">
              DISKON 33%
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-extrabold text-[17px] text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="mt-auto">
          {/* Instructor & Meta */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                {getInstructorInitials(course.instructor)}
              </div>
              <span className="text-xs font-semibold text-gray-700">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              <span>{course.lessons} Modul</span>
            </div>
          </div>

          {/* Pricing & Rating */}
          <div className="flex items-end justify-between mb-5">
            <div>
              {course.price > 0 && (
                <div className="text-[11px] text-gray-400 line-through decoration-red-400 font-medium mb-0.5">
                  {formatPrice(originalPrice)}
                </div>
              )}
              <span className="text-xl font-black text-gray-900 tracking-tight">
                {formatPrice(course.price)}
              </span>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="font-bold text-yellow-700 text-xs">{course.rating}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 font-medium">({course.students.toLocaleString('id-ID')} siswa)</span>
            </div>
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="w-full block text-center bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
          >
            Lihat Detail Kelas
          </Link>
        </div>
      </div>
    </div>
  );
}
