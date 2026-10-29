<#
.SYNOPSIS
    SAD System Prototype: Process 3.2 Automated Stock Depletion & Process 5.4 Threshold Alerting
.DESCRIPTION
    Simulates the linkage between agricultural field operations and inventory.
    Calculates required consumables based on standard agronomic recipes, deducts from dummy
    inventory database, checks dynamic reorder thresholds, and generates Purchase Requisitions
    for the Farm Manager when thresholds are breached.
.EXAMPLE
    .\simulate_depletion.ps1 -ActivityType "crop_fertilization" -Quantity 15 -PlotOrBatch "Plot North-4" -WorkerName "Worker Alex"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("crop_fertilization", "crop_urea_topdress", "poultry_flock_feed", "livestock_deworming", "maize_planting")]
    [string]$ActivityType = "crop_fertilization",

    [Parameter(Mandatory = $false)]
    [double]$Quantity = 12.0,

    [Parameter(Mandatory = $false)]
    [string]$PlotOrBatch = "Plot North Sector B",

    [Parameter(Mandatory = $false)]
    [string]$WorkerName = "Farm Worker Carlos"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$dbPath = Join-Path $scriptDir "inventory_db.json"

if (-not (Test-Path $dbPath)) {
    Write-Error "Database file not found at: $dbPath"
    exit 1
}

$rawJson = [System.IO.File]::ReadAllText($dbPath, [System.Text.Encoding]::UTF8)
$db = $rawJson | ConvertFrom-Json

$recipe = $db.activityRecipes.$ActivityType
if (-not $recipe) {
    Write-Error "Unknown activity recipe '$ActivityType'. Available recipes: $($db.activityRecipes.PSObject.Properties.Name -join ', ')"
    exit 1
}

# 1. Calculate Required Consumable (Process 3.2.1)
$requiredQty = [Math]::Round(($Quantity * $recipe.ratePerUnit), 2)

# 2. Verify Stock Availability (Process 3.2.2)
$item = $db.inventory | Where-Object { $_.id -eq $recipe.consumableId }
if (-not $item) {
    Write-Error "Consumable item '$($recipe.consumableId)' not found in inventory."
    exit 1
}

$initialStock = $item.currentStock
if ($initialStock -lt $requiredQty) {
    Write-Warning "INSUFFICIENT STOCK: Required $requiredQty $($item.unit), but only $initialStock $($item.unit) available!"
}

# 3. Deduct Stock from Dummy Inventory (Process 3.2.3)
$newStock = [Math]::Max(0.0, [Math]::Round(($initialStock - $requiredQty), 2))
$item.currentStock = $newStock
$financialExpense = [Math]::Round(($requiredQty * $item.unitCost), 2)

# 4. Check Dynamic Reorder Point (Process 5.4.1)
# Formula: ROP = (Daily Consumption Rate * Lead Time Days) + Safety Buffer
$rop = [Math]::Round((($item.dailyConsumptionRate * $item.leadTimeDays) + $item.safetyBuffer), 2)

$alertStatus = "NORMAL"
$badgeColor = "GREEN"
$requisition = $null

if ($newStock -le $item.safetyBuffer) {
    $alertStatus = "CRITICAL_STOCKOUT_RISK"
    $badgeColor = "RED"
} elseif ($newStock -le $rop) {
    $alertStatus = "REORDER_WARNING"
    $badgeColor = "AMBER"
}

# 5. Generate Replenishment Requisition if below threshold (Process 5.4.3)
if ($alertStatus -ne "NORMAL") {
    $suggestedReorderQty = [Math]::Round(($item.maxCapacity - $newStock), 2)
    $estimatedCost = [Math]::Round(($suggestedReorderQty * $item.unitCost), 2)
    $deliveryDue = (Get-Date).AddDays($item.leadTimeDays).ToString("yyyy-MM-dd")

    $requisition = [ordered]@{
        requisitionId = "REQ-" + (Get-Random -Minimum 1000 -Maximum 9999)
        timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        itemId = $item.id
        itemName = $item.name
        category = $item.category
        currentStock = $newStock
        reorderPoint = $rop
        suggestedOrderQty = $suggestedReorderQty
        unit = $item.unit
        estimatedCostUSD = $estimatedCost
        deliveryDueDate = $deliveryDue
        supplier = $item.supplier
        status = "PENDING_MANAGER_APPROVAL"
    }

    if (-not $db.requisitionOrders) { $db.requisitionOrders = @() }
    $db.requisitionOrders += $requisition
}

# 6. Log Depletion Transaction
$logEntry = [ordered]@{
    logId = "DEP-" + (Get-Random -Minimum 10000 -Maximum 99999)
    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    activityType = $ActivityType
    activityName = $recipe.activityName
    worker = $WorkerName
    location = $PlotOrBatch
    targetUnits = $Quantity
    targetUnitType = $recipe.targetType
    consumableId = $item.id
    consumableName = $item.name
    deductedQty = $requiredQty
    unit = $item.unit
    stockBefore = $initialStock
    stockAfter = $newStock
    financialImpactUSD = -($financialExpense)
    alertTriggered = $alertStatus
}

if (-not $db.depletionLogs) { $db.depletionLogs = @() }
$db.depletionLogs += $logEntry

# Save updated JSON database
$updatedJson = $db | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($dbPath, $updatedJson, [System.Text.Encoding]::UTF8)

# Output Summary to Console
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   SAD PROCESS 3.2 AUTOMATED STOCK DEPLETION EXECUTION RECEIPT   " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Log Reference       : $($logEntry.logId)"
Write-Host "Timestamp           : $($logEntry.timestamp)"
Write-Host "Field Activity      : $($recipe.activityName)"
Write-Host "Worker / Operator   : $WorkerName"
Write-Host "Plot / Location     : $PlotOrBatch ($Quantity $($recipe.targetType))"
Write-Host "Recipe Application  : $($recipe.ratePerUnit) $($recipe.rateUnit)"
Write-Host "-----------------------------------------------------------------"
Write-Host "Consumable Deducted : $($item.name) ($($item.id))" -ForegroundColor Yellow
Write-Host "Quantity Deducted   : $requiredQty $($item.unit)" -ForegroundColor Yellow
Write-Host "Stock Progression   : $initialStock $($item.unit)  -->  $newStock $($item.unit)" -ForegroundColor Yellow
Write-Host "Financial Impact    : `$$financialExpense posted to General Ledger D4"
Write-Host "-----------------------------------------------------------------"
Write-Host "PROCESS 5.4 THRESHOLD MONITORING:" -ForegroundColor Cyan
Write-Host "Dynamic Reorder Pt  : $rop $($item.unit) (Buffer: $($item.safetyBuffer), Lead Time: $($item.leadTimeDays) days)"
Write-Host "Threshold Status    : $alertStatus [$badgeColor BADGE]" -ForegroundColor ($badgeColor -replace 'AMBER','DarkYellow')

if ($requisition) {
    Write-Host "-----------------------------------------------------------------"
    Write-Host "AUTOMATED PURCHASE REQUISITION GENERATED (Process 5.4.3):" -ForegroundColor Magenta
    Write-Host "Requisition Ref     : $($requisition.requisitionId)" -ForegroundColor Magenta
    Write-Host "Supplier Assigned   : $($requisition.supplier.name)"
    Write-Host "Suggested Order Qty : $($requisition.suggestedOrderQty) $($item.unit)"
    Write-Host "Estimated PO Cost   : `$$($requisition.estimatedCostUSD)"
    Write-Host "Expected Delivery   : $($requisition.deliveryDueDate)"
    Write-Host "Approval State      : PENDING_MANAGER_APPROVAL" -ForegroundColor DarkCyan
}
Write-Host "=================================================================" -ForegroundColor Cyan

return ($logEntry | ConvertTo-Json)

