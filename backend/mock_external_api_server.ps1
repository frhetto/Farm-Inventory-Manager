<#
.SYNOPSIS
    SAD System Prototype: Process 10.0 External Ecosystem & API Gateway Mock Server
.DESCRIPTION
    A robust, standalone HTTP mock server simulating external ecosystem interactions
    defined in the Context-Level DFD and Process 10.0:
    - Weather Service (Entity E_Weather): Ingests enriched agronomic weather feeds.
    - Third-Party ERP / Accounting (Entity E_ERP): Bidirectional JSON ledger sync.
.EXAMPLE
    # Run server on port 8080:
    .\mock_external_api_server.ps1 -Port 8080
#>

[CmdletBinding()]
param(
    [int]$Port = 8080,
    [int]$TimeoutSeconds = 0 # 0 for indefinite execution
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "Failed to start listener on $prefix : $_"
    exit 1
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  SAD PROCESS 10.0 EXTERNAL ECOSYSTEM MOCK GATEWAY (PORT: $Port)  " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Listening at: $prefix" -ForegroundColor Green
Write-Host "Active Endpoints:" -ForegroundColor Yellow
Write-Host "  GET  http://localhost:$Port/api/v1/weather/agronomic-forecast"
Write-Host "  POST http://localhost:$Port/api/v1/erp/sync-ledger"
Write-Host "  GET  http://localhost:$Port/api/v1/erp/purchase-orders"
Write-Host "  GET  http://localhost:$Port/api/v1/health"
Write-Host "-----------------------------------------------------------------"
Write-Host "CORS is enabled for all origins (*). Press Ctrl+C to terminate." -ForegroundColor DarkGray
Write-Host "=================================================================" -ForegroundColor Cyan

$startTime = Get-Date

try {
    while ($listener.IsListening) {
        if ($TimeoutSeconds -gt 0 -and ((Get-Date) - $startTime).TotalSeconds -ge $TimeoutSeconds) {
            Write-Host "Server timeout reached ($TimeoutSeconds s). Stopping..." -ForegroundColor Yellow
            break
        }

        # Async context polling
        $contextAsync = $listener.BeginGetContext($null, $null)
        while (-not $contextAsync.IsCompleted) {
            if ($TimeoutSeconds -gt 0 -and ((Get-Date) - $startTime).TotalSeconds -ge $TimeoutSeconds) { break }
            Start-Sleep -Milliseconds 100
        }

        if (-not $contextAsync.IsCompleted) { break }
        $context = $listener.EndGetContext($contextAsync)
        $request = $context.Request
        $response = $context.Response

        $method = $request.HttpMethod
        $rawPath = $request.Url.AbsolutePath
        $queryString = $request.Url.Query

        Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] $method $rawPath$queryString" -ForegroundColor Cyan

        # Add CORS Headers
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

        if ($method -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        # Read Request Body
        $requestBody = ""
        if ($request.HasEntityBody) {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $requestBody = $reader.ReadToEnd()
            $reader.Close()
        }

        $statusCode = 200
        $responseObj = $null

        # Routing Logic
        if ($rawPath -eq "/api/v1/weather/agronomic-forecast" -or $rawPath -eq "/api/v1/weather") {
            $responseObj = [ordered]@{
                gateway = "External Agronomic Weather Intelligence API"
                entityReference = "E_Weather (Context DFD Level 0)"
                stationId = "AGRO-MET-STATION-402"
                coordinates = @{ latitude = 42.3601; longitude = -71.0589; elevationMeters = 142 }
                timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
                currentConditions = [ordered]@{
                    temperatureCelsius = 22.4
                    apparentTempCelsius = 21.8
                    relativeHumidityPercent = 58
                    dewPointCelsius = 13.9
                    windSpeedKmh = 12.5
                    windDirection = "SSE"
                    windGustKmh = 18.2
                    barometricPressureHpa = 1016.4
                    uvIndex = 6.2
                    solarRadiationWm2 = 680
                }
                soilTelemetry = [ordered]@{
                    soilTemp10cmCelsius = 18.6
                    soilMoistureIndexPercent = 42.0
                    status = "ADEQUATE_PLANTING_MOISTURE"
                }
                agronomicAdvisory = [ordered]@{
                    sprayingCondition = "OPTIMAL"
                    sprayingNotes = "Wind speed under 15 km/h. Minimal drift risk until 18:00."
                    irrigationRecommendation = "HOLD_IRRIGATION"
                    rainProbabilityNext24h = 15
                    frostRisk = "NONE"
                }
                forecast48h = @(
                    @{ day = "Tomorrow"; maxTemp = 24.1; minTemp = 14.5; rainProb = 10; condition = "Partly Cloudy" },
                    @{ day = "Day After"; maxTemp = 21.0; minTemp = 13.0; rainProb = 65; condition = "Scattered Showers" }
                )
            }
        }
        elseif ($rawPath -eq "/api/v1/erp/sync-ledger") {
            $parsedBody = $null
            if (-not [string]::IsNullOrEmpty($requestBody)) {
                try { $parsedBody = $requestBody | ConvertFrom-Json } catch { $parsedBody = $null }
            }

            $batchRef = "ERP-SYNC-" + (Get-Random -Minimum 100000 -Maximum 999999)
            $amount = if ($parsedBody -and $parsedBody.amount) { $parsedBody.amount } else { 217.50 }
            $count = if ($parsedBody -and $parsedBody.records) { $parsedBody.records.Count } else { 1 }

            $responseObj = [ordered]@{
                gateway = "Third-Party Enterprise ERP Gateway"
                entityReference = "E_ERP (Context DFD Level 0)"
                syncStatus = "SUCCESS_COMMITTED"
                erpBatchId = $batchRef
                receivedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
                accountingStandard = "GAAP / IFRS Agriculture IAS 41 Compliant"
                reconciledCostCenter = "AGRI-OPS-FARM-01"
                reconciledAmountUSD = $amount
                recordsVerified = $count
                ledgerAuditHash = [System.Guid]::NewGuid().ToString("N")
                message = "Double-entry journal batch committed to enterprise ERP general ledger."
            }
        }
        elseif ($rawPath -eq "/api/v1/erp/purchase-orders") {
            $responseObj = [ordered]@{
                gateway = "Third-Party ERP Procurement Gateway"
                entityReference = "E_ERP / E_Supplier"
                activeOrders = @(
                    @{
                        poNumber = "PO-2026-0041"
                        supplier = "AgroChem Nutrients Ltd"
                        item = "Compound NPK 15-15-15 Granular"
                        orderQty = "1,730 kg"
                        status = "IN_TRANSIT"
                        estimatedDelivery = (Get-Date).AddDays(3).ToString("yyyy-MM-dd")
                        totalValueUSD = 2508.50
                    },
                    @{
                        poNumber = "PO-2026-0039"
                        supplier = "FeedMaster Grain Milling Co"
                        item = "Broiler Starter Mash"
                        orderQty = "500 kg"
                        status = "DISPATCHED"
                        estimatedDelivery = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
                        totalValueUSD = 425.00
                    }
                )
            }
        }
        elseif ($rawPath -eq "/api/v1/health" -or $rawPath -eq "/") {
            $responseObj = [ordered]@{
                status = "ONLINE"
                system = "Unified Farm Inventory & Operations - External Gateway Mock"
                processReference = "Process 10.0 External Ecosystem & Inter-System Integration"
                port = $Port
                timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
                availableEndpoints = @(
                    "GET  /api/v1/weather/agronomic-forecast",
                    "POST /api/v1/erp/sync-ledger",
                    "GET  /api/v1/erp/purchase-orders",
                    "GET  /api/v1/health"
                )
            }
        }
        else {
            $statusCode = 404
            $responseObj = [ordered]@{
                error = "Endpoint not recognized"
                path = $rawPath
                validEndpoints = @(
                    "/api/v1/weather/agronomic-forecast",
                    "/api/v1/erp/sync-ledger",
                    "/api/v1/erp/purchase-orders",
                    "/api/v1/health"
                )
            }
        }

        $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes(($responseObj | ConvertTo-Json -Depth 6))
        $response.StatusCode = $statusCode
        $response.ContentType = "application/json; charset=utf-8"
        $response.ContentLength64 = $jsonBytes.Length
        $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
        $response.Close()
    }
}
finally {
    $listener.Stop()
    $listener.Close()
    Write-Host "Server stopped." -ForegroundColor Yellow
}

