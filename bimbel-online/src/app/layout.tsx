import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BimbelKu - Platform Belajar CPNS & UTBK No.1",
  description: "Lulus impianmu bersama BimbelKu! Fitur simulasi CAT standar BKN, Tryout UTBK komprehensif, dan ribuan soal dengan pembahasan lengkap.",
  keywords: "bimbel online, tryout cpns, simulasi cat bkn, tryout utbk, snbt, bimbel kedinasan",
  openGraph: {
    title: "BimbelKu - Platform Belajar CPNS & UTBK No.1",
    description: "Lulus impianmu bersama BimbelKu! Fitur simulasi CAT standar BKN, Tryout UTBK komprehensif.",
    url: "https://bimbelku.id",
    siteName: "BimbelKu",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
