import html
import re

def parse_flows_from_mermaid(mermaid_text):
    flows = []
    # Lines like: A -->|"label"| B  or  A -->|label| B
    for line in mermaid_text.split('\n'):
        line = line.strip()
        m = re.search(r'([A-Za-z0-9_]+)\s*-->\|(?:\"|\&quot;)?(.*?)(?:\"|\&quot;)?\|\s*([A-Za-z0-9_]+)', line)
        if m:
            src, label, dst = m.groups()
            label = html.unescape(label).strip()
            # If label has <br/> or multiple numbers like 1: ...<br/>2: ...
            sublabels = [l.strip() for l in re.split(r'<br\s*/?>|\n', label) if l.strip()]
            flows.append((src, sublabels, dst))
    return flows

with open('diagrams/ContextDFD.svg', 'r', encoding='utf-8') as f:
    c_s = f.read()
idx1 = c_s.find('flowchart')
idx2 = c_s.find('&quot;', idx1)
c_mermaid = html.unescape(html.unescape(c_s[idx1:idx2]))

with open('diagrams/lvl0.drawio.svg', 'r', encoding='utf-8') as f:
    l0_s = f.read()
idx1 = l0_s.find('flowchart')
idx2 = l0_s.find('&quot;', idx1)
l0_mermaid = html.unescape(html.unescape(l0_s[idx1:idx2]))

print('=== CONTEXT DFD FLOWS ===')
c_flows = parse_flows_from_mermaid(c_mermaid)
for src, labels, dst in c_flows:
    print(f'{src} -> {dst} ({len(labels)} items):')
    for l in labels:
        print(f'   - {l}')

print('\n=== LEVEL 0 DFD FLOWS (EXTERNAL ENTITIES ONLY) ===')
l0_flows = parse_flows_from_mermaid(l0_mermaid)
for src, labels, dst in l0_flows:
    if src.startswith('E_') or dst.startswith('E_'):
        print(f'{src} -> {dst} ({len(labels)} items):')
        for l in labels:
            print(f'   - {l}')

