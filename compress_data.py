import json, gzip, base64, sys
# Read segments from stdin (one per line), then compress
lines = [l.rstrip('\n') for l in sys.stdin]
data = json.dumps({"segments": lines}, ensure_ascii=False)
compressed = base64.b64encode(gzip.compress(data.encode('utf-8'))).decode('utf-8')
with open("compressed_data.txt", "w", encoding="utf-8") as f:
    f.write(compressed)
print(f"Compressed {len(lines)} segments to {len(compressed)} chars")
