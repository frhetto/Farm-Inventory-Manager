/**
 * Farm Inventory & Operations Manager - Main Application Script
 * Controls bilingual internationalization, theme toggling, interactive demo widgets,
 * and page navigation.
 */

// Bilingual Translation Dictionary (English / Simplified Chinese)
const I18N_TRANSLATIONS = {
  en: {
    nav_title: "Farm Inventory & Operations Manager",
    nav_overview: "Overview",
    nav_requirements: "Requirements",
    nav_wbs: "WBS Matrix",
    nav_diagrams: "Diagram Viewer",
    nav_sandbox: "Live Prototypes",

    hero_badge: "Systems Analysis & Design Project",
    hero_title: "Unified Farm Inventory & Operations Management System",
    hero_desc: "A centralized, offline-first management platform for livestock, seeds, equipment, field operations, and automated financial accounting across diverse agricultural scales.",
    hero_btn_diagrams: "Explore System Diagrams",
    hero_btn_wbs: "Inspect WBS Hierarchy",

    stat_categories: "Inventory Scope",
    stat_categories_val: "Seeds, Tools, Livestock, Fertilizers",
    stat_roles: "Access Roles",
    stat_roles_val: "Superadmin, Owner, Manager, Worker",
    stat_offline: "Sync Architecture",
    stat_offline_val: "Offline-First Local Queue",
    stat_integration: "External Systems",
    stat_integration_val: "REST APIs & 3rd-Party ERP",

    section_overview_title: "Project Overview & Problem Statement",
    section_overview_sub: "Solving fragmented agricultural records with a unified operational and financial ledger",
    problem_title: "The Core Problem",
    problem_text: "In the absence of a centralized system, the datasets for farm management are handled separately across disjointed spreadsheets, paper logs, and disparate tools. This leads to severe data inconsistencies, stock discrepancies, unaccounted equipment depreciation, and delayed financial visibility.",
    why_title: "Why is such a system required?",
    why_text: "As the agricultural sector grows, it becomes increasingly difficult to keep track of operations across separated datasets. A centralized system handles inventory and operation records efficiently, establishing a transparent, consistent, and automated method to manage inventories regardless of farm acreage or team size.",
    who_title: "Who needs this system?",
    who_text: "Large crop farm owners, farm managers, agricultural field workers, contract farmers, and backyard growers who need disciplined oversight of their yields and inputs.",

    section_req_title: "System Requirements Matrix",
    section_req_sub: "Comprehensive functional specifications categorized into 10 core system domains",

    req_1_title: "1. User & Role Management",
    req_1_desc: "Register new users with specified agricultural scales (smallholding, commercial crop farm, livestock ranch, greenhouse, garden). Assign granular roles (Superadmin/Developer, Owners, Managers, Workers, Gardeners) and manage secure user profiles.",

    req_2_title: "2. Inventory Management",
    req_2_desc: "Manage main categories (seeds, tools, livestock, fertilizers, produce). Automatically update stock upon purchasing or outgoing sales. Verify record deletions with audit trails, track stock movement history, define physical location hierarchies (barn, field, warehouse), and execute inter-location transfers.",

    req_3_title: "3. Operational Management",
    req_3_desc: "Record daily worker activities (feeding livestock, planting seeds, applying treatments). Directly link activities to automated inventory depletion. Schedule routine maintenance for agricultural tools and livestock health/vaccination cycles, with approval/rejection workflows by managers.",

    req_4_title: "4. Financial & Expense Management",
    req_4_desc: "Record operational expenses categorized by sections (purchasing, repairs, utilities, labor). Capture sales revenue transactions, categorize financial accounts, and automatically calculate total operational costs, gross income, and profit margins.",

    req_5_title: "5. Reporting & Visualization Management",
    req_5_desc: "Generate current stock summaries based on categories or items. Export reports into external formats (PDF, XLSX, CSV). Provide role-tailored visual dashboards (simple interfaces for workers; detailed analytical summaries with AI-assisted insights for owners/managers), and broadcast early low-stock warnings.",

    req_6_title: "6. Supplier Management",
    req_6_desc: "Maintain a comprehensive directory of suppliers, vendors, and distributors via API, XLSX, or CSV ingestion. Create and track purchase orders with safety fulfillment monitoring, and benchmark supplier price histories for cost optimization.",

    req_7_title: "7. Asset Maintenance Management",
    req_7_desc: "Schedule periodic maintenance and routine servicing for heavy equipment and machinery. Record repair history, maintenance costs, and asset physical conditions. Issue automated early warnings when service dates approach or warranties expire.",

    req_8_title: "8. Task Management",
    req_8_desc: "Create, read, update, delete (CRUD), and assign field tasks to designated workers. Track live task progress and statuses (pending, in-progress, blocked, completed), and validate task sign-offs upon completion.",

    req_9_title: "9. Offline & Synchronization Management",
    req_9_desc: "Store all inputs locally on the client device (offline-first architecture). Automatically synchronize pending local queue batches to the central server upon network reconnection, with robust conflict resolution rules for concurrent edits.",

    req_10_title: "10. External Integration Management",
    req_10_desc: "Expose secure REST APIs for external consumption. Ingest live external data feeds (weather forecasts, agronomic recommendations, market prices), and export financial/inventory records to third-party accounting and ERP systems.",

    section_wbs_title: "Work Breakdown Structure (WBS)",
    section_wbs_sub: "Hierarchical process decomposition used as the foundation for DFD Level 0, Level 1, and Level 2 modeling",

    section_diagrams_title: "System Architecture, DFD & UML Models",
    section_diagrams_sub: "Interactive hierarchical DFD, WBS, Activity Workflow, and Use Case viewer with click-to-drill-down navigation, pan, zoom, auto-fit, and multi-format exports",
    diagram_tip: "Click on highlighted process nodes (e.g. 1.0 - 6.0 on Level 0, or 2.1 - 2.6 on Level 1) to drill down directly into child diagrams.",
    btn_zoom_in: "Zoom In",
    btn_zoom_out: "Zoom Out",
    btn_reset_view: "Reset (100%)",
    btn_fit_screen: "Fit to View",
    btn_fullscreen: "Fullscreen",
    btn_export_svg: "Export SVG",
    btn_export_png: "Export PNG",
    btn_copy_code: "Export",

    section_demos_title: "Interactive Feature Demos & SAD Logic Prototypes",
    section_demos_sub: "Functional verification of Role-Differentiated Dashboards, Automated Stock Depletion (Process 3.2), Dynamic Threshold Alerting (Process 5.4), and External Ecosystem API Gateways (Process 10.0)",

    tool1_title: "12-Digit Deterministic Barcode Generator",
    tool1_desc: "Generates a repeatable 12-digit barcode via SHA-256 cryptographic hashing as specified in the inventory requirements.",
    lbl_item_name: "Item Name / Identifier:",
    lbl_category: "Category:",
    lbl_batch: "Batch / Lot No:",
    btn_gen_barcode: "Generate 12-Digit Barcode",
    lbl_hash_preview: "SHA-256 Digest:",
    lbl_barcode_result: "Deterministic 12-Digit Barcode:",

    tool2_title: "Offline-First Sync Simulator",
    tool2_desc: "Simulates remote field operations: transactions queue into local storage and flush to server upon network restoration.",
    lbl_net_status: "Network Connectivity:",
    btn_toggle_net: "Toggle Online / Offline",
    btn_simulate_op: "Simulate Inventory Action",
    btn_trigger_sync: "Trigger Manual Sync",
    tbl_queue_title: "Local Offline Queue (Pending Sync)",
    tbl_server_title: "Central Server Database (Committed Records)"
  },
  zh: {
    nav_title: "智慧农场库存与运营管理系统",
    nav_overview: "项目概述",
    nav_requirements: "系统需求",
    nav_wbs: "WBS 工作分解",
    nav_diagrams: "系统图表展示",
    nav_sandbox: "在线演示",

    hero_badge: "系统分析与设计 (SAD) 课程项目规格",
    hero_title: "统一农场库存与运营数字化管理系统",
    hero_desc: "面向牲畜、种子、农具、田间作业及自动化财务核算的集中式离线优先管理平台，适配不同规模农业生产组织。",
    hero_btn_diagrams: "浏览系统图表",
    hero_btn_wbs: "查看 WBS 工作分解结构",

    stat_categories: "管理品类",
    stat_categories_val: "种子、工具、牲畜、化肥",
    stat_roles: "角色体系",
    stat_roles_val: "超级管理员、农场主、经理、工人",
    stat_offline: "同步机制",
    stat_offline_val: "离线优先本地队列",
    stat_integration: "系统对接",
    stat_integration_val: "REST API 与第三方 ERP",

    section_overview_title: "项目背景与问题陈述",
    section_overview_sub: "打破农业生产数据孤岛，构建透明、一致的现代化运营数字账本",
    problem_title: "核心痛点",
    problem_text: "在缺乏集中管理系统的情况下，农场管理的各项数据分别处理，导致数据严重不一致。因此，迫切需要一个能够同时统一管理牲畜、种子数量、工具、费用等多套数据集的集中系统。",
    why_title: "为什么需要这样一个系统？",
    why_text: "随着农业领域的不断发展，使用分散的数据集跟踪记录变得愈发困难。集中式系统能高效处理库存与运营记录，建立起无论是大型农场还是小型种植园都能适用的透明、一致的管理方法。",
    who_title: "谁需要这个系统？",
    who_text: "大型农作物农场主、农场运营经理、农业工人、契约农户以及庭院自耕种植者。",

    section_req_title: "系统功能需求矩阵",
    section_req_sub: "涵盖十大核心领域的完整系统功能规格说明",

    req_1_title: "1. 用户与角色管理 (User & Role Management)",
    req_1_desc: "注册新用户并指定农业规模（小型自耕、商业种植园、畜牧农场、温室大棚、庭院花园）。分配角色（超级管理员/开发者、农场主、运营经理、田间工人、园丁）并管理用户资料与权限凭证。",

    req_2_title: "2. 库存管理 (Inventory Management)",
    req_2_desc: "管理主要品类（种子、工具、牲畜、化肥、农产品）。在采购与出库交易时自动更新库存。支持带验证的记录删除、库存流水追踪、定义物理存放层级（粮仓、田块、仓库），并执行跨区域调拨。",

    req_3_title: "3. 运营管理 (Operational Management)",
    req_3_desc: "记录工人日常农事活动（牲畜喂养、播种、施肥植保）。活动自动关联并扣减对应库存耗材。为农具和牲畜健康疫苗周期排期，并支持经理/农场主对运营活动的审批与驳回流程。",

    req_4_title: "4. 财务与支出管理 (Financial & Expense Management)",
    req_4_desc: "按业务分区记录运营支出（采购、维修、公用事业、人工）。记录农产品销售收入，分类管理收支账目，自动计算总运营成本与净利润率。",

    req_5_title: "5. 报表与可视化管理 (Reporting & Visualization Management)",
    req_5_desc: "按品类或单品生成当前库存汇总报表。支持导出外部格式（PDF、XLSX、CSV）。提供基于角色的可视化仪表盘（工人简版、管理层 AI 辅助综合摘要），并在低于安全库存时发出预警。",

    req_6_title: "6. 供应商管理 (Supplier Management)",
    req_6_desc: "通过 API、XLSX、CSV 维护供应商/分销商数据库。创建并全流程追踪采购订单的履约安全，对比不同供应商的历史价格以优化采购成本。",

    req_7_title: "7. 资产维护管理 (Asset Maintenance Management)",
    req_7_desc: "为重型设备与农机安排周期性维保。记录维修历史、维保支出及设备当前运行状态。在设备保养期临近或保修期将满时自动触发早期预警。",

    req_8_title: "8. 任务管理 (Task Management)",
    req_8_desc: "支持创建、查看、更新、删除（CRUD）并将农事任务指派给指定工人。更新实时任务状态（待处理、进行中、受阻、已完成），并在交付后进行完成验收。",

    req_9_title: "9. 离线与同步管理 (Offline & Synchronization Management)",
    req_9_desc: "所有输入数据均在客户端设备本地存储（离线优先架构）。联网后自动将本地队列同步至中心服务器，并针对服务端与本地的并发冲突进行业务仲裁。",

    req_10_title: "10. 外部系统集成管理 (External Integration Management)",
    req_10_desc: "对外开放标准安全 REST API。通过 API 获取实时外部数据（天气预报、农艺建议、市场指导价），并支持将财务与库存数据导出对接第三方财务与 ERP 软件。",

    section_wbs_title: "WBS 工作分解结构 (Work Breakdown Structure)",
    section_wbs_sub: "作为系统数据流图 (DFD Level 0, Level 1, Level 2) 建模基准的标准化功能编号层级",

    section_diagrams_title: "系统架构、数据流图 (DFD) 与 UML 模型",
    section_diagrams_sub: "交互式多层级 DFD、WBS、活动图及用例图视窗，支持点击下钻跳转、平移缩放、自适应及多格式导出",
    diagram_tip: "直接点击图中高亮的功能圆圈（例如 0 层图中的 1.0 - 6.0，或 1 层图中的 2.1 - 2.6）即可直接下钻进入子图！",
    btn_zoom_in: "放大",
    btn_zoom_out: "缩小",
    btn_reset_view: "重置 (100%)",
    btn_fit_screen: "自适应居中",
    btn_fullscreen: "全屏检视",
    btn_export_svg: "导出 SVG 矢量图",
    btn_export_png: "导出 PNG 高清图",
    btn_copy_code: "导出",

    section_demos_title: "系统特性在线仿真",
    section_demos_sub: "在线体验确定性 12 位条码生成与离线队列自动同步机制",

    tool1_title: "SHA-256 确定性 12 位条码生成器",
    tool1_desc: "基于物料编码与批次，通过 SHA-256 哈希计算生成离线可复现的 12 位标准条形码。",
    lbl_item_name: "物料品名 / 资产代码:",
    lbl_category: "所属类别:",
    lbl_batch: "批次编号:",
    btn_gen_barcode: "生成 12 位条码",
    lbl_hash_preview: "SHA-256 哈希摘要:",
    lbl_barcode_result: "确定性 12 位条码:",

    tool2_title: "离线优先同步模拟器",
    tool2_desc: "模拟田间脱机操作：数据写入本地持久化队列，网络恢复后自动提交落库中心服务器。",
    lbl_net_status: "网络连接状态:",
    btn_toggle_net: "切换 在线 / 离线",
    btn_simulate_op: "模拟一次库存交易",
    btn_trigger_sync: "手动触发队列同步",
    tbl_queue_title: "本地离线队列 (待提交)",
    tbl_server_title: "中心服务器数据库 (已落库)"
  }
};

let currentLang = localStorage.getItem("farm_inv_lang") || "en";

function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem("farm_inv_lang", lang);
  const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.en;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  const langBtn = document.getElementById("btnToggleLanguage");
  if (langBtn) {
    langBtn.textContent = lang === "en" ? "中文 / EN" : "English / 中文";
  }
}

// Theme toggling (Dark / Light)
function initTheme() {
  const savedTheme = localStorage.getItem("farm_inv_theme") || "dark";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const themeBtn = document.getElementById("btnToggleTheme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      const isDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("farm_inv_theme", isDark ? "dark" : "light");
      
      // Update mermaid theme
      if (typeof mermaid !== "undefined") {
        mermaid.initialize({
          theme: isDark ? "dark" : "default"
        });
        if (window.diagramStudioInstance) {
          window.diagramStudioInstance.loadDiagram(window.diagramStudioInstance.currentDiagramId);
        }
      }
    });
  }
}

// Setup Interactive Demo Widgets
function setupDemoWidgets() {
  // 1. Barcode Generator
  const btnGenBarcode = document.getElementById("btnGenBarcode");
  const itemNameInput = document.getElementById("inputItemName");
  const itemCategoryInput = document.getElementById("selectItemCategory");
  const itemBatchInput = document.getElementById("inputItemBatch");

  async function updateBarcode() {
    const name = itemNameInput ? itemNameInput.value : "Organic Corn Seeds";
    const cat = itemCategoryInput ? itemCategoryInput.value : "Seeds";
    const batch = itemBatchInput ? itemBatchInput.value : "LOT-2026-X";

    const combinedStr = `${name}::${cat}::${batch}`;
    const result = await window.demoBarcode.generate(combinedStr);

    const hashDisplay = document.getElementById("displayHashDigest");
    const barcodeDisplay = document.getElementById("displayBarcodeNum");
    const barcodeSvgContainer = document.getElementById("displayBarcodeSvg");

    if (hashDisplay) hashDisplay.textContent = result.hashHex;
    if (barcodeDisplay) barcodeDisplay.textContent = result.formatted;
    if (barcodeSvgContainer) {
      barcodeSvgContainer.innerHTML = window.demoBarcode.renderSvg(result.barcode);
    }
  }

  if (btnGenBarcode) {
    btnGenBarcode.addEventListener("click", updateBarcode);
  }
  if (itemNameInput) itemNameInput.addEventListener("input", updateBarcode);
  if (itemCategoryInput) itemCategoryInput.addEventListener("change", updateBarcode);
  if (itemBatchInput) itemBatchInput.addEventListener("input", updateBarcode);

  updateBarcode();

  // 2. Offline Sync Simulator
  const btnToggleNet = document.getElementById("btnToggleNet");
  const btnSimulateOp = document.getElementById("btnSimulateOp");
  const btnTriggerSync = document.getElementById("btnTriggerSync");
  const netStatusBadge = document.getElementById("netStatusBadge");
  const queueTbody = document.getElementById("queueTableBody");
  const serverTbody = document.getElementById("serverTableBody");
  const queueCountBadge = document.getElementById("queueCountBadge");

  function renderSyncTables() {
    const isOnline = window.syncSimulator.isOnline;
    if (netStatusBadge) {
      if (isOnline) {
        netStatusBadge.className = "px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5";
        netStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE (Connected)`;
      } else {
        netStatusBadge.className = "px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1.5";
        netStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-500"></span> OFFLINE (Local Queue Only)`;
      }
    }

    if (queueCountBadge) {
      queueCountBadge.textContent = window.syncSimulator.localQueue.length + " Pending";
      queueCountBadge.className = window.syncSimulator.localQueue.length > 0
        ? "text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30 animate-pulse"
        : "text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium";
    }

    // Render Queue Table
    if (queueTbody) {
      if (window.syncSimulator.localQueue.length === 0) {
        queueTbody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-xs text-slate-500 italic">No pending offline actions in queue.</td></tr>`;
      } else {
        queueTbody.innerHTML = window.syncSimulator.localQueue.map(item => `
          <tr class="border-b border-slate-700/50 hover:bg-slate-800/40 text-xs">
            <td class="py-2.5 px-3 font-mono text-amber-400">${item.id}</td>
            <td class="py-2.5 px-3 font-medium text-slate-200">${item.item}</td>
            <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${item.type === 'Sale' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'}">${item.type} (${item.qty})</span></td>
            <td class="py-2.5 px-3 font-mono font-bold ${item.impact.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}">${item.impact}</td>
            <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">PENDING</span></td>
          </tr>
        `).join("");
      }
    }

    // Render Server DB Table
    if (serverTbody) {
      serverTbody.innerHTML = window.syncSimulator.serverDatabase.slice(0, 5).map(item => `
        <tr class="border-b border-slate-700/50 hover:bg-slate-800/40 text-xs">
          <td class="py-2.5 px-3 font-mono text-slate-400">${item.id}</td>
          <td class="py-2.5 px-3 font-medium text-slate-200">${item.item}</td>
          <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${item.type === 'Sale' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'}">${item.type} (${item.qty})</span></td>
          <td class="py-2.5 px-3 font-mono font-bold ${item.impact.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}">${item.impact}</td>
          <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">COMMITTED</span></td>
        </tr>
      `).join("");
    }
  }

  if (btnToggleNet) {
    btnToggleNet.addEventListener("click", () => {
      window.syncSimulator.toggleNetworkStatus();
      renderSyncTables();
    });
  }

  const sampleItems = [
    { name: "Organic Tomatoes (15kg)", type: "Sale", qty: 15, price: 3.5 },
    { name: "Livestock Dewormer (500ml)", type: "Restock", qty: 4, price: 42.0 },
    { name: "Alfalfa Hay Bales", type: "Sale", qty: 20, price: 8.0 },
    { name: "Steel Trowels & Hoes (Set)", type: "Restock", qty: 6, price: 18.5 }
  ];

  if (btnSimulateOp) {
    btnSimulateOp.addEventListener("click", () => {
      const sample = sampleItems[Math.floor(Math.random() * sampleItems.length)];
      window.syncSimulator.addRecord(sample.name, sample.type, sample.qty, sample.price);
      renderSyncTables();
    });
  }

  if (btnTriggerSync) {
    btnTriggerSync.addEventListener("click", () => {
      const res = window.syncSimulator.syncLocalQueue();
      alert(res.message);
      renderSyncTables();
    });
  }

  renderSyncTables();
}

// Document Ready Initialization with ReadyState Verification & Safe Isolation
function initApplication() {
  initTheme();

  // Language Toggle
  const btnToggleLanguage = document.getElementById("btnToggleLanguage");
  if (btnToggleLanguage) {
    btnToggleLanguage.addEventListener("click", () => {
      const nextLang = currentLang === "en" ? "zh" : "en";
      applyTranslations(nextLang);
    });
  }
  applyTranslations(currentLang);

  // 1. Initialize Diagram Studio
  try {
    if (window.DiagramStudio) {
      window.diagramStudioInstance = new window.DiagramStudio();
    }
  } catch (err) {
    console.error("DiagramStudio initialization failed:", err);
  }

  // 2. Initialize Interactive Barcode & Sync Demos
  try {
    setupDemoWidgets();
  } catch (err) {
    console.error("Demo widgets initialization failed:", err);
  }

  // 3. Initialize SAD Prototypes Studio (Process 3.2, 5.3, 5.4, 10.0)
  try {
    if (window.FarmPrototypesStudio) {
      window.prototypesStudio = new window.FarmPrototypesStudio();
    }
  } catch (err) {
    console.error("FarmPrototypesStudio initialization failed:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApplication);
} else {
  initApplication();
}

window.initApplication = initApplication;
