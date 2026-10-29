# SAD Backend Prototype Verification Modules

This directory provides functional backend scripts implementing core logic from the System Analysis & Design (SAD) deliverables.

---

## 1. Automated Stock Depletion Logic (Process 3.2 & Process 5.4)
**Script**: `simulate_depletion.ps1`  
**Database**: `inventory_db.json`

### Overview:
Simulates the linkage between field operations and inventory:
1. Ingests mock field activities (Crop fertilization, broiler flock feeding, livestock parasite treatments, or seed sowing).
2. Calculates required consumables via agronomic recipe formulas (e.g. `15.0 kg/ha` or `0.12 kg/bird`).
3. Deducts quantities atomically from `inventory_db.json`.
4. Calculates financial impact and books debit/credit entries to D4 Financial Ledger.
5. Monitors Dynamic Reorder Points:
   $$\text{ROP} = (\text{Daily Consumption Rate} \times \text{Lead Time Days}) + \text{Safety Buffer}$$
6. Automatically generates simulated Purchase Requisitions for the Farm Manager when stock breaches the reorder threshold.

### Example Executions:

```powershell
# 1. Plot Nitrogen Fertilization (15 hectares):
powershell -ExecutionPolicy Bypass -File .\simulate_depletion.ps1 -ActivityType "crop_fertilization" -Quantity 15 -PlotOrBatch "Plot North-4" -WorkerName "Alex Worker"

# 2. Daily Poultry Nutrition (1,200 birds):
powershell -ExecutionPolicy Bypass -File .\simulate_depletion.ps1 -ActivityType "poultry_flock_feed" -Quantity 1200 -PlotOrBatch "Coop Alpha" -WorkerName "Maria Santos"

# 3. Livestock Inoculation (50 cattle):
powershell -ExecutionPolicy Bypass -File .\simulate_depletion.ps1 -ActivityType "livestock_deworming" -Quantity 50 -PlotOrBatch "Pasture 2" -WorkerName "David Chen"
```

---

## 2. External Ecosystem Mock Server (Process 10.0)
**Script**: `mock_external_api_server.ps1`

### Overview:
A lightweight HTTP mock server validating Context-Level DFD system boundaries:
- **Entity E_Weather**: Enriched weather forecasts and agronomic advisories (spraying drift index, soil temperature at 10cm, soil moisture).
- **Entity E_ERP**: Third-party ERP financial ledger synchronization and supplier purchase orders.

### Example Execution:

```powershell
# Start mock server on port 8080:
powershell -ExecutionPolicy Bypass -File .\mock_external_api_server.ps1 -Port 8080

# In another terminal or browser, test the endpoints:
curl http://localhost:8080/api/v1/health
curl http://localhost:8080/api/v1/weather/agronomic-forecast
curl -X POST http://localhost:8080/api/v1/erp/sync-ledger -H "Content-Type: application/json" -d "{\"amount\": 340.50}"
```

