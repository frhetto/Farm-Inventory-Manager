import html
import json
import xml.etree.ElementTree as ET

def generate_activity_diagram():
    # 1. Mermaid specification for dual compatibility
    mermaid_code = """flowchart TD
    %% Initial Start Node
    Start(( )):::startEndNode

    %% 3 Swimlanes Arranged Horizontally Across the Canvas
    subgraph Worker ["Farm Worker"]
        direction TB
        A["3.1 Record Daily Field & Animal Activities<br/>(Plots, Animals, Materials)"]
        E["3.4.3 Return Rejected Submissions<br/>(Review Correction Notice & Revise Data)"]
    end

    subgraph Sys ["System (Inventory & Interface)"]
        direction TB
        B["3.4.1 Review Worker Activity Drafts<br/>(Stage Pending Draft & Format Check)"]
        ForkBar["======== FORK (Parallel Execution) ========"]:::barNode
        F["3.2 Execute Automated Material Depletion<br/>(3.2.3 Post Deductions to D2: Inventory Ledger)"]
        G["3.4.2 Authorize Approved Submissions<br/>(Commit Approved Record to D3: Operations Logs)"]
        JoinBar["======== JOIN (Synchronization) ========"]:::barNode
        EndNode((( ))):::startEndNode
    end

    subgraph Manager ["Farm Manager"]
        direction TB
        C["3.4 Validate Operational Submissions<br/>(Verify Quantities & Agronomic Logs)"]
        D{"3.4 Decision:<br/>Submission Valid?"}
    end

    %% Workflow Routing
    Start --> A
    A -->|"Daily activity log"| B
    B -->|"Pending draft for review"| C
    C --> D

    %% Decision Branches
    D -->|"No: Rejected"| E
    E -->|"Re-submit activity log to 3.1"| A

    D -->|"Yes: Approved"| ForkBar

    %% Parallel Execution (Fork)
    ForkBar -->|"Deduct consumables"| F
    ForkBar -->|"Commit audit log"| G

    %% Synchronization (Join)
    F --> JoinBar
    G --> JoinBar
    JoinBar --> EndNode

    %% Styling
    classDef default fill:#f8fafc,stroke:#475569,stroke-width:2px,color:#0f172a,font-family:Recursive;
    classDef startEndNode fill:#1e293b,stroke:#1e293b,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef decisionNode fill:#fef08a,stroke:#ca8a04,stroke-width:2px,color:#854d0e,font-weight:bold;
    classDef barNode fill:#0f172a,stroke:#0f172a,stroke-width:3px,color:#ffffff,font-weight:bold;
    
    class D decisionNode;
    class ForkBar barNode;
    class JoinBar barNode;"""

    mermaid_json = json.dumps({"data": mermaid_code, "config": None, "version": "12"})
    mermaid_attr = html.escape(mermaid_json, quote=True)

    # 2. Draw.io mxGraphModel XML
    model_xml = f"""<mxfile host="app.diagrams.net">
  <diagram name="Page-1" id="activity-diagram-horizontal">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="transparent" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <UserObject label="" mermaidData="{mermaid_attr}" id="cell-mermaid-root">
          <mxCell connectable="0" parent="1" style="group;" vertex="1">
            <mxGeometry as="geometry" />
          </mxCell>
        </UserObject>
        
        <!-- Lane 1: Farm Worker -->
        <UserObject label="Farm Worker" id="lane-worker">
          <mxCell parent="cell-mermaid-root" style="swimlane;html=1;startSize=30;horizontal=1;fillColor=#FDF4FF;strokeColor=#E879F9;fontColor=#0f172a;fontFamily=Recursive;fontSize=14;fontStyle=1;strokeWidth=2;rounded=1;" vertex="1">
            <mxGeometry x="30" y="40" width="320" height="640" as="geometry" />
          </mxCell>
        </UserObject>
        
        <!-- Lane 2: System -->
        <UserObject label="System (Inventory &amp; Interface)" id="lane-system">
          <mxCell parent="cell-mermaid-root" style="swimlane;html=1;startSize=30;horizontal=1;fillColor=#F0FDFA;strokeColor=#2DD4BF;fontColor=#0f172a;fontFamily=Recursive;fontSize=14;fontStyle=1;strokeWidth=2;rounded=1;" vertex="1">
            <mxGeometry x="380" y="40" width="350" height="640" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Lane 3: Farm Manager -->
        <UserObject label="Farm Manager" id="lane-manager">
          <mxCell parent="cell-mermaid-root" style="swimlane;html=1;startSize=30;horizontal=1;fillColor=#FFF7ED;strokeColor=#FB923C;fontColor=#0f172a;fontFamily=Recursive;fontSize=14;fontStyle=1;strokeWidth=2;rounded=1;" vertex="1">
            <mxGeometry x="760" y="40" width="310" height="640" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Start Node -->
        <UserObject label="" id="node-start">
          <mxCell parent="cell-mermaid-root" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#0f172a;strokeColor=#0f172a;" vertex="1">
            <mxGeometry x="178" y="83" width="24" height="24" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Action 1: 3.1 Record Daily Field & Animal Activities -->
        <UserObject label="3.1 Record Daily Field &amp; Animal Activities&#xa;(Plots, Animals, Materials)" id="node-submit-log">
          <mxCell parent="cell-mermaid-root" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#475569;strokeWidth=2;fontColor=#0f172a;fontFamily=Recursive;fontSize=12;fontStyle=1;arcSize=20;" vertex="1">
            <mxGeometry x="70" y="130" width="240" height="55" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Action 2: 3.4.1 Review Worker Activity Drafts -->
        <UserObject label="3.4.1 Review Worker Activity Drafts&#xa;&amp; Validate Input Formats" id="node-draft-record">
          <mxCell parent="cell-mermaid-root" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#475569;strokeWidth=2;fontColor=#0f172a;fontFamily=Recursive;fontSize=12;fontStyle=1;arcSize=20;" vertex="1">
            <mxGeometry x="430" y="130" width="250" height="55" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Action 3: 3.4 Validate Operational Submissions -->
        <UserObject label="3.4 Validate Operational Submissions&#xa;&amp; Verify Material Usage" id="node-review-submission">
          <mxCell parent="cell-mermaid-root" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#475569;strokeWidth=2;fontColor=#0f172a;fontFamily=Recursive;fontSize=12;fontStyle=1;arcSize=20;" vertex="1">
            <mxGeometry x="795" y="130" width="245" height="55" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Decision: 3.4 Validation Decision -->
        <UserObject label="3.4 Decision:&#xa;Submission&#xa;Valid?" id="node-decision">
          <mxCell parent="cell-mermaid-root" style="rhombus;whiteSpace=wrap;html=1;fillColor=#fef08a;strokeColor=#ca8a04;strokeWidth=2;fontColor=#854d0e;fontFamily=Recursive;fontSize=11;fontStyle=1;" vertex="1">
            <mxGeometry x="847" y="230" width="140" height="80" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Action 4: 3.4.3 Return Rejected Submissions (Correction Notice) -->
        <UserObject label="3.4.3 Review Correction Notice&#xa;&amp; Revise Operational Data" id="node-correction-notice">
          <mxCell parent="cell-mermaid-root" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#475569;strokeWidth=2;fontColor=#0f172a;fontFamily=Recursive;fontSize=12;fontStyle=1;arcSize=20;" vertex="1">
            <mxGeometry x="70" y="242.5" width="240" height="55" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- FORK BAR -->
        <UserObject label="" id="node-fork-bar">
          <mxCell parent="cell-mermaid-root" style="rounded=1;html=1;fillColor=#0f172a;strokeColor=#0f172a;strokeWidth=2;" vertex="1">
            <mxGeometry x="415" y="370" width="280" height="8" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Parallel Action 1: 3.2 Execute Automated Material Depletion -->
        <UserObject label="3.2 Execute Automated&#xa;Material Depletion&#xa;(3.2.3 Deduct D2 Stock)" id="node-stock-depletion">
          <mxCell parent="cell-mermaid-root" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#475569;strokeWidth=2;fontColor=#0f172a;fontFamily=Recursive;fontSize=11;fontStyle=1;arcSize=20;" vertex="1">
            <mxGeometry x="390" y="430" width="160" height="65" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Parallel Action 2: 3.4.2 Authorize Approved Submissions -->
        <UserObject label="3.4.2 Authorize Approved&#xa;Submissions&#xa;(Commit to D3 Logs)" id="node-commit-log">
          <mxCell parent="cell-mermaid-root" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#475569;strokeWidth=2;fontColor=#0f172a;fontFamily=Recursive;fontSize=11;fontStyle=1;arcSize=20;" vertex="1">
            <mxGeometry x="560" y="430" width="160" height="65" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- JOIN BAR -->
        <UserObject label="" id="node-join-bar">
          <mxCell parent="cell-mermaid-root" style="rounded=1;html=1;fillColor=#0f172a;strokeColor=#0f172a;strokeWidth=2;" vertex="1">
            <mxGeometry x="415" y="550" width="280" height="8" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Final End Node -->
        <UserObject label="" id="node-end">
          <mxCell parent="cell-mermaid-root" style="ellipse;html=1;shape=endState;fillColor=#0f172a;strokeColor=#0f172a;" vertex="1">
            <mxGeometry x="539" y="614" width="32" height="32" as="geometry" />
          </mxCell>
        </UserObject>

        <!-- Edges -->
        <UserObject label="" id="edge-start-submit">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-start" target="node-submit-log" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="Daily activity log" id="edge-submit-draft">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-submit-log" target="node-draft-record" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="Pending draft for review" id="edge-draft-review">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-draft-record" target="node-review-submission" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="" id="edge-review-decision">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-review-submission" target="node-decision" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="No: Rejected" id="edge-decision-rejected">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-decision" target="node-correction-notice" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#dc2626;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="Re-submit activity log to 3.1" id="edge-correction-submit">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-correction-notice" target="node-submit-log" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="Yes: Approved" id="edge-decision-approved">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-decision" target="node-fork-bar" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#16a34a;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry">
              <Array as="points">
                <mxPoint x="917" y="374" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>

        <UserObject label="Deduct consumables" id="edge-fork-deplete">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-fork-bar" target="node-stock-depletion" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="Commit audit log" id="edge-fork-commit">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-fork-bar" target="node-commit-log" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="" id="edge-deplete-join">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-stock-depletion" target="node-join-bar" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="" id="edge-commit-join">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-commit-log" target="node-join-bar" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

        <UserObject label="" id="edge-join-end">
          <mxCell edge="1" parent="cell-mermaid-root" source="node-join-bar" target="node-end" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#000000;strokeWidth=2;endArrow=block;">
            <mxGeometry relative="1" as="geometry" />
          </mxCell>
        </UserObject>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""

    model_xml_escaped = html.escape(model_xml, quote=True)

    # 3. Visual SVG markup
    svg_header = f"""<?xml version="1.0" encoding="UTF-8"?>
<!-- Do not edit this file with editors other than draw.io -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" style="background: transparent; background-color: transparent; color-scheme: light dark;" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="1100px" height="710px" viewBox="0 0 1100 710" content="{model_xml_escaped}">
<defs>
  <style type="text/css">@import url("https://fonts.googleapis.com/css2?family=Recursive:wght@400;500;600;700");</style>
</defs>
<g>
<g data-cell-id="0">
<g data-cell-id="1">
<g data-cell-id="cell-mermaid-root">
"""

    visual_elements = """
<!-- ================== SWIMLANES ================== -->
<!-- Lane 1: Farm Worker -->
<g data-cell-id="lane-worker">
  <rect x="30" y="40" width="320" height="640" rx="10" ry="10" fill="#fdf4ff" stroke="#e879f9" stroke-width="2" style="fill: light-dark(#fdf4ff, #2a122e); stroke: light-dark(#e879f9, #c026d3);"/>
  <path d="M 30 70 L 350 70" fill="none" stroke="#e879f9" stroke-width="2" style="stroke: light-dark(#e879f9, #c026d3);"/>
  <text x="190" y="60" fill="#0f172a" font-family="Recursive" font-size="15px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">Farm Worker</text>
</g>

<!-- Lane 2: System -->
<g data-cell-id="lane-system">
  <rect x="380" y="40" width="350" height="640" rx="10" ry="10" fill="#f0fdfa" stroke="#2dd4bf" stroke-width="2" style="fill: light-dark(#f0fdfa, #112a28); stroke: light-dark(#2dd4bf, #0d9488);"/>
  <path d="M 380 70 L 730 70" fill="none" stroke="#2dd4bf" stroke-width="2" style="stroke: light-dark(#2dd4bf, #0d9488);"/>
  <text x="555" y="60" fill="#0f172a" font-family="Recursive" font-size="15px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">System (Inventory &amp; Interface)</text>
</g>

<!-- Lane 3: Farm Manager -->
<g data-cell-id="lane-manager">
  <rect x="760" y="40" width="310" height="640" rx="10" ry="10" fill="#fff7ed" stroke="#fb923c" stroke-width="2" style="fill: light-dark(#fff7ed, #321c11); stroke: light-dark(#fb923c, #ea580c);"/>
  <path d="M 760 70 L 1070 70" fill="none" stroke="#fb923c" stroke-width="2" style="stroke: light-dark(#fb923c, #ea580c);"/>
  <text x="915" y="60" fill="#0f172a" font-family="Recursive" font-size="15px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">Farm Manager</text>
</g>

<!-- ================== NODES ================== -->
<!-- Start Node -->
<g data-cell-id="node-start">
  <circle cx="190" cy="95" r="12" fill="#0f172a" stroke="#0f172a" style="fill: light-dark(#0f172a, #38bdf8); stroke: light-dark(#0f172a, #38bdf8);"/>
</g>

<!-- Action 1: 3.1 Record Daily Field & Animal Activities -->
<g data-cell-id="node-submit-log">
  <rect x="70" y="130" width="240" height="55" rx="12" ry="12" fill="#f8fafc" stroke="#475569" stroke-width="2" style="fill: light-dark(#f8fafc, #1e293b); stroke: light-dark(#475569, #94a3b8);"/>
  <text x="190" y="148" fill="#0f172a" font-family="Recursive" font-size="12px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">3.1 Record Daily Field</text>
  <text x="190" y="163" fill="#0f172a" font-family="Recursive" font-size="12px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">&amp; Animal Activities</text>
  <text x="190" y="177" fill="#64748b" font-family="Recursive" font-size="10px" text-anchor="middle" style="fill: light-dark(#64748b, #94a3b8);">(Plots, Animals, Materials)</text>
</g>

<!-- Action 2: 3.4.1 Review Worker Activity Drafts -->
<g data-cell-id="node-draft-record">
  <rect x="430" y="130" width="250" height="55" rx="12" ry="12" fill="#f8fafc" stroke="#475569" stroke-width="2" style="fill: light-dark(#f8fafc, #1e293b); stroke: light-dark(#475569, #94a3b8);"/>
  <text x="555" y="148" fill="#0f172a" font-family="Recursive" font-size="12px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">3.4.1 Review Worker</text>
  <text x="555" y="163" fill="#0f172a" font-family="Recursive" font-size="12px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">Activity Drafts</text>
  <text x="555" y="177" fill="#64748b" font-family="Recursive" font-size="10px" text-anchor="middle" style="fill: light-dark(#64748b, #94a3b8);">&amp; Validate Input Formats</text>
</g>

<!-- Action 3: 3.4 Validate Operational Submissions -->
<g data-cell-id="node-review-submission">
  <rect x="795" y="130" width="245" height="55" rx="12" ry="12" fill="#f8fafc" stroke="#475569" stroke-width="2" style="fill: light-dark(#f8fafc, #1e293b); stroke: light-dark(#475569, #94a3b8);"/>
  <text x="917" y="148" fill="#0f172a" font-family="Recursive" font-size="12px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">3.4 Validate Operational</text>
  <text x="917" y="163" fill="#0f172a" font-family="Recursive" font-size="12px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">Submissions</text>
  <text x="917" y="177" fill="#64748b" font-family="Recursive" font-size="10px" text-anchor="middle" style="fill: light-dark(#64748b, #94a3b8);">&amp; Verify Material Usage</text>
</g>

<!-- Decision: 3.4 Validation Decision -->
<g data-cell-id="node-decision">
  <path d="M 917 230 L 987 270 L 917 310 L 847 270 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2" style="fill: light-dark(#fef08a, #713f12); stroke: light-dark(#ca8a04, #facc15);"/>
  <text x="917" y="260" fill="#854d0e" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#854d0e, #fef08a);">3.4 Decision:</text>
  <text x="917" y="274" fill="#854d0e" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#854d0e, #fef08a);">Is Submission</text>
  <text x="917" y="288" fill="#854d0e" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#854d0e, #fef08a);">Valid?</text>
</g>

<!-- Action 4: 3.4.3 Return Rejected Submissions -->
<g data-cell-id="node-correction-notice">
  <rect x="70" y="242.5" width="240" height="55" rx="12" ry="12" fill="#f8fafc" stroke="#475569" stroke-width="2" style="fill: light-dark(#f8fafc, #1e293b); stroke: light-dark(#475569, #94a3b8);"/>
  <text x="190" y="260" fill="#0f172a" font-family="Recursive" font-size="12px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">3.4.3 Review Correction Notice</text>
  <text x="190" y="275" fill="#0f172a" font-family="Recursive" font-size="12px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">&amp; Revise Operational Data</text>
  <text x="190" y="289" fill="#64748b" font-family="Recursive" font-size="10px" text-anchor="middle" style="fill: light-dark(#64748b, #94a3b8);">(Per 3.4.3 Rejection Notice)</text>
</g>

<!-- UML FORK BAR -->
<g data-cell-id="node-fork-bar">
  <rect x="415" y="370" width="280" height="8" rx="4" ry="4" fill="#0f172a" stroke="#0f172a" style="fill: light-dark(#0f172a, #38bdf8); stroke: light-dark(#0f172a, #38bdf8);"/>
  <text x="555" y="362" fill="#0284c7" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0369a1, #38bdf8);">[FORK: Concurrent Execution]</text>
</g>

<!-- Parallel Action 1: 3.2 Execute Automated Material Depletion -->
<g data-cell-id="node-stock-depletion">
  <rect x="390" y="430" width="160" height="65" rx="12" ry="12" fill="#f8fafc" stroke="#475569" stroke-width="2" style="fill: light-dark(#f8fafc, #1e293b); stroke: light-dark(#475569, #94a3b8);"/>
  <text x="470" y="448" fill="#0f172a" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">3.2 Execute Automated</text>
  <text x="470" y="463" fill="#0f172a" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">Material Depletion</text>
  <text x="470" y="481" fill="#d97706" font-family="Recursive" font-size="10px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#d97706, #fbbf24);">(3.2.3 Deduct D2 Stock)</text>
</g>

<!-- Parallel Action 2: 3.4.2 Authorize Approved Submissions -->
<g data-cell-id="node-commit-log">
  <rect x="560" y="430" width="160" height="65" rx="12" ry="12" fill="#f8fafc" stroke="#475569" stroke-width="2" style="fill: light-dark(#f8fafc, #1e293b); stroke: light-dark(#475569, #94a3b8);"/>
  <text x="640" y="448" fill="#0f172a" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">3.4.2 Authorize Approved</text>
  <text x="640" y="463" fill="#0f172a" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">Submissions</text>
  <text x="640" y="481" fill="#d97706" font-family="Recursive" font-size="10px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#d97706, #fbbf24);">(Commit to D3 Logs)</text>
</g>

<!-- UML JOIN BAR -->
<g data-cell-id="node-join-bar">
  <rect x="415" y="550" width="280" height="8" rx="4" ry="4" fill="#0f172a" stroke="#0f172a" style="fill: light-dark(#0f172a, #38bdf8); stroke: light-dark(#0f172a, #38bdf8);"/>
  <text x="555" y="542" fill="#0284c7" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0369a1, #38bdf8);">[JOIN: Synchronization]</text>
</g>

<!-- Activity Final State (Bullseye) -->
<g data-cell-id="node-end">
  <circle cx="555" cy="630" r="16" fill="none" stroke="#0f172a" stroke-width="2" style="stroke: light-dark(#0f172a, #38bdf8);"/>
  <circle cx="555" cy="630" r="10" fill="#0f172a" stroke="#0f172a" style="fill: light-dark(#0f172a, #38bdf8); stroke: light-dark(#0f172a, #38bdf8);"/>
</g>

<!-- ================== EDGES & FLOWS ================== -->
<!-- Start -> Submit Log -->
<g data-cell-id="edge-start-submit">
  <path d="M 190 107 L 190 128" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="190,130 186,120 194,120" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
</g>

<!-- Submit Log -> Draft Record -->
<g data-cell-id="edge-submit-draft">
  <title>Daily activity log</title>
  <path d="M 310 157.5 L 428 157.5" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="430,157.5 420,153.5 420,161.5" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
  <rect x="325" y="142" width="95" height="18" rx="4" ry="4" fill="#cccccc" style="fill: light-dark(#cccccc, #334155);"/>
  <text x="372" y="155" fill="#28253D" font-family="Recursive" font-size="10px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#28253D, #e2e8f0);">Daily activity log</text>
</g>

<!-- Draft Record -> Review Submission -->
<g data-cell-id="edge-draft-review">
  <title>Pending draft for review</title>
  <path d="M 680 157.5 L 793 157.5" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="795,157.5 785,153.5 785,161.5" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
  <rect x="688" y="142" width="102" height="18" rx="4" ry="4" fill="#cccccc" style="fill: light-dark(#cccccc, #334155);"/>
  <text x="739" y="155" fill="#28253D" font-family="Recursive" font-size="10px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#28253D, #e2e8f0);">Pending draft</text>
</g>

<!-- Review -> Decision -->
<g data-cell-id="edge-review-decision">
  <path d="M 917 185 L 917 228" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="917,230 913,220 921,220" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
</g>

<!-- Decision -> Rejected Loopback -->
<g data-cell-id="edge-decision-rejected">
  <title>No: Rejected</title>
  <path d="M 847 270 L 312 270" fill="none" stroke="#dc2626" stroke-width="2" style="stroke: light-dark(#dc2626, #f87171);"/>
  <polygon points="310,270 320,266 320,274" fill="#dc2626" style="fill: light-dark(#dc2626, #f87171);"/>
  <rect x="530" y="259" width="90" height="20" rx="4" ry="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1" style="fill: light-dark(#fee2e2, #450a0a); stroke: light-dark(#dc2626, #f87171);"/>
  <text x="575" y="273" fill="#dc2626" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#dc2626, #fca5a5);">[No: Rejected]</text>
</g>

<!-- Correction Notice -> Submit Log (Re-submit) -->
<g data-cell-id="edge-correction-submit">
  <title>Re-submit activity log to 3.1</title>
  <path d="M 190 242.5 L 190 187" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="190,185 186,195 194,195" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
  <rect x="120" y="205" width="140" height="18" rx="4" ry="4" fill="#cccccc" style="fill: light-dark(#cccccc, #334155);"/>
  <text x="190" y="218" fill="#28253D" font-family="Recursive" font-size="10px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#28253D, #e2e8f0);">Re-submit log to 3.1</text>
</g>

<!-- Decision -> Approved (to FORK BAR) -->
<g data-cell-id="edge-decision-approved">
  <title>Yes: Approved</title>
  <path d="M 917 310 L 917 374 Q 917 374 905 374 L 697 374" fill="none" stroke="#16a34a" stroke-width="2" style="stroke: light-dark(#16a34a, #4ade80);"/>
  <polygon points="695,374 705,370 705,378" fill="#16a34a" style="fill: light-dark(#16a34a, #4ade80);"/>
  <rect x="760" y="362" width="100" height="20" rx="4" ry="4" fill="#dcfce7" stroke="#16a34a" stroke-width="1" style="fill: light-dark(#dcfce7, #052e16); stroke: light-dark(#16a34a, #4ade80);"/>
  <text x="810" y="376" fill="#15803d" font-family="Recursive" font-size="11px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#15803d, #86efac);">[Yes: Approved]</text>
</g>

<!-- Fork Bar -> Parallel Stock Depletion -->
<g data-cell-id="edge-fork-deplete">
  <title>Deduct consumables</title>
  <path d="M 470 378 L 470 428" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="470,430 466,420 474,420" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
  <rect x="415" y="395" width="110" height="18" rx="4" ry="4" fill="#cccccc" style="fill: light-dark(#cccccc, #334155);"/>
  <text x="470" y="408" fill="#28253D" font-family="Recursive" font-size="10px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#28253D, #e2e8f0);">Deduct stock</text>
</g>

<!-- Fork Bar -> Parallel Operations Log Commit -->
<g data-cell-id="edge-fork-commit">
  <title>Commit audit log</title>
  <path d="M 640 378 L 640 428" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="640,430 636,420 644,420" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
  <rect x="585" y="395" width="110" height="18" rx="4" ry="4" fill="#cccccc" style="fill: light-dark(#cccccc, #334155);"/>
  <text x="640" y="408" fill="#28253D" font-family="Recursive" font-size="10px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#28253D, #e2e8f0);">Commit log</text>
</g>

<!-- Parallel Stock Depletion -> JOIN BAR -->
<g data-cell-id="edge-deplete-join">
  <path d="M 470 495 L 470 548" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="470,550 466,540 474,540" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
</g>

<!-- Parallel Operations Log Commit -> JOIN BAR -->
<g data-cell-id="edge-commit-join">
  <path d="M 640 495 L 640 548" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="640,550 636,540 644,540" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
</g>

<!-- Join Bar -> Activity Final State -->
<g data-cell-id="edge-join-end">
  <path d="M 555 558 L 555 612" fill="none" stroke="#000000" stroke-width="2" style="stroke: light-dark(#000000, #e2e8f0);"/>
  <polygon points="555,614 551,604 559,604" fill="#000000" style="fill: light-dark(#000000, #e2e8f0);"/>
</g>
"""

    svg_footer = """</g>
</g>
</g>
</g>
<switch>
  <g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"/>
  <a transform="translate(0,-5)" xlink:href="https://www.drawio.com/doc/faq/svg-export-text-problems" target="_blank">
    <text text-anchor="middle" font-size="10px" x="50%" y="100%">Text is not SVG - cannot display</text>
  </a>
</switch>
</svg>"""

    full_svg = svg_header + visual_elements + svg_footer

    # Validate XML
    xml_only = full_svg[full_svg.find('<svg'):]
    root = ET.fromstring(xml_only)
    print("SUCCESS: Valid XML parsed!")
    print("Root tag:", root.tag)

    with open("diagrams/Activity_Diagram.drawio.svg", "w", encoding="utf-8") as f:
        f.write(full_svg)
    print(f"SUCCESS: Wrote diagrams/Activity_Diagram.drawio.svg ({len(full_svg)} bytes)!")

if __name__ == "__main__":
    generate_activity_diagram()
