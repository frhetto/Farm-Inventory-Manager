import html
import re
import glob

def parse_flows(mermaid_text):
    flows = []
    for line in mermaid_text.split('\n'):
        line = line.strip()
        m = re.search(r'([A-Za-z0-9_]+)\s*-->\|(?:\"|\&quot;)?(.*?)(?:\"|\&quot;)?\|\s*([A-Za-z0-9_]+)', line)
        if m:
            src, label, dst = m.groups()
            label = html.unescape(label).strip()
            # clean up <br/> or \n
            raw_items = [l.strip() for l in re.split(r'<br\s*/?>|\n', label) if l.strip()]
            clean_items = []
            for item in raw_items:
                # strip leading "1: ", "2: ", etc. if present
                cleaned = re.sub(r'^\d+\s*:\s*', '', item).strip()
                cleaned = cleaned.strip('"').strip("'")
                clean_items.append(cleaned)
            flows.append((src, clean_items, dst))
    return flows

def get_mermaid(svg_path):
    with open(svg_path, 'r', encoding='utf-8') as f:
        s = f.read()
    idx1 = s.find('flowchart')
    if idx1 == -1: return None
    idx2 = s.find('&quot;', idx1)
    if idx2 == -1: idx2 = s.find('"', idx1)
    return html.unescape(html.unescape(s[idx1:idx2]))

c_flows = parse_flows(get_mermaid('diagrams/ContextDFD.svg'))
l0_flows = parse_flows(get_mermaid('diagrams/lvl0.drawio.svg'))

print('========================================')
print('1. CONTEXT DFD vs LEVEL 0 DFD (EXTERNAL ENTITIES)')
print('========================================')

# Group context flows by (Entity, direction)
# direction: 'in' = Entity -> System, 'out' = System -> Entity
c_grouped = {}
for src, items, dst in c_flows:
    if src.startswith('E_'):
        key = (src, 'in')
    else:
        key = (dst, 'out')
    c_grouped.setdefault(key, []).extend(items)

# Group lvl0 flows by (Entity, direction)
l0_grouped = {}
for src, items, dst in l0_flows:
    if src.startswith('E_'):
        key = (src, 'in')
        l0_grouped.setdefault(key, []).extend(items)
    elif dst.startswith('E_'):
        key = (dst, 'out')
        l0_grouped.setdefault(key, []).extend(items)

all_keys = sorted(set(list(c_grouped.keys()) + list(l0_grouped.keys())))
for ent, direction in all_keys:
    c_list = sorted(c_grouped.get((ent, direction), []))
    l0_list = sorted(l0_grouped.get((ent, direction), []))
    match = (c_list == l0_list)
    status = 'MATCH' if match else 'MISMATCH'
    print(f'[{status}] {ent} ({direction.upper()}):')
    print(f'   Context ({len(c_list)}): {c_list}')
    print(f'   Level 0 ({len(l0_list)}): {l0_list}')
    if not match:
        diff_c = set(c_list) - set(l0_list)
        diff_l0 = set(l0_list) - set(c_list)
        if diff_c: print(f'      In Context but NOT Level 0: {diff_c}')
        if diff_l0: print(f'      In Level 0 but NOT Context: {diff_l0}')

print('\n========================================')
print('2. LEVEL 0 DFD vs LEVEL 1 DFDs')
print('========================================')

lvl1_files = {
    'P1': 'diagrams/lvl1/level1process1.0.svg',
    'P2': 'diagrams/lvl1/lvl1process2.0.svg',
    'P3': 'diagrams/lvl1/lvl1process3.0.svg',
    'P4': 'diagrams/lvl1/lvl1process4.0.svg',
    'P5': 'diagrams/lvl1/lvl1process5.0.svg',
    'P6': 'diagrams/lvl1/lvl1process6.0.svg',
}

for pid, fpath in lvl1_files.items():
    print(f'\n--- Checking Process {pid} vs {fpath} ---')
    # Get flows in Level 0 for this process
    l0_p_in = []
    l0_p_out = []
    for src, items, dst in l0_flows:
        if dst == pid:
            for it in items: l0_p_in.append((src, it))
        if src == pid:
            for it in items: l0_p_out.append((dst, it))
    
    # Get flows in Level 1 for this process
    l1_mermaid = get_mermaid(fpath)
    l1_flows = parse_flows(l1_mermaid) if l1_mermaid else []
    
    # Boundary flows in Level 1 are those connected to an external entity, external process, or data store outside
    # Let's list all flows in Level 1 that involve E_* or external processes (like P4, P10_Ref, P2_Ref)
    l1_boundary_in = []
    l1_boundary_out = []
    for src, items, dst in l1_flows:
        # If src is external (starts with E_ or ends with Ref or is P4 when pid!=P4)
        if src.startswith('E_') or src in ['P4', 'P2_Ref', 'P10_Ref']:
            for it in items: l1_boundary_in.append((src, it, dst))
        # If dst is external
        if dst.startswith('E_') or dst in ['P4', 'P2_Ref', 'P10_Ref']:
            for it in items: l1_boundary_out.append((src, it, dst))
        # What about data stores?
        # In Level 0, pid connects to stores D*
        # In Level 1, sub-processes connect to stores D*
        
    print(f'Level 0 Inputs to {pid} ({len(l0_p_in)}):', l0_p_in)
    print(f'Level 1 Inputs from External ({len(l1_boundary_in)}):', [(s, it) for s, it, d in l1_boundary_in])
    print(f'Level 0 Outputs from {pid} ({len(l0_p_out)}):', l0_p_out)
    print(f'Level 1 Outputs to External ({len(l1_boundary_out)}):', [(d, it) for s, it, d in l1_boundary_out])

