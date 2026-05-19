import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";

export async function GET() {
  const headerTexts = [
    "No", "Pertanyaan", "Opsi A", "Opsi B", "Opsi C", "Opsi D", "Opsi E",
    "Jawaban", "Pembahasan", "Tipe", "Poin A", "Poin B", "Poin C", "Poin D", "Poin E"
  ];

  const headerRow = new TableRow({
    tableHeader: true,
    children: headerTexts.map(
      (text) =>
        new TableCell({
          shading: { fill: "1a73e8", type: "clear" as const },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text, bold: true, color: "ffffff", size: 18 })],
            }),
          ],
        })
    ),
  });

  const sampleCell = (text: string) =>
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, size: 18 })] })],
    });

  const sampleRow = (vals: string[]) =>
    new TableRow({
      children: vals.map(sampleCell),
    });

  const emptyRow = () =>
    new TableRow({
      children: headerTexts.map((h) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: h === "Tipe" ? "Regular/TKP" : h === "Poin A" || h === "Poin B" || h === "Poin C" || h === "Poin D" || h === "Poin E" ? "1-5" : "", size: 18 })] })],
        })
      ),
    });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { size: 22, font: "Calibri" },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "TEMPLATE IMPORT SOAL",
                bold: true,
                size: 32,
                color: "1a73e8",
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Isi data soal pada tabel di bawah. Gambar dapat disisipkan di sel Pertanyaan.",
                size: 22,
                italics: true,
                color: "666666",
              }),
            ],
          }),
          new Paragraph({ spacing: { before: 200, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              headerRow,
              sampleRow(["1", "Apa ibu kota Indonesia?", "Jakarta", "Bandung", "Surabaya", "Medan", "", "A", "Jakarta adalah ibu kota NKRI", "Regular", "", "", "", "", ""]),
              sampleRow(["2", "Anda sedang mengerjakan proyek tim...", "Mengerjakan sendiri", "Membagi ulang pekerjaan", "Melapor ke atasan", "Meminta rekan lain", "Menunggu", "B", "Membagi tugas adalah terbaik", "TKP", "3", "5", "4", "2", "1"]),
              emptyRow(),
              emptyRow(),
            ],
          }),
          new Paragraph({ spacing: { before: 400, after: 100 } }),
          new Paragraph({
            children: [new TextRun({ text: "Petunjuk:", bold: true, size: 22 })],
          }),
          new Paragraph({ children: [new TextRun({ text: "1. Kolom No diisi nomor urut soal (otomatis saat import)", size: 22 })] }),
          new Paragraph({ children: [new TextRun({ text: "2. Kolom Pertanyaan bisa berisi teks dan gambar", size: 22 })] }),
          new Paragraph({ children: [new TextRun({ text: "3. Kolom Opsi A, B, C, D wajib diisi. Opsi E opsional", size: 22 })] }),
          new Paragraph({ children: [new TextRun({ text: "4. Kolom Jawaban diisi huruf: A, B, C, D, atau E", size: 22 })] }),
          new Paragraph({ children: [new TextRun({ text: "5. Kolom Tipe: isi 'Regular' untuk soal biasa, 'TKP' untuk soal TKP", size: 22 })] }),
          new Paragraph({ children: [new TextRun({ text: "6. Kolom Poin A-E: diisi angka 1-5 untuk soal TKP (kosongkan untuk Regular)", size: 22 })] }),
          new Paragraph({ children: [new TextRun({ text: "7. Kolom Pembahasan opsional, bisa dikosongkan", size: 22 })] }),
          new Paragraph({ children: [new TextRun({ text: "8. Hapus baris contoh sebelum mengisi soal sendiri", size: 22 })] }),
        ],
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  const uint8 = new Uint8Array(buf);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="template-soal.docx"',
    },
  });
}
