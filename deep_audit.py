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

def parse_flows(mermaid_text):
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
            flows.append((src, clean_items, dst))
    return flows

# Parse all 6 Level 1 diagrams
l1_data = {}
for p in ['1.0', '2.0', '3.0', '4.0', '5.0', '6.0']:
    fname = f'diagrams/lvl1/level1process{p}.svg' if p == '1.0' else f'diagrams/lvl1/lvl1process{p}.svg'
    m = get_mermaid(fname)
    l1_data[p] = parse_flows(m)

l0_flows = parse_flows(get_mermaid('diagrams/lvl0.drawio.svg'))
c_flows = parse_flows(get_mermaid('diagrams/ContextDFD.svg'))

print('=====================================================')
print('DETAILED LEVEL 1 FLOWS PER PROCESS (BOUNDARY & STORES)')
print('=====================================================')

for p, flows in l1_data.items():
    print(f'\n*** PROCESS {p} in LEVEL 1 ***')
    # Separate into:
    # 1. External Entity flows
    # 2. External Process flows
    # 3. Data Store flows (D1..D8)
    # 4. Internal Subprocess-to-Subprocess flows
    ext_in = []
    ext_out = []
    store_writes = {}
    store_reads = {}
    internal = []
    
    for src, items, dst in flows:
        # Check if src is entity or external process
        if src.startswith('E_') or src in ['P4', 'P2_Ref', 'P10_Ref']:
            ext_in.append((src, items, dst))
        elif dst.startswith('E_') or dst in ['P4', 'P2_Ref', 'P10_Ref']:
            ext_out.append((src, items, dst))
        elif src.startswith('D'):
            store_reads.setdefault(src, []).extend(items)
        elif dst.startswith('D'):
            store_writes.setdefault(dst, []).extend(items)
        else:
            internal.append((src, items, dst))
            
    print(f'External Inputs ({len(ext_in)}):')
    for s, it, d in ext_in: print(f'   {s} --> {d}: {it}')
    print(f'External Outputs ({len(ext_out)}):')
    for s, it, d in ext_out: print(f'   {s} --> {d}: {it}')
    print(f'Data Store Writes:')
    for st, it in store_writes.items(): print(f'   --> {st} ({len(it)}): {it}')
    print(f'Data Store Reads:')
    for st, it in store_reads.items(): print(f'   {st} --> ({len(it)}): {it}')
    print(f'Internal Sub-process flows ({len(internal)}):')
    for s, it, d in internal: print(f'   {s} --> {d}: {it}')

