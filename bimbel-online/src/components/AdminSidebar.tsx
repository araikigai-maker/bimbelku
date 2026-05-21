"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin/overview", icon: "📊" },
  { name: "Kursus", href: "/admin/courses", icon: "📚" },
  { name: "Tryout", href: "/admin/tryouts", icon: "📝" },
  { name: "Simulasi CAT", href: "/admin/cat-simulation", icon: "🖥️" },
  { name: "Akses CAT", href: "/admin/cat-access", icon: "🔑" },
  { name: "Pengguna", href: "/admin/users", icon: "👥" },
  { name: "Hasil Tryout", href: "/admin/results", icon: "📈" },
  { name: "Langganan", href: "/admin/subscriptions", icon: "💳", badge: "Baru" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <Link href="/admin/overview" className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <div className="font-bold">BimbelKu</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </div>
      </Link>

      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.name}</span>
              {"badge" in item && item.badge && (
                <span className="text-[10px] bg-yellow-400 text-yellow-900 font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
        >
          <span>🌐</span>
          <span>Kembali ke Website</span>
        </Link>
      </div>
    </aside>
  );
}
