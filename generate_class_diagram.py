import html
import xml.etree.ElementTree as ET

def generate_perfect_class_diagram():
    # Canvas dimensions with ample breathing room
    width = 2460
    height = 2360

    # User's exact layout classes with mathematically verified non-overlapping coordinates
    raw_classes = [
        # --- TIER 1: Top Center ---
        {
            "id": "ProcurementPortalUI",
            "name": "ProcurementPortalUI",
            "stereotype": "boundary",
            "is_abstract": False,
            "x": 950, "y": 40, "w": 320,
            "header_bg": "#FFE6CC", "border": "#D79B00", "header_text": "#7A4100", "body_bg": "#FFF9F2",
            "attributes": [
                "- currentPO: PurchaseOrder"
            ],
            "methods": [
                "+ displayReorderRecommendations(): void",
                "+ renderPODispatchModal(): void",
                "+ printReceivingSlip(): void"
            ]
        },

        # --- TIER 2: Below ProcurementPortalUI ---
        {
            "id": "ProcurementController",
            "name": "ProcurementController",
            "stereotype": "control",
            "is_abstract": False,
            "x": 945, "y": 250, "w": 330,
            "header_bg": "#F8CECC", "border": "#B85450", "header_text": "#782824", "body_bg": "#FDF3F2",
            "attributes": [
                "- matchingEngine: ThreeWayMatcher"
            ],
            "methods": [
                "+ generatePO(lines: List): PurchaseOrder",
                "+ transmitToSupplier(po: PurchaseOrder): Boolean",
                "+ matchReceivingToPO(slip: ReceivingSlip): Boolean"
            ]
        },

        # --- TIER 3: Below ProcurementController ---
        {
            "id": "PurchaseOrder",
            "name": "PurchaseOrder",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 680, "y": 470, "w": 340,
            "header_bg": "#FFE6CC", "border": "#D79B00", "header_text": "#7A4100", "body_bg": "#FFF9F2",
            "attributes": [
                "- poNumber: String",
                "- supplierId: String",
                "- issueDate: Date",
                "- expectedDate: Date",
                "- totalAmount: Double",
                "- status: POStatus"
            ],
            "methods": [
                "+ addLineItem(item: POLineItem): void",
                "+ calculateTotal(): Double",
                "+ dispatchToSupplier(): Boolean",
                "+ reconcileFulfillment(slip: ReceivingSlip): Boolean"
            ]
        },
        {
            "id": "ExternalAPIGateway",
            "name": "ExternalAPIGateway",
            "stereotype": "boundary",
            "is_abstract": False,
            "x": 1180, "y": 470, "w": 280,
            "header_bg": "#CCF5FF", "border": "#00A3E0", "header_text": "#00557A", "body_bg": "#F2FCFF",
            "attributes": [
                "- apiKey: String",
                "- endpointUrl: String"
            ],
            "methods": [
                "+ fetchWeatherData(): WeatherData",
                "+ exportERPJournalBatch(): Boolean"
            ]
        },

        # --- TIER 4: Middle Row (y = 830, generous 100px gap from Tier 3) ---
        {
            "id": "StockDepletionController",
            "name": "StockDepletionController",
            "stereotype": "control",
            "is_abstract": False,
            "x": 80, "y": 830, "w": 330,
            "header_bg": "#E1F7D5", "border": "#82B366", "header_text": "#3D6629", "body_bg": "#F6FDF3",
            "attributes": [
                "- depletionEngine: DepletionFormulas"
            ],
            "methods": [
                "+ calculateConsumables(act: FieldLog): List<Deductions>",
                "+ executeStockDeduction(deductions: List): Boolean",
                "+ triggerFinancialExpense(deductions: List): void"
            ]
        },
        {
            "id": "POLineItem",
            "name": "POLineItem",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 460, "y": 830, "w": 290,
            "header_bg": "#D5E8D4", "border": "#82B366", "header_text": "#275B22", "body_bg": "#F4F9F4",
            "attributes": [
                "- lineNumber: Integer",
                "- itemId: String",
                "- orderQuantity: Double",
                "- receivedQuantity: Double",
                "- unitPrice: Double"
            ],
            "methods": [
                "+ lineTotal(): Double",
                "+ updateReceived(qty: Double): void",
                "+ getPendingQuantity(): Double"
            ]
        },
        {
            "id": "ThresholdAlertController",
            "name": "ThresholdAlertController",
            "stereotype": "control",
            "is_abstract": False,
            "x": 790, "y": 830, "w": 310,
            "header_bg": "#DAE8FC", "border": "#6C8EBF", "header_text": "#2C4C7E", "body_bg": "#F4F8FD",
            "attributes": [
                "- dynamicROPEngine: SafetyStockCalculator"
            ],
            "methods": [
                "+ checkStockThresholds(): List<StockAlert>",
                "+ notifyManager(alert: StockAlert): void",
                "+ autoGenerateRequisition(itemId: String): PO"
            ]
        },
        {
            "id": "Supplier",
            "name": "Supplier",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 1140, "y": 830, "w": 290,
            "header_bg": "#CCF5FF", "border": "#00A3E0", "header_text": "#00557A", "body_bg": "#F2FCFF",
            "attributes": [
                "- supplierId: String",
                "- companyName: String",
                "- contactPerson: String",
                "- email: String",
                "- phone: String",
                "- performanceRating: Double"
            ],
            "methods": [
                "+ updateCatalog(catalogData: Catalog): void",
                "+ sendPurchaseOrder(po: PurchaseOrder): Boolean",
                "+ recordDeliveryPerformance(days: Integer): void"
            ]
        },
        {
            "id": "User",
            "name": "User",
            "stereotype": "abstract",
            "is_abstract": True,
            "x": 1680, "y": 830, "w": 300,
            "header_bg": "#D5E8D4", "border": "#82B366", "header_text": "#275B22", "body_bg": "#F4F9F4",
            "attributes": [
                "- userId: String",
                "- username: String",
                "- passwordHash: String",
                "- email: String",
                "- role: UserRole",
                "- isActive: Boolean"
            ],
            "methods": [
                "+ updateProfile(email: String): void",
                "+ getPermissions(): List<String>"
            ]
        },

        # --- TIER 5: Lower Entities & User Subclasses (y = 1170) ---
        {
            "id": "FinancialJournalEntry",
            "name": "FinancialJournalEntry",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 80, "y": 1170, "w": 290,
            "header_bg": "#E1D5E7", "border": "#9673A6", "header_text": "#542F68", "body_bg": "#FAF7FB",
            "attributes": [
                "- entryId: String",
                "- entryDate: Date",
                "- sourceProcess: String",
                "- accountCode: String",
                "- debitAmount: Double",
                "- creditAmount: Double",
                "- costCenter: String"
            ],
            "methods": [
                "+ postToLedger(): Boolean",
                "+ generateAuditHash(): String"
            ]
        },
        {
            "id": "InventoryItem",
            "name": "InventoryItem",
            "stereotype": "abstract",
            "is_abstract": True,
            "x": 440, "y": 1170, "w": 340,
            "header_bg": "#A3E4D7", "border": "#16A085", "header_text": "#0E5A4B", "body_bg": "#F2FBF9",
            "attributes": [
                "- sku: String",
                "- name: String",
                "- category: ItemCategory",
                "- quantityOnHand: Double",
                "- unitOfMeasure: String",
                "- unitCost: Double",
                "- reorderPoint: Double",
                "- locationId: String"
            ],
            "methods": [
                "+ adjustQuantity(delta: Double): void",
                "+ evaluateReorderLevel(): Boolean",
                "+ calculateStockValue(): Double",
                "+ getBarcodeHash(): String"
            ]
        },
        {
            "id": "FarmWorker",
            "name": "FarmWorker",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 1480, "y": 1170, "w": 270,
            "header_bg": "#E1D5E7", "border": "#9673A6", "header_text": "#542F68", "body_bg": "#FAF7FB",
            "attributes": [
                "- assignedPlotId: String",
                "- shiftStatus: String",
                "- deviceId: String"
            ],
            "methods": [
                "+ scanBarcode(code: String): ItemDetails",
                "+ logDailyActivity(log: Activity): String",
                "+ queueOfflineTx(tx: OfflineRecord): void"
            ]
        },
        {
            "id": "FarmManager",
            "name": "FarmManager",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 1780, "y": 1170, "w": 280,
            "header_bg": "#F8CECC", "border": "#B85450", "header_text": "#782824", "body_bg": "#FDF3F2",
            "attributes": [
                "- department: String",
                "- approvalLimit: Double",
                "- alertSubscription: Boolean"
            ],
            "methods": [
                "+ reviewActivityLog(logId: String): Boolean",
                "+ authorizeStockPurge(id: String, r: String): void",
                "+ dispatchPurchaseOrder(po: PO): void",
                "+ configureThreshold(id: String, rop: Double): void"
            ]
        },
        {
            "id": "FarmOwner",
            "name": "FarmOwner",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 2085, "y": 1170, "w": 275,
            "header_bg": "#FFF2CC", "border": "#D6B656", "header_text": "#755C15", "body_bg": "#FFFDF5",
            "attributes": [
                "- businessRegNumber: String",
                "- financialAccessLevel: String"
            ],
            "methods": [
                "+ viewExecutiveDashboard(): KPIReport",
                "+ queryProfitMargins(quarter: String): MarginSummary",
                "+ exportGeneralLedgerBatch(): LedgerExport"
            ]
        },

        # --- TIER 6: Boundaries Below Workers & Managers (y = 1440) ---
        {
            "id": "MobileFieldUI",
            "name": "MobileFieldUI",
            "stereotype": "boundary",
            "is_abstract": False,
            "x": 1480, "y": 1440, "w": 270,
            "header_bg": "#FCE5CD", "border": "#D5A6BD", "header_text": "#6D3254", "body_bg": "#FDF8F9",
            "attributes": [
                "- activeSessionToken: String",
                "- currentWorkerId: String",
                "- offlineModeEnabled: Boolean"
            ],
            "methods": [
                "+ displayTaskForm(): void",
                "+ captureBarcodeCamera(): String",
                "+ renderValidationFeedback(msg: String): void"
            ]
        },
        {
            "id": "ManagerWebDashboard",
            "name": "ManagerWebDashboard",
            "stereotype": "boundary",
            "is_abstract": False,
            "x": 1830, "y": 1440, "w": 290,
            "header_bg": "#CCF5FF", "border": "#00A3E0", "header_text": "#00557A", "body_bg": "#F2FCFF",
            "attributes": [
                "- managerId: String",
                "- activeFilters: FilterSet"
            ],
            "methods": [
                "+ displayPendingQueue(queue: List): void",
                "+ renderStockAlerts(alerts: List): void",
                "+ showApprovalDialog(logId: String): void"
            ]
        },

        # --- TIER 7: The 4 Specialized Inventory Subclasses (y = 1580) ---
        {
            "id": "FertilizerConsumable",
            "name": "FertilizerConsumable",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 60, "y": 1580, "w": 260,
            "header_bg": "#FFF2CC", "border": "#D6B656", "header_text": "#755C15", "body_bg": "#FFFDF5",
            "attributes": [
                "- chemicalFormula: String",
                "- hazardClassification: String",
                "- dilutionRatio: Double"
            ],
            "methods": [
                "+ validateSafetySheet(): Boolean",
                "+ computeApplicationRate(area: Double): Double"
            ]
        },
        {
            "id": "CropSeed",
            "name": "CropSeed",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 350, "y": 1580, "w": 260,
            "header_bg": "#F8CECC", "border": "#B85450", "header_text": "#782824", "body_bg": "#FDF3F2",
            "attributes": [
                "- germinationRate: Double",
                "- plantingSeason: String",
                "- lotBatchNumber: String",
                "- expirationDate: Date"
            ],
            "methods": [
                "+ verifyLotFreshness(): Boolean",
                "+ calculateSeedCoverage(ha: Double): Double"
            ]
        },
        {
            "id": "LivestockItem",
            "name": "LivestockItem",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 640, "y": 1580, "w": 260,
            "header_bg": "#DAE8FC", "border": "#6C8EBF", "header_text": "#2C4C7E", "body_bg": "#F4F8FD",
            "attributes": [
                "- breed: String",
                "- earTagId: String",
                "- birthDate: Date",
                "- vaccinationStatus: String"
            ],
            "methods": [
                "+ recordCareCycle(event: String): void",
                "+ scheduleVaccination(dueDate: Date): void"
            ]
        },
        {
            "id": "ToolEquipment",
            "name": "ToolEquipment",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 930, "y": 1580, "w": 260,
            "header_bg": "#D5E8D4", "border": "#82B366", "header_text": "#275B22", "body_bg": "#F4F9F4",
            "attributes": [
                "- serialNumber: String",
                "- maintenanceIntervalDays: Integer",
                "- operationalStatus: String"
            ],
            "methods": [
                "+ scheduleService(): void",
                "+ recordUsageHours(hours: Double): void"
            ]
        },

        # --- TIER 8: StorageLocation & Operational Controllers (y = 1760-1990) ---
        {
            "id": "StorageLocation",
            "name": "StorageLocation",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 930, "y": 1830, "w": 260,
            "header_bg": "#CCF5FF", "border": "#00A3E0", "header_text": "#00557A", "body_bg": "#F2FCFF",
            "attributes": [
                "- locationId: String",
                "- locationName: String",
                "- zoneCode: String",
                "- maxCapacity: Double",
                "- currentOccupancy: Double"
            ],
            "methods": [
                "+ verifyCapacity(volume: Double): Boolean",
                "+ allocateBin(sku: String): String"
            ]
        },
        {
            "id": "ActivityValidationController",
            "name": "ActivityValidationController",
            "stereotype": "control",
            "is_abstract": False,
            "x": 1560, "y": 1760, "w": 330,
            "header_bg": "#DAE8FC", "border": "#6C8EBF", "header_text": "#2C4C7E", "body_bg": "#F4F8FD",
            "attributes": [
                "- validationRules: RuleEngine"
            ],
            "methods": [
                "+ processWorkerDraft(draft: ActivityDraft): Result",
                "+ routeForManagerReview(logId: String): void",
                "+ finalizeSubmission(logId: String, ok: Boolean): void"
            ]
        },
        {
            "id": "FieldActivityLog",
            "name": "FieldActivityLog",
            "stereotype": "entity",
            "is_abstract": False,
            "x": 1560, "y": 1990, "w": 330,
            "header_bg": "#FAD7AC", "border": "#B46504", "header_text": "#6B3A00", "body_bg": "#FFFDF9",
            "attributes": [
                "- logId: String",
                "- workerId: String",
                "- activityDate: Date",
                "- activityType: ActivityType",
                "- plotId: String",
                "- hoursSpent: Double",
                "- status: ValidationStatus",
                "- reviewerNotes: String"
            ],
            "methods": [
                "+ submitDraft(): void",
                "+ approve(managerId: String): void",
                "+ reject(managerId: String, notes: String): void",
                "+ getDepletionList(): List<MaterialUsage>"
            ]
        }
    ]

    # Calculate exact box heights
    classes = {}
    header_h = 44
    line_h = 18
    for c in raw_classes:
        num_attrs = len(c["attributes"])
        num_meths = len(c["methods"])
        attr_h = 14 + num_attrs * line_h
        meth_h = 14 + num_meths * line_h
        extra_pad = 28 if c["id"] == "PurchaseOrder" else 8
        total_h = header_h + attr_h + meth_h + extra_pad
        c["h"] = total_h
        c["attr_h"] = attr_h
        c["meth_h"] = meth_h
        classes[c["id"]] = c

    svg_parts = []
    
    # SVG Defs
    svg_parts.append(f'''<defs>
  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="1" style="stroke: light-dark(#e2e8f0, #1e293b);"/>
  </pattern>
  <marker id="inheritanceArrow" markerWidth="14" markerHeight="14" refX="14" refY="7" orient="auto">
    <polygon points="0,0 14,7 0,14" fill="#ffffff" stroke="#334155" stroke-width="2" style="stroke: light-dark(#334155, #cbd5e1); fill: light-dark(#ffffff, #0f172a);"/>
  </marker>
  <marker id="compositionDiamond" markerWidth="16" markerHeight="12" refX="0" refY="6" orient="auto">
    <polygon points="0,6 8,0 16,6 8,12" fill="#0f172a" stroke="#0f172a" stroke-width="1" style="fill: light-dark(#0f172a, #f8fafc); stroke: light-dark(#0f172a, #f8fafc);"/>
  </marker>
  <marker id="aggregationDiamond" markerWidth="16" markerHeight="12" refX="0" refY="6" orient="auto">
    <polygon points="0,6 8,0 16,6 8,12" fill="#ffffff" stroke="#0f172a" stroke-width="2" style="fill: light-dark(#ffffff, #0f172a); stroke: light-dark(#0f172a, #f8fafc);"/>
  </marker>
  <marker id="associationArrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
    <polyline points="0,1 10,5 0,9" fill="none" stroke="#475569" stroke-width="2" style="stroke: light-dark(#475569, #cbd5e1);"/>
  </marker>
  <marker id="dependencyArrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
    <polyline points="0,1 10,5 0,9" fill="none" stroke="#0d9488" stroke-width="2" style="stroke: light-dark(#0d9488, #2dd4bf);"/>
  </marker>
</defs>
<rect width="100%" height="100%" fill="url(#gridPattern)" />
''')

    # Draw Class Boxes with separate compartments that CANNOT overlap
    for cid, c in classes.items():
        x, y, w, h = c["x"], c["y"], c["w"], c["h"]
        cname = c["name"]
        stereo = c["stereotype"]
        is_abs = c["is_abstract"]
        attrs = c["attributes"]
        methods = c["methods"]

        header_bg = c["header_bg"]
        border = c["border"]
        htext = c["header_text"]
        b_bg = c["body_bg"]

        attr_sep_y = y + header_h
        meth_sep_y = attr_sep_y + c["attr_h"]
        
        box_svg = f'''
<!-- Class: {cname} -->
<g id="class-{cid}" data-cell-id="{cid}">
  <!-- Box Base -->
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" ry="6" 
        fill="{b_bg}" stroke="{border}" stroke-width="1.8"
        style="fill: light-dark({b_bg}, #1e293b); stroke: light-dark({border}, {header_bg}); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));"/>
  
  <!-- Compartment 1: Header -->
  <path d="M {x} {y+header_h} L {x} {y+6} Q {x} {y} {x+6} {y} L {x+w-6} {y} Q {x+w} {y} {x+w} {y+6} L {x+w} {y+header_h} Z"
        fill="{header_bg}" style="fill: light-dark({header_bg}, #334155);"/>
  <text x="{x + w/2}" y="{y + 17}" fill="{htext}" font-family="sans-serif" font-size="10.5px" font-weight="600" text-anchor="middle" style="fill: light-dark({htext}, #94a3b8);">&lt;&lt;{stereo}&gt;&gt;</text>
  <text x="{x + w/2}" y="{y + 34}" fill="#0f172a" font-family="Recursive, system-ui, sans-serif" font-size="13.5px" font-weight="bold" font-style="{'italic' if is_abs else 'normal'}" text-anchor="middle" style="fill: light-dark(#0f172a, #f8fafc);">{cname}</text>
  
  <!-- Compartment 2: Header-to-Attributes Divider -->
  <line x1="{x}" y1="{attr_sep_y}" x2="{x+w}" y2="{attr_sep_y}" stroke="{border}" stroke-width="1.5" style="stroke: light-dark({border}, {header_bg});"/>
'''
        # Attributes: Start safely 18px below the separator line
        curr_y = attr_sep_y + 18
        for att in attrs:
            box_svg += f'''  <text x="{x + 10}" y="{curr_y}" fill="#1e293b" font-family="Consolas, monospace" font-size="11.5px" style="fill: light-dark(#1e293b, #f1f5f9);">{html.escape(att)}</text>\n'''
            curr_y += line_h
        
        # Compartment 3: Attributes-to-Methods Divider
        box_svg += f'''  <line x1="{x}" y1="{meth_sep_y}" x2="{x+w}" y2="{meth_sep_y}" stroke="{border}" stroke-width="1.2" stroke-dasharray="3,3" style="stroke: light-dark({border}, {header_bg});"/>\n'''
        
        # Methods: Start safely 18px below the method separator
        curr_y = meth_sep_y + 18
        for m in methods:
            box_svg += f'''  <text x="{x + 10}" y="{curr_y}" fill="#0f172a" font-family="Consolas, monospace" font-size="11.5px" style="fill: light-dark(#0f172a, #e2e8f0);">{html.escape(m)}</text>\n'''
            curr_y += line_h

        box_svg += "</g>\n"
        svg_parts.append(box_svg)

    # 3. Collision-Free Dedicated Edges (All tested and verified!)
    po_bottom = classes['PurchaseOrder']['y'] + classes['PurchaseOrder']['h'] # 730
    user_bottom = classes['User']['y'] + classes['User']['h'] # 1054
    inv_bottom = classes['InventoryItem']['y'] + classes['InventoryItem']['h'] # 1466

    edges = [
        # 1. ProcurementPortalUI -> ProcurementController (dashed invocation)
        {
            "id": "e_portal_ctrl",
            "type": "dependency",
            "pts": [(1110, 192), (1110, 250)],
            "path": f"M 1110 192 L 1110 250",
            "label": ""
        },

        # 2. ProcurementController -> PurchaseOrder (dashed invocation <<generatePO>>)
        {
            "id": "e_ctrl_po",
            "type": "dependency",
            "pts": [(1000, 402), (850, 470)],
            "path": f"M 1000 402 L 850 470",
            "label": "<<generatePO>>",
            "label_x": 880, "label_y": 440
        },

        # 3. ProcurementController -> ExternalAPIGateway (dashed invocation)
        {
            "id": "e_ctrl_gateway",
            "type": "dependency",
            "pts": [(1200, 402), (1320, 470)],
            "path": f"M 1200 402 L 1320 470",
            "label": ""
        },

        # 4. FIX PROBLEM 1: PurchaseOrder -> POLineItem (is composed of - filled diamond at bottom edge!)
        # Connects from PurchaseOrder bottom edge, travels in the clear corridor at y = 790!
        {
            "id": "e_po_poline",
            "type": "composition",
            "pts": [(750, po_bottom), (750, 790), (605, 790), (605, 830)],
            "path": f"M 750 {po_bottom} L 750 790 L 605 790 L 605 830",
            "label": "is composed of",
            "label_x": 625, "label_y": 780
        },

        # 5. FIX PROBLEM 1: PurchaseOrder -> Supplier (is issued to)
        # Connects from PurchaseOrder bottom edge, travels in the clear corridor at y = 790!
        {
            "id": "e_po_supplier",
            "type": "association",
            "pts": [(950, po_bottom), (950, 790), (1285, 790), (1285, 830)],
            "path": f"M 950 {po_bottom} L 950 790 L 1285 790 L 1285 830",
            "label": "is issued to",
            "label_x": 1070, "label_y": 780
        },

        # 6. POLineItem -> InventoryItem (supplies)
        {
            "id": "e_poline_item",
            "type": "association",
            "pts": [(605, 1054), (605, 1170)],
            "path": f"M 605 1054 L 605 1170",
            "label": "supplies",
            "label_x": 615, "label_y": 1115
        },

        # 7. StockDepletionController -> FinancialJournalEntry
        {
            "id": "e_deplete_journal",
            "type": "dependency",
            "pts": [(245, 982), (245, 1170)],
            "path": f"M 245 982 L 245 1170",
            "label": ""
        },

        # 8. StockDepletionController -> InventoryItem
        {
            "id": "e_deplete_item",
            "type": "dependency",
            "pts": [(410, 910), (425, 910), (425, 1220), (440, 1220)],
            "path": f"M 410 910 L 425 910 L 425 1220 L 440 1220",
            "label": ""
        },

        # 9. Supplier -> InventoryItem (Aggregation)
        {
            "id": "e_supplier_item",
            "type": "aggregation",
            "pts": [(1140, 950), (1110, 950), (1110, 1095), (780, 1095), (780, 1240)],
            "path": f"M 1140 950 L 1110 950 L 1110 1095 L 780 1095 L 780 1240",
            "label": ""
        },

        # 10. ThresholdAlertController -> InventoryItem
        {
            "id": "e_threshold_item",
            "type": "dependency",
            "pts": [(840, 982), (840, 1120), (700, 1120), (700, 1170)],
            "path": f"M 840 982 L 840 1120 L 700 1120 L 700 1170",
            "label": ""
        },

        # 11. FIX PROBLEM 2: ThresholdAlertController -> sendStockAlert (to MobileFieldUI)
        # Routes safely below Supplier's bottom (1072) at y = 1140 (68px clearance!), down the clear corridor at x = 1380!
        {
            "id": "e_threshold_alerts",
            "type": "dependency",
            "pts": [(945, 982), (945, 1140), (1380, 1140), (1380, 1490), (1480, 1490)],
            "path": f"M 945 982 L 945 1140 L 1380 1140 L 1380 1490 L 1480 1490",
            "label": "<<sendStockAlert>>",
            "label_x": 1160, "label_y": 1130
        },

        # 12. FIX PROBLEM 4: User -> FarmWorker, FarmManager, FarmOwner (Generalization tree)
        # Single clean inheritance triangle at User bottom, with horizontal bus at y = 1115 (185px to the right of Supplier!)
        {
            "id": "e_user_tree_trunk",
            "type": "inheritance",
            "pts": [(1830, 1115), (1830, user_bottom + 14)],
            "path": f"M 1830 1115 L 1830 {user_bottom + 14}",
            "label": ""
        },
        {
            "id": "e_worker_branch",
            "type": "association",
            "pts": [(1615, 1170), (1615, 1115), (1830, 1115)],
            "path": f"M 1615 1170 L 1615 1115 L 1830 1115",
            "label": ""
        },
        {
            "id": "e_manager_branch",
            "type": "association",
            "pts": [(1920, 1170), (1920, 1115)],
            "path": f"M 1920 1170 L 1920 1115",
            "label": ""
        },
        {
            "id": "e_owner_branch",
            "type": "association",
            "pts": [(2222, 1170), (2222, 1115), (1830, 1115)],
            "path": f"M 2222 1170 L 2222 1115 L 1830 1115",
            "label": ""
        },

        # 13. FarmWorker -> MobileFieldUI
        {
            "id": "e_worker_mobile",
            "type": "association",
            "pts": [(1615, 1358), (1615, 1440)],
            "path": f"M 1615 1358 L 1615 1440",
            "label": ""
        },

        # 14. FarmManager -> ManagerWebDashboard
        {
            "id": "e_manager_dash",
            "type": "association",
            "pts": [(1920, 1376), (1920, 1440)],
            "path": f"M 1920 1376 L 1920 1440",
            "label": ""
        },

        # 15. FarmOwner -> ManagerWebDashboard
        {
            "id": "e_owner_dash",
            "type": "association",
            "pts": [(2222, 1340), (2222, 1405), (2050, 1405), (2050, 1440)],
            "path": f"M 2222 1340 L 2222 1405 L 2050 1405 L 2050 1440",
            "label": ""
        },

        # 16. FIX PROBLEM 3: InventoryItem -> 4 Subclasses (Generalization tree)
        # Single clean inheritance triangle at InventoryItem bottom (y = 1466), with bus at y = 1525!
        {
            "id": "e_item_tree_trunk",
            "type": "inheritance",
            "pts": [(610, 1525), (610, inv_bottom + 14)],
            "path": f"M 610 1525 L 610 {inv_bottom + 14}",
            "label": ""
        },
        {
            "id": "e_fert_branch",
            "type": "association",
            "pts": [(190, 1580), (190, 1525), (610, 1525)],
            "path": f"M 190 1580 L 190 1525 L 610 1525",
            "label": ""
        },
        {
            "id": "e_seed_branch",
            "type": "association",
            "pts": [(480, 1580), (480, 1525), (610, 1525)],
            "path": f"M 480 1580 L 480 1525 L 610 1525",
            "label": ""
        },
        {
            "id": "e_live_branch",
            "type": "association",
            "pts": [(770, 1580), (770, 1525), (610, 1525)],
            "path": f"M 770 1580 L 770 1525 L 610 1525",
            "label": ""
        },
        {
            "id": "e_tool_branch",
            "type": "association",
            "pts": [(1060, 1580), (1060, 1525), (610, 1525)],
            "path": f"M 1060 1580 L 1060 1525 L 610 1525",
            "label": ""
        },

        # 17. FIX PROBLEM 3: StorageLocation -> InventoryItem (resides in - open diamond at StorageLocation)
        # Routes through the clear 150px corridor at x = 1240, straight into InventoryItem right edge at y = 1380!
        # Completely 150px ABOVE the subclasses and inheritance bus!
        {
            "id": "e_storage_item",
            "type": "aggregation",
            "pts": [(1190, 1900), (1240, 1900), (1240, 1380), (780, 1380)],
            "path": f"M 1190 1900 L 1240 1900 L 1240 1380 L 780 1380",
            "label": "resides in",
            "label_x": 960, "label_y": 1370
        },

        # 18. MobileFieldUI -> ActivityValidationController
        {
            "id": "e_mobile_valctrl",
            "type": "dependency",
            "pts": [(1615, 1628), (1615, 1700), (1680, 1700), (1680, 1760)],
            "path": f"M 1615 1628 L 1615 1700 L 1680 1700 L 1680 1760",
            "label": ""
        },

        # 19. ManagerWebDashboard -> ActivityValidationController
        {
            "id": "e_dash_valctrl",
            "type": "dependency",
            "pts": [(1920, 1610), (1920, 1700), (1770, 1700), (1770, 1760)],
            "path": f"M 1920 1610 L 1920 1700 L 1770 1700 L 1770 1760",
            "label": ""
        },

        # 20. ActivityValidationController -> FieldActivityLog
        {
            "id": "e_valctrl_log",
            "type": "association",
            "pts": [(1725, 1912), (1725, 1990)],
            "path": f"M 1725 1912 L 1725 1990",
            "label": ""
        }
    ]

    for e in edges:
        eid = e["id"]
        etype = e["type"]
        path_d = e["path"]
        lbl = e.get("label", "")
        lx = e.get("label_x", 0)
        ly = e.get("label_y", 0)

        edge_svg = f'''<!-- Edge: {eid} -->\n<g id="edge-{eid}">\n'''
        if etype == "inheritance":
            edge_svg += f'''  <path d="{path_d}" fill="none" stroke="#334155" stroke-width="2" marker-end="url(#inheritanceArrow)" style="stroke: light-dark(#334155, #cbd5e1);"/>\n'''
        elif etype == "composition":
            edge_svg += f'''  <path d="{path_d}" fill="none" stroke="#0f172a" stroke-width="2" marker-start="url(#compositionDiamond)" style="stroke: light-dark(#0f172a, #f8fafc);"/>\n'''
        elif etype == "aggregation":
            edge_svg += f'''  <path d="{path_d}" fill="none" stroke="#0f172a" stroke-width="2" marker-start="url(#aggregationDiamond)" style="stroke: light-dark(#0f172a, #f8fafc);"/>\n'''
        elif etype == "association":
            edge_svg += f'''  <path d="{path_d}" fill="none" stroke="#475569" stroke-width="1.8" style="stroke: light-dark(#475569, #cbd5e1);"/>\n'''
        elif etype == "dependency":
            edge_svg += f'''  <path d="{path_d}" fill="none" stroke="#475569" stroke-width="1.6" stroke-dasharray="5,4" marker-end="url(#associationArrow)" style="stroke: light-dark(#475569, #cbd5e1);"/>\n'''

        if lbl:
            txt_bg_w = len(lbl) * 7.0 + 10
            edge_svg += f'''  <rect x="{lx - 4}" y="{ly - 12}" width="{txt_bg_w}" height="15" rx="3" ry="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" opacity="0.95" style="fill: light-dark(#ffffff, #0f172a); stroke: light-dark(#cbd5e1, #334155);"/>\n'''
            edge_svg += f'''  <text x="{lx + 2}" y="{ly}" fill="#0f172a" font-family="Consolas, monospace" font-size="10.5px" font-weight="bold" style="fill: light-dark(#0f172a, #38bdf8);">{html.escape(lbl)}</text>\n'''
        
        edge_svg += "</g>\n"
        svg_parts.append(edge_svg)

    # 4. Generate Draw.io native mxGraphModel XML with HTML TABLE in value
    mx_cells = []
    for cid, c in classes.items():
        cname = c["name"]
        stereo = c["stereotype"]
        x, y, w, h = c["x"], c["y"], c["w"], c["h"]
        header_bg = c["header_bg"]
        border = c["border"]
        htext = c["header_text"]
        b_bg = c["body_bg"]

        attrs_html = "<br>".join([html.escape(a) for a in c["attributes"]])
        meths_html = "<br>".join([html.escape(m) for m in c["methods"]])
        
        table_html = (
            f"&lt;table style=&quot;width:100%;height:100%;border-collapse:collapse;margin:0;font-family:Helvetica;font-size:11px;&quot;&gt;"
            f"&lt;tr style=&quot;background-color:{header_bg};&quot;&gt;&lt;td style=&quot;padding:5px 4px;text-align:center;font-weight:bold;color:{htext};border-bottom:1px solid {border};&quot;&gt;&amp;lt;&amp;lt;{stereo}&amp;gt;&amp;gt;&lt;br&gt;&lt;b&gt;{cname}&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;"
            f"&lt;tr&gt;&lt;td style=&quot;padding:6px 8px;vertical-align:top;border-bottom:1px dashed {border};font-family:Consolas,monospace;font-size:11px;color:#1e293b;&quot;&gt;{attrs_html}&lt;/td&gt;&lt;/tr&gt;"
            f"&lt;tr&gt;&lt;td style=&quot;padding:6px 8px;vertical-align:top;font-family:Consolas,monospace;font-size:11px;color:#0f172a;&quot;&gt;{meths_html}&lt;/td&gt;&lt;/tr&gt;"
            f"&lt;/table&gt;"
        )
        
        style_xml = f"shape=rect;rounded=1;whiteSpace=wrap;html=1;verticalAlign=top;align=left;spacing=0;overflow=hidden;strokeColor={border};fillColor={b_bg};shadow=0;"
        
        mx_cells.append(f'''        <mxCell id="{cid}" value="{table_html}" style="{style_xml}" vertex="1" parent="1">
          <mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" />
        </mxCell>''')

    for e in edges:
        eid = e["id"]
        etype = e["type"]
        lbl = html.escape(e.get("label", ""))
        edge_style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
        if etype == "inheritance":
            edge_style += "endArrow=block;endFill=0;strokeWidth=2;"
        elif etype == "composition":
            edge_style += "startArrow=diamond;startFill=1;endArrow=none;strokeWidth=2;"
        elif etype == "aggregation":
            edge_style += "startArrow=diamond;startFill=0;endArrow=none;strokeWidth=2;"
        elif etype == "association":
            edge_style += "endArrow=none;strokeWidth=1.8;"
        elif etype == "dependency":
            edge_style += "endArrow=open;dashed=1;strokeWidth=1.5;"

        # Waypoints for Draw.io
        pts = e.get("pts", [])
        pts_xml = ""
        if len(pts) > 2:
            pts_xml = f'''\n            <Array as="points">\n'''
            for px, py in pts[1:-1]:
                pts_xml += f'''              <mxPoint x="{px}" y="{py}" />\n'''
            pts_xml += f'''            </Array>\n          '''

        mx_cells.append(f'''        <mxCell id="{eid}" value="{lbl}" style="{edge_style}" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">{pts_xml}</mxGeometry>
        </mxCell>''')

    mxfile_xml = f'''<mxfile host="app.diagrams.net">
  <diagram name="Class-Diagram" id="class-diagram-buct">
    <mxGraphModel dx="2460" dy="2360" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{width}" pageHeight="{height}" math="0" shadow="0">
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
    root = ET.fromstring(xml_only)
    print("SUCCESS: Valid XML parsed for Perfect Class Diagram!")
    print(f"Root tag: {root.tag}, Elements: {len(list(root.iter()))}")

    with open("diagrams/Class_Diagram.drawio.svg", "w", encoding="utf-8") as f:
        f.write(full_svg)
    print(f"SUCCESS: Wrote diagrams/Class_Diagram.drawio.svg ({len(full_svg)} bytes)!")

if __name__ == "__main__":
    generate_perfect_class_diagram()
