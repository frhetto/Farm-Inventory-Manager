/**
 * Farm Inventory & Operations Manager - SAD Prototyping Modules
 * Implements:
 * 1. Role-Differentiated Dashboards (Process 5.3):
 *    - Mobile-First High-Contrast Farm Worker Field Logging UI
 *    - Data-Dense Executive KPI Dashboard for Farm Owner
 *    - Operational Oversight Dashboard for Farm Manager
 * 2. Automated Stock Depletion Engine (Process 3.2):
 *    - Real-time recipe calculation based on field acreage/headcount
 *    - Atomic deduction from dummy inventory ledger (D2)
 *    - Automated double-entry financial posting to General Ledger (D4)
 * 3. Event-Driven Threshold Alerting & UI Badges (Process 5.4):
 *    - Dynamic Reorder Point: ROP = (DailyConsumption * LeadTime) + SafetyBuffer
 *    - Visual Amber Warning and Red Critical Stockout Badges
 *    - Automated Purchase Requisition Order Generation for Farm Manager
 * 4. External Ecosystem API Gateway Mock (Process 10.0):
 *    - Weather Service Ingestion (Entity E_Weather)
 *    - Third-Party ERP General Ledger Synchronization (Entity E_ERP)
 */

class FarmPrototypesStudio {
  constructor() {
    this.activeRole = 'worker'; // 'worker' | 'owner' | 'manager'
    this.activeModuleTab = 'roles'; // 'roles' | 'depletion' | 'alerts' | 'api'

    // Dummy Inventory State (Cloned from backend database specifications)
    this.inventory = [
      {
        id: "INV-FERT-001",
        name: "Compound NPK 15-15-15 Granular",
        category: "Fertilizers",
        unit: "kg",
        unitCost: 1.45,
        currentStock: 420.0,
        safetyBuffer: 150.0,
        dailyConsumptionRate: 25.0,
        leadTimeDays: 5,
        maxCapacity: 2000.0,
        batchNumber: "LOT-2026-NPK-88",
        location: "Warehouse A - Bay 3",
        supplier: { id: "SUP-AGRO-01", name: "AgroChem Nutrients Ltd", contact: "orders@agrochem-nutrients.com" }
      },
      {
        id: "INV-FEED-002",
        name: "Broiler High-Energy Starter Mash",
        category: "Feed",
        unit: "kg",
        unitCost: 0.85,
        currentStock: 180.0,
        safetyBuffer: 100.0,
        dailyConsumptionRate: 30.0,
        leadTimeDays: 4,
        maxCapacity: 1500.0,
        batchNumber: "LOT-2026-MASH-12",
        location: "Feed Silo 2",
        supplier: { id: "SUP-FEED-02", name: "FeedMaster Grain Milling Co", contact: "dispatch@feedmaster.ag" }
      },
      {
        id: "INV-SEED-003",
        name: "Hybrid Maize Seed Gen-4",
        category: "Seeds",
        unit: "kg",
        unitCost: 6.20,
        currentStock: 75.0,
        safetyBuffer: 40.0,
        dailyConsumptionRate: 8.0,
        leadTimeDays: 7,
        maxCapacity: 500.0,
        batchNumber: "LOT-2026-SEED-09",
        location: "Cold Seed Vault B",
        supplier: { id: "SUP-SEED-03", name: "Pioneer Seed Genetics", contact: "sales@pioneergenetics.com" }
      },
      {
        id: "INV-VET-004",
        name: "Ivermectin 1% Injectable Solution",
        category: "Veterinary",
        unit: "mL",
        unitCost: 0.35,
        currentStock: 220.0,
        safetyBuffer: 80.0,
        dailyConsumptionRate: 15.0,
        leadTimeDays: 6,
        maxCapacity: 1000.0,
        batchNumber: "LOT-2026-VET-41",
        location: "Vet Storage Cabinet C",
        supplier: { id: "SUP-VET-04", name: "Apex Animal Health Supplies", contact: "care@apexanimalhealth.com" }
      },
      {
        id: "INV-FERT-005",
        name: "Urea Nitrogen Fertilizer 46-0-0",
        category: "Fertilizers",
        unit: "kg",
        unitCost: 1.10,
        currentStock: 190.0,
        safetyBuffer: 120.0,
        dailyConsumptionRate: 20.0,
        leadTimeDays: 4,
        maxCapacity: 1200.0,
        batchNumber: "LOT-2026-UREA-03",
        location: "Warehouse A - Bay 1",
        supplier: { id: "SUP-AGRO-01", name: "AgroChem Nutrients Ltd", contact: "orders@agrochem-nutrients.com" }
      }
    ];

    // Standard Agronomic Recipes (Process 3.2.1)
    this.recipes = {
      crop_fertilization: {
        name: "Plot NPK Fertilization",
        consumableId: "INV-FERT-001",
        rate: 15.0,
        unitLabel: "kg / hectare",
        targetLabel: "Hectares",
        category: "Crops"
      },
      poultry_feed: {
        name: "Daily Broiler Nutrition",
        consumableId: "INV-FEED-002",
        rate: 0.12,
        unitLabel: "kg / bird",
        targetLabel: "Birds",
        category: "Livestock"
      },
      livestock_deworming: {
        name: "Bovine Parasite Inoculation",
        consumableId: "INV-VET-004",
        rate: 2.0,
        unitLabel: "mL / animal",
        targetLabel: "Cattle Head",
        category: "Livestock"
      },
      maize_sowing: {
        name: "Maize Seeding",
        consumableId: "INV-SEED-003",
        rate: 4.5,
        unitLabel: "kg / hectare",
        targetLabel: "Hectares",
        category: "Crops"
      }
    };

    // Transaction & Requisition Logs
    this.depletionLogs = [];
    this.requisitions = [];

    // Financial Ledger State (D4)
    this.financialSummary = {
      totalValuation: 248650.00,
      monthlyRevenue: 42800.00,
      monthlyExpenses: 27900.00,
      cashOnHand: 84300.00
    };

    this.init();
  }

  init() {
    this.bindNavigationTabs();
    this.renderRoleDashboard(this.activeRole);
    this.renderDepletionStudio();
    this.renderThresholdAlerts();
    this.renderExternalApiTestbed();
  }

  // --- MODULE TABS NAVIGATION ---
  bindNavigationTabs() {
    const tabs = document.querySelectorAll(".proto-nav-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-module");
        this.switchModuleTab(target);
      });
    });

    // Role switcher buttons
    const roleBtns = document.querySelectorAll(".role-switcher-btn");
    roleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role");
        this.renderRoleDashboard(role);
      });
    });
  }

  switchModuleTab(moduleId) {
    this.activeModuleTab = moduleId;
    document.querySelectorAll(".proto-nav-tab").forEach(tab => {
      const isTarget = tab.getAttribute("data-module") === moduleId;
      if (isTarget) {
        tab.className = "proto-nav-tab active px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-2 transition-all";
      } else {
        tab.className = "proto-nav-tab px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2";
      }
    });

    document.querySelectorAll(".proto-module-pane").forEach(pane => {
      if (pane.id === `proto-pane-${moduleId}`) {
        pane.classList.remove("hidden");
      } else {
        pane.classList.add("hidden");
      }
    });
  }

  // =========================================================================
  // REQUIREMENT 1: ROLE-DIFFERENTIATED DASHBOARDS (Process 5.3)
  // =========================================================================
  renderRoleDashboard(role) {
    this.activeRole = role;

    // Update button states
    document.querySelectorAll(".role-switcher-btn").forEach(btn => {
      const match = btn.getAttribute("data-role") === role;
      if (match) {
        btn.className = "role-switcher-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white dark:bg-emerald-600 shadow transition-all";
      } else {
        btn.className = "role-switcher-btn px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all";
      }
    });

    const container = document.getElementById("roleDashboardContent");
    if (!container) return;

    if (role === 'worker') {
      container.innerHTML = this.getWorkerMobileTemplate();
      this.attachWorkerEvents();
    } else if (role === 'owner') {
      container.innerHTML = this.getOwnerExecutiveTemplate();
    } else if (role === 'manager') {
      container.innerHTML = this.getManagerOpsTemplate();
    }
  }

  // Mobile-First High-Contrast Wireframe for Farm Worker
  getWorkerMobileTemplate() {
    return `
      <div class="flex flex-col lg:flex-row items-start justify-center gap-8 py-2">
        <!-- Ruggedized Smartphone Frame -->
        <div class="w-full max-w-sm mx-auto bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-700">
          <!-- Phone Speaker & Camera Notch -->
          <div class="flex items-center justify-between px-6 pt-1 pb-3 text-[11px] font-mono text-slate-400">
            <span>09:41</span>
            <div class="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div class="flex items-center gap-1">
              <span>LTE</span>
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
            </div>
          </div>

          <!-- High-Contrast Field Screen -->
          <div class="bg-black text-white rounded-3xl p-4 border-2 border-emerald-500/40 space-y-4">
            
            <!-- Worker Header & Offline Ready Indicator -->
            <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Field Mode • High Contrast</span>
                <h4 class="text-base font-extrabold text-white">Carlos (Worker #14)</h4>
              </div>
              <span class="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                Offline Ready
              </span>
            </div>

            <!-- Quick Action Category Selector -->
            <div>
              <label class="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Select Field Work Type:</label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" id="workerCatLivestock" class="worker-cat-btn py-3 px-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs text-center border-2 border-emerald-400 flex flex-col items-center gap-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                  <span>Livestock Log</span>
                </button>
                <button type="button" id="workerCatCrop" class="worker-cat-btn py-3 px-3 rounded-xl bg-zinc-900 text-zinc-300 font-bold text-xs text-center border border-zinc-700 flex flex-col items-center gap-1 hover:border-emerald-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  <span>Crop Agronomics</span>
                </button>
              </div>
            </div>

            <!-- Form: High Contrast Large Touch Targets -->
            <form id="workerMobileForm" class="space-y-3">
              <div>
                <label class="block text-[10px] font-bold text-zinc-300 uppercase">Field Plot / Herd Enclosure:</label>
                <select id="workerPlotSelect" class="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-zinc-900 text-white border-2 border-zinc-700 focus:border-emerald-400 focus:outline-none">
                  <option value="Pasture Zone B (Cattle Herd #3)">Pasture Zone B (Cattle Herd #3)</option>
                  <option value="Poultry Barn 2 (Broiler Batch)">Poultry Barn 2 (Broiler Batch)</option>
                  <option value="North Field 4 (Maize Field)">North Field 4 (Maize Field)</option>
                  <option value="Greenhouse Nursery C">Greenhouse Nursery C</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-zinc-300 uppercase">Operation Sub-Activity:</label>
                <select id="workerActivitySelect" class="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-zinc-900 text-white border-2 border-zinc-700 focus:border-emerald-400 focus:outline-none">
                  <option value="poultry_feed">Feed Distribution (Starter Mash)</option>
                  <option value="livestock_deworming">Parasite Inoculation (Ivermectin 1%)</option>
                  <option value="crop_fertilization">Plot NPK Granular Application</option>
                  <option value="maize_sowing">Field Maize Precision Seeding</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-zinc-300 uppercase">Units Count:</label>
                  <input type="number" id="workerUnitsInput" value="650" min="1" class="w-full text-sm font-extrabold py-2 px-3 rounded-xl bg-zinc-900 text-emerald-400 border-2 border-zinc-700 focus:border-emerald-400 focus:outline-none">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-zinc-300 uppercase">GPS Tag:</label>
                  <input type="text" readonly value="42.3601 N, -71.0589 W" class="w-full text-[11px] font-mono py-2.5 px-2 rounded-xl bg-zinc-800 text-zinc-400 border border-zinc-700 select-all">
                </div>
              </div>

              <!-- Calculated Consumable Preview Card -->
              <div class="p-3 rounded-xl bg-zinc-900 border border-emerald-500/30 text-[11px] space-y-1">
                <div class="flex items-center justify-between text-zinc-400 font-mono text-[10px]">
                  <span>AUTO-CALCULATED CONSUMABLE:</span>
                  <span class="text-emerald-400 font-bold">Process 3.2</span>
                </div>
                <p id="workerConsumableCalc" class="text-xs font-extrabold text-white">78.0 kg Broiler Starter Mash</p>
                <p class="text-[10px] text-zinc-400">Deducts automatically from Silo 2 upon submission</p>
              </div>

              <!-- High Contrast Touch Button -->
              <button type="submit" id="btnWorkerSubmit" class="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider transition-transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                <span>Commit Field Activity</span>
              </button>
            </form>

            <div id="workerSubmitFeedback" class="hidden p-2.5 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-mono text-center border border-emerald-500/40">
              Activity logged & linked stock deducted!
            </div>
          </div>
        </div>

        <!-- Explanatory Wireframe Annotation -->
        <div class="w-full lg:w-1/2 space-y-4">
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase mb-2">
              <span>SAD Actor: Farm Worker</span>
            </div>
            <h4 class="text-lg font-bold text-slate-900 dark:text-white">Mobile-First, High-Contrast UI Rationale</h4>
            <p class="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              As modeled in <strong>DFD Level 1 (Process 3.0)</strong> and the <strong>UML Activity Diagram</strong>, farm workers operate in direct sunlight and dusty field conditions with handheld ruggedized devices. 
            </p>
            <ul class="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 font-bold">&#10003;</span>
                <span><strong>High-Contrast Color Tokens:</strong> Pitch-black background with vibrant Emerald (<code>#10b981</code>) text ensures readability under 100,000 lux outdoor solar glare.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 font-bold">&#10003;</span>
                <span><strong>Large Touch Targets:</strong> Touch zones exceed 48px to accommodate gloved operation during machinery and livestock handling.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 font-bold">&#10003;</span>
                <span><strong>Automatic Recipe Engine:</strong> Workers input only animal counts or acreage; required fertilizer or feed batches are computed automatically via Process 3.2 logic.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 font-bold">&#10003;</span>
                <span><strong>Offline Cache Integration:</strong> Logs persist immediately to local SQLite/IndexedDB queue before network dispatch.</span>
              </li>
            </ul>
          </div>

          <!-- Live Activity Log Stream -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Live Worker Log Stream (Recent):</span>
              <span class="text-[10px] font-mono text-emerald-500 font-bold" id="workerStreamCount">0 Submissions</span>
            </div>
            <div id="workerRecentLogs" class="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs text-slate-500">
              <p class="italic text-[11px] text-slate-400">No field submissions yet. Use the mobile frame on the left to submit an activity.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Data-Dense Executive KPI Dashboard for Farm Owner
  getOwnerExecutiveTemplate() {
    const netProfit = this.financialSummary.monthlyRevenue - this.financialSummary.monthlyExpenses;
    const margin = ((netProfit / this.financialSummary.monthlyRevenue) * 100).toFixed(1);

    return `
      <div class="space-y-6">
        <!-- Dashboard Top Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase mb-1">
              <span>SAD Actor: Farm Owner</span>
            </div>
            <h4 class="text-xl font-extrabold text-slate-900 dark:text-white">Executive Enterprise KPI & Valuation Dashboard</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">Process 4.4 Margin Analytics & Process 5.3 Executive Reporting</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-slate-500">Period: Q4 Current FY</span>
            <button onclick="alert('Exporting IAS 41 Compliant Farm Financial Statement (PDF)...')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Export PDF Statement</span>
            </button>
          </div>
        </div>

        <!-- 4 Top Executive KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1 -->
          <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Farm Biological & Fixed Valuation</span>
            <div class="mt-1 flex items-baseline justify-between">
              <span class="text-2xl font-extrabold text-slate-900 dark:text-white">$248,650.00</span>
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+12.4% MoM</span>
            </div>
            <p class="mt-2 text-[10px] text-slate-400">Biological assets evaluated under IAS 41 fair value</p>
          </div>

          <!-- Card 2 -->
          <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Operating Margin (P4.4)</span>
            <div class="mt-1 flex items-baseline justify-between">
              <span class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">${margin}%</span>
              <span class="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">Target: 30%</span>
            </div>
            <p class="mt-2 text-[10px] text-slate-400">Net: +$${netProfit.toFixed(2)} on $42.8k monthly revenue</p>
          </div>

          <!-- Card 3 -->
          <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Productive Scale</span>
            <div class="mt-1 flex items-baseline justify-between">
              <span class="text-xl font-extrabold text-slate-900 dark:text-white">1,420 Units</span>
              <span class="text-xs font-mono text-slate-400">380 Hectares</span>
            </div>
            <p class="mt-2 text-[10px] text-slate-400">120 Bovine, 1,300 Poultry Broilers, 380ha Arable</p>
          </div>

          <!-- Card 4 -->
          <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inventory Health & Alarms (P5.4)</span>
            <div class="mt-1 flex items-baseline justify-between">
              <span class="text-xl font-extrabold text-amber-500" id="ownerAlarmCount">1 Reorder Alert</span>
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">Active</span>
            </div>
            <p class="mt-2 text-[10px] text-slate-400">Dynamic buffer monitored across 5 categories</p>
          </div>
        </div>

        <!-- Data Dense Section: Financial Breakdown vs Field Depletions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Cost Centers Breakdown -->
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h5 class="text-sm font-bold text-slate-900 dark:text-white mb-3">Cost-Center Expenditure Distribution (P4.3)</h5>
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-medium text-slate-700 dark:text-slate-300">Animal Nutrition & Feed</span>
                  <span class="font-mono font-bold">$10,600 (38%)</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full rounded-full" style="width: 38%"></div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-medium text-slate-700 dark:text-slate-300">Machinery Maintenance & Fuel</span>
                  <span class="font-mono font-bold">$7,250 (26%)</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-sky-500 h-full rounded-full" style="width: 26%"></div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-medium text-slate-700 dark:text-slate-300">Agronomic Fertilizers & Seeds</span>
                  <span class="font-mono font-bold">$5,850 (21%)</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full rounded-full" style="width: 21%"></div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-medium text-slate-700 dark:text-slate-300">Field Labor & Operations</span>
                  <span class="font-mono font-bold">$4,200 (15%)</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-indigo-500 h-full rounded-full" style="width: 15%"></div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span class="font-bold text-slate-600 dark:text-slate-400">Total Monthly Debits:</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white">$27,900.00</span>
            </div>
          </div>

          <!-- Sectional Revenue vs Expense Audit Ledger -->
          <div class="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h5 class="text-sm font-bold text-slate-900 dark:text-white">General Ledger Linked Transactions (D4 Store)</h5>
              <span class="text-xs font-mono text-emerald-500">Live Double-Entry Sync</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <th class="py-2 px-2">Voucher #</th>
                    <th class="py-2 px-2">Account Name</th>
                    <th class="py-2 px-2">Transaction Details</th>
                    <th class="py-2 px-2">Cost Center</th>
                    <th class="py-2 px-2 text-right">Debit / Credit</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  <tr>
                    <td class="py-2 px-2 text-slate-400">JV-2026-881</td>
                    <td class="py-2 px-2 font-bold text-slate-800 dark:text-slate-200">Wholesale Corn Offtake</td>
                    <td class="py-2 px-2 text-slate-500">Bulk Grain Contract Fulfilled</td>
                    <td class="py-2 px-2 text-slate-400">AGRI-REV</td>
                    <td class="py-2 px-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">+$18,400.00</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 text-slate-400">JV-2026-882</td>
                    <td class="py-2 px-2 font-bold text-slate-800 dark:text-slate-200">Raw Milk Dairy Sales</td>
                    <td class="py-2 px-2 text-slate-500">Regional Cooperative Dispatch</td>
                    <td class="py-2 px-2 text-slate-400">DAIRY-REV</td>
                    <td class="py-2 px-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">+$9,250.00</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 text-slate-400">JV-2026-883</td>
                    <td class="py-2 px-2 font-bold text-slate-800 dark:text-slate-200">Compound Fertilizer PO</td>
                    <td class="py-2 px-2 text-slate-500">AgroChem Nutrients (1,730kg)</td>
                    <td class="py-2 px-2 text-slate-400">INPUT-EXP</td>
                    <td class="py-2 px-2 text-right text-rose-500 font-bold">-$2,508.50</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 text-slate-400">JV-2026-884</td>
                    <td class="py-2 px-2 font-bold text-slate-800 dark:text-slate-200">Tractor Fleet Overhaul</td>
                    <td class="py-2 px-2 text-slate-500">Hydraulic Pump Servicing</td>
                    <td class="py-2 px-2 text-slate-400">MAINT-EXP</td>
                    <td class="py-2 px-2 text-right text-rose-500 font-bold">-$1,480.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Farm Manager Operations & Requisition Template
  getManagerOpsTemplate() {
    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase mb-1">
              <span>SAD Actor: Farm Manager</span>
            </div>
            <h4 class="text-xl font-extrabold text-slate-900 dark:text-white">Field Operations Oversight & Requisition Approvals</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">Process 3.4 Submission Validation & Process 5.4 Threshold Requisitions</p>
          </div>
          <button onclick="window.prototypesStudio.switchModuleTab('depletion')" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500 transition-colors">
            <span>Launch Stock Depletion Simulator</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>

        <!-- Active Inventory Stockpile Table with Dynamic ROP -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-sm font-bold text-slate-900 dark:text-white">Dynamic Reorder Point Monitoring Matrix (Process 5.4.1)</h5>
            <span class="text-xs font-mono text-slate-400">Formula: ROP = (DailyRate &times; LeadTime) + SafetyBuffer</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                  <th class="py-2.5 px-3">Item / SKU</th>
                  <th class="py-2.5 px-3">Category</th>
                  <th class="py-2.5 px-3">Current Stock</th>
                  <th class="py-2.5 px-3">Safety Buffer</th>
                  <th class="py-2.5 px-3">Daily Burn</th>
                  <th class="py-2.5 px-3">Reorder Point (ROP)</th>
                  <th class="py-2.5 px-3">Status Badge</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                ${this.inventory.map(item => {
                  const rop = (item.dailyConsumptionRate * item.leadTimeDays) + item.safetyBuffer;
                  let badge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">HEALTHY</span>`;
                  if (item.currentStock <= item.safetyBuffer) {
                    badge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30 animate-pulse">CRITICAL</span>`;
                  } else if (item.currentStock <= rop) {
                    badge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">REORDER NOW</span>`;
                  }
                  return `
                    <tr>
                      <td class="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">${item.name}</td>
                      <td class="py-2.5 px-3 text-slate-500 font-sans">${item.category}</td>
                      <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white">${item.currentStock} ${item.unit}</td>
                      <td class="py-2.5 px-3 text-slate-500">${item.safetyBuffer} ${item.unit}</td>
                      <td class="py-2.5 px-3 text-slate-500">${item.dailyConsumptionRate} ${item.unit}/day</td>
                      <td class="py-2.5 px-3 font-bold text-sky-600 dark:text-sky-400">${rop} ${item.unit}</td>
                      <td class="py-2.5 px-3 font-sans">${badge}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  attachWorkerEvents() {
    const form = document.getElementById("workerMobileForm");
    const actSelect = document.getElementById("workerActivitySelect");
    const unitsInput = document.getElementById("workerUnitsInput");
    const calcDisplay = document.getElementById("workerConsumableCalc");

    const updateCalc = () => {
      if (!actSelect || !unitsInput || !calcDisplay) return;
      const key = actSelect.value;
      const recipe = this.recipes[key];
      const units = parseFloat(unitsInput.value) || 0;
      if (recipe) {
        const required = (units * recipe.rate).toFixed(1);
        const item = this.inventory.find(i => i.id === recipe.consumableId);
        calcDisplay.textContent = `${required} ${item ? item.unit : ''} ${item ? item.name : ''}`;
      }
    };

    if (actSelect) actSelect.addEventListener("change", updateCalc);
    if (unitsInput) unitsInput.addEventListener("input", updateCalc);
    updateCalc();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const actKey = actSelect.value;
        const units = parseFloat(unitsInput.value) || 10;
        const plot = document.getElementById("workerPlotSelect").value;
        
        const result = this.executeStockDepletion(actKey, units, plot, "Carlos (Worker #14)");
        
        const feedback = document.getElementById("workerSubmitFeedback");
        if (feedback) {
          feedback.classList.remove("hidden");
          feedback.textContent = `SUCCESS: Deducted ${result.requiredQty} ${result.item.unit} of ${result.item.name}. Stock now: ${result.item.currentStock} ${result.item.unit}!`;
          setTimeout(() => feedback.classList.add("hidden"), 5000);
        }

        // Add to stream
        const stream = document.getElementById("workerRecentLogs");
        const countBadge = document.getElementById("workerStreamCount");
        if (stream) {
          if (this.depletionLogs.length === 1) stream.innerHTML = "";
          const entry = document.createElement("div");
          entry.className = "p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono border border-zinc-200 dark:border-zinc-700";
          entry.innerHTML = `<span class="text-emerald-500 font-bold">${result.timestamp}</span> • <strong>${result.recipe.name}</strong> (${units} units) &rarr; <span class="text-rose-500 font-bold">-${result.requiredQty} ${result.item.unit}</span>`;
          stream.prepend(entry);
        }
        if (countBadge) countBadge.textContent = `${this.depletionLogs.length} Submissions`;
      });
    }
  }

  // =========================================================================
  // REQUIREMENT 2 & 3: AUTOMATED STOCK DEPLETION (P3.2) & THRESHOLD ALERTS (P5.4)
  // =========================================================================
  executeStockDepletion(activityKey, units, plotName, workerName) {
    const recipe = this.recipes[activityKey];
    if (!recipe) return null;

    const requiredQty = Math.round((units * recipe.rate) * 100) / 100;
    const item = this.inventory.find(i => i.id === recipe.consumableId);
    if (!item) return null;

    const initialStock = item.currentStock;
    const newStock = Math.max(0, Math.round((initialStock - requiredQty) * 100) / 100);
    item.currentStock = newStock;

    const financialExpense = Math.round((requiredQty * item.unitCost) * 100) / 100;
    this.financialSummary.monthlyExpenses += financialExpense;

    // Check Dynamic Reorder Point: ROP = (DailyRate * LeadTime) + SafetyBuffer
    const rop = Math.round(((item.dailyConsumptionRate * item.leadTimeDays) + item.safetyBuffer) * 100) / 100;
    let alertStatus = "NORMAL";

    if (newStock <= item.safetyBuffer) {
      alertStatus = "CRITICAL_STOCKOUT_RISK";
    } else if (newStock <= rop) {
      alertStatus = "REORDER_WARNING";
    }

    let requisition = null;
    if (alertStatus !== "NORMAL") {
      const suggestedQty = Math.round((item.maxCapacity - newStock) * 100) / 100;
      requisition = {
        requisitionId: "REQ-" + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toLocaleTimeString(),
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        currentStock: newStock,
        reorderPoint: rop,
        suggestedOrderQty: suggestedQty,
        unit: item.unit,
        estimatedCostUSD: (suggestedQty * item.unitCost).toFixed(2),
        supplier: item.supplier,
        status: "PENDING_APPROVAL"
      };
      this.requisitions.unshift(requisition);
    }

    const logEntry = {
      logId: "DEP-" + Math.floor(10000 + Math.random() * 90000),
      timestamp: new Date().toLocaleTimeString(),
      recipe: recipe,
      worker: workerName,
      location: plotName,
      units: units,
      item: item,
      requiredQty: requiredQty,
      initialStock: initialStock,
      newStock: newStock,
      expenseUSD: financialExpense,
      alertStatus: alertStatus,
      requisition: requisition
    };

    this.depletionLogs.unshift(logEntry);

    // Refresh UI modules
    this.renderDepletionStudio();
    this.renderThresholdAlerts();

    return logEntry;
  }

  renderDepletionStudio() {
    const tableBody = document.getElementById("depletionHistoryTable");
    if (!tableBody) return;

    if (this.depletionLogs.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="py-4 text-center text-xs text-slate-400 italic">No field depletions logged yet. Run a simulation using the control panel above.</td></tr>`;
      return;
    }

    tableBody.innerHTML = this.depletionLogs.map(log => `
      <tr class="border-b border-slate-100 dark:border-slate-800 text-xs font-mono">
        <td class="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">${log.logId}</td>
        <td class="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-sans">${log.recipe.name} (${log.location})</td>
        <td class="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">${log.item.name}</td>
        <td class="py-2.5 px-3 text-rose-500 font-bold">-${log.requiredQty} ${log.item.unit}</td>
        <td class="py-2.5 px-3 text-slate-500">${log.initialStock} &rarr; <strong>${log.newStock} ${log.item.unit}</strong></td>
        <td class="py-2.5 px-3 text-right">
          ${
            log.alertStatus === 'CRITICAL_STOCKOUT_RISK'
              ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30">CRITICAL</span>'
              : log.alertStatus === 'REORDER_WARNING'
                ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">WARNING</span>'
                : '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">OK</span>'
          }
        </td>
      </tr>
    `).join('');
  }

  renderThresholdAlerts() {
    const badgeContainer = document.getElementById("liveAlertsBadgeContainer");
    const reqTable = document.getElementById("requisitionsTableBody");
    const alertCountEl = document.getElementById("activeAlertsCount");

    let totalAlerts = 0;

    if (badgeContainer) {
      badgeContainer.innerHTML = this.inventory.map(item => {
        const rop = (item.dailyConsumptionRate * item.leadTimeDays) + item.safetyBuffer;
        const isCritical = item.currentStock <= item.safetyBuffer;
        const isWarning = item.currentStock <= rop;

        if (isWarning) totalAlerts++;

        return `
          <div class="p-4 rounded-xl border ${
            isCritical
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-200'
              : isWarning
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-200'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          } flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${item.category}</span>
                ${
                  isCritical
                    ? '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-600 text-white animate-pulse">CRITICAL STOCKOUT</span>'
                    : isWarning
                      ? '<span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500 text-black">REORDER WARNING</span>'
                      : '<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">BUFFER SECURE</span>'
                }
              </div>
              <h5 class="text-sm font-bold truncate">${item.name}</h5>
              <div class="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span class="text-[10px] text-slate-400 block">Current Stock:</span>
                  <span class="font-bold text-sm ${isWarning ? 'text-rose-600 dark:text-rose-400' : ''}">${item.currentStock} ${item.unit}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block">Dynamic ROP:</span>
                  <span class="font-bold text-slate-600 dark:text-slate-300">${rop} ${item.unit}</span>
                </div>
              </div>
            </div>
            <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
              <span class="text-slate-400">Buffer: ${item.safetyBuffer} ${item.unit}</span>
              <button onclick="window.prototypesStudio.manualRestock('${item.id}', 500)" class="text-emerald-600 dark:text-emerald-400 hover:underline font-bold">+ Restock 500</button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (alertCountEl) alertCountEl.textContent = `${totalAlerts} Active Alerts`;

    if (reqTable) {
      if (this.requisitions.length === 0) {
        reqTable.innerHTML = `<tr><td colspan="6" class="py-4 text-center text-xs text-slate-400 italic">No purchase requisitions generated. Thresholds are currently within safe limits.</td></tr>`;
      } else {
        reqTable.innerHTML = this.requisitions.map(req => `
          <tr class="border-b border-slate-100 dark:border-slate-800 text-xs font-mono">
            <td class="py-2.5 px-3 font-bold text-sky-600 dark:text-sky-400">${req.requisitionId}</td>
            <td class="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-sans">${req.itemName}</td>
            <td class="py-2.5 px-3 text-slate-500">${req.supplier ? req.supplier.name : 'Primary Vendor'}</td>
            <td class="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">${req.suggestedOrderQty} ${req.unit}</td>
            <td class="py-2.5 px-3 text-slate-900 dark:text-white font-bold">$${req.estimatedCostUSD}</td>
            <td class="py-2.5 px-3 text-right">
              <button onclick="alert('Purchase Order approved and dispatched to supplier endpoint!')" class="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors">
                Authorize PO
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  manualRestock(itemId, amount) {
    const item = this.inventory.find(i => i.id === itemId);
    if (!item) return;
    item.currentStock = Math.min(item.maxCapacity, item.currentStock + amount);
    this.renderThresholdAlerts();
    this.renderDepletionStudio();
  }

  // =========================================================================
  // REQUIREMENT 4: EXTERNAL API MOCKING (Process 10.0)
  // =========================================================================
  renderExternalApiTestbed() {
    const btnWeather = document.getElementById("btnFetchWeatherMock");
    const btnErp = document.getElementById("btnSyncErpMock");

    if (btnWeather) {
      btnWeather.addEventListener("click", () => this.fetchWeatherMock());
    }
    if (btnErp) {
      btnErp.addEventListener("click", () => this.syncErpMock());
    }
  }

  async fetchWeatherMock() {
    const outputContainer = document.getElementById("apiJsonOutput");
    const statusPill = document.getElementById("apiStatusPill");
    const endpointLabel = document.getElementById("apiEndpointLabel");

    if (endpointLabel) endpointLabel.textContent = "GET /api/v1/weather/agronomic-forecast?lat=42.36&lon=-71.05";
    if (statusPill) {
      statusPill.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-500";
      statusPill.textContent = "REQUESTING...";
    }

    // Try fetching from real local server on 8080 if available, else fallback to high-fidelity mock
    let payload = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch("http://localhost:8080/api/v1/weather/agronomic-forecast", { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) payload = await res.json();
    } catch {
      payload = null;
    }

    if (!payload) {
      // High fidelity agronomic weather mock
      payload = {
        gateway: "External Agronomic Weather Intelligence API",
        entityReference: "E_Weather (Context DFD Level 0)",
        stationId: "AGRO-MET-STATION-402",
        coordinates: { latitude: 42.3601, longitude: -71.0589, elevationMeters: 142 },
        timestamp: new Date().toISOString(),
        currentConditions: {
          temperatureCelsius: 22.4,
          apparentTempCelsius: 21.8,
          relativeHumidityPercent: 58,
          dewPointCelsius: 13.9,
          windSpeedKmh: 12.5,
          windDirection: "SSE",
          windGustKmh: 18.2,
          barometricPressureHpa: 1016.4,
          uvIndex: 6.2,
          solarRadiationWm2: 680
        },
        soilTelemetry: {
          soilTemp10cmCelsius: 18.6,
          soilMoistureIndexPercent: 42.0,
          status: "ADEQUATE_PLANTING_MOISTURE"
        },
        agronomicAdvisory: {
          sprayingCondition: "OPTIMAL",
          sprayingNotes: "Wind speed under 15 km/h. Minimal droplet drift risk until 18:00.",
          irrigationRecommendation: "HOLD_IRRIGATION",
          rainProbabilityNext24h: 15,
          frostRisk: "NONE"
        },
        forecast48h: [
          { day: "Tomorrow", maxTemp: 24.1, minTemp: 14.5, rainProb: 10, condition: "Partly Cloudy" },
          { day: "Day After", maxTemp: 21.0, minTemp: 13.0, rainProb: 65, condition: "Scattered Showers" }
        ]
      };
    }

    if (statusPill) {
      statusPill.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-500";
      statusPill.textContent = "200 OK (CACHED / LIVE)";
    }
    if (outputContainer) {
      outputContainer.textContent = JSON.stringify(payload, null, 2);
    }
  }

  async syncErpMock() {
    const outputContainer = document.getElementById("apiJsonOutput");
    const statusPill = document.getElementById("apiStatusPill");
    const endpointLabel = document.getElementById("apiEndpointLabel");

    if (endpointLabel) endpointLabel.textContent = "POST /api/v1/erp/sync-ledger";
    if (statusPill) {
      statusPill.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-500";
      statusPill.textContent = "POSTING BATCH...";
    }

    const outgoingPayload = {
      batchId: "BATCH-2026-" + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toISOString(),
      costCenter: "AGRI-OPS-FARM-01",
      records: this.depletionLogs.slice(0, 3).map(l => ({
        glAccount: "5010-INPUT-MATERIALS",
        item: l.item.name,
        debitUSD: l.expenseUSD,
        creditAccount: "1010-CASH-EQUIVALENTS"
      }))
    };

    let responsePayload = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch("http://localhost:8080/api/v1/erp/sync-ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outgoingPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) responsePayload = await res.json();
    } catch {
      responsePayload = null;
    }

    if (!responsePayload) {
      responsePayload = {
        gateway: "Third-Party Enterprise ERP Gateway",
        entityReference: "E_ERP (Context DFD Level 0)",
        syncStatus: "SUCCESS_COMMITTED",
        erpBatchId: "SAP-GL-2026-X" + Math.floor(1000 + Math.random() * 9000),
        receivedAt: new Date().toISOString(),
        accountingStandard: "GAAP / IFRS Agriculture IAS 41 Compliant",
        reconciledCostCenter: outgoingPayload.costCenter,
        reconciledAmountUSD: outgoingPayload.records.reduce((sum, r) => sum + r.debitUSD, 217.50).toFixed(2),
        recordsVerified: Math.max(1, outgoingPayload.records.length),
        ledgerAuditHash: Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join(''),
        message: "Double-entry journal batch committed to enterprise ERP general ledger."
      };
    }

    if (statusPill) {
      statusPill.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-500";
      statusPill.textContent = "200 OK (COMMITTED)";
    }
    if (outputContainer) {
      outputContainer.textContent = JSON.stringify({
        OUTGOING_REQUEST: outgoingPayload,
        ERP_RESPONSE: responsePayload
      }, null, 2);
    }
  }
}

// Global initialization & Fallback auto-instance
window.FarmPrototypesStudio = FarmPrototypesStudio;

function ensurePrototypesStudioInstance() {
  if (!window.prototypesStudio && document.getElementById("roleDashboardContent")) {
    window.prototypesStudio = new FarmPrototypesStudio();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ensurePrototypesStudioInstance);
} else {
  ensurePrototypesStudioInstance();
}
