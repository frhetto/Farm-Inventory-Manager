import html
import re

def get_mermaid(svg_path):
    with open(svg_path, 'r', encoding='utf-8') as f:
        s = f.read()
    idx1 = s.find('flowchart')
    if idx1 == -1: return ""
    idx2 = s.find('&quot;', idx1)
    if idx2 == -1: idx2 = s.find('"', idx1)
    return html.unescape(html.unescape(s[idx1:idx2])).replace('\\n', '\n')

def parse_raw_flows(mermaid_text):
    flows = []
    for line in mermaid_text.split('\n'):
        line = line.strip()
        m = re.search(r'([A-Za-z0-9_]+)\s*-->\|(?:\"|\&quot;)?(.*?)(?:\"|\&quot;)?\|\s*([A-Za-z0-9_]+)', line)
        if m:
            src, label, dst = m.groups()
            label = html.unescape(label).strip()
            raw_items = [l.strip() for l in re.split(r'<br\s*/?>|\n', label) if l.strip()]
            clean_items = []
            for item in raw_items:
                cleaned = re.sub(r'^\d+\s*:\s*', '', item).strip()
                cleaned = cleaned.strip('"').strip("'")
                clean_items.append(cleaned)
            flows.append((src, label, clean_items, dst))
    return flows

# Level 0
l0_raw = parse_raw_flows(get_mermaid('diagrams/lvl0.drawio.svg'))
# Context
ctx_raw = parse_raw_flows(get_mermaid('diagrams/ContextDFD.svg'))

# All 6 Level 1s
l1_data = {}
for p in ['1.0', '2.0', '3.0', '4.0', '5.0', '6.0']:
    fname = f'diagrams/lvl1/level1process{p}.svg' if p == '1.0' else f'diagrams/lvl1/lvl1process{p}.svg'
    l1_data[p] = parse_raw_flows(get_mermaid(fname))

print("==================================================")
print("LEVEL 0 FLOWS CONNECTED TO PROCESS 1.0 - 6.0:")
print("==================================================")
for p_num in ['1', '2', '3', '4', '5', '6']:
    p_id = f'P{p_num}'
    print(f"\n--- LEVEL 0 for {p_id} ---")
    in_flows = [f for f in l0_raw if f[3] == p_id]
    out_flows = [f for f in l0_raw if f[0] == p_id]
    print(f"Inputs into {p_id}:")
    for src, lbl, items, dst in in_flows:
        print(f"  {src} -> {p_id} ({len(items)} items): {items}")
    print(f"Outputs from {p_id}:")
    for src, lbl, items, dst in out_flows:
        print(f"  {p_id} -> {dst} ({len(items)} items): {items}")

