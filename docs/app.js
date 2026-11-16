/* The engine: a ghostty window cut into cells, a herdr workspace laid out inside it.
   Content lives in data.js, captured terminal output in captures.js. */
(() => {
  "use strict";

  const { TABS, PROFILE_ENTRY, PROJECTS, CLAWD_BODY_PATH, AGY_ARCH_PATH } = window.HERDR_DATA;
  const CAPTURES = window.HERDR_CAPTURES || {};
  const ALL_ITEMS = [PROFILE_ENTRY, ...PROJECTS];
  const PANES = TABS.map((tab) => tab.id);
  const THEMES = ["tokyo-night", "paper", "amber", "phosphor"];
  const THEME_COLOR = { "tokyo-night": "#0b0d12", paper: "#fafafa", amber: "#0c0802", phosphor: "#020a05" };
  const SIDE_COLS = 32;
  const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (id) => document.getElementById(id);

  const store = {
    get(key) {
      try {
        return window.localStorage.getItem(`herdr.${key}`);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(`herdr.${key}`, value);
      } catch (e) {
        /* private mode: the choice just lasts for this visit */
      }
    },
  };

  /** @typedef {"ko" | "en"} Lang */

  const state = {
    selectedId: "cc-desktop-mod",
    pane: "readme",
    zoom: null,
    side: "demo",
    /** @type {Lang} */
    lang: store.get("lang") || ((navigator.language || "ko").toLowerCase().startsWith("ko") ? "ko" : "en"),
    active: true,
    filter: "",
    sidebarOpen: false,
    theme: root.dataset.theme || "tokyo-night",
    crt: root.dataset.crt === "on",
    layout: "single",
    cols: 0,
    rows: 0,
    cw: 8,
    scene: {},
    agents: {},
    history: [],
    historyIndex: -1,
    minutes: 0,
    ctxDrift: 0,
  };

  const els = {
    app: $("app"),
    probe: $("cell-probe"),
    tabs: $("topbar-tabs"),
    brandHomeBtn: $("brand-home-btn"),
    mobileMenuBtn: $("mobile-menu-btn"),
    themeBtn: $("theme-btn"),
    themeLabel: $("theme-label"),
    crtBtn: $("crt-btn"),
    activeToggleBtn: $("active-toggle-btn"),
    stateToggleLabel: $("state-toggle-label"),
    langToggleBtn: $("lang-toggle-btn"),
    sidebar: $("herdr-sidebar"),
    sidebarBackdrop: $("sidebar-backdrop"),
    sbScroll: $("sb-scroll"),
    sbCursor: $("sb-cursor"),
    spaceFilter: $("space-filter"),
    profileSpaceList: $("profile-space-list"),
    projectSpaceList: $("project-space-list"),
    projectsCount: $("projects-count"),
    layoutMeta: $("layout-meta"),
    paneList: $("pane-list"),
    tiles: $("tiles"),
    paneState: $("pane-state"),
    paneAgentLabel: $("pane-agent-label"),
    paneCwd: $("pane-cwd"),
    paneBranchChip: $("pane-branch-chip"),
    paneBorderActions: $("pane-border-actions"),
    terminalScroll: $("terminal-scroll"),
    term: $("terminal-content"),
    demoBody: $("demo-body"),
    demoTitle: $("demo-title"),
    demoProgress: $("demo-progress"),
    mediaBody: $("media-body"),
    mediaTitle: $("media-title"),
    splitX: $("split-x"),
    splitY: $("split-y"),
    promptForm: $("terminal-prompt-form"),
    cmdInput: $("terminal-cmd-input"),
    promptFeedback: $("prompt-feedback"),
    statuslineLogoSlot: $("statusline-logo-slot"),
    statuslineRows: $("statusline-rows"),
    resizeOverlay: $("resize-overlay"),
    toasts: $("toasts"),
    whichkey: $("whichkey"),
    lightbox: $("lightbox"),
    lbTitle: $("lb-title"),
    lbStage: $("lb-stage"),
    lbCaption: $("lb-caption"),
    lbOpen: $("lb-open"),
    boot: $("boot"),
    bootLines: $("boot-lines"),
  };

  // ── small helpers ──────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function t(val) {
    if (val && typeof val === "object" && ("ko" in val || "en" in val)) {
      return val[state.lang] ?? val.ko ?? "";
    }
    return String(val ?? "");
  }

  const L = (ko, en) => (state.lang === "ko" ? ko : en);
  const animated = () => state.active && !reduceMotion.matches;
  const getSelectedItem = () => ALL_ITEMS.find((item) => item.id === state.selectedId) || PROJECTS[0];

  /** Terminal cell width of a string: Hangul, CJK and full-width forms take two cells. */
  function cellWidth(text) {
    let width = 0;
    for (const ch of String(text)) {
      const cp = ch.codePointAt(0);
      const wide =
        (cp >= 0x1100 && cp <= 0x115f) ||
        (cp >= 0x2e80 && cp <= 0xa4cf) ||
        (cp >= 0xac00 && cp <= 0xd7a3) ||
        (cp >= 0xf900 && cp <= 0xfaff) ||
        (cp >= 0xff00 && cp <= 0xff60) ||
        cp === 0x23f1;
      width += wide ? 2 : 1;
    }
    return width;
  }

  /** Cut a string to a number of cells, ending in an ellipsis when it had to be shortened. */
  function clipCells(text, cols) {
    if (cellWidth(text) <= cols) return text;
    let out = "";
    let width = 0;
    for (const ch of String(text)) {
      const w = cellWidth(ch);
      if (width + w > cols - 1) break;
      out += ch;
      width += w;
    }
    return `${out.trimEnd()}…`;
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  // ── grid: measure the cell, snap the window, pick a layout ─────
  let resizeOverlayTimer = 0;

  function measureGrid(announce) {
    const vv = window.visualViewport;
    const usingVisual = vv && Math.abs(vv.scale - 1) < 0.01;
    const viewW = root.clientWidth;
    const viewH = usingVisual ? vv.height : window.innerHeight;

    // Keep the window on the visible part of the screen while a soft keyboard is up.
    document.body.style.height = `${viewH}px`;
    document.body.style.top = usingVisual ? `${vv.offsetTop}px` : "0px";

    const fontSize = parseFloat(getComputedStyle(root).fontSize) || 13;
    const cw = els.probe.getBoundingClientRect().width / 10 || fontSize * 0.6;
    const lh = Math.round(fontSize * 1.55);
    const pad = viewW < 560 ? 3 : 8;

    const frame = getComputedStyle($("ghostty"));
    const availW = viewW - parseFloat(frame.paddingLeft) - parseFloat(frame.paddingRight) - pad * 2;
    const availH = viewH - parseFloat(frame.paddingTop) - parseFloat(frame.paddingBottom) - pad * 2;
    const cols = Math.max(20, Math.floor(availW / cw));
    const rows = Math.max(8, Math.floor(availH / lh));

    root.style.setProperty("--cw", `${cw}px`);
    root.style.setProperty("--lh", `${lh}px`);
    root.style.setProperty("--pad", `${pad}px`);
    root.style.setProperty("--shell-w", `${cols * cw}px`);
    root.style.setProperty("--shell-h", `${rows * lh}px`);

    const changed = cols !== state.cols || rows !== state.rows;
    state.cols = cols;
    state.rows = rows;
    state.cw = cw;

    const dock = cols >= 112;
    const mainCols = cols - (dock ? SIDE_COLS : 0);
    let layout = "single";
    if (mainCols >= 118 && rows >= 38) layout = "tiled3";
    else if (mainCols >= 84 && rows >= 54) layout = "tiled2";
    else if (mainCols >= 100 && rows >= 18) layout = "split2";

    const prevLayout = state.layout;
    state.layout = layout;
    els.app.dataset.layout = layout;
    els.app.dataset.sidebar = dock ? "dock" : "drawer";
    els.app.dataset.w = cols >= 150 ? "l" : cols >= 112 ? "m" : cols >= 64 ? "s" : "xs";
    els.app.toggleAttribute("data-short", rows < 24);
    if (dock && state.sidebarOpen) setSidebarOpen(false);
    if (layout === "single" && state.zoom) setZoom(null);

    if (changed) {
      els.layoutMeta.textContent = `${cols}×${rows}`;
      if (prevLayout !== layout) applyPaneVisibility();
      renderStatusline(getSelectedItem(), 1);
      positionSidebarCursor(false);
      if (announce) {
        els.resizeOverlay.textContent = `${cols} × ${rows}`;
        els.resizeOverlay.classList.add("is-on");
        window.clearTimeout(resizeOverlayTimer);
        resizeOverlayTimer = window.setTimeout(() => els.resizeOverlay.classList.remove("is-on"), 700);
      }
    }
  }

  // ── theme ──────────────────────────────────────────────────────
  function setTheme(name, persist = true) {
    if (!THEMES.includes(name)) return false;
    const wasRetro = state.theme === "amber" || state.theme === "phosphor";
    const isRetro = name === "amber" || name === "phosphor";
    state.theme = name;
    root.dataset.theme = name;
    els.themeLabel.textContent = name;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[name]);
    if (persist) store.set("theme", name);
    // The phosphor themes come with their tube; leaving them switches it back off.
    if (isRetro !== wasRetro) setCrt(isRetro, persist);
    return true;
  }

  function setCrt(on, persist = true) {
    state.crt = on;
    root.dataset.crt = on ? "on" : "off";
    els.crtBtn.setAttribute("aria-pressed", on ? "true" : "false");
    if (persist) store.set("crt", on ? "on" : "off");
  }

  function cycleTheme() {
    setTheme(THEMES[(THEMES.indexOf(state.theme) + 1) % THEMES.length]);
    setPromptFeedback(`theme: ${state.theme}`);
  }

  // ── statusline pieces ──────────────────────────────────────────
  function buildBarHtml(pct, width = 6, tone = "usage") {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)));
    const halfCells = Math.floor((clamped * width * 2 * 2 + 100) / 200);
    const full = Math.floor(halfCells / 2);
    const hasHalf = halfCells % 2 === 1;
    const filled = "━".repeat(full) + (hasHalf ? "╸" : "");
    const used = full + (hasHalf ? 1 : 0);
    const empty = "·".repeat(Math.max(0, width - used));

    let colorClass = "c-blue";
    if (tone === "health") {
      if (clamped >= 70) colorClass = "c-green";
      else if (clamped >= 40) colorClass = "c-teal";
      else colorClass = "c-yellow";
    } else if (clamped >= 90) {
      colorClass = "c-red";
    } else if (clamped >= 70) {
      colorClass = "c-orange";
    } else if (clamped >= 50) {
      colorClass = "c-yellow";
    }

    return `<span class="${colorClass}">${filled}</span><span class="c-muted">${empty}</span>`;
  }

  function renderClawdSvg(active, uid) {
    const activeAttr = active ? ' data-active=""' : "";
    return `<svg viewBox="0 0 42 42"${activeAttr} role="img" aria-label="Claude Clawd logo">
      <defs>
        <clipPath id="${uid}-torso"><path d="M8 11H34V27H8Z" /></clipPath>
        <filter id="${uid}-glow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <linearGradient id="${uid}-body" x1="8" y1="11" x2="34" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#F09676" />
          <stop offset="52%" stop-color="#D77757" />
          <stop offset="100%" stop-color="#B55437" />
        </linearGradient>
        <linearGradient id="${uid}-arm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#DF8160" />
          <stop offset="100%" stop-color="#9E442A" />
        </linearGradient>
        <linearGradient id="${uid}-leg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#9C4128" />
          <stop offset="32%" stop-color="#BC583B" />
          <stop offset="100%" stop-color="#7E2E1A" />
        </linearGradient>
        <linearGradient id="${uid}-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFF5EE" stop-opacity="0" />
          <stop offset="35%" stop-color="#FFF5EE" stop-opacity="0.16" />
          <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.54" />
          <stop offset="68%" stop-color="#FFD6C2" stop-opacity="0.16" />
          <stop offset="100%" stop-color="#FFF5EE" stop-opacity="0" />
        </linearGradient>
      </defs>
      <ellipse class="clawd-mascot-shadow" cx="21" cy="33.6" rx="13.5" ry="2.1" fill="#2A120A" opacity="0.22" />
      <path d="${CLAWD_BODY_PATH}" fill="#E07A57" filter="url(#${uid}-glow)" opacity="0.46" />
      <g class="clawd-mascot-float">
        <g class="clawd-legs-a">
          <rect x="8" y="25.8" width="2.5" height="5.2" rx="0.35" fill="url(#${uid}-leg)" />
          <rect x="8" y="27" width="2.5" height="1" fill="#742B17" opacity="0.55" />
          <rect x="27.5" y="25.8" width="2.5" height="5.2" rx="0.35" fill="url(#${uid}-leg)" />
          <rect x="27.5" y="27" width="2.5" height="1" fill="#742B17" opacity="0.55" />
        </g>
        <g class="clawd-legs-b">
          <rect x="12" y="25.8" width="2.5" height="5.2" rx="0.35" fill="url(#${uid}-leg)" />
          <rect x="12" y="27" width="2.5" height="1" fill="#742B17" opacity="0.55" />
          <rect x="31.5" y="25.8" width="2.5" height="5.2" rx="0.35" fill="url(#${uid}-leg)" />
          <rect x="31.5" y="27" width="2.5" height="1" fill="#742B17" opacity="0.55" />
        </g>
        <g class="clawd-arm-l">
          <rect x="4" y="19" width="4.5" height="4" rx="0.35" fill="url(#${uid}-arm)" />
          <rect x="4" y="19" width="4" height="0.9" fill="#F5AE93" opacity="0.7" />
          <rect x="4" y="22.1" width="4" height="0.9" fill="#7E2F1A" opacity="0.72" />
        </g>
        <g class="clawd-arm-r">
          <rect x="33.5" y="19" width="4.5" height="4" rx="0.35" fill="url(#${uid}-arm)" />
          <rect x="34" y="19" width="4" height="0.9" fill="#F5AE93" opacity="0.48" />
          <rect x="37.1" y="19" width="0.9" height="4" fill="#7E2F1A" opacity="0.68" />
          <rect x="34" y="22.1" width="4" height="0.9" fill="#7E2F1A" opacity="0.78" />
        </g>
        <g clip-path="url(#${uid}-torso)">
          <rect x="8" y="11" width="26" height="16" fill="url(#${uid}-body)" />
          <path d="M8 11H34L32.4 12.6H9.6Z" fill="#FAD8C8" opacity="0.62" />
          <path d="M8 11L9.6 12.6V25.4L8 27Z" fill="#F5AE93" opacity="0.42" />
          <path d="M34 11V27L32.4 25.4V12.6Z" fill="#8B3720" opacity="0.58" />
          <path d="M9.6 25.4H32.4L34 27H8Z" fill="#7E2F1A" opacity="0.64" />
          <g transform="rotate(-24 21 19)">
            <rect class="clawd-mascot-sheen" x="-26" y="3" width="14" height="32" fill="url(#${uid}-sheen)" />
          </g>
        </g>
        <g class="clawd-mascot-eyes">
          <rect x="11.75" y="14.6" width="2.8" height="4.6" rx="0.35" fill="#09090B" />
          <rect x="27.45" y="14.6" width="2.8" height="4.6" rx="0.35" fill="#09090B" />
          <rect x="12.15" y="15.05" width="0.95" height="0.95" rx="0.18" fill="#FFF5EE" opacity="0.88" />
          <rect x="27.85" y="15.05" width="0.95" height="0.95" rx="0.18" fill="#FFF5EE" opacity="0.88" />
        </g>
      </g>
    </svg>`;
  }

  function renderAgySvg(active, uid) {
    const activeAttr = active ? ' data-active=""' : "";
    return `<svg viewBox="0 0 112 112"${activeAttr} role="img" aria-label="Antigravity logo">
      <defs>
        <clipPath id="${uid}-clip"><path d="${AGY_ARCH_PATH}" /></clipPath>
        <filter id="${uid}-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id="${uid}-red" cx="56" cy="24" r="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#EA4335" stop-opacity="1" />
          <stop offset="48%" stop-color="#EA4335" stop-opacity="0.72" />
          <stop offset="100%" stop-color="#EA4335" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="${uid}-yellow" cx="37" cy="50" r="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FBBC04" stop-opacity="1" />
          <stop offset="50%" stop-color="#FBBC04" stop-opacity="0.68" />
          <stop offset="100%" stop-color="#FBBC04" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="${uid}-green" cx="31" cy="71" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#34A853" stop-opacity="0.95" />
          <stop offset="55%" stop-color="#34A853" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#34A853" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="${uid}-violet" cx="74" cy="48" r="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#9358F7" stop-opacity="0.85" />
          <stop offset="55%" stop-color="#7B61FF" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#4285F4" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="${uid}-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0" />
          <stop offset="32%" stop-color="#FFFFFF" stop-opacity="0.16" />
          <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.82" />
          <stop offset="68%" stop-color="#D2E3FC" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </linearGradient>
        <radialGradient id="${uid}-glint" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.68" />
          <stop offset="42%" stop-color="#FFF8E1" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
      </defs>
      <g class="agy-logo-halo" filter="url(#${uid}-glow)">
        <path d="${AGY_ARCH_PATH}" fill="#4285F4" />
        <path d="${AGY_ARCH_PATH}" fill="url(#${uid}-green)" />
        <path d="${AGY_ARCH_PATH}" fill="url(#${uid}-yellow)" />
        <path d="${AGY_ARCH_PATH}" fill="url(#${uid}-violet)" />
        <path d="${AGY_ARCH_PATH}" fill="url(#${uid}-red)" />
      </g>
      <g>
        <circle class="agy-logo-mote-a" cx="50" cy="90" r="2.6" fill="#669DF6" />
        <circle class="agy-logo-mote-b" cx="62" cy="92" r="2.1" fill="#8AB4F8" />
      </g>
      <g class="agy-logo-levitate">
        <g clip-path="url(#${uid}-clip)">
          <rect x="0" y="0" width="112" height="112" fill="#4285F4" />
          <rect x="0" y="0" width="112" height="112" fill="url(#${uid}-green)" />
          <rect x="0" y="0" width="112" height="112" fill="url(#${uid}-yellow)" />
          <rect x="0" y="0" width="112" height="112" fill="url(#${uid}-violet)" />
          <rect x="0" y="0" width="112" height="112" fill="url(#${uid}-red)" />
          <circle class="agy-logo-glint" cx="56" cy="40" r="28" fill="url(#${uid}-glint)" />
          <g transform="rotate(-24 56 56)">
            <rect class="agy-logo-sheen" x="-92" y="-28" width="52" height="168" fill="url(#${uid}-sheen)" />
          </g>
        </g>
        <path d="${AGY_ARCH_PATH}" fill="none" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="2.4" />
      </g>
    </svg>`;
  }

  function renderCustomSvg(kind, active) {
    const activeAttr = active ? ' data-active=""' : "";
    const bg = "fill:var(--bg-raise)";
    if (kind === "custom-soksak") {
      return `<svg viewBox="0 0 40 40"${activeAttr} role="img" aria-label="Soksak NPU icon">
        <g class="custom-logo-pulse">
          <rect x="4" y="6" width="32" height="24" rx="8" style="${bg};stroke:var(--teal)" stroke-width="1.8" />
          <path d="M12 20v-4M16.5 23v-10M21 25v-14M25.5 22v-8M30 20v-4" style="stroke:var(--teal)" stroke-width="2.2" stroke-linecap="round" />
          <path d="M14 30l-3 5 7-5" style="${bg};stroke:var(--teal)" stroke-width="1.6" stroke-linejoin="round" />
        </g>
      </svg>`;
    }
    if (kind === "custom-gemini") {
      return `<svg viewBox="0 0 40 40"${activeAttr} role="img" aria-label="Gemini remote Linux icon">
        <g class="custom-logo-pulse">
          <circle cx="20" cy="20" r="16" style="${bg};stroke:var(--gem)" stroke-width="1.5" />
          <path d="M20 7c0 7.2-5.8 13-13 13 7.2 0 13 5.8 13 13 0-7.2 5.8-13 13-13-7.2 0-13-5.8-13-13Z" style="fill:var(--gem)" />
        </g>
      </svg>`;
    }
    if (kind === "custom-ts") {
      return `<svg viewBox="0 0 40 40"${activeAttr} role="img" aria-label="Tailscale gate icon">
        <g class="custom-logo-pulse">
          <path d="M20 4l12 5v9c0 8.2-5.1 14.6-12 18-6.9-3.4-12-9.8-12-18V9l12-5Z" style="${bg};stroke:var(--teal)" stroke-width="1.8" />
          <circle cx="14" cy="17" r="2.1" style="fill:var(--teal)" />
          <circle cx="20" cy="17" r="2.1" style="fill:var(--blue)" />
          <circle cx="26" cy="17" r="2.1" style="fill:var(--teal)" />
          <circle cx="20" cy="24" r="2.1" style="fill:var(--green)" />
        </g>
      </svg>`;
    }
    return `<svg viewBox="0 0 40 40"${activeAttr} role="img" aria-label="Herdr mux icon">
      <g class="custom-logo-pulse">
        <rect x="4" y="6" width="32" height="28" rx="6" style="${bg};stroke:var(--blue)" stroke-width="1.8" />
        <path d="M12 16l6 4-6 4M21 24h7" style="stroke:var(--blue)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
    </svg>`;
  }

  function renderLogo(item, uid) {
    const type = item.statusline.type;
    if (type === "claude") return renderClawdSvg(state.active, `clawd-${uid}`);
    if (type === "agy") return renderAgySvg(state.active, `agy-${uid}`);
    return renderCustomSvg(type, state.active);
  }

  // A statusline row is a list of groups. When the dock is too narrow the group with the
  // highest priority number goes first, so the row shortens at word boundaries instead of
  // being cut mid-number.
  const seg = (cls, text) => ({ h: `<span class="${cls}">${esc(text)}</span>`, w: cellWidth(text) });
  const bar = (pct, tone) => ({ h: buildBarHtml(pct, 6, tone), w: 6 });
  const pct3 = (n) => `${String(Math.round(n)).padStart(3, " ")}%`;

  function grp(prio, ...parts) {
    return {
      prio,
      h: parts.map((p) => p.h).join(" "),
      w: parts.reduce((sum, p) => sum + p.w, 0) + parts.length - 1,
    };
  }

  function fitRow(groups, cols) {
    const kept = groups.slice();
    const width = () => kept.reduce((sum, g) => sum + g.w, 0) + kept.length - 1;
    while (width() > cols) {
      let drop = -1;
      let worst = 0;
      kept.forEach((g, i) => {
        if (g.prio > 0 && g.prio >= worst) {
          worst = g.prio;
          drop = i;
        }
      });
      if (drop < 0) break;
      kept.splice(drop, 1);
    }
    return `<div class="sl-row">${kept.map((g) => g.h).join(" ")}</div>`;
  }

  function branchSeg(branch, ahead) {
    const dirty = branch.endsWith("*");
    const clean = dirty ? branch.slice(0, -1) : branch;
    const aheadText = ahead ? ` ↑${ahead}f` : "";
    return {
      h: `<span class="c-green">(${esc(clean)}${dirty ? '<span class="c-red">*</span>' : ""}${ahead ? ` <span class="c-yellow">↑${ahead}f</span>` : ""})</span>`,
      w: cellWidth(`(${branch}${aheadText})`),
    };
  }

  function addMinutes(label, extra) {
    const m = /^(\d+)m$/.exec(label);
    if (!m) return label;
    const total = Number(m[1]) + extra;
    return total >= 60 ? `${Math.floor(total / 60)}h${String(total % 60).padStart(2, "0")}m` : `${total}m`;
  }

  /** @param {number} k 0..1 — how far the bars have filled (they sweep in when a space opens) */
  function statuslineRows(item, k, cols) {
    const sl = item.statusline;
    const r1 = sl.row1;
    const r2 = sl.row2;
    const r3 = sl.row3;
    const dim = (text) => seg("c-dim", text);
    const white = (text) => seg("c-white", text);
    const quota = (prio, lead, p5, t5, p7, t7, restPrio) => [
      grp(prio, ...lead, white("5h"), bar(p5 * k), white(pct3(p5 * k))),
      grp(5, dim(t5)),
      grp(2, dim("·"), white("7d"), bar(p7 * k), white(pct3(p7 * k))),
      grp(restPrio, dim(t7)),
    ];

    if (sl.type === "claude" || sl.type === "agy") {
      const ctx = Math.min(99, r1.ctxPct + state.ctxDrift) * k;
      const rows = [
        [
          grp(0, seg("c-blue", r1.model), seg("c-yellow", r1.effort)),
          grp(3, dim("│"), seg("c-cyan", r1.dir), branchSeg(r1.branch, r1.ahead)),
          grp(1, dim("│"), white("context"), bar(ctx), white(`${Math.round(ctx)}%`)),
          grp(4, dim("│"), { h: '<span class="c-dim g2">⏱</span>', w: 2 }, white(addMinutes(r1.duration, state.minutes))),
        ],
      ];
      if (sl.type === "claude") {
        rows.push([
          ...quota(0, [dim("├─"), seg("c-clawd", "claude")], r2.p5, r2.t5, r2.p7, r2.t7, 6),
          grp(7, dim("·"), seg("c-magenta", r2.scopedName), bar(r2.scopedPct * k), white(`${Math.round(r2.scopedPct * k)}%`)),
          grp(8, dim("· advisor"), white(r2.advisorCalls), dim("calls"), white(r2.advisorTokens), dim("tok")),
        ]);
        rows.push(quota(0, [dim("└─"), seg("c-clawd", "codex ")], r3.p5, r3.t5, r3.p7, r3.t7, 6));
      } else {
        const r4 = sl.row4;
        rows.push(quota(0, [dim("├─"), seg("c-gem-blue", "gemini")], r2.p5, r2.t5, r2.p7, r2.t7, 6));
        rows.push(quota(0, [dim("└─"), seg("c-gem-purple", "3p    ")], r3.p5, r3.t5, r3.p7, r3.t7, 6));
        rows.push([grp(0, seg(r4.state === "merged" ? "c-magenta" : "c-teal", clipCells(`${r4.pr} ${r4.state} · ${r4.title}`, cols)))]);
      }
      return rows;
    }

    if (sl.type === "custom-soksak") {
      return [
        [
          grp(0, seg("c-teal", r1.model)),
          grp(4, seg("c-green", r1.engine)),
          grp(1, dim("│"), white("latency"), bar(r1.rtfPct * k), white(r1.rtfLabel)),
          grp(3, dim("│"), seg("c-cyan", r1.target)),
        ],
        [
          grp(0, dim("├─"), seg("c-teal", r2.label), white("voice"), bar(r2.p5 * k, "health"), dim(r2.t5)),
          grp(2, dim("·"), white("floor"), bar(r2.p7 * k), dim(r2.t7)),
        ],
        [
          grp(0, dim("└─"), seg("c-teal", r3.label), seg("c-green", r3.host)),
          grp(2, dim("·"), seg("c-yellow", r3.autoEnter)),
          grp(3, dim("·"), white(r3.vocab)),
        ],
      ];
    }

    if (sl.type === "custom-gemini") {
      return [
        [
          grp(0, seg("c-gem-blue", r1.model)),
          grp(4, seg("c-cyan", r1.proto)),
          grp(1, dim("│"), white("rtt"), bar(r1.rttPct * k), white(r1.rttLabel)),
          grp(3, dim("│"), seg("c-green", r1.host)),
        ],
        [
          grp(0, dim("├─"), seg("c-gem-blue", r2.label), white("sync"), bar(r2.p5 * k, "health"), seg("c-green", r2.t5)),
          grp(2, dim("·"), white("mounts"), bar(r2.p7 * k), white(r2.t7)),
        ],
        [grp(0, dim("└─"), seg("c-gem-purple", r3.label), white(r3.compositor)), grp(2, dim("·"), seg("c-teal", r3.mcp))],
      ];
    }

    if (sl.type === "custom-ts") {
      return [
        [
          grp(0, seg("c-teal", r1.model)),
          grp(3, seg("c-green", r1.mode)),
          grp(1, dim("│"), white("ttl"), bar(r1.ttlPct * k), white(r1.ttlLabel)),
          grp(2, dim("│"), seg("c-red", r1.funnel)),
        ],
        [
          grp(0, dim("├─"), seg("c-teal", r2.label), white("temp"), bar(r2.p5 * k), white(r2.t5)),
          grp(2, dim("·"), white("keep"), bar(r2.p7 * k, "health"), seg("c-green", r2.t7)),
        ],
        [grp(0, dim("└─"), seg("c-teal", r3.label), seg("c-green", r3.boot)), grp(2, dim("·"), dim(r3.state))],
      ];
    }

    const ctx = r1.ctxPct * k;
    return [
      [
        grp(0, seg("c-blue", r1.model), seg("c-yellow", r1.tag)),
        grp(3, dim("│"), seg("c-cyan", r1.dir), seg("c-green", `(${r1.branch})`)),
        grp(1, dim("│"), white("context"), bar(ctx), white(`${Math.round(ctx)}%`)),
        grp(4, dim("│"), seg("c-teal", r1.extra)),
      ],
      quota(0, [dim("├─"), seg("c-clawd", r2.label)], r2.p5, r2.t5, r2.p7, `${r2.t7} · ${r2.extra}`, 6),
      quota(0, [dim("└─"), seg("c-gem-blue", r3.label)], r3.p5, r3.t5, r3.p7, `${r3.t7} · ${r3.extra}`, 6),
    ];
  }

  function renderStatusline(item, k) {
    const cols = Math.max(10, Math.floor(els.statuslineRows.clientWidth / state.cw));
    els.statuslineRows.innerHTML = statuslineRows(item, k, cols).map((row) => fitRow(row, cols)).join("");
  }

  let statuslineFrame = 0;

  /** Bars sweep up from empty, one terminal cell at a time. */
  function sweepStatusline(item) {
    window.cancelAnimationFrame(statuslineFrame);
    els.statuslineLogoSlot.innerHTML = renderLogo(item, "sl");
    if (!animated()) {
      renderStatusline(item, 1);
      return;
    }
    const started = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - started) / 520);
      renderStatusline(item, 1 - (1 - p) ** 3);
      if (p < 1) statuslineFrame = window.requestAnimationFrame(step);
    };
    statuslineFrame = window.requestAnimationFrame(step);
  }

  // ── top bar ────────────────────────────────────────────────────
  function isPaneVisible(pane) {
    if (state.zoom) return state.zoom === pane;
    if (state.layout === "single") return state.pane === pane;
    if (state.layout === "split2") return pane === "readme" || pane === state.side;
    return true;
  }

  function renderTabs() {
    els.tabs.innerHTML = TABS.map((tab) => {
      const cls = `tab${state.pane === tab.id ? " is-active" : ""}${isPaneVisible(tab.id) ? " is-visible" : ""}`;
      return `<button type="button" class="${cls}" data-tab="${tab.id}" aria-pressed="${state.pane === tab.id}">
        <span class="tab-num">${tab.num}</span><span>${esc(tab[state.lang])}</span>
      </button>`;
    }).join("");
  }

  function renderTopControls() {
    els.activeToggleBtn.setAttribute("aria-pressed", state.active ? "true" : "false");
    els.stateToggleLabel.textContent = state.active ? "working" : "idle";
    els.langToggleBtn.textContent = state.lang.toUpperCase();
    els.themeLabel.textContent = state.theme;
    els.crtBtn.setAttribute("aria-pressed", state.crt ? "true" : "false");
    root.dataset.active = state.active ? "on" : "off";
    root.lang = state.lang;
  }

  // ── sidebar ────────────────────────────────────────────────────
  function agentState(id) {
    if (!state.active) return "idle";
    return state.agents[id] || "idle";
  }

  function stateGlyph(st) {
    if (st === "working") return SPINNER[0];
    if (st === "done") return "●";
    return "○";
  }

  function renderSpaceCard(item, indexHint) {
    const selected = state.selectedId === item.id;
    const st = agentState(item.id);
    return `<button type="button" class="space${selected ? " is-selected" : ""}" data-select-id="${esc(item.id)}"
      data-state="${st}" role="option" aria-selected="${selected}">
      <span class="space-row">
        <span class="space-state" data-state="${st}" data-agent="${esc(item.id)}"${st === "working" ? " data-spin" : ""} aria-hidden="true">${stateGlyph(st)}</span>
        <span class="space-name">${esc(item.name)}</span>
        <span class="space-idx">${esc(indexHint)}</span>
        <span class="space-badge ${item.badgeClass}">${esc(item.badge)}</span>
      </span>
      <span class="space-row space-row2">
        <span class="space-sub">${esc(t(item.sub))}</span>
        <span class="space-branch"><span class="g1">⎇</span> ${esc(item.branch)}</span>
      </span>
    </button>`;
  }

  function renderSidebar() {
    const q = state.filter.trim().toLowerCase();
    els.profileSpaceList.innerHTML = renderSpaceCard(PROFILE_ENTRY, "~");

    const filtered = PROJECTS.filter((p) => {
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q) ||
        t(p.sub).toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q))
      );
    });

    els.projectsCount.textContent = `${filtered.length}/${PROJECTS.length}`;
    els.projectSpaceList.innerHTML = filtered.length
      ? filtered.map((p) => renderSpaceCard(p, String(PROJECTS.indexOf(p) + 1))).join("")
      : `<div class="sb-empty">no matching spaces</div>`;
    positionSidebarCursor(false);
  }

  /** Slide the selection block to the selected space instead of redrawing the list. */
  function positionSidebarCursor(glide) {
    const selected = els.sbScroll.querySelector(".space.is-selected");
    if (!selected) {
      els.sbCursor.classList.remove("is-on");
      return;
    }
    if (!glide) els.sbCursor.style.transition = "none";
    els.sbCursor.style.transform = `translateY(${selected.offsetTop}px)`;
    els.sbCursor.style.height = `${selected.offsetHeight}px`;
    els.sbCursor.classList.add("is-on");
    if (!glide) {
      void els.sbCursor.offsetHeight;
      els.sbCursor.style.transition = "";
    }
  }

  function updateSidebarSelection() {
    els.sbScroll.querySelectorAll(".space").forEach((node) => {
      const selected = node.getAttribute("data-select-id") === state.selectedId;
      node.classList.toggle("is-selected", selected);
      node.setAttribute("aria-selected", selected ? "true" : "false");
    });
    positionSidebarCursor(true);
    const selected = els.sbScroll.querySelector(".space.is-selected");
    if (selected) selected.scrollIntoView({ block: "nearest" });
  }

  function updateAgentIcons() {
    document.querySelectorAll("[data-agent]").forEach((node) => {
      const id = node.getAttribute("data-agent");
      const st = agentState(id);
      node.dataset.state = st;
      node.toggleAttribute("data-spin", st === "working");
      if (st !== "working") node.textContent = stateGlyph(st);
      const card = node.closest(".space");
      if (card) card.dataset.state = st;
    });
  }

  function renderPaneList() {
    const item = getSelectedItem();
    const media = item.media.filter((m) => m.kind !== "logos").length;
    const meta = {
      readme: item.agent,
      demo: `${item.scenes.length} ${item.scenes.length > 1 ? "scenes" : "scene"}`,
      media: media ? `${media} ${media > 1 ? "shots" : "shot"}` : "flow",
    };
    els.paneList.innerHTML = TABS.map(
      (tab) => `<button type="button" class="pane-item${state.pane === tab.id ? " is-focused" : ""}" data-tab="${tab.id}">
        <span class="pi-mark" aria-hidden="true">❯</span><span class="c-muted">${tab.num}</span>
        <span class="pi-name">${esc(tab[state.lang])}</span><span class="pi-meta">${esc(meta[tab.id])}</span>
      </button>`
    ).join("");
  }

  function setSidebarOpen(open) {
    state.sidebarOpen = open;
    els.sidebar.classList.toggle("is-open", open);
    els.sidebarBackdrop.hidden = !open;
    els.mobileMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) positionSidebarCursor(false);
  }

  // ── panes ──────────────────────────────────────────────────────
  function applyPaneVisibility() {
    const shown = state.zoom || state.pane;
    if (state.pane !== "readme") state.side = state.pane;
    els.tiles.querySelectorAll(".pane").forEach((node) => {
      const name = node.dataset.pane;
      node.classList.toggle("is-focused", name === state.pane);
      node.classList.toggle("is-shown", name === shown);
      node.classList.toggle("is-side", name === state.side);
    });
    els.app.dataset.pane = state.pane;
    document.querySelectorAll("[data-zoom]").forEach((btn) => btn.classList.toggle("is-on", state.zoom === btn.dataset.zoom));
    renderTabs();
    renderPaneList();
    syncCastPlayback();
    syncArchFlow();
    updateScrollPositions();
  }

  function focusPane(pane) {
    if (!PANES.includes(pane)) return;
    state.pane = pane;
    if (state.zoom) state.zoom = pane;
    applyPaneVisibility();
  }

  function setZoom(pane) {
    state.zoom = pane;
    if (pane) {
      state.pane = pane;
      els.app.dataset.zoom = pane;
    } else {
      delete els.app.dataset.zoom;
    }
    applyPaneVisibility();
    renderStatusline(getSelectedItem(), 1);
  }

  function toggleZoom(pane = state.pane) {
    if (state.layout === "single") return;
    setZoom(state.zoom === pane ? null : pane);
  }

  function cyclePane(delta) {
    const next = PANES[(PANES.indexOf(state.pane) + delta + PANES.length) % PANES.length];
    focusPane(next);
  }

  function renderPaneHead(item) {
    els.paneAgentLabel.textContent = item.agent;
    els.paneCwd.textContent = item.cwd;
    els.paneBranchChip.innerHTML = `<span class="g1">⎇</span> ${esc(item.branch)}`;
    els.paneState.dataset.agent = item.id;
    els.paneState.className = "state-icon space-state";
    updateAgentIcons();

    const actions = [];
    if (item.siteUrl && item.id !== "profile") {
      actions.push(`<a class="pane-tool is-primary" href="${esc(item.siteUrl)}" target="_blank" rel="noopener noreferrer">site ↗</a>`);
    }
    actions.push(`<a class="pane-tool" href="${esc(item.repoUrl)}" target="_blank" rel="noopener noreferrer">github ↗</a>`);
    actions.push(`<button type="button" class="pane-tool${state.zoom === "readme" ? " is-on" : ""}" data-zoom="readme" title="zoom (z)">zoom</button>`);
    els.paneBorderActions.innerHTML = actions.join("");
  }

  function updateScrollPositions() {
    els.tiles.querySelectorAll(".pane").forEach((pane) => {
      const body = pane.querySelector(".pane-body");
      const label = pane.querySelector("[data-scroll-pos]");
      if (!body || !label) return;
      const max = body.scrollHeight - body.clientHeight;
      if (max <= 2) label.textContent = "";
      else if (body.scrollTop <= 1) label.textContent = "top";
      else if (body.scrollTop >= max - 1) label.textContent = "bot";
      else label.textContent = `${Math.round((body.scrollTop / max) * 100)}%`;
    });
  }

  // ── readme pane ────────────────────────────────────────────────
  let typeToken = 0;

  /** Type the echoed command the way a person would, without blocking the content below. */
  async function typeInto(node, text, total) {
    const token = ++typeToken;
    node.textContent = "";
    const per = Math.max(6, total / Math.max(1, text.length));
    for (let i = 1; i <= text.length; i += 1) {
      if (token !== typeToken) return;
      node.textContent = text.slice(0, i);
      await sleep(per);
    }
  }

  /** Decode-style reveal: noise settles into the title from left to right. */
  function scramble(node, text) {
    const glyphs = "!<>-_\\/[]{}=+*^?#";
    const started = performance.now();
    const duration = 460;
    const step = (now) => {
      if (!node.isConnected) return;
      const settled = Math.floor(((now - started) / duration) * text.length);
      if (settled >= text.length) {
        node.textContent = text;
        return;
      }
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i += 1) {
        out += text[i] === " " || text[i] === "-" ? text[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      node.textContent = out;
      window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  function block(html, index, delay) {
    return `<div class="blk paint" style="--i:${index};--d:${delay}ms">${html}</div>`;
  }

  function fetchBlock() {
    const rows = [
      ["os", "omarchy · arch linux"],
      ["wm", "hyprland · wayland"],
      ["term", "ghostty · herdr v0.9.5"],
      ["agents", "claude code · antigravity cli · codex"],
      ["lang", PROFILE_ENTRY.stack.slice(0, 4).join(" · ")],
      ["spaces", `${PROJECTS.length} ${L("프로젝트", "projects")}`],
    ];
    const swatches = ["--red", "--orange", "--yellow", "--green", "--teal", "--cyan", "--blue", "--magenta"]
      .map((v) => `<i style="background:var(${v})"></i>`)
      .join("");
    return `<div class="fetch">
      <img class="fetch-avatar" src="https://raw.githubusercontent.com/KyongSik-Yoon/KyongSik-Yoon/main/sam.png" alt="KyongSik Yoon" width="87" height="87" />
      <div>
        <dl class="fetch-list">
          <dt>sam</dt><dd class="c-muted">@omarchy</dd>
          ${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}
        </dl>
        <div class="palette" aria-hidden="true">${swatches}</div>
      </div>
    </div>`;
  }

  function renderReadme(item, animate) {
    const isProfile = item.id === "profile";
    const cmdLine = isProfile ? "cat ~/KyongSik-Yoon/README.md && herdr spaces --all" : `cd ${item.cwd} && cat README.md`;
    const typing = animate && animated();
    const delay = typing ? 300 : 0;
    const promptChar = item.installCmd.startsWith("/") ? "❯" : "$";
    const blocks = [];

    blocks.push(`<div class="echo">
      <span><span class="echo-host">sam@omarchy</span><span class="c-muted">:</span><span class="c-cyan">${esc(item.cwd)}</span><span class="c-muted">$</span></span>
      <span class="echo-cmd" data-echo>${esc(cmdLine)}</span>
    </div>`);

    blocks.push(`<div class="hero">
      <h1 class="hero-title" data-title>${esc(item.name)}</h1>
      <div class="hero-sub">${esc(t(item.sub))}</div>
      <p class="hero-summary">${esc(t(item.summary))}</p>
      <div class="badges">
        <span class="badge is-hl">agent:${esc(item.agent)}</span>
        ${item.stack.map((s) => `<span class="badge">${esc(s)}</span>`).join("")}
      </div>
    </div>`);

    if (isProfile) {
      blocks.push(`<section class="sec">
        <h2 class="sec-h">${L("프로필", "Profile")}</h2>
        ${fetchBlock()}
      </section>`);
      blocks.push(`<section class="sec">
        <h2 class="sec-h">${L("AI 토큰 사용량", "AI Usage Telemetry")}</h2>
        <img class="usage-card" src="https://raw.githubusercontent.com/KyongSik-Yoon/KyongSik-Yoon/main/cards/ai-usage-full.svg" alt="AI usage" width="846" height="225" />
      </section>`);
    }

    blocks.push(`<section class="sec">
      <h2 class="sec-h">${L("핵심 기능", "Key Capabilities")}</h2>
      <div class="features">
        ${item.features
          .map(
            (f, i) => `<article class="feature">
              <span class="feature-n">${String(i + 1).padStart(2, "0")}</span>
              <h3 class="feature-t">${esc(t(f.title))}</h3>
              <p class="feature-d">${esc(t(f.desc))}</p>
            </article>`
          )
          .join("")}
      </div>
    </section>`);

    blocks.push(`<section class="sec">
      <h2 class="sec-h">${L("설치 및 실행", "Install & Quickstart")}</h2>
      <div class="box">
        <div class="box-h">
          <span>${esc(item.cliBlockTitle)}</span>
          <button type="button" class="copy-btn" data-copy="${esc(item.installCmd)}">⧉ copy</button>
        </div>
        <pre class="pre wrap"><span class="c-green">${promptChar}</span> ${highlightCommand(item.installCmd)}</pre>
      </div>
      <div class="c-muted">
        ${L("이어 보기", "next")}:
        <button type="button" class="link" data-tab="demo">2 demo</button> ·
        <button type="button" class="link" data-tab="media">3 media</button> ·
        <button type="button" class="link" data-cmd="help">help</button>
      </div>
    </section>`);

    els.term.innerHTML = blocks.map((html, i) => block(html, i, i === 0 ? 0 : delay)).join("");
    els.terminalScroll.scrollTop = 0;

    if (typing) {
      typeInto(els.term.querySelector("[data-echo]"), cmdLine, 260);
      window.setTimeout(() => {
        const title = els.term.querySelector("[data-title]");
        if (title && getSelectedItem() === item) scramble(title, item.name);
      }, delay);
    }
  }

  /** Append shell output to the scrollback and follow it. */
  function print(html, echo) {
    const count = els.term.children.length;
    const wrap = document.createElement("div");
    wrap.className = "blk paint";
    wrap.style.setProperty("--i", "0");
    wrap.innerHTML =
      (echo !== undefined
        ? `<div class="echo"><span class="prompt-chevron">❯</span><span class="echo-cmd">${esc(echo)}</span></div>`
        : "") + html;
    els.term.appendChild(wrap);
    if (count > 60) els.term.removeChild(els.term.children[1]);
    if (!isPaneVisible("readme")) focusPane("readme");
    els.terminalScroll.scrollTo({ top: els.terminalScroll.scrollHeight, behavior: animated() ? "smooth" : "auto" });
    updateScrollPositions();
  }

  // ── demo pane: terminal casts and the real recording ───────────
  function highlightCommand(text) {
    const hash = text.search(/\s#\s/);
    const body = hash >= 0 ? text.slice(0, hash) : text;
    const comment = hash >= 0 ? text.slice(hash) : "";
    const html = esc(body)
      .replace(/(&quot;[^&]*?&quot;)/g, '<span class="c-green">$1</span>')
      .replace(/(^|\s)(--?[a-zA-Z][\w-]*)/g, '$1<span class="c-yellow">$2</span>')
      .replace(/(&amp;&amp;|\|)/g, '<span class="c-muted">$1</span>')
      .replace(/^([./\w-]+)/, '<span class="c-white t-b">$1</span>');
    return html + (comment ? `<span class="c-muted">${esc(comment)}</span>` : "");
  }

  function highlightOutput(text) {
    return esc(text).replace(
      /(https?:\/\/[^\s)]+)|(^\[[+*!]\])|(^\[[a-z]+\])|(✓)|(✕|DENY|BLOCKED)|(●)|(◆)|(\s#\s.*$)|\b(enabled|configured|ALLOW|merged)\b/g,
      (m, url, mark, tag, ok, bad, dot, diamond, comment, good) => {
        if (url) return `<span class="c-cyan">${m}</span>`;
        if (mark) return `<span class="${m === "[+]" ? "c-green" : m === "[!]" ? "c-yellow" : "c-blue"}">${m}</span>`;
        if (tag) return `<span class="c-teal">${m}</span>`;
        if (ok || dot || good) return `<span class="c-green">${m}</span>`;
        if (bad) return `<span class="c-red">${m}</span>`;
        if (diamond) return `<span class="c-yellow">${m}</span>`;
        if (comment) return `<span class="c-muted">${m}</span>`;
        return m;
      }
    );
  }

  /** A cast is a list of steps: a typed command, or a burst of output lines. */
  function castSteps(item, scene) {
    const promptChar = scene.prompt || "$";
    if (scene.capture) {
      return [
        { type: "cmd", prompt: promptChar, text: scene.cmd },
        { type: "out", lines: (CAPTURES[scene.capture] || "").split("\n") },
      ];
    }
    const steps = [];
    let pending = [];
    const flush = () => {
      if (pending.length) steps.push({ type: "out", lines: pending });
      pending = [];
    };
    for (const line of item.cliSnippet.split("\n")) {
      const isCommand = line.startsWith("$ ") || (promptChar !== "$" && line.startsWith("/"));
      if (isCommand) {
        flush();
        steps.push({ type: "cmd", prompt: promptChar, text: line.replace(/^\$ /, "") });
      } else {
        pending.push(highlightOutput(line));
      }
    }
    flush();
    return steps;
  }

  const cast = { run: 0, steps: [], screen: null, paused: false, userPaused: false, pending: false, finished: false, loopTimer: 0 };

  function castLine(html, fresh) {
    const node = document.createElement("div");
    node.className = fresh ? "cl is-new" : "cl";
    node.innerHTML = html || " ";
    cast.screen.appendChild(node);
    cast.screen.scrollTop = cast.screen.scrollHeight;
    return node;
  }

  function setCastProgress(done) {
    const total = cast.steps.length;
    if (!total) {
      els.demoProgress.textContent = "";
      return;
    }
    els.demoProgress.textContent = `${"█".repeat(done)}${"░".repeat(total - done)} ${done}/${total}`;
  }

  function updateCastButton() {
    const btn = els.demoBody.querySelector('.cast-btn[data-cast="toggle"]');
    if (!btn) return;
    btn.textContent = cast.finished ? "⟳ replay" : cast.paused ? "▶ play" : "‖ pause";
  }

  function drawCastStatic() {
    cast.run += 1;
    window.clearTimeout(cast.loopTimer);
    cast.screen.innerHTML = "";
    for (const step of cast.steps) {
      if (step.type === "cmd") castLine(`<span class="c-green">${step.prompt}</span> ${highlightCommand(step.text)}`, false);
      else step.lines.forEach((line) => castLine(line, false));
    }
    cast.screen.scrollTop = 0;
    cast.finished = true;
    setCastProgress(cast.steps.length);
    updateCastButton();
  }

  /** Wait, but hold the clock while the cast is paused; false once this run was replaced. */
  async function castWait(ms, run) {
    let left = ms;
    while (left > 0 || cast.paused) {
      await sleep(30);
      if (run !== cast.run) return false;
      if (!cast.paused) left -= 30;
    }
    return run === cast.run;
  }

  async function playCast() {
    const run = ++cast.run;
    window.clearTimeout(cast.loopTimer);
    cast.finished = false;
    cast.screen.innerHTML = "";
    setCastProgress(0);
    updateCastButton();

    for (let i = 0; i < cast.steps.length; i += 1) {
      const step = cast.steps[i];
      if (step.type === "cmd") {
        const line = castLine(`<span class="c-green">${step.prompt}</span> <span data-typed></span><span class="cursor"></span>`, false);
        const typed = line.querySelector("[data-typed]");
        if (!(await castWait(i === 0 ? 350 : 520, run))) return;
        const per = Math.min(26, 1100 / step.text.length);
        for (let c = 1; c <= step.text.length; c += 1) {
          typed.textContent = step.text.slice(0, c);
          if (!(await castWait(per, run))) return;
        }
        if (!(await castWait(240, run))) return;
        line.innerHTML = `<span class="c-green">${step.prompt}</span> ${highlightCommand(step.text)}`;
      } else {
        const per = Math.min(55, 900 / step.lines.length);
        for (const text of step.lines) {
          castLine(text, true);
          if (!(await castWait(per, run))) return;
        }
      }
      setCastProgress(i + 1);
    }

    castLine(`<span class="c-green">${cast.steps[0] ? cast.steps[0].prompt : "$"}</span> <span class="cursor"></span>`, false);
    cast.finished = true;
    updateCastButton();
    cast.loopTimer = window.setTimeout(() => {
      if (run === cast.run && animated() && isPaneVisible("demo") && !document.hidden) playCast();
    }, 7000);
  }

  function startCast() {
    if (!cast.screen) return;
    cast.paused = false;
    cast.userPaused = false;
    cast.pending = false;
    if (!animated()) drawCastStatic();
    else if (isPaneVisible("demo")) playCast();
    else {
      // Hidden behind another pane: play from the top the moment it is shown.
      cast.pending = true;
      cast.screen.innerHTML = "";
      setCastProgress(0);
    }
  }

  /** Called when the demo pane is shown or hidden, or the agents go idle. */
  function syncCastPlayback() {
    if (!cast.screen || !cast.screen.isConnected) return;
    if (!animated()) {
      if (!cast.finished) drawCastStatic();
      return;
    }
    const visible = isPaneVisible("demo");
    if (visible && cast.pending) {
      cast.pending = false;
      playCast();
      return;
    }
    if (!visible) cast.paused = true;
    else if (!cast.userPaused) cast.paused = false;
    updateCastButton();
  }

  function currentScene(item) {
    return item.scenes.find((s) => s.id === state.scene[item.id]) || item.scenes[0];
  }

  function renderDemo(item) {
    cast.run += 1;
    window.clearTimeout(cast.loopTimer);
    cast.screen = null;
    cast.steps = [];
    cast.userPaused = false;
    cast.pending = false;

    const scene = currentScene(item);
    els.demoTitle.textContent = scene.title;
    const tabs =
      item.scenes.length > 1
        ? `<div class="scene-tabs" role="tablist">${item.scenes
            .map(
              (s) =>
                `<button type="button" role="tab" class="scene-tab${s === scene ? " is-active" : ""}" data-scene="${esc(s.id)}" aria-selected="${s === scene}">${esc(s.title)}</button>`
            )
            .join("")}</div>`
        : "";

    if (scene.kind === "video") {
      els.demoProgress.textContent = "";
      els.demoBody.innerHTML = `${tabs}
        <div class="video-wrap paint">
          <video controls muted loop playsinline preload="none" poster="${esc(scene.poster)}" width="${scene.w}" height="${scene.h}"
            aria-label="${esc(item.name)} demo">
            <source src="${esc(scene.src)}" type="video/mp4" />
          </video>
        </div>
        <div class="cast-bar"><span class="cast-note">${esc(t(scene.note))}</span></div>`;
      return;
    }

    els.demoBody.innerHTML = `${tabs}
      <div class="cast" data-cast="toggle" title="${L("눌러서 멈춤/재생", "click to pause or play")}"></div>
      <div class="cast-bar">
        <button type="button" class="cast-btn" data-cast="toggle">‖ pause</button>
        <button type="button" class="cast-btn" data-cast="restart">⟳</button>
        <span class="cast-note">${esc(t(scene.note))}</span>
      </div>`;
    cast.screen = els.demoBody.querySelector(".cast");
    cast.steps = castSteps(item, scene);
    startCast();
  }

  // ── media pane: flow diagram, real shots, captured screens ─────
  let archTimer = 0;

  /** A packet walks the pipeline: one node lights up after another. */
  function syncArchFlow() {
    window.clearInterval(archTimer);
    const nodes = Array.from(els.mediaBody.querySelectorAll(".arch li"));
    nodes.forEach((n) => n.classList.remove("is-lit"));
    if (!nodes.length || !animated() || !isPaneVisible("media")) return;
    let tick = 0;
    archTimer = window.setInterval(() => {
      if (document.hidden) return;
      const at = tick % (nodes.length + 2);
      nodes.forEach((n, i) => n.classList.toggle("is-lit", i === at));
      tick += 1;
    }, 620);
  }

  function fileName(src) {
    return src.split("/").pop();
  }

  function mediaTile(item, m, index) {
    const cap = esc(t(m.caption));
    if (m.kind === "logos") {
      return `<div class="logos">${m.items
        .map(
          (logo, i) => `<div class="logo-chip" style="--i:${i}">
            <img src="${esc(logo.src)}" alt="" width="64" height="64" loading="lazy" />
            <div><b>${esc(logo.name)}</b><span>${esc(logo.sub)}</span></div>
          </div>`
        )
        .join("")}</div>`;
    }
    if (m.kind === "screen") {
      return `<button type="button" class="shot is-wide" data-media="${index}">
        <span class="shot-h"><span>${esc(m.title)}</span><span>${m.cols} cols · real</span></span>
        <span class="shot-frame screen-wrap" style="--cols:${m.cols}"><span class="screen">${CAPTURES[m.capture] || ""}</span></span>
        <span class="shot-cap">${cap}</span>
      </button>`;
    }
    const svg = m.src.endsWith(".svg");
    const wide = m.w / m.h > 3;
    return `<button type="button" class="shot${wide ? " is-wide" : ""}" data-media="${index}">
      <span class="shot-h"><span>${esc(fileName(m.src))}</span><span>${m.w}×${m.h}</span></span>
      <span class="shot-frame${svg ? " is-svg" : ""}"><img src="${esc(m.src)}" alt="${cap}" width="${m.w}" height="${m.h}" loading="lazy" decoding="async" data-reveal /></span>
      <span class="shot-cap">${cap}</span>
    </button>`;
  }

  function renderMedia(item) {
    const shots = item.media.filter((m) => m.kind !== "logos");
    const logos = item.media.filter((m) => m.kind === "logos");
    els.mediaTitle.textContent = shots.length ? `${shots.length} ${shots.length > 1 ? "shots" : "shot"}` : "flow";

    const blocks = [];
    blocks.push(`<section class="sec">
      <h2 class="sec-h">${L("동작 흐름", "Architecture Flow")}</h2>
      <div class="arch-wrap">
        <div class="arch-logo">${renderLogo(item, "arch")}</div>
        <ol class="arch">${item.archNodes.map((node) => `<li>${esc(node)}</li>`).join("")}</ol>
      </div>
    </section>`);

    logos.forEach((m) => {
      blocks.push(`<section class="sec"><h2 class="sec-h">${esc(t(m.caption))}</h2>${mediaTile(item, m, -1)}</section>`);
    });

    if (shots.length) {
      blocks.push(`<section class="sec">
        <h2 class="sec-h">${L("화면", "Screens")} · ${shots.length}</h2>
        <div class="gallery">${item.media.map((m, i) => (m.kind === "logos" ? "" : mediaTile(item, m, i))).join("")}</div>
      </section>`);
    } else {
      blocks.push(
        `<div class="media-note">${L(
          "이 프로젝트는 아직 스크린샷이 없습니다 — 자세한 동작은 저장소 README 에 있습니다.",
          "No screenshots for this project yet — the repository README has the details."
        )}</div>`
      );
    }

    els.mediaBody.innerHTML = `<div class="media">${blocks.map((html, i) => block(html, i, 0)).join("")}</div>`;
    els.mediaBody.scrollTop = 0;
    els.mediaBody.querySelectorAll("img[data-reveal]").forEach(revealImage);
    syncArchFlow();
  }

  /** Images resolve out of big pixels, the way a terminal image protocol paints a picture in. */
  function revealImage(img) {
    if (!animated()) return;
    const frame = img.parentElement;
    const run = () => {
      if (!img.naturalWidth || !frame.isConnected) return;
      const canvas = document.createElement("canvas");
      const ratio = img.naturalHeight / img.naturalWidth;
      canvas.width = 160;
      canvas.height = Math.max(1, Math.round(160 * ratio));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      frame.appendChild(canvas);
      const small = document.createElement("canvas");
      const sctx = small.getContext("2d");
      const widths = [6, 12, 24, 48, 96];
      let i = 0;
      const step = () => {
        if (!canvas.isConnected) return;
        if (i >= widths.length) {
          canvas.remove();
          return;
        }
        small.width = widths[i];
        small.height = Math.max(1, Math.round(widths[i] * ratio));
        try {
          sctx.drawImage(img, 0, 0, small.width, small.height);
          ctx.imageSmoothingEnabled = false;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
        } catch (e) {
          canvas.remove();
          return;
        }
        i += 1;
        window.setTimeout(step, 70);
      };
      step();
    };
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener("load", run, { once: true });
  }

  // ── lightbox ───────────────────────────────────────────────────
  const lightbox = { index: -1, returnFocus: null };

  function lightboxItems() {
    return getSelectedItem().media.map((m, i) => ({ m, i })).filter(({ m }) => m.kind !== "logos");
  }

  function showLightbox(index) {
    const item = getSelectedItem();
    const m = item.media[index];
    if (!m) return;
    if (els.lightbox.hidden) lightbox.returnFocus = document.activeElement;
    lightbox.index = index;
    const list = lightboxItems();
    const pos = list.findIndex((entry) => entry.i === index) + 1;
    els.lbTitle.textContent = `${item.name} · ${m.kind === "screen" ? "tui capture" : fileName(m.src)} · ${pos}/${list.length}`;
    els.lbCaption.textContent = t(m.caption);
    if (m.href) {
      els.lbOpen.hidden = false;
      els.lbOpen.href = m.href;
    } else {
      els.lbOpen.hidden = true;
    }
    els.lbStage.innerHTML =
      m.kind === "screen"
        ? `<div class="screen-wrap" style="--cols:${m.cols}"><div class="screen">${CAPTURES[m.capture] || ""}</div></div>`
        : `<img src="${esc(m.src)}" alt="${esc(t(m.caption))}" width="${m.w}" height="${m.h}"${m.src.endsWith(".svg") ? ' class="is-svg"' : ""} />`;
    els.lightbox.hidden = false;
    $("lb-close").focus();
  }

  function moveLightbox(delta) {
    const list = lightboxItems();
    const at = list.findIndex((entry) => entry.i === lightbox.index);
    if (at < 0) return;
    showLightbox(list[(at + delta + list.length) % list.length].i);
  }

  function closeLightbox() {
    if (els.lightbox.hidden) return;
    els.lightbox.hidden = true;
    els.lbStage.innerHTML = "";
    if (lightbox.returnFocus && lightbox.returnFocus.isConnected) lightbox.returnFocus.focus();
  }

  // ── selection ──────────────────────────────────────────────────
  function renderSpace(animate) {
    const item = getSelectedItem();
    renderPaneHead(item);
    renderReadme(item, animate);
    renderDemo(item);
    renderMedia(item);
    renderPaneList();
    if (animate) sweepStatusline(item);
    else {
      els.statuslineLogoSlot.innerHTML = renderLogo(item, "sl");
      renderStatusline(item, 1);
    }
    updateScrollPositions();
    document.title = item.id === "profile" ? "KyongSik Yoon — Herdr Workspace Showcase" : `${item.name} — KyongSik Yoon`;
  }

  function selectItem(id, updateHash = true) {
    if (!ALL_ITEMS.some((it) => it.id === id)) return;
    setSidebarOpen(false);
    if (id === state.selectedId) return;
    state.selectedId = id;
    state.ctxDrift = 0;
    state.minutes = 0;
    if (state.active) state.agents[id] = "working";
    if (updateHash && window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
    updateSidebarSelection();
    renderSpace(true);
  }

  function setLang(lang) {
    state.lang = lang;
    store.set("lang", lang);
    renderTopControls();
    renderTabs();
    renderSidebar();
    renderSpace(false);
  }

  function setActive(active) {
    state.active = active;
    renderTopControls();
    updateAgentIcons();
    const item = getSelectedItem();
    els.statuslineLogoSlot.innerHTML = renderLogo(item, "sl");
    const archLogo = els.mediaBody.querySelector(".arch-logo");
    if (archLogo) archLogo.innerHTML = renderLogo(item, "arch");
    syncCastPlayback();
    if (active && cast.screen && cast.finished) startCast();
    syncArchFlow();
  }

  // ── shell ──────────────────────────────────────────────────────
  let feedbackTimer = 0;

  function setPromptFeedback(msg) {
    els.promptFeedback.textContent = msg;
    window.clearTimeout(feedbackTimer);
    if (msg) feedbackTimer = window.setTimeout(() => (els.promptFeedback.textContent = ""), 3200);
  }

  const COMMANDS = {
    help: () => L("이 도움말", "this help"),
    ls: () => L("프로젝트 목록", "list the projects"),
    "open <name>": () => L("프로젝트 열기 (cd 도 같음)", "open a project (cd works too)"),
    profile: () => L("프로필 홈", "profile home"),
    "tab <readme|demo|media>": () => L("패인 이동", "move to a pane"),
    zoom: () => L("지금 패인 확대/복귀", "zoom the focused pane"),
    "theme [name]": () => THEMES.join(" · "),
    crt: () => L("CRT 스캔라인 켜기/끄기", "toggle the CRT scanlines"),
    "ko / en": () => L("표시 언어", "display language"),
    toggle: () => L("에이전트 working / idle", "agents working / idle"),
    fetch: () => L("시스템 요약", "system summary"),
    keys: () => L("단축키", "keyboard shortcuts"),
    "github / site": () => L("저장소·사이트 열기", "open the repo or the site"),
    clear: () => L("화면 지우기", "clear the screen"),
  };

  const COMMAND_WORDS = [
    "help", "ls", "open", "cd", "profile", "tab", "pane", "zoom", "theme", "crt", "ko", "en", "lang",
    "toggle", "fetch", "neofetch", "keys", "github", "site", "clear", "whoami", "history", "date", "echo",
  ];

  function findItem(arg) {
    const q = arg.toLowerCase();
    if (!q) return null;
    if (q === "~" || q === "home" || q === "profile") return PROFILE_ENTRY;
    const n = Number(q);
    if (Number.isInteger(n) && n >= 1 && n <= PROJECTS.length) return PROJECTS[n - 1];
    return (
      ALL_ITEMS.find((it) => it.id.toLowerCase() === q) ||
      ALL_ITEMS.find((it) => it.id.toLowerCase().startsWith(q)) ||
      ALL_ITEMS.find((it) => it.name.toLowerCase().includes(q)) ||
      null
    );
  }

  function handleCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    state.history.push(cmd);
    state.historyIndex = state.history.length;
    const parts = cmd.split(/\s+/);
    const head = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");
    const argLower = arg.toLowerCase();

    if (head === "help" || head === "?") {
      print(
        `<div class="out-table">${Object.entries(COMMANDS)
          .map(([name, desc]) => `<span>${esc(name)}</span><span class="c-dim">${esc(desc())}</span>`)
          .join("")}</div>`,
        cmd
      );
      return;
    }
    if (head === "ls") {
      print(
        `<div class="out-table">${PROJECTS.map(
          (p, i) =>
            `<button type="button" class="link" data-select-id="${esc(p.id)}">${i + 1} ${esc(p.name)}/</button><span class="c-dim">${esc(t(p.sub))}</span>`
        ).join("")}</div>`,
        cmd
      );
      return;
    }
    if (head === "profile" || head === "home" || head === "~") {
      selectItem("profile");
      setPromptFeedback("switched -> profile");
      return;
    }
    if (head === "open" || head === "cd") {
      const match = findItem(argLower.replace(/^~\/dev\/git-repo\//, "").replace(/\/$/, ""));
      if (match) {
        selectItem(match.id);
        setPromptFeedback(`opened ${match.name}`);
      } else {
        print(`<div class="c-red">cd: no such space: ${esc(arg || "(none)")}</div><div class="c-dim">${L("ls 로 목록을 볼 수 있습니다.", "try ls for the list.")}</div>`, cmd);
      }
      return;
    }
    if (head === "tab" || head === "pane") {
      const target = PANES.find((p) => p === argLower) || PANES[Number(argLower) - 1];
      if (target) {
        focusPane(target);
        setPromptFeedback(`pane: ${target}`);
      } else {
        print(`<div class="c-red">tab: ${esc(arg || "?")} — readme · demo · media</div>`, cmd);
      }
      return;
    }
    if (head === "zoom") {
      if (state.layout === "single") setPromptFeedback(L("이 폭에서는 이미 한 패인입니다", "already a single pane at this width"));
      else toggleZoom();
      return;
    }
    if (head === "theme") {
      if (!argLower) {
        cycleTheme();
      } else if (setTheme(argLower)) {
        setPromptFeedback(`theme: ${argLower}`);
      } else {
        print(`<div class="c-red">theme: ${esc(arg)} — ${THEMES.join(" · ")}</div>`, cmd);
      }
      return;
    }
    if (head === "crt") {
      setCrt(argLower === "on" ? true : argLower === "off" ? false : !state.crt);
      setPromptFeedback(`crt: ${state.crt ? "on" : "off"}`);
      return;
    }
    if (head === "toggle" || head === "anim") {
      setActive(!state.active);
      setPromptFeedback(`status: ${state.active ? "working" : "idle"}`);
      return;
    }
    if (head === "ko" || head === "en" || head === "lang") {
      const lang = head === "lang" ? (argLower === "en" ? "en" : argLower === "ko" ? "ko" : state.lang === "ko" ? "en" : "ko") : head;
      setLang(lang);
      setPromptFeedback(`lang: ${lang.toUpperCase()}`);
      return;
    }
    if (head === "github") {
      window.open(getSelectedItem().repoUrl, "_blank", "noopener,noreferrer");
      setPromptFeedback("opened GitHub ↗");
      return;
    }
    if (head === "site") {
      window.open(getSelectedItem().siteUrl || getSelectedItem().repoUrl, "_blank", "noopener,noreferrer");
      setPromptFeedback("opened site ↗");
      return;
    }
    if (head === "clear") {
      renderReadme(getSelectedItem(), false);
      return;
    }
    if (head === "fetch" || head === "neofetch" || head === "fastfetch") {
      print(fetchBlock(), cmd);
      return;
    }
    if (head === "whoami") {
      print(`<div>sam <span class="c-dim">— KyongSik Yoon · ${esc(t(PROFILE_ENTRY.sub))}</span></div>`, cmd);
      return;
    }
    if (head === "keys") {
      print(`<div class="wk-grid">${keyRows(false)}</div>`, cmd);
      return;
    }
    if (head === "history") {
      print(`<div>${state.history.map((h, i) => `<div><span class="c-muted">${String(i + 1).padStart(3, " ")}</span>  ${esc(h)}</div>`).join("")}</div>`, cmd);
      return;
    }
    if (head === "date") {
      print(`<div>${esc(new Date().toString())}</div>`, cmd);
      return;
    }
    if (head === "echo") {
      print(`<div>${esc(arg)}</div>`, cmd);
      return;
    }
    const direct = findItem(head);
    if (direct && parts.length === 1) {
      selectItem(direct.id);
      setPromptFeedback(`opened ${direct.name}`);
      return;
    }
    print(`<div class="c-red">zsh: command not found: ${esc(head)}</div><div class="c-dim">${L("help 를 입력해 보세요.", "try help.")}</div>`, cmd);
  }

  function completeInput() {
    const value = els.cmdInput.value;
    const parts = value.split(/\s+/);
    let pool = COMMAND_WORDS;
    if (parts.length > 1) {
      const head = parts[0].toLowerCase();
      if (head === "open" || head === "cd") pool = ALL_ITEMS.map((it) => it.id);
      else if (head === "theme") pool = THEMES;
      else if (head === "tab" || head === "pane") pool = PANES;
      else if (head === "crt") pool = ["on", "off"];
      else return;
    }
    const last = parts[parts.length - 1].toLowerCase();
    const hits = pool.filter((word) => word.startsWith(last));
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      els.cmdInput.value = `${parts.join(" ")} `;
    } else if (hits.length > 1) {
      setPromptFeedback(hits.slice(0, 6).join("  "));
    }
  }

  // ── which-key ──────────────────────────────────────────────────
  const KEYS = [
    ["1–6", () => L("프로젝트 열기", "open a project"), false],
    ["0 ~", () => L("프로필", "profile"), false],
    ["j k", () => L("다음·이전 스페이스", "next / previous space"), false],
    ["alt+←→", () => L("패인 이동", "move between panes"), false],
    ["alt+1–3", () => L("패인 선택", "pick a pane"), false],
    ["z", () => L("패인 확대", "zoom the pane"), true],
    ["t", () => L("테마 바꾸기", "next theme"), true],
    ["c", () => L("CRT 효과", "CRT effect"), true],
    ["l", () => L("언어 전환", "switch language"), true],
    ["b", () => L("사이드바", "sidebar"), true],
    ["w", () => L("working / idle", "working / idle"), true],
    ["1 2 3", () => L("패인 선택", "pick a pane"), "prefix"],
    ["/", () => L("스페이스 검색", "filter spaces"), false],
    [":", () => L("명령 입력", "command line"), true],
    ["C-a", () => L("프리픽스", "prefix"), false],
    ["?", () => L("이 표", "this table"), false],
  ];

  function keyRows(prefixOnly) {
    return KEYS.filter(([, , inPrefix]) => (prefixOnly ? inPrefix : inPrefix !== "prefix"))
      .map(([key, label]) => `<div><kbd>${esc(key)}</kbd><span>${esc(label())}</span></div>`)
      .join("");
  }

  const prefix = { armed: false, timer: 0 };

  function showWhichKey(prefixMode) {
    els.whichkey.innerHTML = `<div class="wk-title">${prefixMode ? "prefix C-a —" : L("단축키", "keys")}</div><div class="wk-grid">${keyRows(prefixMode)}</div>`;
    els.whichkey.hidden = false;
  }

  function hideWhichKey() {
    prefix.armed = false;
    window.clearTimeout(prefix.timer);
    els.whichkey.hidden = true;
  }

  function armPrefix() {
    prefix.armed = true;
    showWhichKey(true);
    window.clearTimeout(prefix.timer);
    prefix.timer = window.setTimeout(hideWhichKey, 3000);
  }

  /** Keys that work both after the prefix and bare. */
  function runSharedKey(key) {
    if (key === "z") toggleZoom();
    else if (key === "t") cycleTheme();
    else if (key === "c") {
      setCrt(!state.crt);
      setPromptFeedback(`crt: ${state.crt ? "on" : "off"}`);
    } else if (key === "l") setLang(state.lang === "ko" ? "en" : "ko");
    else if (key === "b") {
      if (els.app.dataset.sidebar === "drawer") setSidebarOpen(!state.sidebarOpen);
    } else if (key === "w") setActive(!state.active);
    else if (key === ":") els.cmdInput.focus();
    else return false;
    return true;
  }

  // ── agents: a little life in the sidebar ───────────────────────
  let spinFrame = 0;

  function tickSpinner() {
    if (!state.active || document.hidden) return;
    spinFrame = (spinFrame + 1) % SPINNER.length;
    const glyph = SPINNER[spinFrame];
    document.querySelectorAll("[data-spin]").forEach((node) => {
      node.textContent = glyph;
    });
  }

  function toast(item) {
    while (els.toasts.children.length) els.toasts.firstChild.remove();
    const node = document.createElement("button");
    node.type = "button";
    node.className = "toast";
    node.setAttribute("data-select-id", item.id);
    node.innerHTML = `<b>✓ ${esc(item.agent)}</b> ${L("작업을 마쳤습니다", "finished")}<small>${esc(item.name)} · ${L("눌러서 열기", "open")}</small>`;
    els.toasts.appendChild(node);
    window.setTimeout(() => {
      node.classList.add("is-out");
      window.setTimeout(() => node.remove(), 320);
    }, 4600);
  }

  function tickAgents() {
    if (!animated() || document.hidden) return;
    const others = ALL_ITEMS.filter((it) => it.id !== state.selectedId);
    const item = others[Math.floor(Math.random() * others.length)];
    const current = state.agents[item.id] || "idle";
    if (current === "working") {
      state.agents[item.id] = "done";
      if (els.lightbox.hidden) toast(item);
    } else {
      state.agents[item.id] = "working";
    }
    updateAgentIcons();
  }

  function tickStatusline() {
    if (!animated() || document.hidden) return;
    state.ctxDrift = state.ctxDrift >= 9 ? 0 : state.ctxDrift + 1;
    renderStatusline(getSelectedItem(), 1);
  }

  // ── boot ───────────────────────────────────────────────────────
  async function boot() {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem("herdr.booted") === "1";
      window.sessionStorage.setItem("herdr.booted", "1");
    } catch (e) {
      seen = false;
    }
    if (seen || reduceMotion.matches) return;

    const lines = [
      `<span class="c-white">ghostty</span> · xterm-ghostty · ${state.cols}×${state.rows}`,
      `<span class="c-green">$</span> <span class="c-white">herdr</span>`,
      `herdr v0.9.5 — attaching session <span class="c-cyan">main</span>`,
      `  <span class="c-green">✓</span> spaces   ${ALL_ITEMS.length} restored`,
      `  <span class="c-green">✓</span> agents   ${[...new Set(ALL_ITEMS.map((it) => it.agent))].join(" · ")}`,
      `  <span class="c-green">✓</span> layout   ${state.layout}`,
    ];
    els.boot.hidden = false;
    let skipped = false;
    const skip = () => {
      skipped = true;
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    for (let i = 0; i < lines.length && !skipped; i += 1) {
      els.bootLines.innerHTML = `${lines.slice(0, i + 1).join("\n")}\n<span class="cursor"></span>`;
      await sleep(i === 1 ? 260 : 120);
    }
    if (!skipped) await sleep(260);
    window.removeEventListener("keydown", skip);
    window.removeEventListener("pointerdown", skip);
    els.boot.classList.add("is-out");
    window.setTimeout(() => {
      els.boot.hidden = true;
    }, 400);
  }

  // ── events ─────────────────────────────────────────────────────
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      if (ok) resolve();
      else reject(new Error("copy failed"));
    });
  }

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (!els.whichkey.hidden && !prefix.armed) hideWhichKey();

    const spaceBtn = target.closest("[data-select-id]");
    if (spaceBtn) {
      selectItem(spaceBtn.getAttribute("data-select-id"));
      return;
    }

    const zoomBtn = target.closest("[data-zoom]");
    if (zoomBtn) {
      toggleZoom(zoomBtn.getAttribute("data-zoom"));
      return;
    }

    const tabBtn = target.closest("[data-tab]");
    if (tabBtn) {
      focusPane(tabBtn.getAttribute("data-tab") || "readme");
      setSidebarOpen(false);
      return;
    }

    const cmdBtn = target.closest("[data-cmd]");
    if (cmdBtn) {
      handleCommand(cmdBtn.getAttribute("data-cmd") || "");
      return;
    }

    const copyBtn = target.closest("[data-copy]");
    if (copyBtn) {
      copyText(copyBtn.getAttribute("data-copy") || "").then(
        () => {
          copyBtn.textContent = "✓ copied";
          copyBtn.classList.add("is-done");
          window.setTimeout(() => {
            copyBtn.textContent = "⧉ copy";
            copyBtn.classList.remove("is-done");
          }, 1600);
        },
        () => setPromptFeedback(L("복사하지 못했습니다", "could not copy"))
      );
      return;
    }

    const sceneBtn = target.closest("[data-scene]");
    if (sceneBtn) {
      const item = getSelectedItem();
      state.scene[item.id] = sceneBtn.getAttribute("data-scene");
      renderDemo(item);
      return;
    }

    const castBtn = target.closest("[data-cast]");
    if (castBtn && cast.screen) {
      if (castBtn.getAttribute("data-cast") === "restart" || cast.finished) {
        cast.userPaused = false;
        cast.paused = false;
        if (reduceMotion.matches) drawCastStatic();
        else playCast();
      } else {
        cast.paused = !cast.paused;
        cast.userPaused = cast.paused;
        updateCastButton();
      }
      return;
    }

    const mediaBtn = target.closest("[data-media]");
    if (mediaBtn) {
      showLightbox(Number(mediaBtn.getAttribute("data-media")));
      return;
    }

    if (target === els.lbStage) closeLightbox();
  });

  // Focus follows the pointer press, like a multiplexer with mouse support.
  els.tiles.addEventListener("pointerdown", (e) => {
    const pane = e.target instanceof Element ? e.target.closest(".pane") : null;
    if (pane && pane.dataset.pane !== state.pane && !state.zoom && state.layout !== "single") {
      state.pane = pane.dataset.pane;
      applyPaneVisibility();
    }
  });

  els.tiles.addEventListener("dblclick", (e) => {
    const label = e.target instanceof Element ? e.target.closest(".pane-label") : null;
    if (label) toggleZoom(label.closest(".pane").dataset.pane);
  });

  els.tiles.addEventListener(
    "scroll",
    () => window.requestAnimationFrame(updateScrollPositions),
    { capture: true, passive: true }
  );

  // Feature cards: a light follows the pointer.
  els.term.addEventListener("pointermove", (e) => {
    const card = e.target instanceof Element ? e.target.closest(".feature") : null;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });

  // Swipe between panes when only one fits.
  const swipe = { x: 0, y: 0, ok: false };
  els.tiles.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      const scroller = e.target instanceof Element ? e.target.closest(".pre, .cast, video, .gallery") : null;
      swipe.ok = e.touches.length === 1 && !(scroller && scroller.scrollWidth > scroller.clientWidth + 2);
      swipe.x = touch.clientX;
      swipe.y = touch.clientY;
    },
    { passive: true }
  );
  els.tiles.addEventListener(
    "touchend",
    (e) => {
      if (!swipe.ok || state.layout !== "single") return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - swipe.x;
      const dy = touch.clientY - swipe.y;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) cyclePane(dx < 0 ? 1 : -1);
    },
    { passive: true }
  );

  // Split handles move in whole cells.
  function dragSplit(handle, axis) {
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      handle.classList.add("is-dragging");
      const rect = els.tiles.getBoundingClientRect();
      const cell = axis === "x" ? state.cw : parseFloat(getComputedStyle(root).getPropertyValue("--lh"));
      let shown = "";
      const move = (ev) => {
        const raw = axis === "x" ? ev.clientX - rect.left : ev.clientY - rect.top;
        const size = axis === "x" ? rect.width : rect.height;
        const snapped = Math.round(raw / cell) * cell;
        const pct = Math.max(30, Math.min(70, (snapped / size) * 100));
        root.style.setProperty(axis === "x" ? "--split-x" : "--split-y", `${pct}%`);
        const label = `${Math.round((pct / 100) * size / cell)} ${axis === "x" ? "cols" : "rows"}`;
        if (label !== shown) {
          shown = label;
          els.resizeOverlay.textContent = label;
          els.resizeOverlay.classList.add("is-on");
        }
        renderStatusline(getSelectedItem(), 1);
      };
      const up = () => {
        handle.classList.remove("is-dragging");
        handle.removeEventListener("pointermove", move);
        els.resizeOverlay.classList.remove("is-on");
        updateScrollPositions();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up, { once: true });
      handle.addEventListener("pointercancel", up, { once: true });
    });
    handle.addEventListener("dblclick", () => root.style.removeProperty(axis === "x" ? "--split-x" : "--split-y"));
  }
  dragSplit(els.splitX, "x");
  dragSplit(els.splitY, "y");

  els.brandHomeBtn.addEventListener("click", () => selectItem("profile"));
  els.mobileMenuBtn.addEventListener("click", () => setSidebarOpen(!state.sidebarOpen));
  els.sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
  els.themeBtn.addEventListener("click", cycleTheme);
  els.crtBtn.addEventListener("click", () => setCrt(!state.crt));
  els.activeToggleBtn.addEventListener("click", () => setActive(!state.active));
  els.langToggleBtn.addEventListener("click", () => setLang(state.lang === "ko" ? "en" : "ko"));
  $("lb-close").addEventListener("click", closeLightbox);
  $("lb-prev").addEventListener("click", () => moveLightbox(-1));
  $("lb-next").addEventListener("click", () => moveLightbox(1));

  els.spaceFilter.addEventListener("input", (e) => {
    state.filter = e.target.value || "";
    renderSidebar();
  });

  els.spaceFilter.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const first = els.projectSpaceList.querySelector("[data-select-id]");
    if (first) {
      selectItem(first.getAttribute("data-select-id"));
      els.spaceFilter.blur();
    }
  });

  els.promptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = els.cmdInput.value;
    els.cmdInput.value = "";
    handleCommand(val);
  });

  els.cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      completeInput();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!state.history.length) return;
      e.preventDefault();
      state.historyIndex = Math.max(0, Math.min(state.history.length, state.historyIndex + (e.key === "ArrowUp" ? -1 : 1)));
      els.cmdInput.value = state.history[state.historyIndex] || "";
    }
  });

  document.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    const isInput = activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement;

    if (!els.lightbox.hidden) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") moveLightbox(-1);
      else if (e.key === "ArrowRight") moveLightbox(1);
      else return;
      e.preventDefault();
      return;
    }

    if (e.key === "Escape") {
      if (isInput) activeEl.blur();
      hideWhichKey();
      setSidebarOpen(false);
      if (state.zoom) setZoom(null);
      return;
    }

    if (isInput) return;

    if (prefix.armed) {
      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
      e.preventDefault();
      hideWhichKey();
      if (/^[1-3]$/.test(e.key)) focusPane(PANES[Number(e.key) - 1]);
      else runSharedKey(e.key);
      return;
    }

    if (e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      armPrefix();
      return;
    }

    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      if (/^[1-3]$/.test(e.key)) {
        e.preventDefault();
        focusPane(PANES[Number(e.key) - 1]);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        cyclePane(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        cyclePane(-1);
      }
      return;
    }

    if (e.ctrlKey || e.metaKey) return;
    if (!els.whichkey.hidden) hideWhichKey();

    if (e.key === "?") {
      showWhichKey(false);
      return;
    }

    if (e.key === "/") {
      e.preventDefault();
      if (els.app.dataset.sidebar === "drawer") setSidebarOpen(true);
      els.spaceFilter.focus();
      return;
    }

    if (/^[1-6]$/.test(e.key)) {
      const proj = PROJECTS[Number(e.key) - 1];
      if (proj) selectItem(proj.id);
      return;
    }

    if (e.key === "0" || e.key === "~") {
      selectItem("profile");
      return;
    }

    // j/k and plain arrows walk the spaces; shift+arrows too, as in the herdr config.
    const scrollingPane = activeEl instanceof Element && activeEl.closest(".pane-body, .cast");
    const arrow = e.key === "ArrowDown" || e.key === "ArrowUp";
    if (e.key === "j" || e.key === "k" || (arrow && (e.shiftKey || !scrollingPane))) {
      e.preventDefault();
      const idx = ALL_ITEMS.findIndex((it) => it.id === state.selectedId);
      const delta = e.key === "j" || e.key === "ArrowDown" ? 1 : -1;
      selectItem(ALL_ITEMS[(idx + delta + ALL_ITEMS.length) % ALL_ITEMS.length].id);
      return;
    }

    if (runSharedKey(e.key)) e.preventDefault();
  });

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (hash) selectItem(hash, false);
  });

  let resizeFrame = 0;
  const onResize = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      measureGrid(true);
      updateScrollPositions();
    });
  };
  window.addEventListener("resize", onResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onResize);
    window.visualViewport.addEventListener("scroll", onResize);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      measureGrid(false);
      positionSidebarCursor(false);
    });
  }

  reduceMotion.addEventListener("change", () => {
    syncCastPlayback();
    syncArchFlow();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncCastPlayback();
  });

  // ── start ──────────────────────────────────────────────────────
  const initialHash = window.location.hash.replace(/^#/, "").trim();
  if (initialHash && ALL_ITEMS.some((it) => it.id === initialHash)) state.selectedId = initialHash;
  PROJECTS.forEach((p, i) => {
    state.agents[p.id] = i % 3 === 0 ? "working" : "idle";
  });
  state.agents[state.selectedId] = "working";

  renderTopControls();
  measureGrid(false);
  renderSidebar();
  applyPaneVisibility();
  renderSpace(true);
  boot();

  window.setInterval(tickSpinner, 90);
  window.setInterval(tickAgents, 13000);
  window.setInterval(tickStatusline, 15000);
  window.setInterval(() => {
    if (state.active) state.minutes += 1;
  }, 60000);
})();
