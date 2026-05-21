"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    // Tampilkan tombol WA setelah 2 detik untuk animasi yang halus
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Tampilkan tooltip secara bergantian untuk menarik perhatian
    const tooltipTimer = setInterval(() => {
      setIsTooltipVisible((prev) => !prev);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(tooltipTimer);
    };
  }, []);

  if (!isVisible) return null;

  // Ganti nomor ini dengan nomor Admin sungguhan
  const waNumber = "6281234567890"; 
  const waMessage = encodeURIComponent("Halo Admin BimbelKu, saya ingin bertanya tentang paket langganan.");
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip Chat Bubble */}
      <div 
        className={`bg-white text-gray-800 text-sm py-2 px-4 rounded-xl shadow-lg border border-gray-100 transition-all duration-500 origin-bottom-right transform ${
          isTooltipVisible ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-4"
        }`}
      >
        <p className="font-semibold text-blue-700 mb-1">Butuh Bantuan?</p>
        <p>Tanya admin lewat WhatsApp</p>
        {/* Segitiga panah chat bubble */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
      </div>

      {/* Floating Button */}
      <Link 
        href={waLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
        onMouseEnter={() => setIsTooltipVisible(true)}
      >
        <svg viewBox="0 0 32 32" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.027 1.054c-8.156 0-14.792 6.637-14.792 14.793 0 2.61.68 5.158 1.97 7.414l-2.095 7.643 7.822-2.052a14.745 14.745 0 007.095 1.815h.005c8.155 0 14.792-6.639 14.792-14.793 0-3.95-1.539-7.665-4.331-10.457-2.793-2.793-6.508-4.331-10.461-4.331v-.031l-.005-.001zm0 24.966c-2.215 0-4.39-.595-6.295-1.724l-.45-.268-4.675 1.226 1.248-4.56-.293-.467a12.288 12.288 0 01-1.879-6.602c0-6.793 5.53-12.325 12.326-12.325 3.292 0 6.386 1.282 8.713 3.61a12.274 12.274 0 013.612 8.711c-.001 6.794-5.53 12.328-12.307 12.328v.071zm6.753-9.231c-.37-.184-2.189-1.079-2.528-1.203-.339-.122-.586-.184-.832.185-.246.368-.956 1.202-1.171 1.448-.216.246-.431.276-.8.093-.37-.184-1.562-.576-2.977-1.839-1.1-1.01-1.841-2.257-2.057-2.626-.216-.37-.023-.57.162-.754.166-.166.37-.43.555-.645.185-.215.246-.369.37-.614.122-.246.061-.461-.031-.645-.093-.185-.832-2.008-1.14-2.748-.3-.718-.606-.62-.832-.631-.215-.011-.461-.011-.708-.011s-.647.092-.986.461c-.339.369-1.294 1.261-1.294 3.076s1.325 3.567 1.509 3.813c.185.246 2.602 3.971 6.301 5.568 2.656 1.146 3.655 1.246 4.975 1.047 1.107-.168 3.39-1.385 3.868-2.723.477-1.339.477-2.485.339-2.731-.14-.246-.51-.385-.88-.569z" />
        </svg>
      </Link>
    </div>
  );
}
