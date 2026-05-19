import json, re, os
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

# ── 1. Load segments from the JSON file ──
with open("data.json", "r", encoding="utf-8") as f:
    raw = json.load(f)

segments = raw["segments"]
full_text = " ".join(segments)

# ── 2. Split into sections ──
sections_raw = re.split(r"Soal dan Pembahasan FR\s+", full_text)
# sections_raw[0] is the header "SOAL FR CPNS ... by Fannyaspill"
# sections_raw[1] = TWK, sections_raw[2] = TIU, sections_raw[3] = TKP

section_names = []
section_texts = []
for s in sections_raw:
    s = s.strip()
    if not s:
        continue
    # Detect section name from start
    if s.startswith("TWK") or "TWK" in s[:20]:
        section_names.append("TWK")
        section_texts.append(s[3:].strip() if s.startswith("TWK") else s)
    elif s.startswith("TIU") or "TIU" in s[:20]:
        section_names.append("TIU")
        section_texts.append(s[3:].strip() if s.startswith("TIU") else s)
    elif s.startswith("TKP") or "TKP" in s[:20]:
        section_names.append("TKP")
        section_texts.append(s[3:].strip() if s.startswith("TKP") else s)
    else:
        # Check for any section keyword
        twk_m = re.search(r'TWK', s[:50])
        tiu_m = re.search(r'TIU', s[:50])
        tkp_m = re.search(r'TKP', s[:50])
        if twk_m and not tiu_m and not tkp_m:
            section_names.append("TWK")
            section_texts.append(s)
        elif tiu_m:
            section_names.append("TIU")
            section_texts.append(s)
        elif tkp_m:
            section_names.append("TKP")
            section_texts.append(s)

print(f"Found sections: {section_names}")
for i, (name, text) in enumerate(zip(section_names, section_texts)):
    print(f"  {i+1}. {name}: {len(text)} chars")

# ── 3. Parse questions from a section ──
def parse_questions(text):
    """Parse questions from a section text. Returns list of dicts."""
    questions = []
    
    # Pattern: question number followed by text, then options a)-e), then optional Pembahasan
    # Split by question numbers like "1.", "2.", etc.
    q_blocks = re.split(r'(?<!\d)(\d+)\.(?!\d)', text)
    
    # q_blocks alternates between: [before, num, after, num, after, ...]
    # We need to rebuild: num + after
    combined = []
    i = 1
    while i < len(q_blocks):
        num = q_blocks[i]
        after = q_blocks[i+1] if i+1 < len(q_blocks) else ""
        combined.append((int(num), after.strip()))
        i += 2
    
    for qnum, qtext in combined:
        question_data = {"nomor": qnum, "soal": "", "opsi": {}, "jawaban": "", "pembahasan": ""}
        
        # Split by option patterns a), b), c), d), e)
        opt_pattern = re.split(r'\b(a\)|b\)|c\)|d\)|e\))\s*', qtext)
        
        if len(opt_pattern) < 3:
            # No options found, it's probably a sub-section header
            question_data["soal"] = qtext
            questions.append(question_data)
            continue
        
        # opt_pattern: [before_a, "a)", text_a, "b)", text_b, "c)", text_c, "d)", text_d, "e)", text_e_rest]
        # The first element is the question text (before first option)
        question_data["soal"] = opt_pattern[0].strip()
        
        # Extract options and pembahasan
        opt_labels = []
        opt_texts = []
        for j in range(1, len(opt_pattern), 2):
            label = opt_pattern[j].rstrip(')')
            content = opt_pattern[j+1] if j+1 < len(opt_pattern) else ""
            opt_labels.append(label)
            opt_texts.append(content)
        
        # Separate pembahasan from last option
        last_opt = opt_texts[-1] if opt_texts else ""
        if "pembahasan" in last_opt.lower():
            parts = re.split(r'Pembahasan\s*', last_opt, flags=re.IGNORECASE)
            opt_texts[-1] = parts[0].strip()
            question_data["pembahasan"] = " ".join(parts[1:]).strip() if len(parts) > 1 else ""
        
        for label, content in zip(opt_labels, opt_texts):
            question_data["opsi"][label.upper()] = content.strip()
        
        # Try to extract answer from pembahasan
        pemb = question_data["pembahasan"]
        if pemb:
            # Look for patterns like "opsi A", "opsi B", "opsi C", "opsi D", "opsi E"
            ans_match = re.search(r'opsi\s+([A-Ea-e])', pemb)
            if ans_match:
                question_data["jawaban"] = ans_match.group(1).upper()
            else:
                # Look for "adalah opsi C", "adalah C", "jawaban C", "tepat adalah C"
                ans_match = re.search(r'(?:adalah|jawaban|tepat|benar|jawaban\s+(?:yang\s+)?tepat|jawaban\s+(?:yang\s+)?benar)\s+(?:opsi\s+)?([A-Ea-e])', pemb)
                if ans_match:
                    question_data["jawaban"] = ans_match.group(1).upper()
                else:
                    # Look for option letter near "tepat", "benar", "jawaban"
                    ans_match = re.search(r'(?:pilihan|opsi|jawaban)\s+(?:yang\s+)?(?:paling\s+)?(?:tepat|benar)\s+(?:adalah\s+)?(?:opsi\s+)?([A-Ea-e])', pemb)
                    if ans_match:
                        question_data["jawaban"] = ans_match.group(1).upper()
        
        questions.append(question_data)
    
    return questions

# ── 4. Parse TKP questions (with point values) ──
def parse_tkp_questions(text):
    """Parse TKP questions - answer is option with highest point value."""
    questions = []
    
    q_blocks = re.split(r'(?<!\d)(\d+)\.(?!\d)', text)
    combined = []
    i = 1
    while i < len(q_blocks):
        num = q_blocks[i]
        after = q_blocks[i+1] if i+1 < len(q_blocks) else ""
        combined.append((int(num), after.strip()))
        i += 2
    
    for qnum, qtext in combined:
        question_data = {"nomor": qnum, "soal": "", "opsi": {}, "jawaban": "", "pembahasan": ""}
        
        opt_pattern = re.split(r'\b(a\)|b\)|c\)|d\)|e\))\s*', qtext)
        
        if len(opt_pattern) < 3:
            question_data["soal"] = qtext
            questions.append(question_data)
            continue
        
        question_data["soal"] = opt_pattern[0].strip()
        
        opt_labels = []
        opt_texts = []
        for j in range(1, len(opt_pattern), 2):
            label = opt_pattern[j].rstrip(')')
            content = opt_pattern[j+1] if j+1 < len(opt_pattern) else ""
            opt_labels.append(label)
            opt_texts.append(content)
        
        max_points = 0
        best_opt = ""
        
        for label, content in zip(opt_labels, opt_texts):
            # Extract point value: (5 Point), (4 Point), etc.
            pt_match = re.search(r'\((\d+)\s*Point\)', content)
            points = int(pt_match.group(1)) if pt_match else 0
            
            # Clean option text: remove the point annotation
            clean_text = re.sub(r'\s*\(\d+\s*Point\)', '', content).strip()
            question_data["opsi"][label.upper()] = clean_text
            
            if points > max_points:
                max_points = points
                best_opt = label.upper()
        
        question_data["jawaban"] = best_opt
        question_data["pembahasan"] = f"Jawaban dengan poin tertinggi ({max_points} Point) pada opsi {best_opt}"
        
        questions.append(question_data)
    
    return questions

# ── 5. Process all sections ──
all_data = {}
for name, text in zip(section_names, section_texts):
    if name == "TKP":
        all_data[name] = parse_tkp_questions(text)
    else:
        all_data[name] = parse_questions(text)
    print(f"\n{name}: {len(all_data[name])} questions parsed")

# ── 6. Write to Excel ──
wb = Workbook()
header_font = Font(bold=True, color="FFFFFF", size=11)
header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
header_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
cell_align = Alignment(vertical="top", wrap_text=True)
thin_border = Border(
    left=Side(style='thin'),
    right=Side(style='thin'),
    top=Side(style='thin'),
    bottom=Side(style='thin')
)

first_sheet = True
for section_name in ["TWK", "TIU", "TKP"]:
    if section_name not in all_data:
        continue
    
    ws = wb.create_sheet(title=f"FR {section_name}") if not first_sheet else wb.active
    if first_sheet:
        ws.title = f"FR {section_name}"
        first_sheet = False
    
    # Headers
    headers = ["No", "Soal/Pertanyaan", "Opsi A", "Opsi B", "Opsi C", "Opsi D", "Opsi E", "Jawaban", "Pembahasan"]
    for col, h in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_align
        cell.border = thin_border
    
    # Data
    for row_idx, q in enumerate(all_data[section_name], 2):
        ws.cell(row=row_idx, column=1, value=q["nomor"]).alignment = Alignment(horizontal="center", vertical="top")
        ws.cell(row=row_idx, column=2, value=q["soal"]).alignment = cell_align
        ws.cell(row=row_idx, column=3, value=q["opsi"].get("A", "")).alignment = cell_align
        ws.cell(row=row_idx, column=4, value=q["opsi"].get("B", "")).alignment = cell_align
        ws.cell(row=row_idx, column=5, value=q["opsi"].get("C", "")).alignment = cell_align
        ws.cell(row=row_idx, column=6, value=q["opsi"].get("D", "")).alignment = cell_align
        ws.cell(row=row_idx, column=7, value=q["opsi"].get("E", "")).alignment = cell_align
        
        jawab_cell = ws.cell(row=row_idx, column=8, value=q["jawaban"])
        jawab_cell.alignment = Alignment(horizontal="center", vertical="top")
        if q["jawaban"]:
            jawab_cell.font = Font(bold=True, color="C00000")
        
        ws.cell(row=row_idx, column=9, value=q["pembahasan"]).alignment = cell_align
        
        # Add borders
        for col in range(1, 10):
            ws.cell(row=row_idx, column=col).border = thin_border
    
    # Column widths
    ws.column_dimensions['A'].width = 6
    ws.column_dimensions['B'].width = 60
    ws.column_dimensions['C'].width = 35
    ws.column_dimensions['D'].width = 35
    ws.column_dimensions['E'].width = 35
    ws.column_dimensions['F'].width = 35
    ws.column_dimensions['G'].width = 35
    ws.column_dimensions['H'].width = 12
    ws.column_dimensions['I'].width = 60

output_path = "FR_CPNS_SKD_2024.xlsx"
wb.save(output_path)
print(f"\nExcel saved to: {output_path}")
print("Done!")
