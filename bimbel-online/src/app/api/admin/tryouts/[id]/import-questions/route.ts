import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

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
    const wb = XLSX.read(bytes, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });

    if (data.length < 2) {
      return NextResponse.json({ error: "File kosong atau tidak valid" }, { status: 400 });
    }

    const rows = data.slice(1).filter((row: any[]) => row[0] && row[0].toString().trim());
    let success = 0;
    let errors: string[] = [];
    const tryoutId = params.id;

    const maxOrder = await prisma.question.count({ where: { tryoutId } });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const question = row[0]?.toString().trim();
      const optionA = row[1]?.toString().trim();
      const optionB = row[2]?.toString().trim();
      const optionC = row[3]?.toString().trim();
      const optionD = row[4]?.toString().trim();
      const optionE = row[5]?.toString().trim() || null;
      const answer = row[6]?.toString().trim().toUpperCase();
      const explanation = row[7]?.toString().trim() || null;
      const tipe = row[8]?.toString().trim().toLowerCase() || "regular";
      const poinA = row[9]?.toString().trim();
      const poinB = row[10]?.toString().trim();
      const poinC = row[11]?.toString().trim();
      const poinD = row[12]?.toString().trim();
      const poinE = row[13]?.toString().trim();

      if (!question || !optionA || !optionB || !optionC || !optionD || !answer) {
        errors.push(`Baris ${i + 2}: data tidak lengkap`);
        continue;
      }

      if (!["A", "B", "C", "D", "E"].includes(answer)) {
        errors.push(`Baris ${i + 2}: jawaban harus A, B, C, D, atau E`);
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
            optionE,
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
      message: `Berhasil import ${success} soal${errors.length > 0 ? `, ${errors.length} gagal` : ""}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Gagal memproses file: ${err.message || "format tidak valid"}` }, { status: 500 });
  }
}
