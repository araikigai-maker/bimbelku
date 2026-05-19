import json, re, os, pickle
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

# Read all segment files
all_segments = []
for fname in sorted(os.listdir('.')):
    if fname.startswith('segments_') and fname.endswith('.pkl'):
        with open(fname,'rb') as f:
            all_segments.extend(pickle.load(f))

full_text = ' '.join(all_segments)
print(f'Total segments: {len(all_segments)}, text length: {len(full_text)}')

def parse_questions(text):
    questions = []
    q_blocks = re.split(r'(?<!\d)(\d+)\.(?!\d)', text)
    combined = []
    i = 1
    while i < len(q_blocks):
        num = q_blocks[i]
        after = q_blocks[i+1] if i+1 < len(q_blocks) else ''
        combined.append((int(num), after.strip()))
        i += 2
    for qnum, qtext in combined:
        qdata = {'nomor': qnum, 'soal': '', 'opsi': {}, 'jawaban': '', 'pembahasan': ''}
        opt_pattern = re.split(r'\b(a\)|b\)|c\)|d\)|e\))\s*', qtext)
        if len(opt_pattern) < 3:
            qdata['soal'] = qtext
            questions.append(qdata)
            continue
        qdata['soal'] = opt_pattern[0].strip()
        opt_labels, opt_texts = [], []
        for j in range(1, len(opt_pattern), 2):
            label = opt_pattern[j].rstrip(')')
            content = opt_pattern[j+1] if j+1 < len(opt_pattern) else ''
            opt_labels.append(label)
            opt_texts.append(content)
        last_opt = opt_texts[-1] if opt_texts else ''
        if 'pembahasan' in last_opt.lower():
            parts = re.split(r'Pembahasan\s*', last_opt, flags=re.IGNORECASE)
            opt_texts[-1] = parts[0].strip()
            qdata['pembahasan'] = ' '.join(parts[1:]).strip() if len(parts) > 1 else ''
        for lbl, ct in zip(opt_labels, opt_texts):
            qdata['opsi'][lbl.upper()] = ct.strip()
        pemb = qdata['pembahasan']
        if pemb:
            m = re.search(r'opsi\s+([A-Ea-e])', pemb)
            if m: qdata['jawaban'] = m.group(1).upper()
            else:
                m = re.search(r'(?:adalah|jawaban|tepat|benar)\s+(?:opsi\s+)?([A-Ea-e])', pemb)
                if m: qdata['jawaban'] = m.group(1).upper()
        questions.append(qdata)
    return questions

def parse_tkp_questions(text):
    questions = []
    q_blocks = re.split(r'(?<!\d)(\d+)\.(?!\d)', text)
    combined = []
    i = 1
    while i < len(q_blocks):
        num = q_blocks[i]
        after = q_blocks[i+1] if i+1 < len(q_blocks) else ''
        combined.append((int(num), after.strip()))
        i += 2
    for qnum, qtext in combined:
        qdata = {'nomor': qnum, 'soal': '', 'opsi': {}, 'jawaban': '', 'pembahasan': ''}
        opt_pattern = re.split(r'\b(a\)|b\)|c\)|d\)|e\))\s*', qtext)
        if len(opt_pattern) < 3:
            qdata['soal'] = qtext
            questions.append(qdata)
            continue
        qdata['soal'] = opt_pattern[0].strip()
        best_opt, max_pts = '', 0
        for j in range(1, len(opt_pattern), 2):
            label = opt_pattern[j].rstrip(')')
            content = opt_pattern[j+1] if j+1 < len(opt_pattern) else ''
            pt = re.search(r'\((\d+)\s*Point\)', content)
            pts = int(pt.group(1)) if pt else 0
            clean = re.sub(r'\s*\(\d+\s*Point\)', '', content).strip()
            qdata['opsi'][label.upper()] = clean
            if pts > max_pts:
                max_pts, best_opt = pts, label.upper()
        qdata['jawaban'] = best_opt
        qdata['pembahasan'] = f'Jawaban dengan poin tertinggi ({max_pts} Point) pada opsi {best_opt}'
        questions.append(qdata)
    return questions

# Split into sections
secs = re.split(r'Soal dan Pembahasan FR\s+', full_text)
snames, stexts = [], []
for s in secs:
    s = s.strip()
    if not s: continue
    for kw in ['TWK','TIU','TKP']:
        if kw in s[:30]:
            snames.append(kw)
            stexts.append(s)
            break

all_data = {}
for name, text in zip(snames, stexts):
    if name == 'TKP':
        all_data[name] = parse_tkp_questions(text)
    else:
        all_data[name] = parse_questions(text)
    print(f'{name}: {len(all_data[name])} questions')

# Write Excel
wb = Workbook()
hfont = Font(bold=True, color='FFFFFF', size=11)
hfill = PatternFill(start_color='4472C4', end_color='4472C4', fill_type='solid')
halign = Alignment(horizontal='center', vertical='center', wrap_text=True)
calign = Alignment(vertical='top', wrap_text=True)
border = Border(left=Side(style='thin'),right=Side(style='thin'),top=Side(style='thin'),bottom=Side(style='thin'))

first = True
for sec in ['TWK','TIU','TKP']:
    if sec not in all_data: continue
    ws = wb.create_sheet(title=f'FR {sec}') if not first else wb.active
    if first:
        ws.title = f'FR {sec}'
        first = False
    headers = ['No','Soal/Pertanyaan','Opsi A','Opsi B','Opsi C','Opsi D','Opsi E','Jawaban','Pembahasan']
    for col, h in enumerate(headers, 1):
        c = ws.cell(row=1, column=col, value=h)
        c.font, c.fill, c.alignment, c.border = hfont, hfill, halign, border
    for ri, q in enumerate(all_data[sec], 2):
        ws.cell(row=ri, column=1, value=q['nomor']).alignment = Alignment(horizontal='center', vertical='top')
        ws.cell(row=ri, column=2, value=q['soal']).alignment = calign
        for optl in ['A','B','C','D','E']:
            ws.cell(row=ri, column=3+ord(optl)-ord('A'), value=q['opsi'].get(optl,'')).alignment = calign
        jc = ws.cell(row=ri, column=8, value=q['jawaban'])
        jc.alignment = Alignment(horizontal='center', vertical='top')
        if q['jawaban']: jc.font = Font(bold=True, color='C00000')
        ws.cell(row=ri, column=9, value=q['pembahasan']).alignment = calign
        for col in range(1,10):
            ws.cell(row=ri, column=col).border = border
    ws.column_dimensions['A'].width = 6
    ws.column_dimensions['B'].width = 60
    for col in 'CDEFG': ws.column_dimensions[col].width = 35
    ws.column_dimensions['H'].width = 12
    ws.column_dimensions['I'].width = 60

wb.save('FR_CPNS_SKD_2024.xlsx')
print('Done! Excel saved to FR_CPNS_SKD_2024.xlsx')