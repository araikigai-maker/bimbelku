export function FaqSection() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="bg-purple-50 text-purple-600 text-sm font-semibold px-4 py-2 rounded-full">FAQ</span>
          <h2 className="text-4xl font-extrabold mt-4 mb-4 text-gray-900">Pertanyaan yang Sering Diajukan</h2>
        </div>
        
        <div className="space-y-4">
          {[
            {
              q: "Apakah simulasi CAT bisa dikerjakan di HP (Mobile)?",
              a: "Ya, bisa! Kami merancang sistem CAT BimbelKu agar responsif dan nyaman digunakan baik di Laptop, PC, maupun Smartphone Anda."
            },
            {
              q: "Bagaimana cara melakukan pembayaran?",
              a: "Saat ini kami sedang dalam tahap integrasi. Ke depannya, Anda bisa membayar menggunakan QRIS, GoPay, ShopeePay, Virtual Account, hingga Transfer Bank otomatis."
            },
            {
              q: "Apakah soal tryout selalu di-update?",
              a: "Tentu. Tim pengajar kami secara rutin menganalisa pola soal terbaru dari BKN dan LTMPT untuk memastikan bank soal kami selalu relevan dan up-to-date."
            },
            {
              q: "Apakah skor Simulasi CAT saya bisa dilihat orang lain?",
              a: "Skor Anda akan muncul di fitur Peringkat Nasional (Leaderboard) jika masuk Top 100 untuk memacu jiwa kompetitif. Namun data pribadi seperti Email atau Nomor HP tetap aman dan rahasia."
            }
          ].map((faq, i) => (
            <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900">
                <h2 className="font-semibold text-lg">{faq.q}</h2>
                <span className="relative size-5 shrink-0">
                  <svg className="absolute inset-0 size-5 opacity-100 group-open:opacity-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg className="absolute inset-0 size-5 opacity-0 group-open:opacity-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
