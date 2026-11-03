import html
import json
import xml.etree.ElementTree as ET

def generate_sequence_diagram_operations():
    width = 1780
    height = 1120

    # Lifelines definition
    lifelines = [
        {"id": "worker", "name": "FarmWorker", "type": "actor", "x": 90, "layer": "presentation", "stereo": "actor"},
        {"id": "ui_m", "name": ":MobileFieldUI", "type": "boundary", "x": 280, "layer": "presentation", "stereo": "boundary"},
        {"id": "c_val", "name": ":ActivityValidationController", "type": "control", "x": 520, "layer": "business", "stereo": "control"},
        {"id": "e_log", "name": ":FieldActivityLog", "type": "entity", "x": 770, "layer": "persistence", "stereo": "entity"},
        {"id": "mgr", "name": "FarmManager", "type": "actor", "x": 990, "layer": "presentation", "stereo": "actor"},
        {"id": "ui_dash", "name": ":ManagerWebDashboard", "type": "boundary", "x": 1200, "layer": "presentation", "stereo": "boundary"},
        {"id": "c_dep", "name": ":StockDepletionController", "type": "control", "x": 1420, "layer": "business", "stereo": "control"},
        {"id": "e_item", "name": ":InventoryItem", "type": "entity", "x": 1610, "layer": "persistence", "stereo": "entity"},
        {"id": "e_fin", "name": ":FinancialJournalEntry", "type": "entity", "x": 1720, "layer": "persistence", "stereo": "entity"}
    ]

    # Adjust x to spread nicely across 1780px
    lifelines[0]["x"] = 80   # FarmWorker
    lifelines[1]["x"] = 260  # :MobileFieldUI
    lifelines[2]["x"] = 490  # :ActivityValidationController
    lifelines[3]["x"] = 720  # :FieldActivityLog
    lifelines[4]["x"] = 920  # FarmManager
    lifelines[5]["x"] = 1120 # :ManagerWebDashboard
    lifelines[6]["x"] = 1330 # :StockDepletionController
    lifelines[7]["x"] = 1530 # :InventoryItem
    lifelines[8]["x"] = 1700 # :FinancialJournalEntry

    messages = [
        {"num": 1, "from": 0, "to": 1, "y": 180, "type": "sync", "text": "1: submitDailyLog(plotId, hrs, materialsUsed)"},
        {"num": 2, "from": 1, "to": 2, "y": 225, "type": "sync", "text": "2: stageDraftActivity(workerId, logData)"},
        {"num": 3, "from": 2, "to": 3, "y": 270, "type": "sync", "text": "3: createDraftRecord(logData, status=PENDING)"},
        {"num": 4, "from": 3, "to": 2, "y": 315, "type": "return", "text": "4: return draftId (\"ACT-2026-891\")"},
        {"num": 5, "from": 2, "to": 5, "y": 360, "type": "sync", "text": "5: notifyPendingReview(draftId, workerId)"},
        {"num": 6, "from": 5, "to": 4, "y": 405, "type": "sync", "text": "6: displayReviewQueue(draftId, workerId)"},
        {"num": 7, "from": 4, "to": 5, "y": 465, "type": "sync", "text": "7: submitValidationDecision(draftId, APPROVED)"},
        {"num": 8, "from": 5, "to": 2, "y": 510, "type": "sync", "text": "8: processManagerApproval(draftId, approvalNotes)"},
        {"num": 9, "from": 2, "to": 3, "y": 555, "type": "sync", "text": "9: setApprovedStatus(managerId, timestamp)"},
        {"num": 10, "from": 3, "to": 2, "y": 595, "type": "return", "text": "10: return statusUpdated (true)"},
        {"num": 11, "from": 2, "to": 6, "y": 645, "type": "sync", "text": "11: triggerAutomatedDepletion(materialsUsed)"},
        {"num": 12, "from": 6, "to": 7, "y": 690, "type": "sync", "text": "12: checkAvailableStock(itemId, quantity)"},
        {"num": 13, "from": 7, "to": 6, "y": 730, "type": "return", "text": "13: return availableQuantity >= requested (true)"},
        {"num": 14, "from": 6, "to": 7, "y": 775, "type": "sync", "text": "14: adjustQuantity(-quantity, reason=\"DEPLETION_P3.2\")"},
        {"num": 15, "from": 7, "to": 6, "y": 815, "type": "return", "text": "15: return updatedBalance (newQtyOnHand)"},
        {"num": 16, "from": 6, "to": 8, "y": 860, "type": "sync", "text": "16: postMaterialExpense(itemId, cost, costCenter)"},
        {"num": 17, "from": 8, "to": 6, "y": 900, "type": "return", "text": "17: return journalEntryId (\"JNL-7741\")"},
        {"num": 18, "from": 6, "to": 2, "y": 945, "type": "return", "text": "18: return depletionCompleteSummary"},
        {"num": 19, "from": 2, "to": 1, "y": 985, "type": "return", "text": "19: return operationConfirmationReceipt"},
        {"num": 20, "from": 1, "to": 0, "y": 1025, "type": "return", "text": "20: displaySuccessReceipt(receiptId, balanceNotice)"},
        {"num": 21, "from": 2, "to": 5, "y": 1065, "type": "return", "text": "21: updateReviewStatus(\"APPROVED & DEPLETED\")"}
    ]

    # Activations
    activations = [
        {"x": lifelines[0]["x"] - 6, "y": 175, "h": 860}, # Worker
        {"x": lifelines[1]["x"] - 6, "y": 175, "h": 860}, # UI Mobile
        {"x": lifelines[2]["x"] - 6, "y": 220, "h": 855}, # Val Controller
        {"x": lifelines[3]["x"] - 6, "y": 265, "h": 340}, # Log Entity
        {"x": lifelines[4]["x"] - 6, "y": 400, "h": 75},  # Manager
        {"x": lifelines[5]["x"] - 6, "y": 355, "h": 720}, # Dashboard
        {"x": lifelines[6]["x"] - 6, "y": 640, "h": 315}, # Deplete Controller
        {"x": lifelines[7]["x"] - 6, "y": 685, "h": 140}, # Inventory Item
        {"x": lifelines[8]["x"] - 6, "y": 855, "h": 55}   # Journal Entry
    ]

    svg_content = build_sequence_svg(
        title="UML Sequence Diagram: Field Activity Logging & Automated Inventory Depletion",
        subtitle="Process 3.0 (3.1 Recording, 3.4 Validation, 3.2 Material Depletion & 4.1 Expense Posting)",
        width=width,
        height=height,
        lifelines=lifelines,
        messages=messages,
        activations=activations,
        diagram_id="seq-diagram-operations"
    )

    with open("diagrams/Sequence_Diagram.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"SUCCESS: Wrote diagrams/Sequence_Diagram.svg ({len(svg_content)} bytes)!")


def generate_sequence_diagram_procurement():
    width = 1780
    height = 1100

    lifelines = [
        {"id": "timer", "name": ":SystemTimer", "type": "boundary", "x": 80, "layer": "presentation", "stereo": "boundary"},
        {"id": "c_alert", "name": ":ThresholdAlertController", "type": "control", "x": 270, "layer": "business", "stereo": "control"},
        {"id": "e_item", "name": ":InventoryItem", "type": "entity", "x": 480, "layer": "persistence", "stereo": "entity"},
        {"id": "ui_dash", "name": ":ManagerWebDashboard", "type": "boundary", "x": 700, "layer": "presentation", "stereo": "boundary"},
        {"id": "mgr", "name": "FarmManager", "type": "actor", "x": 910, "layer": "presentation", "stereo": "actor"},
        {"id": "ui_po", "name": ":ProcurementPortalUI", "type": "boundary", "x": 1120, "layer": "presentation", "stereo": "boundary"},
        {"id": "c_po", "name": ":ProcurementController", "type": "control", "x": 1330, "layer": "business", "stereo": "control"},
        {"id": "e_po", "name": ":PurchaseOrder", "type": "entity", "x": 1530, "layer": "persistence", "stereo": "entity"},
        {"id": "supp", "name": "Supplier", "type": "actor", "x": 1700, "layer": "presentation", "stereo": "actor"}
    ]

    messages = [
        {"num": 1, "from": 0, "to": 1, "y": 180, "type": "sync", "text": "1: triggerThresholdEvaluation()"},
        {"num": 2, "from": 1, "to": 2, "y": 225, "type": "sync", "text": "2: evaluateReorderLevel()"},
        {"num": 3, "from": 2, "to": 1, "y": 270, "type": "return", "text": "3: return isLowStock (qty <= ROP, currentQty=12, ROP=25)"},
        {"num": 4, "from": 1, "to": 3, "y": 315, "type": "sync", "text": "4: pushLowStockAlert(itemId, currentQty, rop)"},
        {"num": 5, "from": 3, "to": 4, "y": 360, "type": "sync", "text": "5: renderStockAlertBadge(\"CRITICAL: Corn Seeds below ROP\")"},
        {"num": 6, "from": 4, "to": 5, "y": 420, "type": "sync", "text": "6: openReplenishmentModal(itemId)"},
        {"num": 7, "from": 4, "to": 5, "y": 475, "type": "sync", "text": "7: submitOrderDispatch(supplierId, itemId, orderQty=50)"},
        {"num": 8, "from": 5, "to": 6, "y": 520, "type": "sync", "text": "8: createAndDispatchPO(poRequest)"},
        {"num": 9, "from": 6, "to": 7, "y": 565, "type": "sync", "text": "9: instantiatePO(poNumber, supplierId, totalAmount)"},
        {"num": 10, "from": 7, "to": 6, "y": 605, "type": "return", "text": "10: return poInstance (status=\"DISPATCHED\")"},
        {"num": 11, "from": 6, "to": 8, "y": 655, "type": "sync", "text": "11: transmitPurchaseOrderEDI(poNumber, orderPayload)"},
        {"num": 12, "from": 8, "to": 4, "y": 715, "type": "sync", "text": "12: deliverGoodsWithReceivingSlip(poNumber, actualQty=50)"},
        {"num": 13, "from": 4, "to": 5, "y": 770, "type": "sync", "text": "13: submitReceivingSlip(poNumber, actualQty, slipNumber)"},
        {"num": 14, "from": 5, "to": 6, "y": 815, "type": "sync", "text": "14: reconcileFulfillment(poNumber, deliveredItems)"},
        {"num": 15, "from": 6, "to": 7, "y": 860, "type": "sync", "text": "15: updateStatus(status=\"FULFILLED\", receivingSlipNo)"},
        {"num": 16, "from": 6, "to": 2, "y": 910, "type": "sync", "text": "16: adjustQuantity(+50, reason=\"PO_FULFILLMENT\")"},
        {"num": 17, "from": 2, "to": 6, "y": 950, "type": "return", "text": "17: return newBalanceOnHand (62 kg)"},
        {"num": 18, "from": 6, "to": 5, "y": 995, "type": "return", "text": "18: return fulfillmentReceipt(\"PO Reconciled & Stock Updated\")"},
        {"num": 19, "from": 5, "to": 4, "y": 1040, "type": "return", "text": "19: renderFulfillmentSuccessNotice(poNumber)"}
    ]

    activations = [
        {"x": lifelines[0]["x"] - 6, "y": 175, "h": 20},  # Timer
        {"x": lifelines[1]["x"] - 6, "y": 175, "h": 150}, # Threshold Controller
        {"x": lifelines[2]["x"] - 6, "y": 220, "h": 60},  # Item check
        {"x": lifelines[3]["x"] - 6, "y": 310, "h": 60},  # Dashboard alert
        {"x": lifelines[4]["x"] - 6, "y": 355, "h": 690}, # Manager
        {"x": lifelines[5]["x"] - 6, "y": 415, "h": 630}, # UI PO
        {"x": lifelines[6]["x"] - 6, "y": 515, "h": 490}, # Procure Controller
        {"x": lifelines[7]["x"] - 6, "y": 560, "h": 310}, # PO Entity
        {"x": lifelines[8]["x"] - 6, "y": 650, "h": 75},  # Supplier
        {"x": lifelines[2]["x"] - 6, "y": 905, "h": 55}   # Item update
    ]

    svg_content = build_sequence_svg(
        title="UML Sequence Diagram: Dynamic Reorder Point Alert & PO Fulfillment",
        subtitle="Process 5.4 Threshold Alerting, Process 6.0 Procurement & Process 2.2 Stock Reconciliation",
        width=width,
        height=height,
        lifelines=lifelines,
        messages=messages,
        activations=activations,
        diagram_id="seq-diagram-procurement"
    )

    with open("diagrams/Sequence_Diagram_Procurement.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"SUCCESS: Wrote diagrams/Sequence_Diagram_Procurement.svg ({len(svg_content)} bytes)!")


def build_sequence_svg(title, subtitle, width, height, lifelines, messages, activations, diagram_id):
    theme = {
        "presentation": {"bg": "#8B5CF6", "stroke": "#7C3AED", "box_bg": "#FAF5FF", "text": "#ffffff", "sub": "#c084fc"},
        "business": {"bg": "#0D9488", "stroke": "#0F766E", "box_bg": "#F0FDFA", "text": "#ffffff", "sub": "#2dd4bf"},
        "persistence": {"bg": "#D97706", "stroke": "#B45309", "box_bg": "#FFFBEB", "text": "#ffffff", "sub": "#fbbf24"},
        "actor": {"bg": "#1E293B", "stroke": "#0F172A", "box_bg": "#F8FAFC", "text": "#ffffff", "sub": "#94a3b8"}
    }

    svg_parts = []
    
    # Grid & markers
    svg_parts.append(f'''<defs>
  <pattern id="seqGrid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="1" style="stroke: light-dark(#e2e8f0, #1e293b);"/>
  </pattern>
  <marker id="syncMsgArrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
    <polygon points="0,1 10,5 0,9" fill="#0f172a" style="fill: light-dark(#0f172a, #f8fafc);"/>
  </marker>
  <marker id="returnMsgArrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
    <polyline points="0,1 10,5 0,9" fill="none" stroke="#475569" stroke-width="1.8" style="stroke: light-dark(#475569, #cbd5e1);"/>
  </marker>
</defs>
<rect width="100%" height="100%" fill="url(#seqGrid)" />
''')

    # Header block
    svg_parts.append(f'''
<!-- Header Title -->
<g id="header-block">
  <rect x="40" y="10" width="860" height="44" rx="8" ry="8" fill="#0f172a" style="fill: light-dark(#0f172a, #020617);"/>
  <text x="60" y="32" fill="#f8fafc" font-family="Recursive, system-ui, sans-serif" font-size="15px" font-weight="bold">{html.escape(title)}</text>
  <text x="60" y="46" fill="#10b981" font-family="Consolas, monospace" font-size="11px" font-weight="bold">{html.escape(subtitle)}</text>
</g>
''')

    # Layer Header Background Bands
    svg_parts.append('''
<!-- Architectural Layers Header Boxes (Slide 52) -->
<g id="layer-bands">
  <rect x="40" y="62" width="400" height="22" rx="4" ry="4" fill="#8b5cf6" opacity="0.15"/>
  <text x="50" y="77" fill="#7c3aed" font-family="sans-serif" font-size="11px" font-weight="bold" style="fill: light-dark(#7c3aed, #c084fc);">
    Presentation Layer (Boundary Interfaces - Slide 49 &amp; 52)
  </text>

  <rect x="460" y="62" width="280" height="22" rx="4" ry="4" fill="#0d9488" opacity="0.15"/>
  <text x="470" y="77" fill="#0f766e" font-family="sans-serif" font-size="11px" font-weight="bold" style="fill: light-dark(#0f766e, #2dd4bf);">
    Business Layer (Control Classes - Slide 51 &amp; 52)
  </text>

  <rect x="760" y="62" width="300" height="22" rx="4" ry="4" fill="#d97706" opacity="0.15"/>
  <text x="770" y="77" fill="#b45309" font-family="sans-serif" font-size="11px" font-weight="bold" style="fill: light-dark(#b45309, #fbbf24);">
    Persistence Layer (Entity Classes - Slide 48 &amp; 52)
  </text>
</g>
''')

    # Draw Lifelines & Participant Boxes
    for lf in lifelines:
        lx = lf["x"]
        lname = lf["name"]
        ltype = lf["type"]
        layer = lf["layer"]
        stereo = lf["stereo"]
        t = theme[layer]

        # Vertical lifeline dashed line
        svg_parts.append(f'''
<!-- Lifeline: {lname} -->
<line x1="{lx}" y1="145" x2="{lx}" y2="{height - 30}" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="6,5" style="stroke: light-dark(#94a3b8, #475569);"/>
''')
        # Participant Box / Stick Figure
        if ltype == "actor":
            # Actor stick figure + label
            svg_parts.append(f'''
<g id="actor-{lf["id"]}" transform="translate({lx - 40}, 90)">
  <circle cx="40" cy="10" r="8" fill="#ffffff" stroke="#0f172a" stroke-width="2" style="fill: light-dark(#ffffff, #1e293b); stroke: light-dark(#0f172a, #f8fafc);"/>
  <line x1="40" y1="18" x2="40" y2="34" stroke="#0f172a" stroke-width="2" style="stroke: light-dark(#0f172a, #f8fafc);"/>
  <line x1="28" y1="24" x2="52" y2="24" stroke="#0f172a" stroke-width="2" style="stroke: light-dark(#0f172a, #f8fafc);"/>
  <line x1="40" y1="34" x2="30" y2="48" stroke="#0f172a" stroke-width="2" style="stroke: light-dark(#0f172a, #f8fafc);"/>
  <line x1="40" y1="34" x2="50" y2="48" stroke="#0f172a" stroke-width="2" style="stroke: light-dark(#0f172a, #f8fafc);"/>
  <text x="40" y="60" fill="#0f172a" font-family="Recursive, system-ui, sans-serif" font-size="11.5px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">{lname}</text>
</g>
''')
        else:
            # UML Box with stereotype
            bw = 140
            bh = 46
            bx = lx - bw / 2
            by = 92
            svg_parts.append(f'''
<g id="box-{lf["id"]}">
  <rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="6" ry="6" fill="{t["box_bg"]}" stroke="{t["stroke"]}" stroke-width="2" style="fill: light-dark({t["box_bg"]}, #1e293b); stroke: light-dark({t["stroke"]}, {t["bg"]}); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));"/>
  <path d="M {bx} {by+16} L {bx} {by+6} Q {bx} {by} {bx+6} {by} L {bx+bw-6} {by} Q {bx+bw} {by} {bx+bw} {by+6} L {bx+bw} {by+16} Z" fill="{t["bg"]}"/>
  <text x="{lx}" y="{by + 12}" fill="{t["text"]}" font-family="sans-serif" font-size="9.5px" font-weight="600" text-anchor="middle">&lt;&lt;{stereo}&gt;&gt;</text>
  <text x="{lx}" y="{by + 33}" fill="#0f172a" font-family="Recursive, Consolas, monospace" font-size="11.5px" font-weight="bold" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">{lname}</text>
</g>
''')

    # Draw Activations (Execution bars)
    for act in activations:
        ax, ay, ah = act["x"], act["y"], act["h"]
        svg_parts.append(f'''
<rect x="{ax}" y="{ay}" width="12" height="{ah}" rx="2" ry="2" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" style="fill: light-dark(#cbd5e1, #334155); stroke: light-dark(#475569, #94a3b8);"/>
''')

    # Draw Messages
    for msg in messages:
        my = msg["y"]
        fx = lifelines[msg["from"]]["x"]
        tx = lifelines[msg["to"]]["x"]
        mtype = msg["type"]
        mtext = msg["text"]

        # If from < to, arrow goes right; if from > to, arrow goes left
        if fx < tx:
            start_x = fx + 6
            end_x = tx - 6
            text_x = start_x + 15
        else:
            start_x = fx - 6
            end_x = tx + 6
            text_x = end_x + 15

        msg_w = len(mtext) * 6.5 + 12
        text_bg_x = text_x - 4

        if mtype == "sync":
            svg_parts.append(f'''
<!-- Msg {msg["num"]}: {mtext} -->
<g id="msg-{msg["num"]}">
  <line x1="{start_x}" y1="{my}" x2="{end_x}" y2="{my}" stroke="#0f172a" stroke-width="1.8" marker-end="url(#syncMsgArrow)" style="stroke: light-dark(#0f172a, #f8fafc);"/>
  <rect x="{text_bg_x}" y="{my - 13}" width="{msg_w}" height="14" rx="2" ry="2" fill="#ffffff" opacity="0.9" style="fill: light-dark(#ffffff, #0f172a);"/>
  <text x="{text_x}" y="{my - 2}" fill="#0f172a" font-family="Consolas, monospace" font-size="10.5px" font-weight="bold" style="fill: light-dark(#0f172a, #38bdf8);">{html.escape(mtext)}</text>
</g>
''')
        elif mtype == "return":
            svg_parts.append(f'''
<!-- Return Msg {msg["num"]}: {mtext} -->
<g id="msg-{msg["num"]}">
  <line x1="{start_x}" y1="{my}" x2="{end_x}" y2="{my}" stroke="#475569" stroke-width="1.6" stroke-dasharray="5,4" marker-end="url(#returnMsgArrow)" style="stroke: light-dark(#475569, #cbd5e1);"/>
  <rect x="{text_bg_x}" y="{my - 13}" width="{msg_w}" height="14" rx="2" ry="2" fill="#ffffff" opacity="0.9" style="fill: light-dark(#ffffff, #0f172a);"/>
  <text x="{text_x}" y="{my - 2}" fill="#475569" font-family="Consolas, monospace" font-size="10px" font-weight="bold" font-style="italic" style="fill: light-dark(#475569, #94a3b8);">{html.escape(mtext)}</text>
</g>
''')

    # Draw.io native mxGraphModel XML
    mx_cells = []
    for lf in lifelines:
        lid = lf["id"]
        lname = html.escape(lf["name"])
        lx = lf["x"]
        mx_cells.append(f'''        <mxCell id="{lid}" value="{lname}" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;" vertex="1" parent="1">
          <mxGeometry x="{lx-50}" y="90" width="100" height="{height-120}" as="geometry" />
        </mxCell>''')

    for msg in messages:
        mid = f"m_{msg['num']}"
        mtxt = html.escape(msg["text"])
        my = msg["y"]
        fx = lifelines[msg["from"]]["x"]
        tx = lifelines[msg["to"]]["x"]
        mtype = msg["type"]
        style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
        if mtype == "sync":
            style += "endArrow=block;strokeWidth=2;"
        else:
            style += "endArrow=open;dashed=1;strokeWidth=1.5;"

        mx_cells.append(f'''        <mxCell id="{mid}" value="{mtxt}" style="{style}" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="{fx}" y="{my}" as="sourcePoint" />
            <mxPoint x="{tx}" y="{my}" as="targetPoint" />
          </mxGeometry>
        </mxCell>''')

    mxfile_xml = f'''<mxfile host="app.diagrams.net">
  <diagram name="Page-1" id="{diagram_id}">
    <mxGraphModel dx="1800" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{width}" pageHeight="{height}" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
{chr(10).join(mx_cells)}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''

    content_attr = html.escape(mxfile_xml)

    full_svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<!-- Do not edit this file with editors other than draw.io -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" style="background: transparent; background-color: transparent; color-scheme: light dark;" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="{width}px" height="{height}px" viewBox="0 0 {width} {height}" content="{content_attr}">
<g>
{chr(10).join(svg_parts)}
</g>
</svg>'''

    # Validate XML
    xml_only = full_svg[full_svg.find('<svg'):]
    ET.fromstring(xml_only)
    return full_svg

if __name__ == "__main__":
    generate_sequence_diagram_operations()
    generate_sequence_diagram_procurement()

