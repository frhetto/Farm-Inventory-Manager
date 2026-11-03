import os
import re
import html

def extract_flows(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try to find mermaidData
    m = re.search(r'mermaidData="([^"]+)"', content)
    if not m:
        # Maybe raw mermaid in text
        m_code = content
    else:
        mermaid_json = html.unescape(m.group(1))
        # could be {"data": "..."}
        m_code_match = re.search(r'"data":\s*"(.*?)"', mermaid_json, re.DOTALL)
        if m_code_match:
            m_code = m_code_match.group(1).replace('\\"', '"').replace('\\n', '\n')
        else:
            m_code = mermaid_json
            
    # Parse edges: A -->|label| B or A --> B
    flows = []
    for line in m_code.splitlines():
        line = line.strip()
        edge_match = re.search(r'([\w\(\)\[\]]+)\s*--+>\|?(.*?)\|?\s*([\w\(\)\[\]]+)', line)
        if edge_match and not line.startswith('classDef') and not line.startswith('%%'):
            src = edge_match.group(1).strip()
            lbl = edge_match.group(2).strip().strip('|')
            dst = edge_match.group(3).strip()
            flows.append((src, lbl, dst))
    return flows

print("--- AUDITING CONTEXT DFD ---")
ctx_flows = extract_flows("diagrams/ContextDFD.svg")
for s, l, d in ctx_flows:
    print(f"CTX: {s} -> {d} : {l}")

print("\n--- AUDITING LEVEL 0 DFD ---")
lvl0_flows = extract_flows("diagrams/lvl0.drawio.svg")
for s, l, d in lvl0_flows:
    print(f"LVL0: {s} -> {d} : {l}")

