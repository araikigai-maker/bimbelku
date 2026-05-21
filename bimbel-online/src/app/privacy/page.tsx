import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
          <div className="mb-8 border-b pb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Kebijakan Privasi</h1>
            <p className="text-gray-500">Terakhir diperbarui: 21 Mei 2026</p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
            <section>
              <p>
                Privasi Anda sangat penting bagi kami di BimbelKu. Dokumen Kebijakan Privasi ini menguraikan jenis informasi pribadi yang diterima dan dikumpulkan oleh BimbelKu serta bagaimana informasi tersebut digunakan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">1. Informasi yang Kami Kumpulkan</h2>
              <p>Kami mengumpulkan beberapa jenis data untuk memberikan pelayanan terbaik bagi Anda, antara lain:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Data Pribadi:</strong> Nama, alamat email, dan nomor telepon saat Anda mendaftar.</li>
                <li><strong>Data Aktivitas:</strong> Rekam jejak pengerjaan soal (jawaban benar/salah), skor Simulasi CAT, dan durasi pengerjaan.</li>
                <li><strong>Data Teknis:</strong> Alamat IP, jenis peramban (browser), dan sistem operasi untuk keperluan keamanan.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">2. Penggunaan Informasi</h2>
              <p>Informasi yang kami kumpulkan digunakan untuk:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Membuat, mengelola, dan mempersonalisasi akun Anda.</li>
                <li>Memproses transaksi pembayaran Anda dengan aman melalui mitra Payment Gateway (Midtrans/Xendit).</li>
                <li>Menghasilkan laporan analitik dan statistik (Peringkat Nasional) terkait hasil belajar Anda. Nama Anda mungkin ditampilkan secara publik di fitur Leaderboard, kecuali Anda memilih untuk anonim.</li>
                <li>Mengirimkan email pemberitahuan sistem, reset password, atau promo terkait layanan.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">3. Perlindungan Data (Security)</h2>
              <p>
                Kami menerapkan prosedur keamanan fisik dan elektronik yang memadai untuk melindungi data Anda. Kata sandi Anda dienkripsi (hashed) secara kuat. Namun, ingatlah bahwa tidak ada metode transmisi di internet yang 100% aman.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">4. Pembagian Data ke Pihak Ketiga</h2>
              <p>
                BimbelKu tidak akan menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran komersial. Kami hanya membagikan data kepada pihak ketiga yang berwenang (seperti Payment Gateway) semata-mata untuk memproses pembayaran Anda.
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
