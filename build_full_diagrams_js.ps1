$ErrorActionPreference = "Stop"

$diagramDefs = @(
    # Overview
    @{ 
        id = "wbs"
        file = "diagrams/WBS.drawio.svg"
        level = "overview"
        badge = "WBS Hierarchy"
        title = "Work Breakdown Structure (WBS)"
        parent = $null
        children = @{ "1.0"="lvl1_1_0"; "2.0"="lvl1_2_0"; "3.0"="lvl1_3_0"; "4.0"="lvl1_4_0"; "5.0"="lvl1_5_0"; "6.0"="lvl1_6_0" }
        description = "Complete Work Breakdown Structure detailing Level 1 Processes, Level 2 Sub-Functions, and Level 3 Primitive Functions."
    },
    @{ 
        id = "context_dfd"
        file = "diagrams/ContextDFD.svg"
        level = "overview"
        badge = "Context DFD"
        title = "DFD Diagram 0.0 (Context Level Diagram)"
        parent = $null
        children = @{ "0.0"="dfd_lvl0"; "Farm Inventory"="dfd_lvl0"; "Operations Management"="dfd_lvl0" }
        description = "Context diagram (Diagram 0.0) depicting system boundary, external entities (Farm Worker, Farm Manager, Supplier, Customer, Agronomic API), and primary input/output data flows."
    },
    @{ 
        id = "dfd_lvl0"
        file = "diagrams/lvl0.drawio.svg"
        level = "0"
        badge = "DFD Diagram 0"
        title = "DFD Diagram 0 (Level 0 Functional Data Flow)"
        parent = "context_dfd"
        children = @{ "1.0"="lvl1_1_0"; "2.0"="lvl1_2_0"; "3.0"="lvl1_3_0"; "4.0"="lvl1_4_0"; "5.0"="lvl1_5_0"; "6.0"="lvl1_6_0" }
        description = "Level 0 diagram decomposing the system into 10 core functional processes and major central data stores."
    },
    
    # Level 1
    @{ 
        id = "lvl1_1_0"
        file = "diagrams/lvl1/level1process1.0.svg"
        level = "1"
        badge = "Level 1 (1.0)"
        title = "DFD Level 1: Process 1.0 (User & Role Governance)"
        parent = "dfd_lvl0"
        children = @{ "1.1"="lvl2_1_1"; "1.2"="lvl2_1_2"; "1.3"="lvl2_1_3" }
        description = "Decomposition of Process 1.0 into User Registration (1.1), RBAC Administration (1.2), and Profile/Session Management (1.3)."
    },
    @{ 
        id = "lvl1_2_0"
        file = "diagrams/lvl1/lvl1process2.0.svg"
        level = "1"
        badge = "Level 1 (2.0)"
        title = "DFD Level 1: Process 2.0 (Inventory & Stock Management)"
        parent = "dfd_lvl0"
        children = @{ "2.1"="lvl2_2_1"; "2.2"="lvl2_2_2"; "2.3"="lvl2_2_3"; "2.4"="lvl2_2_4"; "2.5"="lvl2_2_5"; "2.6"="lvl2_2_6" }
        description = "Decomposition of Process 2.0 into Categories (2.1), Stock Reconciliation (2.2), Purge Audit (2.3), Lot Tracking (2.4), Locations (2.5), and Transfers (2.6)."
    },
    @{ 
        id = "lvl1_3_0"
        file = "diagrams/lvl1/lvl1process3.0.svg"
        level = "1"
        badge = "Level 1 (3.0)"
        title = "DFD Level 1: Process 3.0 (Field Operations Management)"
        parent = "dfd_lvl0"
        children = @{ "3.1"="lvl2_3_1"; "3.2"="lvl2_3_2"; "3.3"="lvl2_3_3"; "3.4"="lvl2_3_4" }
        description = "Decomposition of Process 3.0 into Daily Logging (3.1), Material Depletion (3.2), Care Cycles (3.3), and Submission Validation (3.4)."
    },
    @{ 
        id = "lvl1_4_0"
        file = "diagrams/lvl1/lvl1process4.0.svg"
        level = "1"
        badge = "Level 1 (4.0)"
        title = "DFD Level 1: Process 4.0 (Financial Accounting & Expenses)"
        parent = "dfd_lvl0"
        children = @{ "4.1"="lvl2_4_1"; "4.2"="lvl2_4_2"; "4.3"="lvl2_4_3"; "4.4"="lvl2_4_4" }
        description = "Decomposition of Process 4.0 into Operational Expenses (4.1), Revenue Records (4.2), Ledger Accounting (4.3), and Financial Analytics (4.4)."
    },
    @{ 
        id = "lvl1_5_0"
        file = "diagrams/lvl1/lvl1process5.0.svg"
        level = "1"
        badge = "Level 1 (5.0)"
        title = "DFD Level 1: Process 5.0 (Reporting, Analytics & Dashboards)"
        parent = "dfd_lvl0"
        children = @{ "5.1"="lvl2_5_1"; "5.2"="lvl2_5_2"; "5.3"="lvl2_5_3"; "5.4"="lvl2_5_4" }
        description = "Decomposition of Process 5.0 into Inventory Balances (5.1), Report Generation (5.2), Dashboards (5.3), and Threshold Alerts (5.4)."
    },
    @{ 
        id = "lvl1_6_0"
        file = "diagrams/lvl1/lvl1process6.0.svg"
        level = "1"
        badge = "Level 1 (6.0)"
        title = "DFD Level 1: Process 6.0 (Procurement & Supplier Management)"
        parent = "dfd_lvl0"
        children = @{ "6.1"="lvl2_6_1"; "6.2"="lvl2_6_2" }
        description = "Decomposition of Process 6.0 into Supplier Directory (6.1) and Purchase Order Lifecycle Management (6.2)."
    },
    
    # Level 2
    @{ 
        id = "lvl2_1_1"
        file = "diagrams/lvl2/1.1.draw.io.svg"
        level = "2"
        badge = "Level 2 (1.1)"
        title = "DFD Level 2: Sub-process 1.1 (Register & Provision Accounts)"
        parent = "lvl1_1_0"
        children = @{}
        description = "Primitive decomposition of 1.1 into Demographics Capture (1.1.1), Credential Verification (1.1.2), and Workspace Provisioning (1.1.3)."
    },
    @{ 
        id = "lvl2_1_2"
        file = "diagrams/lvl2/1.2.drawio.svg"
        level = "2"
        badge = "Level 2 (1.2)"
        title = "DFD Level 2: Sub-process 1.2 (Role-Based Access Control)"
        parent = "lvl1_1_0"
        children = @{}
        description = "Primitive decomposition of 1.2 into Privilege Scopes (1.2.1), Role Assignments (1.2.2), and Method Constraints (1.2.3)."
    },
    @{ 
        id = "lvl2_1_3"
        file = "diagrams/lvl2/1.3.drawio.svg"
        level = "2"
        badge = "Level 2 (1.3)"
        title = "DFD Level 2: Sub-process 1.3 (Profiles & Auth Sessions)"
        parent = "lvl1_1_0"
        children = @{}
        description = "Primitive decomposition of 1.3 into Profile Maintenance (1.3.1), Authentication Tokens (1.3.2), and Session Termination (1.3.3)."
    },
    
    @{ 
        id = "lvl2_2_1"
        file = "diagrams/lvl2/2.1.drawio.svg"
        level = "2"
        badge = "Level 2 (2.1)"
        title = "DFD Level 2: Sub-process 2.1 (Inventory Categorization)"
        parent = "lvl1_2_0"
        children = @{}
        description = "Primitive decomposition of 2.1 into Master Categories (2.1.1), UoM Packaging (2.1.2), and Storage Conditions (2.1.3)."
    },
    @{ 
        id = "lvl2_2_2"
        file = "diagrams/lvl2/2.2.drawio.svg"
        level = "2"
        badge = "Level 2 (2.2)"
        title = "DFD Level 2: Sub-process 2.2 (Reconcile Stock Quantities)"
        parent = "lvl1_2_0"
        children = @{}
        description = "Primitive decomposition of 2.2 into Inbound Goods (2.2.1), Outbound Deductions (2.2.2), and Linked Postings (2.2.3)."
    },
    @{ 
        id = "lvl2_2_3"
        file = "diagrams/lvl2/2.3.drawio.svg"
        level = "2"
        badge = "Level 2 (2.3)"
        title = "DFD Level 2: Sub-process 2.3 (Authorize & Audit Purging)"
        parent = "lvl1_2_0"
        children = @{}
        description = "Primitive decomposition of 2.3 into Deletion Requests (2.3.1), Multi-Factor Authorization (2.3.2), and Immutable Archiving (2.3.3)."
    },
    @{ 
        id = "lvl2_2_4"
        file = "diagrams/lvl2/2.4.drawio.svg"
        level = "2"
        badge = "Level 2 (2.4)"
        title = "DFD Level 2: Sub-process 2.4 (Track Stock Movement & Lots)"
        parent = "lvl1_2_0"
        children = @{}
        description = "Primitive decomposition of 2.4 into Lot Barcodes (2.4.1), Depletion Lifecycles (2.4.2), and Movement Audit Trails (2.4.3)."
    },
    @{ 
        id = "lvl2_2_5"
        file = "diagrams/lvl2/2.5.drawio.svg"
        level = "2"
        badge = "Level 2 (2.5)"
        title = "DFD Level 2: Sub-process 2.5 (Location Hierarchies)"
        parent = "lvl1_2_0"
        children = @{}
        description = "Primitive decomposition of 2.5 into Parent Facilities (2.5.1), Sub-Location Partitioning (2.5.2), and Capacity Limits (2.5.3)."
    },
    @{ 
        id = "lvl2_2_6"
        file = "diagrams/lvl2/2.6.drawio.svg"
        level = "2"
        badge = "Level 2 (2.6)"
        title = "DFD Level 2: Sub-process 2.6 (Inter-Location Transfers)"
        parent = "lvl1_2_0"
        children = @{}
        description = "Primitive decomposition of 2.6 into Transfer Orders (2.6.1), Chain-of-Custody (2.6.2), and Destination Reconciliations (2.6.3)."
    },
    
    @{ 
        id = "lvl2_3_1"
        file = "diagrams/lvl2/3.1.drawio.svg"
        level = "2"
        badge = "Level 2 (3.1)"
        title = "DFD Level 2: Sub-process 3.1 (Daily Field & Animal Logs)"
        parent = "lvl1_3_0"
        children = @{}
        description = "Primitive decomposition of 3.1 into Livestock Husbandry (3.1.1), Agronomic Crop Logs (3.1.2), and Field Conditions (3.1.3)."
    },
    @{ 
        id = "lvl2_3_2"
        file = "diagrams/lvl2/3.2.drawio.svg"
        level = "2"
        badge = "Level 2 (3.2)"
        title = "DFD Level 2: Sub-process 3.2 (Automated Material Depletion)"
        parent = "lvl1_3_0"
        children = @{}
        description = "Primitive decomposition of 3.2 into Consumable Calculations (3.2.1), Availability Verification (3.2.2), and Physical Deductions (3.2.3)."
    },
    @{ 
        id = "lvl2_3_3"
        file = "diagrams/lvl2/3.3.drawio.svg"
        level = "2"
        badge = "Level 2 (3.3)"
        title = "DFD Level 2: Sub-process 3.3 (Care Cycles & Schedules)"
        parent = "lvl1_3_0"
        children = @{}
        description = "Primitive decomposition of 3.3 into Livestock Health Protocols (3.3.1), Agronomic Rotations (3.3.2), and Calendar Rosters (3.3.3)."
    },
    @{ 
        id = "lvl2_3_4"
        file = "diagrams/lvl2/3.4.drawio.svg"
        level = "2"
        badge = "Level 2 (3.4)"
        title = "DFD Level 2: Sub-process 3.4 (Validate Operational Submissions)"
        parent = "lvl1_3_0"
        children = @{}
        description = "Primitive decomposition of 3.4 into Activity Review (3.4.1), Ledger Authorization (3.4.2), and Correction Rejections (3.4.3)."
    },
    
    @{ 
        id = "lvl2_4_1"
        file = "diagrams/lvl2/4.1.drawio.svg"
        level = "2"
        badge = "Level 2 (4.1)"
        title = "DFD Level 2: Sub-process 4.1 (Capture Sectional Expenses)"
        parent = "lvl1_4_0"
        children = @{}
        description = "Primitive decomposition of 4.1 into Machinery Invoices (4.1.1), Consumable Purchasing (4.1.2), and Labor Logistics (4.1.3)."
    },
    @{ 
        id = "lvl2_4_2"
        file = "diagrams/lvl2/4.2.drawio.svg"
        level = "2"
        badge = "Level 2 (4.2)"
        title = "DFD Level 2: Sub-process 4.2 (Record Sales & Revenue)"
        parent = "lvl1_4_0"
        children = @{}
        description = "Primitive decomposition of 4.2 into Bulk Harvest Offtake (4.2.1), Direct Market Cash Receipts (4.2.2), and Customer Receivables (4.2.3)."
    },
    @{ 
        id = "lvl2_4_3"
        file = "diagrams/lvl2/4.3.drawio.svg"
        level = "2"
        badge = "Level 2 (4.3)"
        title = "DFD Level 2: Sub-process 4.3 (Standardize Ledger Accounts)"
        parent = "lvl1_4_0"
        children = @{}
        description = "Primitive decomposition of 4.3 into Cost Center Mapping (4.3.1), Double-Entry Reconciliations (4.3.2), and Compliance Audit Trails (4.3.3)."
    },
    @{ 
        id = "lvl2_4_4"
        file = "diagrams/lvl2/4.4.drawio.svg"
        level = "2"
        badge = "Level 2 (4.4)"
        title = "DFD Level 2: Sub-process 4.4 (Margin Analytics & Performance)"
        parent = "lvl1_4_0"
        children = @{}
        description = "Primitive decomposition of 4.4 into Cost of Goods (4.4.1), Operational Gross Margins (4.4.2), and Budget vs Actuals (4.4.3)."
    },
    
    @{ 
        id = "lvl2_5_1"
        file = "diagrams/lvl2/5.1.drawio.svg"
        level = "2"
        badge = "Level 2 (5.1)"
        title = "DFD Level 2: Sub-process 5.1 (Compile Balances & Valuation)"
        parent = "lvl1_5_0"
        children = @{}
        description = "Primitive decomposition of 5.1 into Stock Aggregations (5.1.1), Financial Valuation (5.1.2), and Stagnation Detection (5.1.3)."
    },
    @{ 
        id = "lvl2_5_2"
        file = "diagrams/lvl2/5.2.drawio.svg"
        level = "2"
        badge = "Level 2 (5.2)"
        title = "DFD Level 2: Sub-process 5.2 (Multi-Format Reports)"
        parent = "lvl1_5_0"
        children = @{}
        description = "Primitive decomposition of 5.2 into PDF Vector Rendering (5.2.1), XLSX Workbooks (5.2.2), and Tabular CSV Exports (5.2.3)."
    },
    @{ 
        id = "lvl2_5_3"
        file = "diagrams/lvl2/5.3.drawio.svg"
        level = "2"
        badge = "Level 2 (5.3)"
        title = "DFD Level 2: Sub-process 5.3 (Visual KPI Dashboards)"
        parent = "lvl1_5_0"
        children = @{}
        description = "Primitive decomposition of 5.3 into Worker Task Boards (5.3.1), Executive KPI Cards (5.3.2), and Time-Series Charts (5.3.3)."
    },
    @{ 
        id = "lvl2_5_4"
        file = "diagrams/lvl2/5.4.drawio.svg"
        level = "2"
        badge = "Level 2 (5.4)"
        title = "DFD Level 2: Sub-process 5.4 (Monitor Thresholds & Warnings)"
        parent = "lvl1_5_0"
        children = @{}
        description = "Primitive decomposition of 5.4 into Reorder Point Evaluation (5.4.1), Visual Warning Badges (5.4.2), and Requisition Orders (5.4.3)."
    },
    
    @{ 
        id = "lvl2_6_1"
        file = "diagrams/lvl2/6.1.drawio.svg"
        level = "2"
        badge = "Level 2 (6.1)"
        title = "DFD Level 2: Sub-process 6.1 (Maintain Supplier Directory)"
        parent = "lvl1_6_0"
        children = @{}
        description = "Primitive decomposition of 6.1 into Vendor Profile Ingestion (6.1.1), Catalog Management (6.1.2), and Reliability Tracking (6.1.3)."
    },
    @{ 
        id = "lvl2_6_2"
        file = "diagrams/lvl2/6.2.drawio.svg"
        level = "2"
        badge = "Level 2 (6.2)"
        title = "DFD Level 2: Sub-process 6.2 (Manage Purchase Order Lifecycles)"
        parent = "lvl1_6_0"
        children = @{}
        description = "Primitive decomposition of 6.2 into PO Dispatch (6.2.1), Fulfillment Tracking (6.2.2), and Three-Way Matching (6.2.3)."
    },
    
    # UML Diagrams
    @{ 
        id = "activity_diagram"
        file = "diagrams/Activity_Diagram.drawio.svg"
        level = "uml"
        badge = "Activity Diagram"
        title = "UML Activity Diagram: Process 3.0 Field Operations & Log Validation Workflow"
        parent = "lvl1_3_0"
        children = @{ "3.1 Record Daily"="lvl2_3_1"; "3.2 Execute Automated"="lvl2_3_2"; "3.4 Validate Operational"="lvl2_3_4"; "3.4.1 Review Worker"="lvl2_3_4"; "3.4.2 Authorize Approved"="lvl2_3_4"; "3.4.3 Review Correction"="lvl2_3_4" }
        description = "Swimlane activity workflow modeling the operational log lifecycle: Worker daily submission (3.1), automated material depletion (3.2), Manager validation (3.4), and operations log storage."
    },
    @{ 
        id = "use_case_diagram"
        file = "diagrams/Use_Case_Diagram.svg"
        level = "uml"
        badge = "Use Case Diagram"
        title = "UML Use Case Diagram: Actors & System Boundaries"
        parent = "context_dfd"
        children = @{ "2.0 Administer Inventory"="lvl1_2_0"; "2.2 Reconcile Stock"="lvl2_2_2"; "2.3 Authorize & Audit"="lvl2_2_3"; "3.1 Record Daily"="lvl2_3_1"; "3.4 Validate Operational"="lvl2_3_4"; "4.0 Track Finances"="lvl1_4_0"; "5.0 Deliver Reports"="lvl1_5_0"; "6.0 Manage Suppliers"="lvl1_6_0" }
        description = "Use case diagram depicting primary actors (Farm Worker, Farm Manager, Farm Owner, Supplier, Customer) interacting with core functional subsystems across system boundaries."
    }
)

Write-Output "Processing $($diagramDefs.Count) diagram definitions..."

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("/**")
[void]$sb.AppendLine(" * Farm Inventory & Operations Manager - System Architecture, DFD & UML Store")
[void]$sb.AppendLine(" * 34 Standard Draw.io Diagrams with Multi-Level Drill-Down Navigation.")
[void]$sb.AppendLine(" *")
[void]$sb.AppendLine(" * Levels:")
[void]$sb.AppendLine(" * - overview: Work Breakdown Structure (WBS) & Context Level DFD (Diagram 0.0)")
[void]$sb.AppendLine(" * - 0: DFD Level 0 (Diagram 0 - 10 Core Functional Processes)")
[void]$sb.AppendLine(" * - 1: DFD Level 1 (Processes 1.0 through 6.0)")
[void]$sb.AppendLine(" * - 2: DFD Level 2 (Sub-processes 1.1-1.3, 2.1-2.6, 3.1-3.4, 4.1-4.4, 5.1-5.4, 6.1-6.2)")
[void]$sb.AppendLine(" * - uml: UML Activity Diagram and UML Use Case Diagram")
[void]$sb.AppendLine(" */")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("const DIAGRAMS_DATA = [")

for ($i = 0; $i -lt $diagramDefs.Count; $i++) {
    $d = $diagramDefs[$i]
    if (-not (Test-Path $d.file)) {
        throw "File missing: $($d.file)"
    }
    
    $svgRaw = [System.IO.File]::ReadAllText($d.file, [System.Text.Encoding]::UTF8)
    $svgIndex = $svgRaw.IndexOf("<svg")
    if ($svgIndex -ge 0) {
        $svgRaw = $svgRaw.Substring($svgIndex)
    }
    # Normalize line endings to \n
    $svgRaw = $svgRaw.Replace("`r`n", "`n").Replace("`r", "`n")
    
    $diagramItem = [ordered]@{
        id = $d.id
        title = $d.title
        level = $d.level
        badge = $d.badge
        description = $d.description
        parent = $d.parent
        children = $d.children
        svg = $svgRaw
    }
    
    # Serialize individual object with depth
    $json = $diagramItem | ConvertTo-Json -Compress -Depth 10
    
    [void]$sb.Append("  ")
    [void]$sb.Append($json)
    if ($i -lt ($diagramDefs.Count - 1)) {
        [void]$sb.AppendLine(",")
    } else {
        [void]$sb.AppendLine("")
    }
    Write-Output "Serialized [$($i+1)/34]: $($d.id) ($($d.file)) - SVG size: $($svgRaw.Length) bytes"
}

[void]$sb.AppendLine("];")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("function getDiagramById(id) {")
[void]$sb.AppendLine("  if (!id) return null;")
[void]$sb.AppendLine("  if (id === 'sequence_diagram') id = 'use_case_diagram';")
[void]$sb.AppendLine("  return DIAGRAMS_DATA.find(d => d.id === id) || null;")
[void]$sb.AppendLine("}")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("function getDiagramsByLevel(level) {")
[void]$sb.AppendLine("  if (!level || level === 'all') return DIAGRAMS_DATA;")
[void]$sb.AppendLine("  return DIAGRAMS_DATA.filter(d => d.level === level);")
[void]$sb.AppendLine("}")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("// Global exports")
[void]$sb.AppendLine("window.DIAGRAMS_DATA = DIAGRAMS_DATA;")
[void]$sb.AppendLine("window.diagramsData = DIAGRAMS_DATA;")
[void]$sb.AppendLine("window.getDiagramById = getDiagramById;")
[void]$sb.AppendLine("window.getDiagramsByLevel = getDiagramsByLevel;")

$outputPath = "js/diagrams.js"
[System.IO.File]::WriteAllText($outputPath, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output "Successfully wrote $outputPath ($(([System.IO.FileInfo]$outputPath).Length) bytes)."
