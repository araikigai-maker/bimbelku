import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
          <div className="mb-8 border-b pb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Syarat & Ketentuan Layanan</h1>
            <p className="text-gray-500">Terakhir diperbarui: 21 Mei 2026</p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900">1. Ketentuan Umum</h2>
              <p>
                Dengan mengakses dan menggunakan platform BimbelKu, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan Layanan ini. Jika Anda tidak setuju dengan bagian mana pun dari persyaratan ini, Anda tidak diperkenankan untuk menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">2. Akun Pengguna</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Anda harus membuat akun untuk mengakses sebagian besar fitur BimbelKu.</li>
                <li>Satu akun hanya boleh digunakan oleh <strong>satu orang</strong>. Berbagi akun dengan orang lain adalah pelanggaran berat dan dapat mengakibatkan pemblokiran akun tanpa pengembalian dana.</li>
                <li>Anda bertanggung jawab menjaga kerahasiaan kata sandi Anda.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">3. Layanan Berbayar & Pengembalian Dana (Refund Policy)</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pembayaran yang telah berhasil dilakukan tidak dapat dikembalikan (Non-refundable) kecuali terjadi kesalahan sistem fatal dari pihak kami yang menyebabkan layanan tidak dapat diakses lebih dari 7x24 jam.</li>
                <li>Akses Premium akan langsung aktif setelah pembayaran dikonfirmasi oleh sistem Payment Gateway.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">4. Hak Kekayaan Intelektual</h2>
              <p>
                Seluruh materi, soal Tryout, Simulasi CAT, video pembelajaran, dan desain grafis dalam platform ini adalah hak cipta milik BimbelKu. Dilarang keras menyalin, merekam layar, atau mendistribusikan ulang materi tanpa izin tertulis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">5. Perubahan Syarat & Ketentuan</h2>
              <p>
                BimbelKu berhak memperbarui Syarat dan Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Link href="/" className="text-blue-600 font-semibold hover:underline">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
