/**
 * Farm Inventory & Operations Manager - Interactive DFD & WBS Studio
 * Provides:
 * 1. Native Draw.io SVG rendering with zero blur/distortion.
 * 2. Level Filtering (All, Overview, Level 0, Level 1, Level 2).
 * 3. Interactive click-to-drill-down node navigation:
 *    - Level 0 (1.0 - 6.0) -> Level 1 (Process 1.0 - 6.0)
 *    - Level 1 (e.g. 2.1 - 2.6) -> Level 2 (Sub-process 2.1 - 2.6)
 *    - WBS (1.0 - 6.0) -> Level 1
 *    - Context Level (0.0) -> Level 0
 * 4. Hierarchical breadcrumb navigation & "Up to Parent" button.
 * 5. Smooth Pan, Zoom (Wheel / Buttons), Auto-Fit to Viewport, and Fullscreen.
 * 6. High-Resolution SVG and PNG export.
 */

class DiagramStudio {
  constructor() {
    this.currentDiagramId = "dfd_lvl0"; // Default to Level 0
    this.currentLevelFilter = "all";
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;
    this.isFullscreen = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initLevelFilterTabs();
    this.switchDiagram(this.currentDiagramId);
  }

  initLevelFilterTabs() {
    const tabs = document.querySelectorAll(".level-filter-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const level = tab.getAttribute("data-level");
        this.setLevelFilter(level);
      });
    });
  }

  setLevelFilter(level) {
    this.currentLevelFilter = level;

    // Update active tab styles
    document.querySelectorAll(".level-filter-tab").forEach(tab => {
      const tabLevel = tab.getAttribute("data-level");
      if (tabLevel === level) {
        tab.className = "level-filter-tab active px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white border border-emerald-700 shadow-sm flex items-center gap-1.5";
      } else {
        tab.className = "level-filter-tab px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 flex items-center gap-1.5";
      }
    });

    const diagrams = window.getDiagramsByLevel(this.currentLevelFilter);
    // If the currently selected diagram is not in this level, switch to the first diagram of this level
    if (level !== "all" && diagrams && diagrams.length > 0) {
      const isCurrentInLevel = diagrams.some(d => d.id === this.currentDiagramId);
      if (!isCurrentInLevel) {
        this.switchDiagram(diagrams[0].id, true);
        return;
      }
    }

    this.populateDiagramSelector();
  }

  populateDiagramSelector() {
    const selector = document.getElementById("diagramSelect");
    const pillsContainer = document.getElementById("diagramPills");
    if (!pillsContainer) return;

    if (selector) selector.innerHTML = "";
    pillsContainer.innerHTML = "";

    const diagrams = window.getDiagramsByLevel(this.currentLevelFilter);

    diagrams.forEach(d => {
      // Mobile dropdown
      if (selector) {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = `${d.title} (${d.badge})`;
        selector.appendChild(opt);
      }

      // Pill button
      const btn = document.createElement("button");
      const isActive = (d.id === this.currentDiagramId);
      btn.className = `diagram-pill text-xs px-3.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
        isActive
          ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      }`;
      btn.textContent = d.badge || d.title;
      btn.title = d.title;
      btn.setAttribute("data-id", d.id);
      btn.addEventListener("click", () => {
        this.switchDiagram(d.id, true);
      });
      pillsContainer.appendChild(btn);
    });

    if (selector) selector.value = this.currentDiagramId;
  }

  switchDiagram(diagramId, keepFilter = false) {
    const diagram = window.getDiagramById(diagramId);
    if (!diagram) return;

    this.currentDiagramId = diagramId;

    // If the diagram's level doesn't match the current filter (and current filter is not 'all'),
    // adjust filter so the active pill is visible
    if (!keepFilter && this.currentLevelFilter !== "all" && diagram.level !== this.currentLevelFilter) {
      this.setLevelFilter(diagram.level);
    } else {
      this.populateDiagramSelector();
    }

    // Update Pills and Select
    document.querySelectorAll(".diagram-pill").forEach(p => {
      if (p.getAttribute("data-id") === diagramId) {
        p.className = "diagram-pill text-xs px-3.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all bg-emerald-700 text-white border-emerald-700 shadow-sm";
      } else {
        p.className = "diagram-pill text-xs px-3.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400";
      }
    });
    const selector = document.getElementById("diagramSelect");
    if (selector) selector.value = diagramId;

    this.updateBreadcrumbs(diagram);
    this.updateDrillUpButton(diagram);
    this.updateRelatedDiagramLinks(diagram);
    this.loadDiagram(diagramId);
  }

  updateRelatedDiagramLinks(diagram) {
    const container = document.getElementById("relatedDiagramContainer");
    if (!container) return;
    container.innerHTML = "";

    // If viewing Process 3.0 or its sub-processes, offer quick jump to Activity Diagram
    if (["lvl1_3_0", "lvl2_3_1", "lvl2_3_2", "lvl2_3_3", "lvl2_3_4"].includes(diagram.id)) {
      const btn = document.createElement("button");
      btn.className = "px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1";
      btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg><span>View Activity Diagram</span>`;
      btn.title = "View Swimlane Activity Workflow for Operational Log Verification";
      btn.addEventListener("click", () => this.switchDiagram("activity_diagram"));
      container.appendChild(btn);
    }

    // If viewing Context DFD or WBS, offer quick jump to Use Case Diagram
    if (["context_dfd", "wbs", "dfd_lvl0"].includes(diagram.id)) {
      const btn = document.createElement("button");
      btn.className = "px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-semibold transition-colors flex items-center gap-1";
      btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg><span>View Use Case Diagram</span>`;
      btn.title = "View Actor-to-System Boundary & Use Case Interaction Model";
      btn.addEventListener("click", () => this.switchDiagram("use_case_diagram"));
      container.appendChild(btn);
    }
  }

  updateBreadcrumbs(diagram) {
    const breadcrumbsNav = document.getElementById("diagramBreadcrumbs");
    if (!breadcrumbsNav) return;

    breadcrumbsNav.innerHTML = "";

    // Build chain from diagram up to root
    const chain = [];
    let curr = diagram;
    while (curr) {
      chain.unshift(curr);
      curr = curr.parent ? window.getDiagramById(curr.parent) : null;
    }

    chain.forEach((item, idx) => {
      if (idx > 0) {
        const sep = document.createElement("span");
        sep.className = "text-slate-400 dark:text-slate-600 text-xs";
        sep.textContent = ">";
        breadcrumbsNav.appendChild(sep);
      }

      const isCurrent = (idx === chain.length - 1);
      if (isCurrent) {
        const curEl = document.createElement("span");
        curEl.className = "font-bold text-emerald-600 dark:text-emerald-400";
        curEl.textContent = item.badge || item.title;
        breadcrumbsNav.appendChild(curEl);
      } else {
        const linkEl = document.createElement("button");
        linkEl.className = "hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors cursor-pointer";
        linkEl.textContent = item.badge || item.title;
        linkEl.addEventListener("click", () => {
          this.switchDiagram(item.id);
        });
        breadcrumbsNav.appendChild(linkEl);
      }
    });
  }

  updateDrillUpButton(diagram) {
    const btnDrillUp = document.getElementById("btnDrillUp");
    const drillUpLabel = document.getElementById("drillUpLabel");
    if (!btnDrillUp) return;

    if (diagram.parent) {
      const parent = window.getDiagramById(diagram.parent);
      if (parent) {
        btnDrillUp.classList.remove("hidden");
        if (drillUpLabel) drillUpLabel.textContent = `Up to ${parent.badge || "Parent"}`;
        btnDrillUp.onclick = () => this.switchDiagram(parent.id);
        return;
      }
    }
    btnDrillUp.classList.add("hidden");
  }

  loadDiagram(diagramId) {
    const diagram = window.getDiagramById(diagramId);
    if (!diagram) return;

    // Update Meta display
    const titleEl = document.getElementById("currentDiagramTitle");
    const badgeEl = document.getElementById("currentDiagramBadge");
    const descEl = document.getElementById("currentDiagramDesc");
    const explEl = document.getElementById("currentDiagramExpl");
    const hintText = document.getElementById("drillDownHintText");

    if (titleEl) titleEl.textContent = diagram.title;
    if (badgeEl) badgeEl.textContent = diagram.badge;
    if (descEl) descEl.textContent = diagram.description;
    if (explEl) {
      const childKeys = Object.keys(diagram.children || {});
      explEl.textContent = `Level: ${diagram.level} • Child Diagrams: ${childKeys.length > 0 ? childKeys.join(", ") : "None (Primitive Level)"}`;
    }

    // Hint text
    if (hintText) {
      const childCount = Object.keys(diagram.children || {}).length;
      if (childCount > 0) {
        hintText.innerHTML = `This diagram has <strong class="text-emerald-700 dark:text-emerald-300">${childCount} clickable drill-down nodes</strong> (${Object.keys(diagram.children).join(", ")}). Click any highlighted process circle directly on the diagram to drill down!`;
      } else {
        hintText.innerHTML = `Primitive Level reached. Use the breadcrumb trail above or the "Up to Parent" button to navigate back up.`;
      }
    }

    // Render SVG
    const container = document.getElementById("mermaidRenderOutput");
    if (!container) return;

    container.innerHTML = `<div id="diagramTransformWrapper" class="transform-origin-center transition-transform duration-75 select-none w-full flex items-center justify-center">${diagram.svg}</div>`;

    this.attachInteractiveNodes(diagram);
    this.fitToScreen();
    requestAnimationFrame(() => this.fitToScreen());
    setTimeout(() => this.fitToScreen(), 120);
    setTimeout(() => this.fitToScreen(), 350);
  }

  attachInteractiveNodes(diagram) {
    const container = document.getElementById("mermaidRenderOutput");
    if (!container || !diagram.children) return;

    const svgRoot = container.querySelector("svg");
    if (!svgRoot) return;

    const processedCellIds = new Set();
    const childrenMap = diagram.children;

    Object.entries(childrenMap).forEach(([key, targetId]) => {
      const candidateElements = svgRoot.querySelectorAll("div, tspan, text");
      candidateElements.forEach(el => {
        const text = (el.textContent || "").trim();
        const isMatch = (text === key) ||
                        text.startsWith(key + " ") ||
                        text.startsWith(key + "\n") ||
                        text.startsWith(key + "\r") ||
                        text.startsWith(key + ":") ||
                        text.startsWith(key + "<") ||
                        (key.length > 3 && text.includes(key));

        if (isMatch) {
          const cellGroup = el.closest("[data-cell-id]");
          if (cellGroup && !processedCellIds.has(cellGroup.getAttribute("data-cell-id"))) {
            processedCellIds.add(cellGroup.getAttribute("data-cell-id"));

            cellGroup.classList.add("interactive-diagram-node");
            cellGroup.style.cursor = "pointer";

            const targetDiag = window.getDiagramById(targetId);
            const targetTitle = targetDiag ? targetDiag.title : targetId;
            cellGroup.setAttribute("title", `Click to open ${targetTitle}`);

            cellGroup.addEventListener("click", (e) => {
              e.stopPropagation();
              this.switchDiagram(targetId);
            });
          }
        }
      });
    });
  }

  applyTransform() {
    const wrapper = document.getElementById("diagramTransformWrapper");
    if (wrapper) {
      wrapper.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
    }
    const zoomDisplay = document.getElementById("zoomLevelIndicator");
    if (zoomDisplay) {
      zoomDisplay.textContent = Math.round(this.zoomLevel * 100) + "%";
    }
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.15, 4.0);
    this.applyTransform();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.15, 0.05);
    this.applyTransform();
  }

  resetZoomPan() {
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  }

  fitToScreen() {
    const viewport = document.getElementById("diagramViewport");
    const svgEl = document.querySelector("#mermaidRenderOutput svg");
    if (!viewport || !svgEl) {
      this.resetZoomPan();
      return;
    }

    const clientW = viewport.clientWidth || (window.innerWidth > 800 ? window.innerWidth * 0.75 : window.innerWidth - 32);
    const clientH = viewport.clientHeight || 650;
    const vWidth = Math.max(clientW - 48, 600);
    const vHeight = Math.max(clientH - 48, 500);

    let sWidth = 0;
    let sHeight = 0;

    if (svgEl.viewBox && svgEl.viewBox.baseVal && svgEl.viewBox.baseVal.width > 0) {
      sWidth = svgEl.viewBox.baseVal.width;
      sHeight = svgEl.viewBox.baseVal.height;
    } else {
      const bbox = svgEl.getBoundingClientRect();
      sWidth = bbox.width || 1200;
      sHeight = bbox.height || 600;
    }

    const scaleX = vWidth / sWidth;
    const scaleY = vHeight / sHeight;
    let optimalScale = Math.min(scaleX, scaleY);

    // Keep wide diagrams legible with minimum comfortable scale
    if (sWidth > 3500) {
      optimalScale = Math.max(optimalScale, 0.22);
    }

    this.zoomLevel = Math.min(Math.max(optimalScale * 0.95, 0.15), 1.6);
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  }

  toggleFullscreen() {
    const container = document.getElementById("diagramStudioCard");
    const btnFullscreen = document.getElementById("btnToggleFullscreen");
    if (!container) return;

    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      container.classList.add("fixed", "inset-0", "z-50", "rounded-none", "m-0", "h-screen", "w-screen");
      document.body.classList.add("overflow-hidden");
      if (btnFullscreen) {
        btnFullscreen.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg><span class="hidden sm:inline">Exit Fullscreen</span>`;
      }
    } else {
      container.classList.remove("fixed", "inset-0", "z-50", "rounded-none", "m-0", "h-screen", "w-screen");
      document.body.classList.remove("overflow-hidden");
      if (btnFullscreen) {
        btnFullscreen.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg><span class="hidden sm:inline">Fullscreen</span>`;
      }
    }

    setTimeout(() => this.fitToScreen(), 100);
  }

  bindEvents() {
    // Select dropdown
    const selector = document.getElementById("diagramSelect");
    if (selector) {
      selector.addEventListener("change", (e) => {
        this.switchDiagram(e.target.value);
      });
    }

    // Zoom and Pan controls
    const btnZoomIn = document.getElementById("btnZoomIn");
    const btnZoomOut = document.getElementById("btnZoomOut");
    const btnZoomReset = document.getElementById("btnZoomReset");
    const btnFit = document.getElementById("btnFitScreen");
    const btnFullscreen = document.getElementById("btnToggleFullscreen");

    if (btnZoomIn) btnZoomIn.addEventListener("click", () => this.zoomIn());
    if (btnZoomOut) btnZoomOut.addEventListener("click", () => this.zoomOut());
    if (btnZoomReset) btnZoomReset.addEventListener("click", () => this.resetZoomPan());
    if (btnFit) btnFit.addEventListener("click", () => this.fitToScreen());
    if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen());

    // Export SVG
    const btnExportSvg = document.getElementById("btnExportSvg");
    if (btnExportSvg) {
      btnExportSvg.addEventListener("click", () => this.exportSvg());
    }

    // Export PNG
    const btnExportPng = document.getElementById("btnExportPng");
    if (btnExportPng) {
      btnExportPng.addEventListener("click", () => this.exportPng());
    }

    // Pan via Mouse Drag on viewport
    const viewport = document.getElementById("diagramViewport");
    if (viewport) {
      viewport.addEventListener("mousedown", (e) => {
        if (e.target.closest("button") || e.target.closest("select") || e.target.closest("a") || e.target.closest(".interactive-diagram-node")) return;
        this.isPanning = true;
        this.startX = e.clientX - this.panX;
        this.startY = e.clientY - this.panY;
        viewport.style.cursor = "grabbing";
      });

      window.addEventListener("mousemove", (e) => {
        if (!this.isPanning) return;
        this.panX = e.clientX - this.startX;
        this.panY = e.clientY - this.startY;
        this.applyTransform();
      });

      window.addEventListener("mouseup", () => {
        this.isPanning = false;
        if (viewport) viewport.style.cursor = "grab";
      });

      // Mouse Wheel Zoom
      viewport.addEventListener("wheel", (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
          this.zoomIn();
        } else {
          this.zoomOut();
        }
      }, { passive: false });
    }

    // ESC key to exit fullscreen
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isFullscreen) {
        this.toggleFullscreen();
      }
    });

    // Auto-fit on window resize
    window.addEventListener("resize", () => {
      this.fitToScreen();
    });
  }

  exportSvg() {
    const svgEl = document.querySelector("#mermaidRenderOutput svg");
    if (!svgEl) {
      alert("No diagram rendered to export.");
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.currentDiagramId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportPng() {
    const svgEl = document.querySelector("#mermaidRenderOutput svg");
    if (!svgEl) {
      alert("No diagram rendered to export.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    let sWidth = 1200;
    let sHeight = 800;
    if (svgEl.viewBox && svgEl.viewBox.baseVal && svgEl.viewBox.baseVal.width > 0) {
      sWidth = svgEl.viewBox.baseVal.width;
      sHeight = svgEl.viewBox.baseVal.height;
    } else {
      const bbox = svgEl.getBoundingClientRect();
      sWidth = bbox.width || 1200;
      sHeight = bbox.height || 800;
    }

    const scale = Math.min(2.0, 4000 / Math.max(sWidth, sHeight));
    canvas.width = sWidth * scale;
    canvas.height = sHeight * scale;

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const isDark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = isDark ? "#090d16" : "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${this.currentDiagramId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = url;
  }
}

window.DiagramStudio = DiagramStudio;
