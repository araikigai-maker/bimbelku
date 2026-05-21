import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold">BimbelKu</span>
            </div>
            <p className="text-gray-400">
              Platform bimbel online terbaik untuk persiapan UTBK, SKD CPNS, dan ujian lainnya.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kursus</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/courses?cat=UTBK" className="hover:text-white">UTBK</Link></li>
              <li><Link href="/courses?cat=SKD" className="hover:text-white">SKD CPNS</Link></li>
              <li><Link href="/courses?cat=Kedinasan" className="hover:text-white">Kedinasan</Link></li>
              <li><Link href="/courses?cat=SMP" className="hover:text-white">SMP</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Tryout</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/tryouts?cat=UTBK" className="hover:text-white">Tryout UTBK</Link></li>
              <li><Link href="/tryouts?cat=SKD" className="hover:text-white">Tryout SKD</Link></li>
              <li><Link href="/tryouts?cat=CPNS" className="hover:text-white">Tryout CPNS</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontak & Bantuan</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@bimbelku.id</li>
              <li>WA: 0812-3456-7890</li>
              <li className="pt-2"><Link href="/terms" className="hover:text-white transition">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 BimbelKu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
