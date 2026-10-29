# Farm Inventory & Operations Manager — Project Website & System Architecture

A responsive, code-editable project website built for the **Farm Inventory & Operations Management System** (Systems Analysis & Design / SAD Project).

---

## Quick Start: How to Open & Run the Website

### Method 1: Direct Browser Launch
Double-click `index.html` or open it with your browser:
- Windows: Open `index.html` in Microsoft Edge, Google Chrome, or Mozilla Firefox.

### Method 2: Local HTTP Server (Recommended)
Run the built-in Python web server from PowerShell in this directory:
```powershell
python -m http.server 8000
```
Then visit:
```
http://localhost:8000
```

---

## How to Change Diagrams with Code (`js/diagrams.js`)

All diagrams are defined as standard JavaScript string literals inside `js/diagrams.js`:

```javascript
// Located in js/diagrams.js
{
  id: "fig1_functional_decomposition",
  title: "Fig 1.1: Functional Decomposition of the System",
  code: `flowchart TD
    Root["Operate Farm Inventory and Operations System"]
    Root --> F1["Govern User Access and Permissions"]
    ...
  `
}
```

### Steps to Modify:
1. Open `js/diagrams.js` in VS Code or your preferred text editor.
2. Edit any node, connection, or label using standard Mermaid syntax.
3. Save the file and refresh `index.html` in your browser.

---

## 10 Core System Requirements

The system requirements encompass 10 foundational operational domains:

1. **User & Role Management**:
   - Register new users with specified agricultural scales (smallholding, commercial crop farm, livestock ranch, greenhouse, garden).
   - Assign roles: Superadmin / Developer, Owners, Managers, Workers, Gardeners.
   - Manage user profiles and security credentials.

2. **Inventory Management**:
   - Add and manage main categories: seeds, tools, livestock, fertilizers, farm produce.
   - Update stock quantities automatically upon purchasing and outgoing sales transactions.
   - Delete records with verification and authorization audit trails.
   - Track stock movement history and lot changes.
   - Define physical location hierarchies (barn, field, warehouse, storage zone).
   - Transfer items between physical locations.

3. **Operational Management**:
   - Record daily field activities for workers (feeding livestock, planting seeds, applying treatments).
   - Link operational activities to automatic depletion of relevant inventory stock.
   - Schedule routine maintenance for agricultural tools and livestock health/vaccination cycles.
   - Validate operational activities through managerial approval and rejection workflows.

4. **Financial & Expense Management**:
   - Record operational expenses categorized by section (purchasing, repairs, utilities, labor).
   - Record revenue transactions from farm produce sales.
   - Categorize types of expenses and revenues for transparent auditing.
   - Calculate total operational costs, gross income, and net profit margins.

5. **Reporting & Visualization Management**:
   - Generate current stock summary reports based on categories or individual items.
   - Export inventory data and financial reports to external formats (PDF, XLSX, CSV).
   - Display role-tailored visual dashboards (simple interfaces for workers; detailed analytical summaries with AI-assisted insights for owners/managers).
   - Early warning alerts when item stocks reach minimum thresholds.

6. **Supplier Management**:
   - Record and manage a directory of suppliers, vendors, and distributors via API, XLSX, or CSV ingestion.
   - Create and track the fulfillment safety of purchase orders.
   - Compare pricing and purchase histories across multiple suppliers for cost optimization.

7. **Asset Maintenance Management**:
   - Schedule periodic maintenance and routine servicing for heavy equipment and machinery.
   - Record asset repair history, maintenance costs, and current physical condition.
   - Provide automatic early warnings when service schedules are approaching or warranties expiring.

8. **Task Management**:
   - Create, read, update, delete (CRUD) and assign field tasks to designated workers.
   - Track live task progress and statuses (pending, in-progress, blocked, completed).
   - Validate task completions by supervisors.

9. **Offline & Synchronization Management**:
   - Store all inputs and records locally on the client device (offline-first architecture).
   - Automatically synchronize local queue data to the central server upon network restoration.
   - Resolve data conflicts when records are modified concurrently on server and client.

10. **External Integration Management**:
    - Provide a secure REST API for external third-party consumption.
    - Ingest live external data feeds (weather forecasts, agronomic recommendations, market prices).
    - Export financial and inventory data in formats compatible with third-party accounting software and ERP systems.

---

## Work Breakdown Structure (WBS) & Hierarchical Decomposition

The Work Breakdown Structure adheres to standard Systems Analysis & Design (SAD) principles, decomposing functions into Level 1 Processes (X.0), Level 2 Sub-Functions (X.Y), and Level 3 Primitive Functions (X.Y.Z) ready for further decomposition:

### 1.0 User & Role Governance Management
- **1.1 Register & Provision User Accounts**
  - 1.1.1 Capture User Demographics & Agricultural Scale Parameters
  - 1.1.2 Verify Identity Credentials & Contact Details
  - 1.1.3 Provision Farm Workspace & Organizational Context
- **1.2 Administer Role-Based Access Control (RBAC)**
  - 1.2.1 Define Privilege Scopes (Superadmin, Owner, Manager, Worker, Gardener)
  - 1.2.2 Assign & Reassign System Roles to User Accounts
  - 1.2.3 Enforce Method-Level Access Constraints & Audit Logs
- **1.3 Manage User Profiles & Authentication Sessions**
  - 1.3.1 Maintain Account Profiles, Contact Info & Locale Preferences
  - 1.3.2 Authenticate Credentials & Issue Secure Session Tokens
  - 1.3.3 Terminate Sessions & Rotate Security Credentials

### 2.0 Inventory & Multi-Location Stock Management
- **2.1 Configure Inventory Categorization & Standards**
  - 2.1.1 Maintain Master Categories (Seeds, Tools, Livestock, Fertilizers, Produce)
  - 2.1.2 Configure Units of Measurement (UoM) & Packaging Specifications
  - 2.1.3 Define Quality Grades & Storage Condition Rules
- **2.2 Reconcile Stock Quantities via Transactions** *(Decomposed into DFD Diagram 2.2)*
  - 2.2.1 Process Inbound Goods Receipts & Inward Restock Batches
  - 2.2.2 Process Outbound Sales Deductions & Dispatch Allocations
  - 2.2.3 Trigger Automated Linked Financial Ledger Postings
- **2.3 Authorize & Audit Record Purging**
  - 2.3.1 Submit Record Deletion Requests with Justification
  - 2.3.2 Validate Multi-Factor Administrator Authorization Token
  - 2.3.3 Archive Redundant Records to Immutable Historical Audit Log
- **2.4 Track Stock Movement & Batch Lot Histories**
  - 2.4.1 Assign Deterministic Unique Lot Numbers & Cryptographic Barcodes
  - 2.4.2 Trace Batch Depletion, Spoilage, Shrinkage & Life Cycles
  - 2.4.3 Generate End-to-End Stock Movement Audit Trails
- **2.5 Establish Physical Location Hierarchies**
  - 2.5.1 Define Parent Facilities (Barns, Fields, Greenhouses, Warehouses)
  - 2.5.2 Subdivide Holdings into Sub-Locations (Bins, Aisles, Silos, Plots)
  - 2.5.3 Monitor Capacity Limits & Environmental Storage Parameters
- **2.6 Execute Inter-Location Stock Transfers**
  - 2.6.1 Generate Transfer Orders with Source & Destination Specifications
  - 2.6.2 Verify Transit Chain-of-Custody & Dispatch Handover
  - 2.6.3 Reconcile Destination Received Quantities & Update Balances

### 3.0 Agricultural Field Operations Management
- **3.1 Record Daily Field & Animal Activities**
  - 3.1.1 Log Livestock Husbandry Operations (Feeding, Watering, Milking)
  - 3.1.2 Log Crop Agronomic Activities (Sowing, Irrigating, Harvesting)
  - 3.1.3 Capture Field Condition Metrics, Worker Hours & Equipment Utilized
- **3.2 Execute Automated Material Depletion**
  - 3.2.1 Calculate Required Inventory Consumables (Feed Bags, Seed Batches, Fertilizer Kg)
  - 3.2.2 Verify Stock Availability & Reserve Material Quantities
  - 3.2.3 Post Immediate Automated Stock Deductions to Physical Inventory Ledger
- **3.3 Administer Care Cycles & Preventive Schedules**
  - 3.3.1 Schedule Livestock Health Protocols (Vaccinations, Treatments)
  - 3.3.2 Schedule Agronomic Cultivation Sequences & Rotational Fallow Cycles
  - 3.3.3 Generate Operational Calendar Alerts & Worker Duty Rosters
- **3.4 Validate Operational Submissions (Managerial Workflow)**
  - 3.4.1 Review Submitted Worker Activity Drafts Against Quality Standards
  - 3.4.2 Authorize Approved Submissions for Downstream Financial & Stock Posting
  - 3.4.3 Return Rejected Submissions with Correction Requests

### 4.0 Financial Accounting & Expense Management
- **4.1 Capture Sectional Operational Expenses**
  - 4.1.1 Log Equipment Repair & Maintenance Invoices
  - 4.1.2 Record Consumable Purchasing Invoices (Seeds, Feeds, Chemicals)
  - 4.1.3 Log Labor Wages, Utility Overheads & Logistics Costs
- **4.2 Record Revenue & Inward Sales Transactions**
  - 4.2.1 Record Bulk Harvest Offtake Sales & Commercial Invoices
  - 4.2.2 Capture Direct-to-Consumer Market Sales & Cash Receipts
  - 4.2.3 Track Customer Receivables & Settlement Schedules
- **4.3 Standardize Account Categorization & Ledger Accounts**
  - 4.3.1 Classify Financial Entries by Cost Center (Crop Production, Livestock, Overhead)
  - 4.3.2 Reconcile Double-Entry Debit & Credit Allocations
  - 4.3.3 Maintain Audit Trails for Tax Compliance & Accounting Integration
- **4.4 Compute Financial Performance & Margin Analytics**
  - 4.4.1 Calculate Cost of Goods Produced (COGP) per Production Unit
  - 4.4.2 Compute Gross Operational Margins & Net Profit Margins
  - 4.4.3 Perform Variance Analysis Between Budgeted Allocations & Realized Expenditures

### 5.0 Reporting, Analytics & Visualization Management
- **5.1 Compile Inventory Balances & Stock Valuation**
  - 5.1.1 Aggregate Stock Counts by Category, Commodity & Zone
  - 5.1.2 Calculate Current Inventory Valuation (FIFO / Weighted Average)
  - 5.1.3 Detect Stock Stagnation, Expiration & Shrinkage
- **5.2 Generate & Dispatch Multi-Format Business Reports**
  - 5.2.1 Render Formatted PDF Vector Documents (Statements, Summaries)
  - 5.2.2 Compile Structured XLSX Workbooks with Formula Breakdowns
  - 5.2.3 Export Tabular CSV Datasets for External Analytics
- **5.3 Render Role-Differentiated Visual Dashboards**
  - 5.3.1 Display Streamlined Task & Workload View for Workers
  - 5.3.2 Render Executive KPI Dashboard with AI Insights for Owners
  - 5.3.3 Provide Real-Time Interactive Analytical Charts & Heatmaps
- **5.4 Monitor Stock Thresholds & Dispatch Early Warnings**
  - 5.4.1 Evaluate Dynamic Reorder Points Against Live Stock
  - 5.4.2 Broadcast Visual UI Warning Badges & Push Alerts
  - 5.4.3 Automatically Generate Replenishment Procurement Requisitions

### 6.0 Procurement & Supplier Relationship Management
- **6.1 Maintain Centralized Supplier & Vendor Directory**
  - 6.1.1 Ingest Vendor Profiles via API, XLSX, or CSV Import
  - 6.1.2 Manage Supplier Catalogs, Agreed Price Lists & Lead Times
  - 6.1.3 Track Supplier Reliability, Delivery Accuracy & Quality Ratings
- **6.2 Manage Purchase Order (PO) Lifecycles & Fulfillment**
  - 6.2.1 Authorize & Dispatch Formal Purchase Orders to Vendors
  - 6.2.2 Track In-Transit Deliveries & Partial Fulfillment States
  - 6.2.3 Perform Three-Way Matching (PO, Receiving Slip, Inward Invoice)
- **6.3 Conduct Supplier Benchmarking & Cost Analytics**
  - 6.3.1 Benchmark Historical Unit Costs Across Vendors
  - 6.3.2 Evaluate Volume Discount Schedules & Payment Terms
  - 6.3.3 Recommend Cost-Optimal Procurement Sources

### 7.0 Fixed Asset & Machinery Maintenance Management
- **7.1 Schedule Routine Asset Inspections & Maintenance**
  - 7.1.1 Track Operating Hours / Mileage Meters for Heavy Machinery
  - 7.1.2 Define Recurring Preventive Service Intervals (Fluids, Hydraulics)
  - 7.1.3 Dispatch Maintenance Work Orders to Technicians
- **7.2 Log Asset Repair Histories, Expenditures & Conditions**
  - 7.2.1 Record Detailed Repair Logs, Replaced Parts & Costs
  - 7.2.2 Track Total Cost of Ownership (TCO) & Cumulative Depreciation
  - 7.2.3 Update Asset Health Status (Operational, Under Repair, Retired)
- **7.3 Monitor Service Windows & Warranty Expirations**
  - 7.3.1 Evaluate Approaching Service Due Dates & Inspection Deadlines
  - 7.3.2 Track Manufacturer Warranty Terms & Expiration Dates
  - 7.3.3 Trigger Automated Warning Notices Prior to Warranty Lapses

### 8.0 Field Task Allocation & Workload Management
- **8.1 Create, Schedule & Allocate Operational Tasks**
  - 8.1.1 Define Task Packages with Scope, Location, Equipment & Priority
  - 8.1.2 Assign Tasks to Designated Workers or Field Crews
  - 8.1.3 Establish Safety Guidelines, Preconditions & Completion Windows
- **8.2 Monitor Real-Time Task Execution States**
  - 8.2.1 Update Work Status Transitions (Pending, In-Progress, Blocked, Done)
  - 8.2.2 Log Delay Reasons, Weather Interruptions & Bottlenecks
  - 8.2.3 Track Actual vs. Scheduled Execution Duration
- **8.3 Validate Deliverables & Perform Supervisor Sign-Off**
  - 8.3.1 Conduct Quality Inspections of Completed Field Deliverables
  - 8.3.2 Record Supervisor Sign-Off or Issue Revision Requests
  - 8.3.3 Close Completed Task Orders & Update Worker Performance Logs

### 9.0 Offline Operation & Client-Server Synchronization
- **9.1 Maintain Client-Side Persistent Offline Queue**
  - 9.1.1 Intercept Client Input Transactions when Disconnected
  - 9.1.2 Serialize Records into Local IndexedDB with Monotonic Timestamps
  - 9.1.3 Provide Optimistic UI Feedback Ensuring Field Continuity
- **9.2 Coordinate Automatic Background Batch Synchronization**
  - 9.2.1 Detect Network Restoration Events & Heartbeat Signals
  - 9.2.2 Assemble Pending Offline Records into Cryptographically Signed Batches
  - 9.2.3 Transmit Batches to Server API Gateway in Strict Sequential FIFO Order
- **9.3 Arbitrate & Resolve Client-Server Data Conflicts**
  - 9.3.1 Detect Concurrent Multi-Client Revision Clashes via Vector Timestamps
  - 9.3.2 Apply Deterministic Business Rules (Latest-Valid-Timestamp / Server-Wins)
  - 9.3.3 Route Unresolvable Anomalies to Dedicated Managerial Review Queue

### 10.0 External Ecosystem & Inter-System Integration
- **10.1 Expose Secure RESTful API Gateway**
  - 10.1.1 Provide Token-Authenticated (OAuth2 / JWT) REST Endpoints
  - 10.1.2 Enforce API Rate Limiting, Request Validation & Payload Encryption
  - 10.1.3 Expose Webhook Notifications for Downstream Event Subscriptions
- **10.2 Ingest External Environmental & Agronomic Feeds**
  - 10.2.1 Ingest Microclimate & Hyper-Local Weather Forecast APIs
  - 10.2.2 Retrieve Crop Advisory & Pest Threat Warning Feeds
  - 10.2.3 Fetch Regional Market Pricing & Commodity Exchange Benchmarks
- **10.3 Interface with Third-Party Accounting & ERP Systems**
  - 10.3.1 Format Financial Batches for Accounting Systems (QuickBooks, Xero)
  - 10.3.2 Synchronize Inventory Stock Movements with Upstream ERP (SAP, Odoo)
  - 10.3.3 Validate Bidirectional Data Integrity Across Reconciliation Boundaries

---

## DFD Level Mapping Reference

| WBS Process ID | Functional Process | Mapped Data Stores | DFD Diagram Level |
| :--- | :--- | :--- | :--- |
| **0.0** | Farm Inventory and Operations System | All Stores | **Context Level DFD (Diagram 0.0)** |
| **1.0** | User and Role Management | D1: User Accounts & Roles | **DFD Diagram 0 (Level 0)** |
| **2.0** | Inventory Management | D2: Inventory Ledger, D4: Financial Ledger | **DFD Diagram 1 (Level 1)** |
| **2.2** | Reconcile Stock Quantities via Transactions | D2: Inventory Ledger, D4: Financial Ledger | **DFD Diagram 2.2 (Level 2 Primitive)** |
| **3.0** | Operational Management | D2: Inventory Ledger, D3: Operations Logs | **DFD Diagram 2 (Level 1)** |
| **4.0** | Financial & Expense Management | D4: Financial Ledger & Cashflow | **DFD Diagram 3 (Level 1)** |
| **5.0** | Reporting & Visualization Management | D2: Inventory, D4: Financial Ledger | **DFD Diagram 0 (Level 0)** |
| **6.0** | Supplier Management | D5: Supplier Directory & POs | **DFD Diagram 0 (Level 0)** |
| **7.0** | Asset Maintenance Management | D6: Asset & Equipment Registry | **DFD Diagram 0 (Level 0)** |
| **8.0** | Task Management | D7: Tasks & Schedules | **DFD Diagram 0 (Level 0)** |
| **9.0** | Offline & Synchronization Management | D8: Offline Queue (Local DB) | **DFD Diagram 0 (Level 0) / Architecture in diagrams.js** |
| **10.0** | External Integration Management | External Gateway Interface | **Context Level DFD** |

---

## Full-Width Diagram Viewer Features

- **Spacious Canvas**: Full-width viewport with no cramped sidebars or panels covering the diagram.
- **Pan & Zoom**: Smooth click-and-drag panning and mouse wheel zoom.
- **Fit to View**: Auto-scales complex multi-tier diagrams to fit comfortably within the screen.
- **Fullscreen Mode**: Expands the canvas to the full browser window for presentations or deep inspection.
- **Exporting**: One-click high-resolution **SVG** and **PNG** export for Word documents (`.docx`), project reports, or slides.
- **Copy Code**: Copies the clean Mermaid source code to your clipboard with one click.

---

## Project Directory Structure

```
SAD/
├── index.html                   # Main project website with WBS matrix & diagram viewer
├── README.md                    # System documentation and SAD user manual
├── backend/                     # Functional backend verification scripts
│   ├── inventory_db.json        # Dummy inventory ledger (D2) with dynamic ROPs & recipes
│   ├── simulate_depletion.ps1   # Process 3.2 stock depletion & Process 5.4 alerts engine
│   ├── mock_external_api_server.ps1 # Process 10.0 HTTP mock server (Weather + ERP)
│   └── README.md                # CLI commands and execution instructions
├── css/
│   ├── styles.css               # Clean typography, dark/light theme, full-width canvas
│   └── diagram-fonts.css        # Embedded font fallbacks for Draw.io diagrams
├── diagrams/                    # Native vector Draw.io diagram SVGs (34 total)
│   ├── Activity_Diagram.drawio.svg
│   ├── Use_Case_Diagram.svg
│   ├── ContextDFD.svg
│   ├── lvl0.drawio.svg
│   ├── WBS.drawio.svg
│   ├── lvl1/                    # Level 1 Process diagrams (1.0 - 6.0)
│   └── lvl2/                    # Level 2 Sub-process diagrams (23 primitive diagrams)
├── js/
│   ├── diagrams.js              # Native SVG diagram database (34 diagrams)
│   ├── diagram-editor.js        # Interactive hierarchical drill-down viewer (pan/zoom/fit)
│   ├── prototypes.js            # Role dashboards, depletion logic, ROP alerts, & API testbed
│   ├── demo-tools.js            # Deterministic SHA-256 barcode & offline sync engines
│   └── app.js                   # Bilingual internationalization (EN/zh) & theme toggle
└── assets/
    └── vendor/
        └── mermaid.min.js       # Bundled offline library
```
