import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const wb = XLSX.utils.book_new();

  const headers = [
    ["Pertanyaan", "Opsi A", "Opsi B", "Opsi C", "Opsi D", "Opsi E", "Jawaban", "Pembahasan", "Tipe", "Poin A", "Poin B", "Poin C", "Poin D", "Poin E"],
    [
      "Apa ibu kota Indonesia?",
      "Jakarta",
      "Bandung",
      "Surabaya",
      "Medan",
      "",
      "A",
      "Jakarta adalah ibu kota Indonesia",
      "Regular",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "Siapa presiden pertama RI?",
      "Soeharto",
      "Soekarno",
      "Habibie",
      "Gus Dur",
      "Megawati",
      "B",
      "Soekarno adalah presiden pertama RI",
      "Regular",
      "",
      "",
      "",
      "",
      "",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(headers);

  ws["!cols"] = [
    { wch: 50 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 10 },
    { wch: 50 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Soal");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="template-soal.xlsx"',
    },
  });
}
