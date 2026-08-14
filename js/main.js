/**
 * main.js — UI Orchestrator
 * --------------------------
 * Handles only interactive UI behavior:
 *  - Navigation (active state tracking, scroll)
 *  - Honors carousel (flip cards, swipe)
 *  - Certifications coverflow carousel
 *  - Project modal (open/close)
 *  - AI Assistant widget (delegates to window.sendAIMessage)
 *  - Scroll animations, streak counter, video autoplay
 *
 * NO AI logic. NO regex intent matching. NO DOM text rendering.
 * All AI is delegated to js/ai/ai-service.js.
 * All page content is static HTML in index.html.
 */

/* ── Theme Management ──────────────────────────────────── */
var currentTheme = (function () {
  if (typeof localStorage !== "undefined" && localStorage.getItem("portfolio-theme")) {
    return localStorage.getItem("portfolio-theme");
  }
  return "light";
})();

function applyTheme(theme) {
  currentTheme = theme;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("portfolio-theme", theme);
  }
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  }
}

function toggleTheme() {
  var newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  renderNavigation();
}

/* ── Style Tokens ──────────────────────────────────────── */
var GRADIENT_HEADING = "font-display font-bold text-foreground";
var ELEVATED_CARD = "surface-card";
var ELEVATED_CARD_HOVER = "surface-card-hover";
var PRIMARY_BUTTON = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer";
var SECONDARY_BUTTON = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-card hover:bg-muted text-foreground border border-border hover:border-accent hover:text-accent shadow-sm transition-all duration-200 cursor-pointer";

/* ── State ─────────────────────────────────────────────── */
var activeNavId = "hero";
var honorsIndex = window.innerWidth >= 768 ? 1 : 0;
var honorsTimer = null;
var honorsResumeTimeout = null;
var certificationsIndex = 0;
var certificationTimer;
var assistantIsOpen = false;
var assistantMessages = [];

/* ── Icon Helper ───────────────────────────────────────── */
function icon(name, className) {
  var icons = {
    home: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 10.5 9-7 9 7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />',
    briefcase: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1m-9 4h14M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />',
    zap: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />',
    trophy: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8m-6-4h4m-7-9H4a2 2 0 0 0 2 2h1m10-2h3a2 2 0 0 1-2 2h-1M7 4h10v5a5 5 0 0 1-10 0V4z" />',
    graduation: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m22 10-10-5-10 5 10 5 10-5zM6 12v5c3 3 9 3 12 0v-5" />',
    mail: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />',
    arrowRight: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />',
    arrowDown: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />',
    chevronLeft: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />',
    chevronRight: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />',
    close: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12" />',
    flip: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4v12m6-16v12m0 0 4-4m-4 4-4-4" />',
    sun: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />',
    moon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />'
  };
  return '<svg class="' + className + '" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + (icons[name] || "") + "</svg>";
}

/* ── Tech Pill Helpers ─────────────────────────────────── */
function getTechPillClass(tech, index) {
  var base = "px-3 py-1 text-xs font-semibold rounded-full border bg-card text-foreground border-border";
  return base;
}

function techPills(items, small) {
  var html = "";
  for (var i = 0; i < items.length; i++) {
    var extra = small ? " !px-2 !py-0.5 !text-[10px]" : "";
    html += '<span class="' + getTechPillClass(items[i], i) + extra + '">' + items[i] + "</span>";
  }
  return html;
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION (JS-driven for active state & theme toggle)
══════════════════════════════════════════════════════════ */
function renderNavigation() {
  var navItems = [
    { id: "hero", label: "Home", icon: "home" },
    { id: "projects", label: "Projects", icon: "briefcase" },
    { id: "experience", label: "Experience", icon: "zap" },
    { id: "honors", label: "Honors", icon: "trophy" },
    { id: "certifications", label: "Certifications", icon: "graduation" }
  ];

  var desktopButtons = "";
  var mobileButtons = "";
  var GHOST_BUTTON = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200";

  for (var i = 0; i < navItems.length; i++) {
    var item = navItems[i];
    var isActive = activeNavId === item.id;
    var desktopClass = isActive
      ? "relative px-3.5 py-2 text-sm font-semibold transition-all duration-300 flex items-center gap-2 rounded-xl text-accent bg-muted border border-border"
      : "relative " + GHOST_BUTTON + " !px-3.5 !py-2";
    var mobileClass = isActive
      ? "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-muted text-accent border border-border"
      : "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-muted-foreground hover:bg-muted hover:text-foreground";

    desktopButtons += '<button type="button" data-scroll="' + item.id + '" class="' + desktopClass + '">' + icon(item.icon, "w-4 h-4") + item.label + "</button>";
    mobileButtons += '<button type="button" aria-label="' + item.label + '" data-scroll="' + item.id + '" class="' + mobileClass + '">' + icon(item.icon, "w-[18px] h-[18px]") + "</button>";
  }

  var themeToggleBtnDesktop =
    '<button type="button" id="theme-toggle-btn" aria-label="Toggle light and dark theme" class="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground hover:text-accent transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm ml-2">' +
    icon(currentTheme === "dark" ? "sun" : "moon", "w-4 h-4 text-accent") +
    '</button>';

  var themeToggleBtnMobile =
    '<button type="button" id="theme-toggle-mobile" aria-label="Toggle theme" class="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-accent shadow-sm ml-1">' +
    icon(currentTheme === "dark" ? "sun" : "moon", "w-4 h-4") +
    '</button>';

  document.getElementById("navigation").innerHTML =
    '<nav class="hidden md:flex fixed top-0 left-0 right-0 z-50 w-full nav-enter-top">' +
    '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between h-16">' +
    '<div class="flex-shrink-0 flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-[1.02]" data-scroll="hero">' +
    '<img src="/public/Logo.png" alt="Rohan Nimje" class="w-8 h-8 rounded-lg object-contain shadow-sm" />' +
    '<span class="font-display font-bold text-foreground text-base tracking-tight whitespace-nowrap">Rohan Nimje</span>' +
    '</div>' +
    '<div class="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">' +
    desktopButtons +
    '</div>' +
    '<div class="flex items-center gap-2">' +
    themeToggleBtnDesktop +
    '<button type="button" data-scroll="contact" class="' + PRIMARY_BUTTON + ' !px-5 !py-2 text-sm">' + icon("mail", "w-4 h-4") + "Get In Touch</button>" +
    '</div>' +
    '</div>' +
    '</nav>' +
    '<div id="bottom-nav" class="bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-center nav-enter-bottom">' +
    '<div class="rounded-full px-3 py-1.5 bg-card/90 dark:bg-card/75 border border-border/80 flex items-center gap-1.5 max-w-lg w-full justify-center shadow-sm backdrop-blur-md">' +
    mobileButtons +
    themeToggleBtnMobile +
    "</div>" +
    "</div>";
}

/* ══════════════════════════════════════════════════════════
   HONORS & RECOGNITION (Editorial Certificate Showcase)
══════════════════════════════════════════════════════════ */
function renderHonors() {
  var honors = (window.portfolioData && window.portfolioData.honors) || [];
  if (!honors.length) return;

  var container = document.getElementById("honors-carousel-container") || document.getElementById("honors");
  if (!container) return;

  var cards = "";
  var dots = "";

  for (var i = 0; i < honors.length; i++) {
    var honor = honors[i];
    var certSrc = honor.CertImgUrl || honor.image || "";
    var stackHtml = "";
    if (honor.techStack && honor.techStack.length) {
      for (var s = 0; s < Math.min(3, honor.techStack.length); s++) {
        stackHtml += '<span class="px-2 py-0.5 rounded bg-muted/60 text-muted-foreground text-[10px] font-mono font-medium tracking-tight border border-border/40">' + honor.techStack[s] + '</span>';
      }
    }

    cards +=
      '<div class="honor-card flex-shrink-0 snap-center w-[295px] sm:w-[335px] md:w-auto h-[390px] sm:h-[410px] cursor-pointer group select-none flex flex-col rounded-2xl overflow-hidden" data-honor-modal-id="' + honor.id + '" data-honor-index="' + i + '">' +

      '<!-- Certificate Hero Image (Occupies ~68% of card height) -->' +
      '<div class="relative w-full h-[68%] bg-muted/25 dark:bg-muted/10 p-3 sm:p-4 flex items-center justify-center border-b border-border/60 overflow-hidden">' +
      '<img src="' + certSrc + '" alt="' + honor.title + '" class="honor-cert-img w-full h-full object-contain rounded-lg" loading="lazy" decoding="async" draggable="false" />' +
      '</div>' +

      '<!-- Minimalist Footer Info Dock (~32% of card height) -->' +
      '<div class="w-full h-[32%] p-3.5 sm:p-4 flex flex-col justify-between bg-card">' +
      '<div class="space-y-1">' +
      '<div class="flex items-center justify-between gap-2">' +
      '<h3 class="font-display font-bold text-sm sm:text-base text-foreground tracking-tight truncate">' + honor.title + '</h3>' +
      '<span class="text-[11px] font-mono text-muted-foreground font-medium shrink-0">' + (honor.date || "2026") + '</span>' +
      '</div>' +
      '<p class="text-xs text-muted-foreground font-medium truncate">' + honor.event + '</p>' +
      '</div>' +

      (stackHtml ? '<div class="flex flex-wrap gap-1.5 pt-1.5">' + stackHtml + '</div>' : '') +
      '</div>' +

      '</div>';

    dots += '<button type="button" aria-label="Go to honor ' + (i + 1) + '" data-honor-dot="' + i + '" class="honor-indicator-dot h-1.5 rounded-full transition-all duration-300 ' + (i === 0 ? "w-6 bg-accent" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50") + '"></button>';
  }

  container.innerHTML =
    '<div class="honor-deck-container relative w-full select-none">' +
    '<!-- Dynamic Responsive Grid / Mobile Swipe Track -->' +
    '<div id="honor-deck" class="honor-deck-track flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto md:overflow-x-visible pb-2 pt-1 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar">' +
    cards +
    '</div>' +
    '<!-- Mobile Navigation Indicators (Hidden on desktop) -->' +
    '<div class="mt-3 flex md:hidden justify-center items-center gap-1.5" id="honor-indicators">' +
    dots +
    '</div>' +
    '</div>';

  initHonorCards();
}

function initHonorCards() {
  var deck = document.getElementById("honor-deck");
  var cards = document.querySelectorAll(".honor-card");
  if (!deck || !cards.length) return;

  deck.addEventListener("scroll", function () {
    var scrollLeft = deck.scrollLeft;
    var cardWidth = 310;
    var activeIdx = Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
    var dots = document.querySelectorAll("[data-honor-dot]");
    dots.forEach(function (dot, idx) {
      if (idx === activeIdx) {
        dot.className = "honor-indicator-dot h-1.5 rounded-full transition-all duration-300 w-6 bg-accent";
      } else {
        dot.className = "honor-indicator-dot h-1.5 rounded-full transition-all duration-300 w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50";
      }
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   CERTIFICATIONS COVERFLOW CAROUSEL (JS-rendered)
══════════════════════════════════════════════════════════ */
function getRelativePosition(index, activeIndex, total) {
  var diff = index - activeIndex;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function renderCertifications() {
  var certs = (window.portfolioData && window.portfolioData.certifications) || [];
  if (!certs.length) return;

  var activeCert = certs[certificationsIndex];
  var cards = "";

  for (var i = 0; i < certs.length; i++) {
    var cert = certs[i];
    var certSrc = cert.CertImgUrl || cert.image || "";
    var position = getRelativePosition(i, certificationsIndex, certs.length);
    if (Math.abs(position) <= 1) {
      var x = position < 0 ? -220 : position > 0 ? 220 : 0;
      var scale = position === 0 ? 0.95 : 0.68;
      var opacity = position === 0 ? 1 : 0.35;
      var zIndex = position === 0 ? 50 : 20;
      var rotate = position < 0 ? 42 : position > 0 ? -42 : 0;
      cards +=
        '<div data-cert-index="' + i + '" class="coverflow-card absolute cursor-pointer" style="z-index:' + zIndex + ";opacity:" + opacity + ";transform:translateX(" + x + "px) scale(" + scale + ") rotateY(" + rotate + 'deg);">' +
        '<div class="block bg-white rounded-xl border border-slate-200 w-full h-full relative overflow-visible"><img src="' + certSrc + '" alt="' + cert.name + '" draggable="false" loading="lazy" decoding="async" class="block w-full h-full object-contain bg-white rounded-[10px]" style="box-shadow:' + (position === 0 ? "0 12px 40px rgba(67, 56, 202, 0.14)" : "0 4px 16px rgba(15, 23, 42, 0.06)") + ';" /></div>' +
        "</div>";
    }
  }

  var container = document.getElementById("certifications-carousel-container") || document.getElementById("certifications");
  if (!container) return;

  container.innerHTML =
    '<div class="group/carousel relative w-full max-w-4xl mx-auto">' +
    '<div class="coverflow-stage relative w-full flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing">' +
    '<button type="button" aria-label="Previous certification" id="cert-prev" class="absolute left-0 top-1/2 z-40 -translate-y-1/2 w-12 sm:w-16 md:w-20 flex items-center justify-start pl-2 sm:pl-3 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"><span class="flex items-center justify-center w-9 h-9 rounded-full bg-card border border-border backdrop-blur-sm text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200 shadow-sm">' + icon("chevronLeft", "w-5 h-5") + "</span></button>" +
    '<button type="button" aria-label="Next certification" id="cert-next" class="absolute right-0 top-1/2 z-40 -translate-y-1/2 w-12 sm:w-16 md:w-20 flex items-center justify-end pr-2 sm:pr-3 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"><span class="flex items-center justify-center w-9 h-9 rounded-full bg-card border border-border backdrop-blur-sm text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200 shadow-sm">' + icon("chevronRight", "w-5 h-5") + "</span></button>" +
    '<div class="cert-gradient-left absolute left-0 top-0 bottom-0 w-20 sm:w-24 md:w-32 z-20 pointer-events-none"></div><div class="cert-gradient-right absolute right-0 top-0 bottom-0 w-20 sm:w-24 md:w-32 z-20 pointer-events-none"></div>' +
    cards +
    "</div>" +
    "</div>" +
    '<div class="mt-8 md:mt-10 space-y-3 text-center"><div><p class="text-sm sm:text-base md:text-lg font-semibold text-foreground">' + (activeCert ? activeCert.name : "") + '</p><p class="text-xs sm:text-sm text-muted-foreground">' + (activeCert ? activeCert.issuer : "") + '</p></div><div class="flex justify-center items-center gap-3 pt-2"><div class="w-2 h-2 rounded-full bg-accent tiny-pulse"></div><span class="text-xs sm:text-sm font-semibold text-muted-foreground"><span class="text-accent">' + (certificationsIndex + 1) + "</span> / " + certs.length + "</span></div></div>";
}

/* ══════════════════════════════════════════════════════════
   PROJECTS DATA RETRIEVAL & DYNAMIC RENDERING
══════════════════════════════════════════════════════════ */
function getProjectsData() {
  if (window.portfolioData && Array.isArray(window.portfolioData.projects) && window.portfolioData.projects.length > 0) {
    return window.portfolioData.projects;
  }
  return [];
}

var PROJECT_SLUG_MAP = {
  // ScanZy Rewards (ID: 1)
  "1": 1,
  "scanzy": 1,
  "scanzy-rewards": 1,
  "scanzy rewards": 1,
  "scanzyreward": 1,
  "scanzyrewards": 1,
  "smartcareer": 1,
  "loyalty": 1,
  "qr loyalty": 1,

  // Cosmolyze (ID: 2)
  "2": 2,
  "cosmolyze": 2,
  "skincare": 2,
  "skin analyzer": 2,
  "dermatologist": 2,
  "pocket dermatologist": 2,
  "idea2impact": 2,

  // Infrastructure Corruption Detector - Trinity X (ID: 3)
  "3": 3,
  "trinity": 3,
  "trinity x": 3,
  "trinity-x": 3,
  "infrastructure": 3,
  "corruption": 3,
  "corruption detector": 3,

  // Sparky (ID: 4)
  "4": 4,
  "sparky": 4,
  "sparky ai": 4,
  "life coach": 4,
  "productivity": 4,
  "student productivity": 4,

  // Autonomous Business & Workflow Automation System (ID: 5)
  "5": 5,
  "automation": 5,
  "make": 5,
  "make.com": 5,
  "automation engine": 5,
  "business automation": 5,
  "workflow automation": 5,

  // Smart Hackathon Finder Bot (ID: 6)
  "6": 6,
  "hackathon": 6,
  "hackathon bot": 6,
  "hackathon finder": 6,
  "automation anywhere": 6,
  "rpa": 6
};

function getProjectById(idOrSlug) {
  var projects = getProjectsData();
  if (!idOrSlug || !projects.length) return null;

  var targetStr = String(idOrSlug).trim().toLowerCase();

  // 1. Direct Slug Dictionary Mapping
  if (PROJECT_SLUG_MAP.hasOwnProperty(targetStr)) {
    var mappedId = PROJECT_SLUG_MAP[targetStr];
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id === mappedId) return projects[i];
    }
  }

  // 2. Numeric ID lookup
  var num = parseInt(targetStr, 10);
  if (!isNaN(num)) {
    for (var j = 0; j < projects.length; j++) {
      if (projects[j].id === num) return projects[j];
    }
  }

  // 3. Case-Insensitive Title/Description Substring Search
  for (var k = 0; k < projects.length; k++) {
    var p = projects[k];
    var titleLower = (p.title || "").toLowerCase();
    var descLower = (p.description || "").toLowerCase();
    if (titleLower.indexOf(targetStr) !== -1 || targetStr.indexOf(titleLower) !== -1 || descLower.indexOf(targetStr) !== -1) {
      return p;
    }
  }

  // Strict: NEVER default to projects[0]!
  return null;
}

// Global UI Tool for AI Agent Modal Calling
window.openProjectModal = function (idOrSlug) {
  var project = getProjectById(idOrSlug);
  if (project) {
    renderProjectModal(project);
  } else {
    console.warn("[Project Modal] No matching project found for target:", idOrSlug);
  }
};

function renderLaptopFrame(videoUrl, title) {
  return (
    '<div class="space-y-3 reveal">' +
    '<h4 class="text-xs font-mono font-semibold uppercase text-muted-foreground tracking-wider letter-spacing-wide">' + (title || "MVP Architecture") + '</h4>' +
    '<div class="relative rounded-2xl overflow-hidden border border-border shadow-2xl" style="background:#0d0d0d">' +
    '<div style="background:#1a1a1a;border-bottom:1px solid #2a2a2a" class="px-4 py-2.5 flex items-center justify-between">' +
    '<div class="flex gap-1.5">' +
    '<div style="width:10px;height:10px;border-radius:50%;background:#FF5F57"></div>' +
    '<div style="width:10px;height:10px;border-radius:50%;background:#FFBD2E"></div>' +
    '<div style="width:10px;height:10px;border-radius:50%;background:#28C840"></div>' +
    '</div>' +
    '<span style="font-family:monospace;font-size:11px;color:#666;letter-spacing:0.02em">scanzy-mvp-architecture.mp4</span>' +
    '<div style="width:50px"></div>' +
    '</div>' +
    '<video src="' + videoUrl + '" autoplay muted loop playsinline controls preload="auto" class="autoplay-video w-full aspect-video object-cover" style="background:#000;display:block"></video>' +
    '</div>' +
    '</div>'
  );
}

function renderMobileFrame(videoUrl, title) {
  return (
    '<div class="space-y-3 flex flex-col items-center reveal">' +
    '<h4 class="text-xs font-mono font-semibold uppercase text-muted-foreground tracking-wider self-start">' + (title || "Product Demo") + '</h4>' +
    '<div class="relative w-full max-w-[260px] aspect-[9/16] mx-auto overflow-hidden flex-1" style="border-radius:2.5rem;border:6px solid #1a1a1a;background:#000;box-shadow:0 25px 60px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.06)">' +
    '<video src="' + videoUrl + '" autoplay muted loop playsinline controls preload="auto" class="autoplay-video w-full h-full object-cover" style="background:#000;display:block"></video>' +
    '<div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:120px;height:20px;background:#1a1a1a;border-radius:0 0 16px 16px;z-index:20;display:flex;align-items:center;justify-content:center">' +
    '<div style="width:8px;height:8px;border-radius:50%;background:#2a2a2a"></div>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

function renderProjects() {
  var projects = getProjectsData();
  if (!projects.length) return;

  // Find the featured project (first item with isFeatured: true, or fallback to projects[0])
  var featuredProject = null;
  var secondaryProjects = [];

  for (var i = 0; i < projects.length; i++) {
    if (projects[i].isFeatured && !featuredProject) {
      featuredProject = projects[i];
    } else {
      secondaryProjects.push(projects[i]);
    }
  }

  if (!featuredProject && projects.length > 0) {
    featuredProject = projects[0];
    secondaryProjects = projects.slice(1);
  }

  // 1. Render Featured Project Hero Container
  var featuredContainer = document.getElementById("featured-project-container");
  if (featuredContainer && featuredProject) {
    var laptopVideo = featuredProject.laptopVideoUrl || featuredProject.videoUrlmvp || "";
    var mobileVideo = featuredProject.mobileVideoUrl || featuredProject.productDemoUrl || featuredProject.videourlproduct || "";

    if (!laptopVideo && !mobileVideo && featuredProject.videoUrl) {
      laptopVideo = featuredProject.videoUrl;
    }

    var videoMockupHtml = "";

    if (laptopVideo && mobileVideo) {
      // Dual layout: Laptop frame (Left) + Mobile frame (Right)
      videoMockupHtml =
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4">' +
        renderLaptopFrame(laptopVideo, "MVP Architecture Demo") +
        renderMobileFrame(mobileVideo, "Product Mobile Showcase") +
        '</div>';
    } else if (laptopVideo) {
      // Single laptop frame
      videoMockupHtml =
        '<div class="grid grid-cols-1 gap-6 pt-4 max-w-3xl mx-auto">' +
        renderLaptopFrame(laptopVideo, "System Architecture & Demo") +
        '</div>';
    } else if (mobileVideo) {
      // Single mobile device frame
      videoMockupHtml =
        '<div class="flex justify-center pt-4">' +
        renderMobileFrame(mobileVideo, "Product Showcase") +
        '</div>';
    }

    var toggleBtnText = "Show All Projects (" + secondaryProjects.length + ")";

    featuredContainer.innerHTML =
      '<div class="group relative rounded-3xl overflow-hidden surface-card surface-card-hover reveal">' +
      '<div class="p-8 md:p-12 space-y-8">' +
      '<div class="space-y-4">' +
      '<div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-subtle border border-accent/20 text-accent text-xs font-semibold font-mono">' +
      '<span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Featured Product Case Study' +
      '</div>' +
      '<h3 class="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">' +
      featuredProject.title +
      '</h3>' +
      '<p class="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">' +
      featuredProject.description +
      '</p>' +
      '</div>' +
      '<div class="flex flex-wrap gap-2">' +
      techPills(featuredProject.techStack || [], false) +
      '</div>' +
      videoMockupHtml +
      '<div class="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border mt-6">' +
      '<button type="button" id="featured-project-btn" data-project-id="' + featuredProject.id + '" class="' + PRIMARY_BUTTON + '">' +
      'View Full System Details ' + icon("arrowRight", "w-4 h-4") +
      '</button>' +
      (secondaryProjects.length > 0
        ? '<button type="button" id="toggle-projects" class="' + SECONDARY_BUTTON + '">' +
        toggleBtnText + ' ' + icon("arrowDown", "w-4 h-4") +
        '</button>'
        : '') +
      '</div>' +
      '</div>' +
      '</div>';
  }

  // 2. Render Secondary Projects Grid
  var gridContainer = document.getElementById("projects-grid-container");
  if (gridContainer) {
    var gridHtml = "";
    for (var j = 0; j < secondaryProjects.length; j++) {
      var proj = secondaryProjects[j];
      gridHtml +=
        '<div class="group relative overflow-hidden text-left h-full reveal">' +
        '<div class="relative h-64 sm:h-60 p-6 flex flex-col overflow-hidden surface-card surface-card-hover">' +
        '<div class="relative z-10 space-y-2.5">' +
        '<h3 class="text-base font-bold font-display text-foreground line-clamp-2">' + proj.title + '</h3>' +
        '<p class="text-muted-foreground text-xs line-clamp-2 leading-relaxed">' + proj.description + '</p>' +
        '<div class="flex flex-wrap gap-1 pt-1">' +
        techPills(proj.techStack || [], true) +
        '</div>' +
        '</div>' +
        '<div class="relative z-10 mt-auto pt-4">' +
        '<button type="button" data-project-id="' + proj.id + '" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-muted hover:bg-card text-foreground border border-border hover:border-accent hover:text-accent transition-all duration-200 w-full cursor-pointer">' +
        'View Case Study ' + icon("arrowRight", "w-3 h-3") +
        '</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    }
    gridContainer.innerHTML = gridHtml;
  }
}

/* ══════════════════════════════════════════════════════════
   SCROLL LOCK & MODAL CONTROLLERS
══════════════════════════════════════════════════════════ */
function lockBodyScroll() {
  document.body.classList.add("overflow-hidden");
}

function unlockBodyScroll() {
  var modalOpen = document.getElementById("project-modal") || document.getElementById("honor-lightbox-modal");
  if (!modalOpen && !assistantIsOpen) {
    document.body.classList.remove("overflow-hidden");
  }
}

function closeProjectModal() {
  var modalRoot = document.getElementById("project-modal-root");
  if (modalRoot) modalRoot.innerHTML = "";
  var toggle = document.getElementById("assistant-toggle");
  if (toggle && !assistantIsOpen) toggle.classList.remove("is-hidden");
  unlockBodyScroll();
}

/* ══════════════════════════════════════════════════════════
   HONOR / CERTIFICATE LIGHTBOX MODAL
══════════════════════════════════════════════════════════ */
function openHonorModal(honorId) {
  var honors = (window.portfolioData && window.portfolioData.honors) || [];
  var honor = honors.find(function (h) { return h.id === Number(honorId); });
  if (honor) {
    renderHonorModal(honor);
  }
}

function closeHonorModal() {
  var modalRoot = document.getElementById("honor-modal-root");
  if (modalRoot) modalRoot.innerHTML = "";
  var toggle = document.getElementById("assistant-toggle");
  if (toggle && !assistantIsOpen) toggle.classList.remove("is-hidden");
  unlockBodyScroll();
}

function renderHonorModal(honor) {
  if (!honor) return;
  lockBodyScroll();

  var toggle = document.getElementById("assistant-toggle");
  if (toggle) toggle.classList.add("is-hidden");

  var certSrc = honor.CertImgUrl || honor.image || "";
  var stackPills = "";
  if (honor.techStack && honor.techStack.length) {
    for (var s = 0; s < honor.techStack.length; s++) {
      stackPills += '<span class="px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-mono font-medium text-foreground tracking-tight">' + honor.techStack[s] + '</span>';
    }
  }

  var modalRoot = document.getElementById("honor-modal-root");
  if (!modalRoot) return;

  modalRoot.innerHTML =
    '<div id="honor-lightbox-modal" class="modal-backdrop fixed inset-0 bg-foreground/60 backdrop-blur-md z-[80] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="' + honor.title + '">' +
    '<div class="modal-panel relative w-full max-w-4xl max-h-[92vh] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[81]">' +

    '<!-- Header -->' +
    '<div class="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-card/90 backdrop-blur-sm">' +
    '<div class="flex items-center gap-3 min-w-0">' +
    '<div class="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0">' + icon("trophy", "w-4 h-4") + '</div>' +
    '<div class="min-w-0">' +
    '<div class="flex items-center gap-2">' +
    '<span class="px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-[10px] font-mono font-bold text-accent tracking-wider">' + (honor.badge || "VERIFIED AWARD") + '</span>' +
    '<span class="text-xs font-mono text-muted-foreground">' + (honor.date || "2026") + '</span>' +
    '</div>' +
    '<h2 class="text-base sm:text-lg font-bold font-display text-foreground truncate mt-0.5">' + honor.title + ' — <span class="text-accent font-medium">' + honor.event + '</span></h2>' +
    '</div>' +
    '</div>' +

    '<div class="flex items-center gap-2 flex-shrink-0">' +
    (certSrc ? '<a href="' + certSrc + '" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-all shadow-sm">' + icon("externalLink", "w-3.5 h-3.5") + '<span>Verify Certificate</span></a>' : '') +
    '<button type="button" id="close-honor-modal" aria-label="Close modal" class="p-2 rounded-xl bg-card border border-border hover:border-accent/40 hover:bg-muted text-foreground hover:text-accent transition-all shadow-sm cursor-pointer">' + icon("close", "w-5 h-5") + '</button>' +
    '</div>' +
    '</div>' +

    '<!-- Body with High-Resolution Certificate Lightbox Image -->' +
    '<div class="overflow-y-auto max-h-[calc(92vh-75px)] p-6 space-y-6">' +
    '<div class="relative w-full flex items-center justify-center bg-muted/30 rounded-2xl border border-border/70 p-3 sm:p-5 overflow-hidden group shadow-inner">' +
    '<img src="' + certSrc + '" alt="' + honor.title + '" class="max-h-[58vh] w-auto max-w-full object-contain rounded-xl shadow-md transition-transform duration-300" loading="eager" decoding="async" />' +
    '</div>' +

    '<div class="space-y-4">' +
    '<div class="space-y-1.5">' +
    '<div class="text-xs font-mono font-semibold uppercase tracking-wider text-accent">' + (honor.category || "Hackathon Honor") + '</div>' +
    '<p class="text-sm sm:text-base text-foreground leading-relaxed">' + honor.description + '</p>' +
    '</div>' +

    (stackPills ? '<div class="space-y-2 pt-2 border-t border-border/60"><div class="text-xs font-mono text-muted-foreground uppercase tracking-wider">Technologies &amp; Architecture:</div><div class="flex flex-wrap gap-2">' + stackPills + '</div></div>' : '') +

    '<div class="flex sm:hidden pt-2">' +
    (certSrc ? '<a href="' + certSrc + '" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-sm">' + icon("externalLink", "w-4 h-4") + '<span>Verify High-Res Certificate</span></a>' : '') +
    '</div>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '</div>';
}

/* ══════════════════════════════════════════════════════════
   PROJECT MODAL
══════════════════════════════════════════════════════════ */
function renderProjectModal(project) {
  if (!project) return;
  lockBodyScroll();

  var toggle = document.getElementById("assistant-toggle");
  if (toggle) toggle.classList.add("is-hidden");

  var media = "";
  var demoUrl = project.mobileVideoUrl || project.laptopVideoUrl || project.productDemoUrl || project.videourlproduct || project.videoUrlmvp || project.videoUrl;
  if (demoUrl) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Project Demo / Architecture</h3><div class="relative w-full aspect-video rounded-xl overflow-hidden border border-border shadow-sm bg-muted"><video preload="auto" src="' + demoUrl + '" controls class="w-full h-full object-cover"></video></div></div>';
  }
  var shotUrl = project.screenshotUrl || project.screenshoturl;
  if (shotUrl) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Screenshots</h3><div class="relative w-full rounded-xl overflow-hidden border border-border bg-card shadow-sm"><img src="' + shotUrl + '" alt="' + project.title + ' screenshot" class="w-full h-auto block object-cover" loading="lazy" decoding="async" /></div></div>';
  }
  var certImg = project.projectCertImgUrl || project.CertImgUrl;
  if (certImg) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Certificate & Recognition</h3><div class="relative w-full rounded-xl overflow-hidden border border-border bg-card shadow-sm"><img src="' + certImg + '" alt="' + project.title + ' certificate" class="w-full h-auto block object-cover" loading="lazy" decoding="async" /></div></div>';
  }

  var highlightsList = "";
  if (project.highlights && project.highlights.length) {
    highlightsList = '<div><h3 class="text-lg font-semibold text-foreground mb-3">Highlights</h3><ul class="space-y-2">';
    for (var h = 0; h < project.highlights.length; h++) {
      highlightsList += '<li class="flex items-start gap-2.5 text-sm text-foreground"><div class="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>' + project.highlights[h] + '</li>';
    }
    highlightsList += "</ul></div>";
  }

  document.getElementById("project-modal-root").innerHTML =
    '<div id="project-modal" class="modal-backdrop fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4">' +
    '<div class="modal-panel relative w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[71]">' +
    '<button type="button" id="close-modal" aria-label="Close modal" class="absolute top-4 right-4 z-10 p-2 rounded-lg bg-card border border-border hover:border-accent/40 hover:bg-muted transition-all shadow-sm cursor-pointer">' + icon("close", "w-5 h-5 text-foreground") + "</button>" +
    '<div class="overflow-y-auto max-h-[90vh] p-8 space-y-6">' +
    '<div><h2 class="text-3xl sm:text-4xl font-bold mb-2 ' + GRADIENT_HEADING + '">' + project.title + '</h2><p class="text-muted-foreground">' + project.description + "</p></div>" +
    '<div><h3 class="text-lg font-semibold text-foreground mb-3">Tech Stack</h3><div class="flex flex-wrap gap-2">' + techPills(project.techStack || [], false) + "</div></div>" +
    highlightsList +
    media +
    "</div>" +
    "</div>" +
    "</div>";
}

/* ══════════════════════════════════════════════════════════
   AI ASSISTANT WIDGET & DRAGGABLE CONTROLLER
══════════════════════════════════════════════════════════ */
function renderAssistant() {
  var existing = document.getElementById("portfolio-assistant");
  if (existing) existing.remove();

  var shell = document.createElement("div");
  shell.id = "portfolio-assistant";
  shell.className = "assistant-shell";
  shell.innerHTML =
    '<section id="assistant-panel" class="assistant-panel is-hidden" aria-label="Rohan\'s personal AI assistant">' +
    '<div class="assistant-header">' +
    '<div class="flex items-start justify-between gap-3">' +
    '<div class="flex items-center gap-3 min-w-0">' +
    '<div class="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-sm">' + icon("zap", "w-6 h-6") + "</div>" +
    '<div class="min-w-0">' +
    '<p class="text-sm font-bold leading-tight">Rohan\'s AI Assistant</p>' +
    '<div class="mt-1 flex items-center gap-2 text-xs text-white/80"><span class="assistant-status-dot"></span><span>Personal representative</span></div>' +
    "</div>" +
    "</div>" +
    '<button type="button" id="assistant-close" aria-label="Close assistant" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors cursor-pointer">' + icon("close", "w-5 h-5") + "</button>" +
    "</div>" +
    "</div>" +
    '<div id="assistant-messages" class="assistant-messages"></div>' +
    '<div id="assistant-quick-actions" class="assistant-quick-actions"></div>' +
    '<form id="assistant-form" class="assistant-input-row">' +
    '<input id="assistant-input" class="assistant-input" type="text" autocomplete="off" placeholder="Ask about Rohan, hiring, projects..." aria-label="Ask Rohan\'s assistant" />' +
    '<button type="submit" class="assistant-send" aria-label="Send message">' + icon("arrowRight", "w-5 h-5") + "</button>" +
    "</form>" +
    "</section>" +
    '<div id="assistant-toggle" class="assistant-toggle" role="button" aria-label="Ask Rohan AI — Assistant" tabindex="0">' +
    '<video class="avatar-robot-video" src="/public/ai gif.webm" autoplay loop muted playsinline disablepictureinpicture></video>' +
    '</div>';

  document.body.appendChild(shell);

  assistantMessages = [
    {
      sender: "bot",
      html: "Hi! I'm <strong class=\"font-semibold text-indigo-700\">Rohan's personal AI assistant</strong>. Ask me about his background, projects, skills, achievements, or how to get in touch — in any language! 🌍"
    }
  ];

  renderAssistantMessages();
  renderAssistantQuickActions();
  initDraggableAssistant();
}

function initDraggableAssistant() {
  var toggle = document.getElementById("assistant-toggle");
  var panel = document.getElementById("assistant-panel");
  if (!toggle) return;

  var isDragging = false;
  var hasMoved = false;
  var dragStartX = 0;
  var dragStartY = 0;
  var initialLeft = 0;
  var initialTop = 0;
  var currentLeft = 0;
  var currentTop = 0;
  var isDockedOnLeft = false;
  var dragThreshold = 6;

  // Compute initial position — values mirror CSS clamp() midpoints
  var isMobile = window.innerWidth < 640;
  var isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  var isDesktop = window.innerWidth >= 1024;
  var isWide = window.innerWidth >= 1440;
  var defaultSize = isWide ? 150 : isDesktop ? 136 : isTablet ? 116 : 94;
  var toggleRect = toggle.getBoundingClientRect();
  var btnW = toggleRect.width || defaultSize;
  var btnH = toggleRect.height || defaultSize;
  var margin = isMobile ? 10 : isDesktop ? 20 : 16;
  var bottomMargin = isMobile ? 70 : isDesktop ? 20 : 16;

  currentLeft = document.documentElement.clientWidth - btnW - margin;
  currentTop = window.innerHeight - btnH - bottomMargin;
  applyPosition(currentLeft, currentTop, false);

  toggle.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    // Explicitly block event bleeding to underlying DOM
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();

    isDragging = true;
    hasMoved = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;

    var rect = toggle.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    toggle.classList.add("is-dragging");
    toggle.style.transition = "none";
    try {
      toggle.setPointerCapture(e.pointerId);
    } catch (_) { }

    function onPointerMove(moveEvent) {
      if (!isDragging) return;
      var deltaX = moveEvent.clientX - dragStartX;
      var deltaY = moveEvent.clientY - dragStartY;

      if (!hasMoved && Math.hypot(deltaX, deltaY) > dragThreshold) {
        hasMoved = true;
      }

      if (hasMoved) {
        moveEvent.preventDefault();
        var newLeft = initialLeft + deltaX;
        var newTop = initialTop + deltaY;

        var r = toggle.getBoundingClientRect();
        var maxL = document.documentElement.clientWidth - r.width - 6;
        var maxT = window.innerHeight - r.height - 6;

        newLeft = Math.max(6, Math.min(newLeft, maxL));
        newTop = Math.max(6, Math.min(newTop, maxT));

        currentLeft = newLeft;
        currentTop = newTop;
        applyPosition(newLeft, newTop, false);
      }
    }

    function onPointerUp(upEvent) {
      if (!isDragging) return;
      isDragging = false;
      toggle.classList.remove("is-dragging");

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      try {
        toggle.releasePointerCapture(upEvent.pointerId);
      } catch (_) { }

      if (!hasMoved) {
        // Tap/Click -> Toggle Assistant Panel
        if (assistantIsOpen) closeAssistant();
        else openAssistant();
        return;
      }

      // Edge snapping on drag release
      snapToEdge();
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  });

  // Strict pointer isolation: block native click/touchend from bubbling
  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    e.preventDefault();
  });

  toggle.addEventListener("touchend", function (e) {
    e.stopPropagation();
    // Don't prevent default indiscriminately if we need standard touch behavior,
    // but here we fully control the element via pointer events, so it's safe.
    if (e.cancelable) e.preventDefault();
  });

  function snapToEdge() {
    var rect = toggle.getBoundingClientRect();
    var isMobileNow = window.innerWidth < 640;
    var isTabletNow = window.innerWidth >= 640 && window.innerWidth < 1024;
    var isDesktopNow = window.innerWidth >= 1024;
    var isWideNow = window.innerWidth >= 1440;
    var defaultSizeNow = isWideNow ? 150 : isDesktopNow ? 136 : isTabletNow ? 116 : 94;
    var btnW = rect.width || defaultSizeNow;
    var btnH = rect.height || defaultSizeNow;
    var sideMargin = isMobileNow ? 10 : isDesktopNow ? 20 : 16;
    var minTop = 60;
    var maxBottom = isMobileNow ? 70 : isDesktopNow ? 20 : 16;
    var maxTop = window.innerHeight - btnH - maxBottom;

    currentTop = Math.max(minTop, Math.min(currentTop, maxTop));
    var midX = currentLeft + btnW / 2;

    if (midX < document.documentElement.clientWidth / 2) {
      currentLeft = sideMargin;
      isDockedOnLeft = true;
    } else {
      currentLeft = document.documentElement.clientWidth - btnW - sideMargin;
      isDockedOnLeft = false;
    }

    applyPosition(currentLeft, currentTop, true);
  }

  function applyPosition(left, top, animate) {
    toggle.style.transition = animate ? "left 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.2s ease" : "none";
    toggle.style.left = left + "px";
    toggle.style.top = top + "px";
    toggle.style.right = "auto";
    toggle.style.bottom = "auto";
    alignPanelAnchor();
  }

  function alignPanelAnchor() {
    if (!panel) return;
    var isMobile = window.innerWidth < 640;
    if (isMobile) {
      if (window.visualViewport) {
        var vv = window.visualViewport;
        var topOffset = vv.offsetTop || 0;
        var availableHeight = vv.height;
        var panelTop = topOffset + 10;
        var panelHeight = Math.max(260, availableHeight - 20);

        panel.style.position = "fixed";
        panel.style.left = "0.75rem";
        panel.style.right = "0.75rem";
        panel.style.width = "calc(100vw - 1.5rem)";
        panel.style.top = panelTop + "px";
        panel.style.bottom = "auto";
        panel.style.height = panelHeight + "px";
        panel.style.maxHeight = panelHeight + "px";
        panel.style.transformOrigin = "bottom center";
      } else {
        panel.style.position = "fixed";
        panel.style.left = "0.75rem";
        panel.style.right = "0.75rem";
        panel.style.width = "calc(100vw - 1.5rem)";
        panel.style.bottom = "5.5rem";
        panel.style.top = "auto";
        panel.style.height = "min(70vh, 620px)";
        panel.style.maxHeight = "620px";
        panel.style.transformOrigin = "bottom center";
      }
      return;
    }

    // Reset desktop dimensions
    panel.style.position = "fixed";
    panel.style.width = "min(380px, calc(100vw - 2rem))";
    panel.style.height = "min(620px, calc(100vh - 7rem))";
    panel.style.maxHeight = "none";
    panel.style.top = "auto";

    var toggleRect = toggle.getBoundingClientRect();
    var panelW = 380;
    var panelH = Math.min(620, window.innerHeight - 100);

    // Horizontal Anchor: Left dock vs Right dock
    if (isDockedOnLeft || toggleRect.left < window.innerWidth / 2) {
      var panelLeft = Math.max(16, toggleRect.left);
      if (panelLeft + panelW > window.innerWidth - 16) {
        panelLeft = window.innerWidth - panelW - 16;
      }
      panel.style.left = panelLeft + "px";
      panel.style.right = "auto";
      panel.style.transformOrigin = "bottom left";
    } else {
      var panelRight = window.innerWidth - toggleRect.right;
      panel.style.right = Math.max(16, panelRight) + "px";
      panel.style.left = "auto";
      panel.style.transformOrigin = "bottom right";
    }

    // Vertical Anchor: position above toggle or clamped inside viewport
    var panelBottom = window.innerHeight - toggleRect.top + 10;
    if (panelBottom + panelH > window.innerHeight - 20) {
      panelBottom = Math.max(20, window.innerHeight - panelH - 20);
    }
    panel.style.bottom = panelBottom + "px";
  }

  // Visual Viewport listeners for mobile keyboard handling
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
      if (assistantIsOpen) alignPanelAnchor();
    });
    window.visualViewport.addEventListener("scroll", function () {
      if (assistantIsOpen) alignPanelAnchor();
    });
  }

  // Chat input focus & typing micro-interactions
  var assistantInput = document.getElementById("assistant-input");
  var sendButton = document.querySelector(".assistant-send");

  if (assistantInput) {
    assistantInput.addEventListener("focus", function () {
      var bottomNav = document.getElementById("bottom-nav");
      if (bottomNav) bottomNav.classList.add("nav-hidden");

      alignPanelAnchor();
      var msgContainer = document.getElementById("assistant-messages");
      if (msgContainer) {
        setTimeout(function () {
          msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: "smooth" });
        }, 100);
      }
    });

    assistantInput.addEventListener("blur", function () {
      var bottomNav = document.getElementById("bottom-nav");
      if (bottomNav) bottomNav.classList.remove("nav-hidden");

      setTimeout(alignPanelAnchor, 120);
    });

    assistantInput.addEventListener("input", function () {
      var btn = sendButton || document.querySelector(".assistant-send");
      if (btn) {
        if (assistantInput.value.trim().length > 0) {
          btn.classList.add("is-active");
        } else {
          btn.classList.remove("is-active");
        }
      }
    });
  }

  window.addEventListener("resize", function () {
    snapToEdge();
  });
}

function renderAssistantMessages() {
  var container = document.getElementById("assistant-messages");
  if (!container) return;

  container.innerHTML = "";
  for (var i = 0; i < assistantMessages.length; i++) {
    var message = assistantMessages[i];
    var bubble = document.createElement("div");
    bubble.className = "assistant-message " + message.sender;

    if (message.sender === "bot") {
      // Bot messages: render as HTML (Gemini returns clean HTML)
      bubble.innerHTML = message.html || message.text || "";
    } else {
      // User messages: plain text (escape for safety)
      bubble.textContent = message.text || "";
    }
    container.appendChild(bubble);
  }
  container.scrollTop = container.scrollHeight;
}

function renderAssistantQuickActions() {
  var actions = [
    "Show me his projects",
    "View ScanZy demo video",
    "Why should I hire him?",
    "Show certifications",
    "Contact Rohan"
  ];
  var container = document.getElementById("assistant-quick-actions");
  if (!container) return;

  container.innerHTML = "";
  for (var i = 0; i < actions.length; i++) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "assistant-chip";
    button.setAttribute("data-assistant-question", actions[i]);
    button.textContent = actions[i];
    container.appendChild(button);
  }
}

function openAssistant() {
  assistantIsOpen = true;
  var panel = document.getElementById("assistant-panel");
  var toggle = document.getElementById("assistant-toggle");
  var input = document.getElementById("assistant-input");
  if (panel) {
    panel.classList.remove("is-hidden");
    alignPanelAnchorGlobal();
  }
  if (toggle) toggle.classList.add("is-hidden");
  lockBodyScroll();
  if (input) {
    setTimeout(function () {
      input.focus();
      var msgBox = document.getElementById("assistant-messages");
      if (msgBox) msgBox.scrollTo({ top: msgBox.scrollHeight, behavior: "smooth" });
    }, 120);
  }
}

function alignPanelAnchorGlobal() {
  var panel = document.getElementById("assistant-panel");
  if (!panel) return;
  var isMobile = window.innerWidth < 640;
  if (isMobile && window.visualViewport) {
    var vv = window.visualViewport;
    var topOffset = vv.offsetTop || 0;
    var availableHeight = vv.height;
    var panelTop = topOffset + 10;
    var panelHeight = Math.max(260, availableHeight - 20);

    panel.style.position = "fixed";
    panel.style.left = "0.75rem";
    panel.style.right = "0.75rem";
    panel.style.width = "calc(100vw - 1.5rem)";
    panel.style.top = panelTop + "px";
    panel.style.bottom = "auto";
    panel.style.height = panelHeight + "px";
    panel.style.maxHeight = panelHeight + "px";
    panel.style.transformOrigin = "bottom center";
  }
}

function closeAssistant() {
  assistantIsOpen = false;
  var panel = document.getElementById("assistant-panel");
  var toggle = document.getElementById("assistant-toggle");
  var bottomNav = document.getElementById("bottom-nav");
  var modalOpen = document.getElementById("project-modal");
  if (panel) panel.classList.add("is-hidden");
  if (toggle && !modalOpen) toggle.classList.remove("is-hidden");
  if (bottomNav) bottomNav.classList.remove("nav-hidden");
  unlockBodyScroll();
}
window.closeAssistant = closeAssistant;

function addAssistantMessage(sender, htmlOrText) {
  var msg = { sender: sender };
  if (sender === "bot") {
    msg.html = htmlOrText;
  } else {
    msg.text = htmlOrText;
  }
  assistantMessages.push(msg);
  renderAssistantMessages();
}

function showAssistantTyping() {
  var container = document.getElementById("assistant-messages");
  if (!container) return;
  var typing = document.createElement("div");
  typing.id = "assistant-typing";
  typing.className = "assistant-message bot";
  typing.innerHTML = '<span class="assistant-typing"><span></span><span></span><span></span></span>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeAssistantTyping() {
  var typing = document.getElementById("assistant-typing");
  if (typing) typing.remove();
}

function sendAssistantMessage(text) {
  var cleanText = String(text || "").trim();
  if (!cleanText) return;

  // Add user message to UI
  addAssistantMessage("user", cleanText);

  // Show typing indicator until first token streams
  showAssistantTyping();

  var botBubble = null;
  var hasStartedStreaming = false;

  // Delegate to Streaming AI Agent
  window.sendAIMessage(cleanText, function (partialHtml, isDone) {
    if (!hasStartedStreaming) {
      hasStartedStreaming = true;
      removeAssistantTyping();

      // Create live bot bubble container
      var container = document.getElementById("assistant-messages");
      if (container) {
        botBubble = document.createElement("div");
        botBubble.className = "assistant-message bot";
        container.appendChild(botBubble);
      }
      assistantMessages.push({ sender: "bot", html: partialHtml });
    }

    if (botBubble) {
      botBubble.innerHTML = partialHtml;
      var container = document.getElementById("assistant-messages");
      if (container) container.scrollTop = container.scrollHeight;
    }

    if (isDone && assistantMessages.length > 0) {
      assistantMessages[assistantMessages.length - 1].html = partialHtml;
    }
  })
    .catch(function (err) {
      removeAssistantTyping();
      if (!botBubble) {
        addAssistantMessage(
          "bot",
          "Sorry, I ran into a temporary issue. You can reach Rohan directly at " +
          '<a href="mailto:rohannimje53@gmail.com" class="text-indigo-600 underline font-semibold">rohannimje53@gmail.com</a>.'
        );
      }
    });
}

/* ══════════════════════════════════════════════════════════
   EVENTS
══════════════════════════════════════════════════════════ */
function attachEvents() {
  document.addEventListener("click", function (event) {
    // Scroll nav
    var scrollButton = event.target.closest("[data-scroll]");
    if (scrollButton) {
      var id = scrollButton.getAttribute("data-scroll");
      var section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Toggle project grid
    var toggleProjects = event.target.closest("#toggle-projects");
    if (toggleProjects) {
      var wrap = document.querySelector(".projects-grid-wrap");
      if (wrap) {
        var isOpen = wrap.classList.toggle("open");
        var projects = getProjectsData();
        var count = Math.max(0, projects.length - 1);
        toggleProjects.innerHTML =
          (isOpen ? "Hide Projects" : "Show All Projects (" + count + ")") +
          " " + icon("arrowDown", "w-4 h-4 " + (isOpen ? "rotate-180" : ""));
        observeReveals();
      }
    }

    // Project modal open
    var projectButton = event.target.closest("[data-project-id]");
    if (projectButton) {
      var projectId = Number(projectButton.getAttribute("data-project-id"));
      var project = getProjectById(projectId);
      if (project) renderProjectModal(project);
    }

    // Project modal close
    if (event.target.id === "project-modal" || event.target.closest("#close-modal")) {
      closeProjectModal();
    }

    // Honor Lightbox Modal trigger
    var honorCard = event.target.closest("[data-honor-modal-id]");
    if (honorCard) {
      var honorId = honorCard.getAttribute("data-honor-modal-id");
      openHonorModal(honorId);
    }

    // Honor Lightbox Modal close
    if (event.target.id === "honor-lightbox-modal" || event.target.closest("#close-honor-modal")) {
      closeHonorModal();
    }

    // Honor navigation dots
    var honorDot = event.target.closest("[data-honor-dot]");
    if (honorDot) {
      var dotIdx = Number(honorDot.getAttribute("data-honor-dot"));
      var deck = document.getElementById("honor-deck");
      if (deck && deck.children[dotIdx]) {
        deck.children[dotIdx].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }

    // Certifications carousel
    if (event.target.closest("#cert-prev")) {
      pauseCertAutoplay();
      var certs = (window.portfolioData && window.portfolioData.certifications) || [];
      var certLen = certs.length || 1;
      certificationsIndex = (certificationsIndex - 1 + certLen) % certLen;
      renderCertifications();
    }
    if (event.target.closest("#cert-next")) {
      pauseCertAutoplay();
      var certs2 = (window.portfolioData && window.portfolioData.certifications) || [];
      var certLen2 = certs2.length || 1;
      certificationsIndex = (certificationsIndex + 1) % certLen2;
      renderCertifications();
    }
    var certCard = event.target.closest("[data-cert-index]");
    if (certCard) {
      pauseCertAutoplay();
      certificationsIndex = Number(certCard.getAttribute("data-cert-index"));
      renderCertifications();
    }

    // Theme Toggle Handler
    if (event.target.closest("#theme-toggle-btn") || event.target.closest("#theme-toggle-mobile")) {
      toggleTheme();
    }

    // AI Assistant close button
    if (event.target.closest("#assistant-close")) {
      closeAssistant();
    }

    // AI Assistant response action button clicks (Mobile-only auto close)
    var messageActionBtn = event.target.closest("#assistant-messages button, #assistant-messages a");
    if (messageActionBtn) {
      var onclickAttr = messageActionBtn.getAttribute("onclick") || "";
      var isAskFollowUp = messageActionBtn.hasAttribute("data-assistant-question") || onclickAttr.indexOf("sendAIMessage") !== -1;
      if (!isAskFollowUp && window.innerWidth < 768) {
        closeAssistant();
      }
    }

    // Quick action chips
    var assistantQuestion = event.target.closest("[data-assistant-question]");
    if (assistantQuestion) {
      openAssistant();
      sendAssistantMessage(assistantQuestion.getAttribute("data-assistant-question"));
    }
  });

  // Mouse hover pause/resume for Honors & Certifications
  document.addEventListener("mouseover", function (event) {
    if (event.target.closest("#honors") || event.target.closest(".honor-track")) {
      pauseHonorsAutoplay();
    }
  });

  document.addEventListener("mouseout", function (event) {
    if (event.target.closest("#honors") && (!event.relatedTarget || !event.relatedTarget.closest || !event.relatedTarget.closest("#honors"))) {
      resumeHonorsAutoplayWithDelay(2500);
    }
  });



  // Touch gesture swipe support for Certifications Carousel
  var certTouchStartX = 0;
  var certTouchStartY = 0;

  document.addEventListener("touchstart", function (event) {
    var stage = event.target.closest(".coverflow-stage") || event.target.closest("#certifications");
    if (!stage) return;
    certTouchStartX = event.touches[0].clientX;
    certTouchStartY = event.touches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", function (event) {
    var stage = event.target.closest(".coverflow-stage") || event.target.closest("#certifications");
    if (!stage) return;
    var deltaX = event.changedTouches[0].clientX - certTouchStartX;
    var deltaY = event.changedTouches[0].clientY - certTouchStartY;

    // Detect horizontal swipe gesture
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      pauseCertAutoplay();
      var certs = (window.portfolioData && window.portfolioData.certifications) || [];
      var certLen = certs.length || 1;

      if (deltaX < 0) {
        // Swipe Left -> Next
        certificationsIndex = (certificationsIndex + 1) % certLen;
      } else {
        // Swipe Right -> Previous
        certificationsIndex = (certificationsIndex - 1 + certLen) % certLen;
      }
      renderCertifications();
    }
  }, { passive: true });

  // Form submit
  document.addEventListener("submit", function (event) {
    if (event.target.id !== "assistant-form") return;
    event.preventDefault();
    var input = document.getElementById("assistant-input");
    if (!input || !input.value.trim()) return;
    var val = input.value;
    input.value = "";
    sendAssistantMessage(val);
  });

  // Magnetic button effect
  document.addEventListener("mousemove", function (event) {
    var button = event.target.closest(".magnetic-button");
    if (!button) return;
    var rect = button.getBoundingClientRect();
    var x = ((event.clientX - (rect.left + rect.width / 2)) / 50) * 4;
    var y = ((event.clientY - (rect.top + rect.height / 2)) / 50) * 4;
    button.style.transform = "translate(" + x + "px, " + y + "px)";
  });

  document.addEventListener("mouseleave", function (event) {
    var button = event.target.closest && event.target.closest(".magnetic-button");
    if (button) button.style.transform = "translate(0, 0)";
  }, true);

  // Scroll nav update
  window.addEventListener("scroll", updateActiveNavigation);

  // Scroll progress bar updater
  var progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + "%";
    }, { passive: true });
  }

  // Escape key listener to close modal or assistant
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.key === "Esc") {
      if (document.getElementById("honor-lightbox-modal")) {
        closeHonorModal();
      } else if (document.getElementById("project-modal")) {
        closeProjectModal();
      } else if (assistantIsOpen) {
        closeAssistant();
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   ACTIVE NAV
══════════════════════════════════════════════════════════ */
function updateActiveNavigation() {
  var ids = ["hero", "projects", "experience", "honors", "certifications", "contact"];
  var current = activeNavId;

  for (var i = 0; i < ids.length; i++) {
    var section = document.getElementById(ids[i]);
    if (section && section.getBoundingClientRect().top <= 140) {
      current = ids[i];
    }
  }

  if (current !== activeNavId) {
    activeNavId = current;
    renderNavigation();
  }
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════ */
function observeReveals() {
  var revealItems = document.querySelectorAll(".reveal");
  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        var el = entries[i].target;
        // Honor stagger delay classes
        var delay = 0;
        if (el.classList.contains("reveal-delay-1")) delay = 80;
        if (el.classList.contains("reveal-delay-2")) delay = 160;
        if (el.classList.contains("reveal-delay-3")) delay = 240;
        if (el.classList.contains("reveal-delay-4")) delay = 320;
        if (el.classList.contains("reveal-delay-5")) delay = 400;

        if (delay > 0) {
          setTimeout(function (target) {
            target.classList.add("in-view");
          }, delay, el);
        } else {
          el.classList.add("in-view");
        }
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -20px 0px" });

  for (var j = 0; j < revealItems.length; j++) {
    observer.observe(revealItems[j]);
  }
}

/* ══════════════════════════════════════════════════════════
   VIDEO AUTOPLAY (intersection observer)
══════════════════════════════════════════════════════════ */
function setupAutoplayVideos() {
  var videos = document.querySelectorAll(".autoplay-video");
  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var video = entries[i].target;
      video.muted = true;
      if (entries[i].isIntersecting) {
        video.play().catch(function () { });
      } else {
        video.pause();
      }
    }
  }, { threshold: 0.25, rootMargin: "50px" });

  for (var j = 0; j < videos.length; j++) {
    observer.observe(videos[j]);
  }
}

/* ══════════════════════════════════════════════════════════
   STREAK COUNTER ANIMATION
══════════════════════════════════════════════════════════ */
function setupStreakCounter() {
  var counter = document.getElementById("streak-count");
  if (!counter) return;

  var started = false;
  var observer = new IntersectionObserver(function (entries) {
    if (started || !entries[0].isIntersecting) return;
    started = true;
    var target = Number(counter.getAttribute("data-target"));
    var count = 0;
    var increment = Math.ceil(target / 60);
    var interval = setInterval(function () {
      count += increment;
      if (count >= target) {
        counter.textContent = target;
        clearInterval(interval);
      } else {
        counter.textContent = count;
      }
    }, 10);
  }, { threshold: 0.4 });

  observer.observe(counter);
}

/* ══════════════════════════════════════════════════════════
   CERT AUTOPLAY TIMER
══════════════════════════════════════════════════════════ */
function startCertAutoplay() {
  clearInterval(certificationTimer);
  certificationTimer = setInterval(function () {
    var certs = (window.portfolioData && window.portfolioData.certifications) || [];
    var certLen = certs.length || 1;
    certificationsIndex = (certificationsIndex + 1) % certLen;
    renderCertifications();
  }, 5000);
}

function pauseCertAutoplay() {
  clearInterval(certificationTimer);
}

/* ══════════════════════════════════════════════════════════
   HONORS AUTOPLAY ENGINE
══════════════════════════════════════════════════════════ */
function startHonorsAutoplay() {
  clearInterval(honorsTimer);
  clearTimeout(honorsResumeTimeout);
  honorsTimer = setInterval(function () {
    var honors = (window.portfolioData && window.portfolioData.honors) || [];
    if (!honors.length) return;
    honorsIndex = (honorsIndex + 1) % honors.length;
    renderHonors();
  }, 4200);
}

function pauseHonorsAutoplay() {
  clearInterval(honorsTimer);
  clearTimeout(honorsResumeTimeout);
}

function resumeHonorsAutoplayWithDelay(delayMs) {
  clearTimeout(honorsResumeTimeout);
  honorsResumeTimeout = setTimeout(function () {
    startHonorsAutoplay();
  }, delayMs || 3000);
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
function renderPage() {
  applyTheme(currentTheme);
  renderNavigation();
  renderProjects();
  renderHonors();
  renderCertifications();
  renderAssistant();
  attachEvents();
  observeReveals();
  setupAutoplayVideos();
  setupStreakCounter();
  startCertAutoplay();
  startHonorsAutoplay();
}

document.addEventListener("DOMContentLoaded", renderPage);
