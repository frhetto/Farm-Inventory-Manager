import re
import html

def update_lvl1_p2():
    path = "diagrams/lvl1/lvl1process2.0.svg"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Mermaid in content attribute
    content = content.replace(
        'E_Manager --&amp;gt;|\\&amp;quot;Category &amp;amp; location definitions\\&amp;quot;| P2_1',
        'E_Manager --&amp;gt;|\\&amp;quot;Category definitions\\&amp;quot;| P2_1'
    )
    content = content.replace(
        'E_Manager --&amp;gt;|\\&amp;quot;Category &amp;amp; location definitions\\&amp;quot;| P2_5',
        'E_Manager --&amp;gt;|\\&amp;quot;Location definitions\\&amp;quot;| P2_5'
    )

    # XML UserObjects
    content = re.sub(
        r'(<UserObject[^>]*id="ci-6yJaQ9gq9UVaC1ZJM-86"[^>]*label=")[^"]*(")',
        r'\g<1>Category definitions\g<2>',
        content
    )
    content = re.sub(
        r'(<UserObject[^>]*id="ci-6yJaQ9gq9UVaC1ZJM-86"[^>]*mermaidBaseValue=")[^"]*(")',
        r'\g<1>Category definitions\g<2>',
        content
    )
    content = re.sub(
        r'(<UserObject[^>]*id="ci-6yJaQ9gq9UVaC1ZJM-87"[^>]*label=")[^"]*(")',
        r'\g<1>Location definitions\g<2>',
        content
    )
    content = re.sub(
        r'(<UserObject[^>]*id="ci-6yJaQ9gq9UVaC1ZJM-87"[^>]*mermaidBaseValue=")[^"]*(")',
        r'\g<1>Location definitions\g<2>',
        content
    )

    # SVG Visuals
    # 86
    p86 = content.find('data-cell-id="ci-6yJaQ9gq9UVaC1ZJM-86"')
    if p86 != -1:
        e86 = content.find('</g></g></g>', p86)
        block86 = content[p86:e86]
        new_block86 = block86.replace('Category &amp; location definitions', 'Category definitions')
        content = content[:p86] + new_block86 + content[e86:]

    # 87
    p87 = content.find('data-cell-id="ci-6yJaQ9gq9UVaC1ZJM-87"')
    if p87 != -1:
        e87 = content.find('</g></g></g>', p87)
        block87 = content[p87:e87]
        new_block87 = block87.replace('Category &amp; location definitions', 'Location definitions')
        content = content[:p87] + new_block87 + content[e87:]

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: diagrams/lvl1/lvl1process2.0.svg updated.")


def update_lvl0():
    path = "diagrams/lvl0.drawio.svg"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Mermaid replacements inside content attribute
    repls = [
        ('P1 --&amp;gt;|\\&amp;quot;Write credentials\\&amp;quot;| D1',
         'P1 --&amp;gt;|\\&amp;quot;1: Write user credentials&amp;lt;br/&amp;gt;2: Write role privileges&amp;lt;br/&amp;gt;3: Write active session states\\&amp;quot;| D1'),
        ('D1 --&amp;gt;|\\&amp;quot;Read permissions\\&amp;quot;| P1',
         'D1 --&amp;gt;|\\&amp;quot;Read user permissions\\&amp;quot;| P1'),
        ('P2 --&amp;gt;|\\&amp;quot;Write stock balances\\&amp;quot;| D2',
         'P2 --&amp;gt;|\\&amp;quot;1: Write category rules&amp;lt;br/&amp;gt;2: Write location mappings&amp;lt;br/&amp;gt;3: Write stock balances&amp;lt;br/&amp;gt;4: Write archived deletion record&amp;lt;br/&amp;gt;5: Write batch movement history&amp;lt;br/&amp;gt;6: Write destination zone balance\\&amp;quot;| D2'),
        ('D2 --&amp;gt;|\\&amp;quot;Read stock quantities\\&amp;quot;| P2',
         'D2 --&amp;gt;|\\&amp;quot;1: Read stock quantities&amp;lt;br/&amp;gt;2: Read record for purging&amp;lt;br/&amp;gt;3: Read source zone balance\\&amp;quot;| P2'),
        ('E_Manager --&amp;gt;|\\&amp;quot;1: Category &amp;amp; location definitions&amp;lt;br/&amp;gt;2: Deletion authorization\\&amp;quot;| P2',
         'E_Manager --&amp;gt;|\\&amp;quot;1: Category definitions&amp;lt;br/&amp;gt;2: Location definitions&amp;lt;br/&amp;gt;3: Deletion authorization\\&amp;quot;| P2'),
        ('P3 --&amp;gt;|\\&amp;quot;Write activity logs\\&amp;quot;| D3',
         'P3 --&amp;gt;|\\&amp;quot;1: Write provisional activity record&amp;lt;br/&amp;gt;2: Write care calendar schedule&amp;lt;br/&amp;gt;3: Write approved activity record\\&amp;quot;| D3'),
        ('D3 --&amp;gt;|\\&amp;quot;Read pending logs\\&amp;quot;| P3',
         'D3 --&amp;gt;|\\&amp;quot;Read pending activity record\\&amp;quot;| P3'),
        ('P3 --&amp;gt;|\\&amp;quot;Material depletion order\\&amp;quot;| D2',
         'P3 --&amp;gt;|\\&amp;quot;Automated material depletion order\\&amp;quot;| D2'),
        ('P4 --&amp;gt;|\\&amp;quot;Write journal entry\\&amp;quot;| D4',
         'P4 --&amp;gt;|\\&amp;quot;Write standardized journal entry\\&amp;quot;| D4'),
        ('D4 --&amp;gt;|\\&amp;quot;Read ledger accounts\\&amp;quot;| P4',
         'D4 --&amp;gt;|\\&amp;quot;Read ledger accounts &amp;amp; costs\\&amp;quot;| P4'),
        ('P6 --&amp;gt;|\\&amp;quot;Write vendor profiles\\&amp;quot;| D5',
         'P6 --&amp;gt;|\\&amp;quot;1: Write vendor profiles&amp;lt;br/&amp;gt;2: Write purchase order\\&amp;quot;| D5'),
        ('D5 --&amp;gt;|\\&amp;quot;Read supplier directory\\&amp;quot;| P6',
         'D5 --&amp;gt;|\\&amp;quot;1: Read supplier directory&amp;lt;br/&amp;gt;2: Read order history\\&amp;quot;| P6'),
    ]

    for old, new in repls:
        assert old in content, f"Missing Mermaid pattern: {old[:30]}"
        content = content.replace(old, new)

    # 2. XML UserObjects inside content attribute
    cell_updates = {
        'ci-6yJaQ9gq9UVaC1ZJM-50': '1: Write user credentials&#xa;2: Write role privileges&#xa;3: Write active session states',
        'ci-6yJaQ9gq9UVaC1ZJM-51': 'Read user permissions',
        'ci-6yJaQ9gq9UVaC1ZJM-52': '1: Write category rules&#xa;2: Write location mappings&#xa;3: Write stock balances&#xa;4: Write archived deletion record&#xa;5: Write batch movement history&#xa;6: Write destination zone balance',
        'ci-6yJaQ9gq9UVaC1ZJM-53': '1: Read stock quantities&#xa;2: Read record for purging&#xa;3: Read source zone balance',
        'ci-6yJaQ9gq9UVaC1ZJM-36': '1: Category definitions&#xa;2: Location definitions&#xa;3: Deletion authorization',
        'ci-6yJaQ9gq9UVaC1ZJM-55': '1: Write provisional activity record&#xa;2: Write care calendar schedule&#xa;3: Write approved activity record',
        'ci-6yJaQ9gq9UVaC1ZJM-56': 'Read pending activity record',
        'ci-6yJaQ9gq9UVaC1ZJM-57': 'Automated material depletion order',
        'ci-6yJaQ9gq9UVaC1ZJM-58': 'Write standardized journal entry',
        'ci-6yJaQ9gq9UVaC1ZJM-59': 'Read ledger accounts &amp; costs',
        'ci-6yJaQ9gq9UVaC1ZJM-63': '1: Write vendor profiles&#xa;2: Write purchase order',
        'ci-6yJaQ9gq9UVaC1ZJM-64': '1: Read supplier directory&#xa;2: Read order history',
    }

    for cid, esc_lbl in cell_updates.items():
        content = re.sub(
            rf'(<UserObject[^>]*id="{cid}"[^>]*label=")[^"]*(")',
            rf'\g<1>{esc_lbl}\g<2>',
            content
        )
        content = re.sub(
            rf'(<UserObject[^>]*id="{cid}"[^>]*mermaidBaseValue=")[^"]*(")',
            rf'\g<1>{esc_lbl}\g<2>',
            content
        )

    # 3. SVG visual elements inside <g data-cell-id="...">
    svg_visual_updates = {
        'ci-6yJaQ9gq9UVaC1ZJM-50': {
            'title': '1: Write user credentials&#10;2: Write role privileges&#10;3: Write active session states',
            'html': '1: Write user credentials<br/>2: Write role privileges<br/>3: Write active session states',
            'text': '1: Write user credentials',
            'pt': '920px', 'ml': '2159px',
            'tx': '2159', 'ty': '924'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-51': {
            'title': 'Read user permissions',
            'html': 'Read user permissions',
            'text': 'Read user permissions',
            'pt': '985px', 'ml': '2147px',
            'tx': '2147', 'ty': '989'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-52': {
            'title': '1: Write category rules&#10;2: Write location mappings&#10;3: Write stock balances&#10;4: Write archived deletion record&#10;5: Write batch movement history&#10;6: Write destination zone balance',
            'html': '1: Write category rules<br/>2: Write location mappings<br/>3: Write stock balances<br/>4: Write archived deletion record<br/>5: Write batch movement history<br/>6: Write destination zone balance',
            'text': '1: Write category rules',
            'pt': '145px', 'ml': '3500px',
            'tx': '3500', 'ty': '149'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-53': {
            'title': '1: Read stock quantities&#10;2: Read record for purging&#10;3: Read source zone balance',
            'html': '1: Read stock quantities<br/>2: Read record for purging<br/>3: Read source zone balance',
            'text': '1: Read stock quantities',
            'pt': '250px', 'ml': '3660px',
            'tx': '3660', 'ty': '254'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-36': {
            'title': '1: Category definitions&#10;2: Location definitions&#10;3: Deletion authorization',
            'html': '<span title="1: Category definitions&#10;2: Location definitions&#10;3: Deletion authorization">(1..3) Category, Location &amp; Deletion Auth</span>',
            'text': '(1..3) Category, Location &amp; Deletion Auth',
            'pt': '853px', 'ml': '2859px',
            'tx': '2859', 'ty': '857'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-55': {
            'title': '1: Write provisional activity record&#10;2: Write care calendar schedule&#10;3: Write approved activity record',
            'html': '1: Write provisional activity record<br/>2: Write care calendar schedule<br/>3: Write approved activity record',
            'text': '1: Write provisional activity record',
            'pt': '95px', 'ml': '3080px',
            'tx': '3080', 'ty': '99'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-56': {
            'title': 'Read pending activity record',
            'html': 'Read pending activity record',
            'text': 'Read pending activity record',
            'pt': '155px', 'ml': '3220px',
            'tx': '3220', 'ty': '159'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-57': {
            'title': 'Automated material depletion order',
            'html': 'Automated material depletion order',
            'text': 'Automated material depletion order',
            'pt': '210px', 'ml': '3060px',
            'tx': '3060', 'ty': '214'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-58': {
            'title': 'Write standardized journal entry',
            'html': 'Write standardized journal entry',
            'text': 'Write standardized journal entry',
            'pt': '435px', 'ml': '4500px',
            'tx': '4500', 'ty': '439'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-59': {
            'title': 'Read ledger accounts &amp; costs',
            'html': 'Read ledger accounts &amp; costs',
            'text': 'Read ledger accounts &amp; costs',
            'pt': '495px', 'ml': '4580px',
            'tx': '4580', 'ty': '499'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-63': {
            'title': '1: Write vendor profiles&#10;2: Write purchase order',
            'html': '1: Write vendor profiles<br/>2: Write purchase order',
            'text': '1: Write vendor profiles',
            'pt': '250px', 'ml': '5025px',
            'tx': '5025', 'ty': '254'
        },
        'ci-6yJaQ9gq9UVaC1ZJM-64': {
            'title': '1: Read supplier directory&#10;2: Read order history',
            'html': '1: Read supplier directory<br/>2: Read order history',
            'text': '1: Read supplier directory',
            'pt': '320px', 'ml': '5037px',
            'tx': '5037', 'ty': '324'
        },
    }

    for cid, data in svg_visual_updates.items():
        cell_marker = f'data-cell-id="{cid}"'
        pos = content.find(cell_marker)
        if pos == -1:
            print(f"Warning: SVG cell not found: {cid}")
            continue
        end_pos = content.find('</g></g></g>', pos)
        if end_pos == -1:
            continue
        cell_slice = content[pos:end_pos]

        # Update or insert <title>
        title_esc = data['title']
        if '<title>' in cell_slice:
            cell_slice = re.sub(r'<title>.*?</title>', f'<title>{title_esc}</title>', cell_slice, flags=re.DOTALL)
        else:
            cell_slice = cell_slice.replace(f'{cell_marker}>', f'{cell_marker}><title>{title_esc}</title>')

        # Update padding-top and margin-left in foreignObject
        cell_slice = re.sub(
            r'padding-top:\s*\d+px;',
            f'padding-top: {data["pt"]};',
            cell_slice
        )
        cell_slice = re.sub(
            r'margin-left:\s*\d+px;',
            f'margin-left: {data["ml"]};',
            cell_slice
        )

        # Update inner HTML in foreignObject:
        cell_slice = re.sub(
            r'(<div style="display: inline-block;[^>]*>)(.*?)(</div></div></div></foreignObject>)',
            rf'\g<1>{data["html"]}\g<3>',
            cell_slice,
            flags=re.DOTALL
        )

        # Update text x, y and content
        cell_slice = re.sub(
            r'<text\s+x="\d+"\s+y="\d+"',
            f'<text x="{data["tx"]}" y="{data["ty"]}"',
            cell_slice
        )
        cell_slice = re.sub(
            r'(<text[^>]*>)(.*?)(</text>)',
            rf'\g<1>{data["text"]}\g<3>',
            cell_slice,
            flags=re.DOTALL
        )

        content = content[:pos] + cell_slice + content[end_pos:]

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: diagrams/lvl0.drawio.svg updated.")


def update_context():
    path = "diagrams/ContextDFD.svg"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Mermaid replacement
    old_mermaid = 'E_Manager --&amp;gt;|\\&amp;quot;1: User registration details&amp;lt;br/&amp;gt;2: Role assignments&amp;lt;br/&amp;gt;3: Category &amp;amp; location definitions&amp;lt;br/&amp;gt;4: Deletion authorization&amp;lt;br/&amp;gt;5: Care cycle schedule configuration&amp;lt;br/&amp;gt;6: Activity validation decision&amp;lt;br/&amp;gt;7: Stock summary filter request&amp;lt;br/&amp;gt;8: Task assignment\\&amp;quot;| P0'
    new_mermaid = 'E_Manager --&amp;gt;|\\&amp;quot;1: User registration details&amp;lt;br/&amp;gt;2: Role assignments&amp;lt;br/&amp;gt;3: Category definitions&amp;lt;br/&amp;gt;4: Location definitions&amp;lt;br/&amp;gt;5: Deletion authorization&amp;lt;br/&amp;gt;6: Care cycle schedule configuration&amp;lt;br/&amp;gt;7: Activity validation decision&amp;lt;br/&amp;gt;8: Stock summary filter request&amp;lt;br/&amp;gt;9: Task assignment\\&amp;quot;| P0'
    assert old_mermaid in content, "Context DFD Mermaid string not found!"
    content = content.replace(old_mermaid, new_mermaid)

    # XML model replacement
    old_lbl = "1: User registration details&#xa;2: Role assignments&#xa;3: Category &amp; location definitions&#xa;4: Deletion authorization&#xa;5: Care cycle schedule configuration&#xa;6: Activity validation decision&#xa;7: Stock summary filter request&#xa;8: Task assignment"
    new_lbl = "1: User registration details&#xa;2: Role assignments&#xa;3: Category definitions&#xa;4: Location definitions&#xa;5: Deletion authorization&#xa;6: Care cycle schedule configuration&#xa;7: Activity validation decision&#xa;8: Stock summary filter request&#xa;9: Task assignment"
    content = content.replace(old_lbl, new_lbl)

    # SVG visual title & pill label
    old_title = "1: User registration details&#10;2: Role assignments&#10;3: Category &amp; location definitions&#10;4: Deletion authorization&#10;5: Care cycle schedule configuration&#10;6: Activity validation decision&#10;7: Stock summary filter request&#10;8: Task assignment"
    new_title = "1: User registration details&#10;2: Role assignments&#10;3: Category definitions&#10;4: Location definitions&#10;5: Deletion authorization&#10;6: Care cycle schedule configuration&#10;7: Activity validation decision&#10;8: Stock summary filter request&#10;9: Task assignment"
    content = content.replace(old_title, new_title)
    content = content.replace("(1..8) Role, Config &amp; Tasks", "(1..9) Governance, Config &amp; Schedules")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: diagrams/ContextDFD.svg updated.")


if __name__ == "__main__":
    update_lvl1_p2()
    update_lvl0()
    update_context()

