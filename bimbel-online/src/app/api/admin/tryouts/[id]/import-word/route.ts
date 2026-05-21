import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

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

    // Track embedded images
    let imageCount = 0;

    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          imageCount++;
          const imageBuffer = await image.read();
          const base64 = imageBuffer.toString("base64");
          const mimeType = image.contentType || "image/png";
          const dataUri = `data:${mimeType};base64,${base64}`;
          return { src: dataUri };
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
        // Keep img and other tags for display
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
      const explanation = rawCell(cells[8] || "") || null;
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

      try {
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
      } catch (err) {
        errors.push(`Baris ${i + 2}: Gagal menyimpan ke database`);
      }
    }

    await prisma.tryout.update({
      where: { id: tryoutId },
      data: { questionCount: { increment: success } },
    });

    return NextResponse.json({
      success,
      errors,
      images: imageCount,
      warnings: warnings.slice(0, 5),
      message: `Berhasil import ${success} soal${imageCount > 0 ? ` dengan ${imageCount} gambar` : ""}${errors.length > 0 ? `, ${errors.length} gagal` : ""}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Gagal memproses file: ${err.message || "format tidak valid"}` },
      { status: 500 }
    );
  }
}
