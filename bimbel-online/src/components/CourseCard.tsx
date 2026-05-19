import Link from "next/link";

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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 relative">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            📚
          </div>
        )}
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {course.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>👨‍🏫 {course.instructor}</span>
          <span>📖 {course.lessons} lesson</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(course.price)}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span>{course.rating}</span>
            <span className="text-gray-400 text-sm">({course.students})</span>
          </div>
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="mt-4 w-full block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
