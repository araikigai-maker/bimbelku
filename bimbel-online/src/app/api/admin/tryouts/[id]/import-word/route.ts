import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";

// Simple uuid for unique filenames
function simpleId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "questions");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const savedImages: Record<string, string> = {};

    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          const ext = image.contentType?.split("/")[1] || "png";
          const filename = `qimg_${simpleId()}.${ext}`;
          const filepath = path.join(uploadsDir, filename);

          const imageBuffer = await image.read();
          fs.writeFileSync(filepath, imageBuffer);

          const imgUrl = `/uploads/questions/${filename}`;

          savedImages[filename] = imgUrl;

          return { src: imgUrl };
        }),
      }
    );

    const html = result.value;
    const warnings = result.messages;

    // Parse HTML table
    const tableRegex = /<table[\s\S]*?<\/table>/i;
    const tableMatch = html.match(tableRegex);

    if (!tableMatch) {
      return NextResponse.json({ error: "Tidak ditemukan tabel dalam dokumen. Gunakan template yang disediakan." }, { status: 400 });
    }

    const tableHtml = tableMatch[0];

    // Extract rows from table
    const rowRegex = /<tr>[\s\S]*?<\/tr>/gi;
    const rows = tableHtml.match(rowRegex);

    if (!rows || rows.length < 2) {
      return NextResponse.json({ error: "Tabel harus memiliki header dan minimal 1 baris data" }, { status: 400 });
    }

    // Skip header row (index 0)
    const dataRows = rows.slice(1);
    let success = 0;
    let errors: string[] = [];
    const tryoutId = params.id;
    const maxOrder = await prisma.question.count({ where: { tryoutId } });

    for (let i = 0; i < dataRows.length; i++) {
      const cellRegex = /<td>[\s\S]*?<\/td>/gi;
      const cells = dataRows[i].match(cellRegex);

      if (!cells || cells.length < 5) {
        errors.push(`Baris ${i + 2}: format tidak valid`);
        continue;
      }

      const cleanCell = (html: string) => {
        return html
          .replace(/<\/?[^>]+(>|$)/g, "")
          .trim()
          .replace(/\s+/g, " ");
      };

      const rawCell = (html: string) => {
        // Keep img tags for display, but extract text content
        return html.replace(/<\/?td>/g, "").trim();
      };

      // Column mapping: No(0), Pertanyaan(1), OpsiA(2), OpsiB(3), OpsiC(4), OpsiD(5), OpsiE(6), Jawaban(7), Pembahasan(8), Tipe(9), PoinA(10), PoinB(11), PoinC(12), PoinD(13), PoinE(14)
      const no = cleanCell(cells[0]);
      const question = rawCell(cells[1] || "");
      const optionA = cleanCell(cells[2] || "");
      const optionB = cleanCell(cells[3] || "");
      const optionC = cleanCell(cells[4] || "");
      const optionD = cleanCell(cells[5] || "");
      const optionE = cleanCell(cells[6] || "");
      const answer = cleanCell(cells[7] || "").toUpperCase();
      const explanation = cleanCell(cells[8] || "") || null;
      const tipe = cleanCell(cells[9] || "").toLowerCase() || "regular";
      const poinA = cleanCell(cells[10] || "");
      const poinB = cleanCell(cells[11] || "");
      const poinC = cleanCell(cells[12] || "");
      const poinD = cleanCell(cells[13] || "");
      const poinE = cleanCell(cells[14] || "");

      if (!question || question === "Pertanyaan") continue;
      if (!optionA || !optionB || !optionC || !optionD) {
        errors.push(`Baris ${i + 2}: opsi A, B, C, D wajib diisi`);
        continue;
      }
      if (!["A", "B", "C", "D", "E"].includes(answer)) {
        errors.push(`Baris ${i + 2}: jawaban harus A/B/C/D/E`);
        continue;
      }
      if (tipe !== "regular" && tipe !== "tkp") {
        errors.push(`Baris ${i + 2}: Tipe harus Regular atau TKP`);
        continue;
      }

      let optionPoints = "{}";
      if (tipe === "tkp") {
        const pts: Record<string, number> = {};
        const pairs = [
          ["A", poinA], ["B", poinB], ["C", poinC], ["D", poinD], ["E", poinE],
        ];
        for (const [key, val] of pairs) {
          const n = parseInt(val || "0");
          if (n < 1 || n > 5) {
            errors.push(`Baris ${i + 2}: Poin ${key} harus angka 1-5 untuk soal TKP`);
            continue;
          }
          pts[key] = n;
        }
        optionPoints = JSON.stringify(pts);
      }

      await prisma.question.create({
        data: {
          tryoutId,
          question,
          optionA,
          optionB,
          optionC,
          optionD,
          optionE: optionE || null,
          answer,
          explanation,
          questionType: tipe === "tkp" ? "tkp" : "regular",
          optionPoints,
          order: maxOrder + success + 1,
        },
      });
      success++;
    }

    await prisma.tryout.update({
      where: { id: tryoutId },
      data: { questionCount: { increment: success } },
    });

    const imageCount = Object.keys(savedImages).length;

    return NextResponse.json({
      success,
      errors,
      images: imageCount,
      warnings: warnings.slice(0, 5),
      message: `Berhasil import ${success} soal${imageCount > 0 ? ` (${imageCount} gambar)` : ""}${errors.length > 0 ? `, ${errors.length} gagal` : ""}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Gagal memproses file: ${err.message || "format tidak valid"}` },
      { status: 500 }
    );
  }
}
