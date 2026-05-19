"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [pathname]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-blue-600">BimbelKu</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === "ADMIN" ? (
                  <Link href="/admin/overview" className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition">
                    Admin
                  </Link>
                ) : (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Siswa
                  </span>
                )}
                {user.role === "ADMIN" && (
                  <Link href="/admin/overview" className="text-red-600 hover:text-red-800 font-medium text-sm">
                    Admin Panel
                  </Link>
                )}
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  {user.name}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600">
                  Masuk
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Daftar
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === "ADMIN" ? (
                  <Link href="/admin/overview" className="block py-2 text-red-600 font-medium" onClick={() => setMobileOpen(false)}>
                    Panel Admin
                  </Link>
                ) : (
                  <div className="py-2 text-sm text-gray-500">Status: Siswa</div>
                )}
                <Link href="/dashboard" className="block py-2 text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>
                  Dashboard ({user.name})
                </Link>
              </>
            ) : (
              <div className="flex gap-4 mt-4">
                <Link href="/login" className="text-gray-600">Masuk</Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Daftar</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
