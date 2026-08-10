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

/* ── Style Tokens ──────────────────────────────────────── */
var GRADIENT_HEADING = "bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900";
var ELEVATED_CARD = "surface-card";
var ELEVATED_CARD_HOVER = "surface-card-hover";
var PRIMARY_BUTTON = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 border border-indigo-700/20 shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200";
var SECONDARY_BUTTON = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 shadow-sm hover:shadow transition-all duration-200";

/* ── State ─────────────────────────────────────────────── */
var activeNavId = "hero";
var honorsIndex = window.innerWidth >= 768 ? 1 : 0;
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
    flip: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4v12m6-16v12m0 0 4-4m-4 4-4-4" />'
  };
  return '<svg class="' + className + '" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + (icons[name] || "") + "</svg>";
}

/* ── Tech Pill Helpers ─────────────────────────────────── */
function getTechPillClass(tech, index) {
  var base = "px-3 py-1 text-xs font-semibold rounded-full border";
  var map = {
    "Next.js": "bg-slate-800 text-white border-slate-800",
    TypeScript: "bg-blue-50 text-blue-700 border-blue-200",
    JavaScript: "bg-amber-50 text-amber-700 border-amber-200",
    MongoDB: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Supabase: "bg-emerald-50 text-emerald-700 border-emerald-300",
    PostgreSQL: "bg-sky-50 text-sky-700 border-sky-200",
    SQL: "bg-sky-50 text-sky-700 border-sky-200",
    n8n: "bg-orange-50 text-orange-700 border-orange-200",
    Vercel: "bg-slate-100 text-slate-800 border-slate-300",
    Lovable: "bg-pink-50 text-pink-700 border-pink-200",
    Bolt: "bg-violet-50 text-violet-700 border-violet-200",
    "Leonardo AI": "bg-purple-50 text-purple-700 border-purple-200",
    "Cursor IDE": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Pipedream: "bg-cyan-50 text-cyan-700 border-cyan-200",
    "MCP Servers": "bg-teal-50 text-teal-700 border-teal-200",
    LLMs: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    Python: "bg-yellow-50 text-yellow-800 border-yellow-200",
    React: "bg-sky-50 text-sky-700 border-sky-200",
    "Tailwind CSS": "bg-teal-50 text-teal-700 border-teal-200"
  };
  var fallbacks = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-violet-50 text-violet-700 border-violet-200",
    "bg-cyan-50 text-cyan-700 border-cyan-200",
    "bg-rose-50 text-rose-700 border-rose-200"
  ];
  return base + " " + (map[tech] || fallbacks[index % fallbacks.length]);
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
   NAVIGATION (JS-driven for active state highlighting)
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
  var GHOST_BUTTON = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200";

  for (var i = 0; i < navItems.length; i++) {
    var item = navItems[i];
    var isActive = activeNavId === item.id;
    var desktopClass = isActive
      ? "relative px-3 py-2 text-sm font-semibold transition-all duration-300 flex items-center gap-2 rounded-lg text-indigo-700 bg-indigo-50 border border-indigo-100"
      : "relative " + GHOST_BUTTON + " !px-3 !py-2";
    var mobileClass = isActive
      ? "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-indigo-50 text-indigo-700 border border-indigo-100"
      : "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-slate-500 hover:bg-slate-100 hover:text-slate-800";

    desktopButtons += '<button type="button" data-scroll="' + item.id + '" class="' + desktopClass + '">' + icon(item.icon, "w-4 h-4") + item.label + "</button>";
    mobileButtons += '<button type="button" aria-label="' + item.label + '" data-scroll="' + item.id + '" class="' + mobileClass + '">' + icon(item.icon, "w-[18px] h-[18px]") + "</button>";
  }

  document.getElementById("navigation").innerHTML =
    '<nav class="hidden md:flex fixed top-0 left-0 right-0 z-40 justify-center pt-5 px-4 w-full nav-enter-top">' +
      '<div class="border border-slate-200/60 rounded-full px-6 py-3 bg-white shadow-lg shadow-slate-200/40 flex items-center gap-4 max-w-5xl w-full">' +
        desktopButtons +
        '<button type="button" data-scroll="contact" class="ml-auto ' + PRIMARY_BUTTON + ' !px-5 !py-2 text-sm">' + icon("mail", "w-4 h-4") + "Get In Touch</button>" +
      "</div>" +
    "</nav>" +
    '<div class="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-5 pt-3 w-full bg-white border-t border-slate-200/60 shadow-[0_-8px_32px_rgba(15,23,42,0.08)] nav-enter-bottom">' +
      '<div class="rounded-full px-3 py-2.5 bg-white border border-border flex items-center gap-1.5 max-w-lg w-full justify-center shadow-sm">' +
        mobileButtons +
      "</div>" +
    "</div>";
}

/* ══════════════════════════════════════════════════════════
   HONORS CAROUSEL (JS-rendered flip cards)
══════════════════════════════════════════════════════════ */
function renderHonors() {
  var honors = (window.AI_CONTEXT && window.AI_CONTEXT.honors) || [];
  if (!honors.length) return;
  if (honorsIndex > honors.length - 1) honorsIndex = honors.length - 1;

  var cards = "";
  var dots = "";
  for (var i = 0; i < honors.length; i++) {
    var honor = honors[i];
    var active = i === honorsIndex ? "active" : "";
    cards +=
      '<div class="flex-shrink-0 flex flex-col items-center" style="width:288px">' +
        '<button type="button" data-honor-index="' + i + '" class="honor-card-button ' + active + ' w-72 h-80 cursor-pointer perspective">' +
          '<div class="flip-inner w-full h-full relative">' +
            '<div class="flip-side absolute inset-0 group"><img src="' + honor.CertImgUrl + '" alt="' + honor.title + '" class="w-full h-full rounded-2xl border border-slate-200 object-contain group-hover:border-indigo-200 transition-all shadow-sm" loading="' + (i === honorsIndex ? "eager" : "lazy") + '" draggable="false" /><div class="absolute bottom-4 right-4 z-10 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-1.5 text-xs font-semibold text-indigo-700 group-hover:bg-indigo-100 transition-all"><span>Click to Flip</span>' + icon("flip", "w-3 h-3") + "</div></div>" +
            '<div class="flip-side flip-back absolute inset-0"><div class="w-full h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/80 to-white p-6 flex flex-col justify-between hover:border-indigo-200 transition-all shadow-sm"><div class="space-y-3"><p class="text-xs text-muted-foreground font-semibold uppercase tracking-wide">' + honor.event + '</p><div class="w-1 h-5 bg-gradient-to-b from-accent to-foreground rounded-full"></div><p class="text-xs text-foreground leading-relaxed">' + honor.description + '</p></div><div class="flex items-center gap-1.5 text-xs font-semibold text-accent">' + icon("flip", "w-3 h-3") + "<span>Click to flip</span></div></div></div>" +
          "</div>" +
        "</button>" +
      "</div>";
    dots += '<button type="button" aria-label="Go to honor ' + (i + 1) + '" data-honor-dot="' + i + '" class="h-2 rounded-full transition-all duration-300 ' + (i === honorsIndex ? "w-6 bg-accent" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50") + '"></button>';
  }

  document.getElementById("honors").innerHTML =
    '<div class="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">' +
      '<div class="absolute inset-0 overflow-hidden pointer-events-none"><div class="absolute top-20 right-10 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl"></div></div>' +
      '<div class="max-w-6xl mx-auto relative z-10">' +
        '<div class="mb-10 text-center reveal"><h2 class="text-4xl sm:text-5xl font-bold mb-4 ' + GRADIENT_HEADING + '">Honors &amp; Achievements</h2><p class="text-slate-600">Recognitions from national-level competitions.</p></div>' +
        '<div class="group/carousel relative overflow-hidden transition-opacity duration-200">' +
          '<div class="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"></div><div class="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"></div>' +
          '<button type="button" aria-label="Previous honor" id="honor-prev" class="absolute left-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-40 z-30 flex items-center justify-start pl-1 sm:pl-2 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"><span class="flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-white/10 backdrop-blur-sm text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors">' + icon("chevronLeft", "w-5 h-5") + "</span></button>" +
          '<button type="button" aria-label="Next honor" id="honor-next" class="absolute right-0 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-40 z-30 flex items-center justify-end pr-1 sm:pr-2 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"><span class="flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-white/10 backdrop-blur-sm text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors">' + icon("chevronRight", "w-5 h-5") + "</span></button>" +
          '<div id="honor-track" class="honor-track flex gap-8 cursor-grab active:cursor-grabbing touch-pan-y py-2 w-max">' + cards + "</div>" +
        "</div>" +
        '<div class="mt-5 space-y-3 text-center"><h3 class="text-base sm:text-lg font-bold text-foreground px-4">' + honors[honorsIndex].title + '</h3><div class="flex justify-center items-center gap-2">' + dots + "</div></div>" +
      "</div>" +
    "</div>";

  updateHonorTrack();
}

function updateHonorTrack() {
  var track = document.getElementById("honor-track");
  if (track) track.style.transform = "translateX(" + (-honorsIndex * 320) + "px)";
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
  var certs = (window.AI_CONTEXT && window.AI_CONTEXT.certifications) || [];
  if (!certs.length) return;

  var activeCert = certs[certificationsIndex];
  var cards = "";

  for (var i = 0; i < certs.length; i++) {
    var cert = certs[i];
    var position = getRelativePosition(i, certificationsIndex, certs.length);
    if (Math.abs(position) <= 1) {
      var x = position < 0 ? -220 : position > 0 ? 220 : 0;
      var scale = position === 0 ? 0.95 : 0.68;
      var opacity = position === 0 ? 1 : 0.35;
      var zIndex = position === 0 ? 50 : 20;
      var rotate = position < 0 ? 42 : position > 0 ? -42 : 0;
      cards +=
        '<div data-cert-index="' + i + '" class="coverflow-card absolute cursor-pointer" style="z-index:' + zIndex + ";opacity:" + opacity + ";transform:translateX(" + x + "px) scale(" + scale + ") rotateY(" + rotate + 'deg);">' +
          '<div class="block bg-white rounded-xl border border-slate-200 w-full h-full relative overflow-visible"><img src="' + cert.CertImgUrl + '" alt="' + cert.name + '" draggable="false" loading="lazy" decoding="async" class="block w-full h-full object-contain bg-white rounded-[10px]" style="box-shadow:' + (position === 0 ? "0 12px 40px rgba(67, 56, 202, 0.14)" : "0 4px 16px rgba(15, 23, 42, 0.06)") + ';" /></div>' +
        "</div>";
    }
  }

  document.getElementById("certifications").innerHTML =
    '<div class="py-14 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F9FC] relative">' +
      '<div class="max-w-7xl mx-auto">' +
        '<div class="mb-6 md:mb-8 text-center reveal"><h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 ' + GRADIENT_HEADING + '">Certifications</h2><p class="text-sm sm:text-base text-slate-600">Apple-style Cover Flow carousel showcasing professional credentials.</p></div>' +
        '<div class="group/carousel relative w-full max-w-4xl mx-auto">' +
          '<div class="coverflow-stage relative w-full flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing">' +
            '<button type="button" aria-label="Previous certification" id="cert-prev" class="absolute left-0 top-1/2 z-40 -translate-y-1/2 w-12 sm:w-16 md:w-20 flex items-center justify-start pl-2 sm:pl-3 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"><span class="flex items-center justify-center w-9 h-9 rounded-full bg-white/70 border border-slate-200/50 backdrop-blur-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm">' + icon("chevronLeft", "w-5 h-5") + "</span></button>" +
            '<button type="button" aria-label="Next certification" id="cert-next" class="absolute right-0 top-1/2 z-40 -translate-y-1/2 w-12 sm:w-16 md:w-20 flex items-center justify-end pr-2 sm:pr-3 opacity-0 hover:opacity-100 group-hover/carousel:opacity-60 transition-opacity duration-300"><span class="flex items-center justify-center w-9 h-9 rounded-full bg-white/70 border border-slate-200/50 backdrop-blur-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm">' + icon("chevronRight", "w-5 h-5") + "</span></button>" +
            '<div class="absolute left-0 top-0 bottom-0 w-20 sm:w-24 md:w-32 bg-gradient-to-r from-[#F7F9FC] via-[#F7F9FC]/50 to-transparent z-20 pointer-events-none"></div><div class="absolute right-0 top-0 bottom-0 w-20 sm:w-24 md:w-32 bg-gradient-to-l from-[#F7F9FC] via-[#F7F9FC]/50 to-transparent z-20 pointer-events-none"></div>' +
            cards +
          "</div>" +
        "</div>" +
        '<div class="mt-8 md:mt-10 space-y-3 text-center"><div><p class="text-sm sm:text-base md:text-lg font-semibold text-foreground">' + activeCert.name + '</p><p class="text-xs sm:text-sm text-muted-foreground">' + activeCert.issuer + '</p></div><div class="flex justify-center items-center gap-3 pt-2"><div class="w-2 h-2 rounded-full bg-accent tiny-pulse"></div><span class="text-xs sm:text-sm font-semibold text-muted-foreground"><span class="text-accent">' + (certificationsIndex + 1) + "</span> / " + certs.length + "</span></div></div>" +
      "</div>" +
    "</div>";
}

/* ══════════════════════════════════════════════════════════
   PROJECT MODAL
══════════════════════════════════════════════════════════ */
function renderProjectModal(project) {
  var media = "";
  if (project.productDemoUrl || project.videourlproduct) {
    var vurl = project.productDemoUrl || project.videourlproduct;
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Product Demo</h3><div class="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm"><video preload="none" src="' + vurl + '" controls class="w-full h-full object-cover"></video></div></div>';
  } else if (project.videoUrl) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Video Demo</h3><div class="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm"><video preload="none" src="' + project.videoUrl + '" controls class="w-full h-full object-cover"></video></div></div>';
  }
  if (project.screenshotUrl) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Screenshots</h3><img src="' + project.screenshotUrl + '" alt="Project screenshot" class="w-full rounded-xl border border-border" loading="lazy" /></div>';
  }
  if (project.projectCertImgUrl) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Certificate</h3><img src="' + project.projectCertImgUrl + '" alt="Project certificate" class="w-full rounded-xl border border-glass-border max-h-96 object-cover" loading="lazy" /></div>';
  }

  var highlightsList = "";
  if (project.highlights && project.highlights.length) {
    highlightsList = '<div><h3 class="text-lg font-semibold text-foreground mb-3">Highlights</h3><ul class="space-y-2">';
    for (var h = 0; h < project.highlights.length; h++) {
      highlightsList += '<li class="flex items-start gap-2 text-sm text-slate-700"><div class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>' + project.highlights[h] + "</li>";
    }
    highlightsList += "</ul></div>";
  }

  document.getElementById("project-modal-root").innerHTML =
    '<div id="project-modal" class="modal-backdrop fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">' +
      '<div class="modal-panel relative w-full max-w-2xl max-h-[90vh] bg-white border border-border rounded-2xl shadow-xl overflow-hidden">' +
        '<button type="button" id="close-modal" class="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white border border-border hover:border-indigo-200 hover:bg-slate-50 transition-all shadow-sm">' + icon("close", "w-6 h-6 text-foreground") + "</button>" +
        '<div class="overflow-y-auto max-h-[90vh] p-8 space-y-6">' +
          '<div><h2 class="text-3xl sm:text-4xl font-bold mb-2 ' + GRADIENT_HEADING + '">' + project.title + '</h2><p class="text-muted-foreground">' + project.description + "</p></div>" +
          '<div><h3 class="text-lg font-semibold text-foreground mb-3">Tech Stack</h3><div class="flex flex-wrap gap-2">' + techPills(project.techStack, false) + "</div></div>" +
          highlightsList +
          media +
        "</div>" +
      "</div>" +
    "</div>";
}

/* ══════════════════════════════════════════════════════════
   AI ASSISTANT WIDGET
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
          '<button type="button" id="assistant-close" aria-label="Close assistant" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors">' + icon("close", "w-5 h-5") + "</button>" +
        "</div>" +
      "</div>" +
      '<div id="assistant-messages" class="assistant-messages"></div>' +
      '<div id="assistant-quick-actions" class="assistant-quick-actions"></div>' +
      '<form id="assistant-form" class="assistant-input-row">' +
        '<input id="assistant-input" class="assistant-input" type="text" autocomplete="off" placeholder="Ask about Rohan, hiring, projects..." aria-label="Ask Rohan\'s assistant" />' +
        '<button type="submit" class="assistant-send" aria-label="Send message">' + icon("arrowRight", "w-5 h-5") + "</button>" +
      "</form>" +
    "</section>" +
    '<button type="button" id="assistant-toggle" class="assistant-toggle" aria-label="Open Rohan\'s AI assistant">' + icon("mail", "w-7 h-7") + "</button>";

  document.body.appendChild(shell);

  assistantMessages = [
    {
      sender: "bot",
      html: "Hi! I'm <strong class=\"font-semibold text-indigo-700\">Rohan's personal AI assistant</strong>. Ask me about his background, projects, skills, achievements, or how to get in touch — in any language! 🌍"
    }
  ];

  renderAssistantMessages();
  renderAssistantQuickActions();
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
    "Who is Rohan?",
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
  var input = document.getElementById("assistant-input");
  if (panel) panel.classList.remove("is-hidden");
  if (input) setTimeout(function () { input.focus(); }, 120);
}

function closeAssistant() {
  assistantIsOpen = false;
  var panel = document.getElementById("assistant-panel");
  if (panel) panel.classList.add("is-hidden");
}

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
   PROJECT MODAL DATA LOOKUP & ACTION CALLING
══════════════════════════════════════════════════════════ */
function getProjectById(id) {
  var projects = (window.AI_CONTEXT && window.AI_CONTEXT.projects) || [];
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id === id) return projects[i];
  }
  return null;
}

// Global UI Tool for AI Agent Modal Calling
window.openProjectModal = function (id) {
  var project = getProjectById(Number(id));
  if (project) {
    renderProjectModal(project);
  }
};

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
        toggleProjects.innerHTML =
          (isOpen ? "Hide Projects" : "Show All Projects (5)") +
          icon("arrowDown", "w-4 h-4 " + (isOpen ? "rotate-180" : ""));
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
      var modalRoot = document.getElementById("project-modal-root");
      if (modalRoot) modalRoot.innerHTML = "";
    }

    // Honors carousel
    if (event.target.closest("#honor-prev")) {
      honorsIndex = Math.max(0, honorsIndex - 1);
      renderHonors();
      observeReveals();
    }
    if (event.target.closest("#honor-next")) {
      var maxHonors = (window.AI_CONTEXT && window.AI_CONTEXT.honors) ? window.AI_CONTEXT.honors.length - 1 : 0;
      honorsIndex = Math.min(maxHonors, honorsIndex + 1);
      renderHonors();
      observeReveals();
    }
    var honorDot = event.target.closest("[data-honor-dot]");
    if (honorDot) {
      honorsIndex = Number(honorDot.getAttribute("data-honor-dot"));
      renderHonors();
    }
    var honorButton = event.target.closest("[data-honor-index]");
    if (honorButton) {
      var inner = honorButton.querySelector(".flip-inner");
      if (inner) inner.classList.toggle("flipped");
    }

    // Certifications carousel
    if (event.target.closest("#cert-prev")) {
      pauseCertAutoplay();
      var certLen = (window.AI_CONTEXT && window.AI_CONTEXT.certifications) ? window.AI_CONTEXT.certifications.length : 1;
      certificationsIndex = (certificationsIndex - 1 + certLen) % certLen;
      renderCertifications();
    }
    if (event.target.closest("#cert-next")) {
      pauseCertAutoplay();
      var certLen2 = (window.AI_CONTEXT && window.AI_CONTEXT.certifications) ? window.AI_CONTEXT.certifications.length : 1;
      certificationsIndex = (certificationsIndex + 1) % certLen2;
      renderCertifications();
    }
    var certCard = event.target.closest("[data-cert-index]");
    if (certCard) {
      pauseCertAutoplay();
      certificationsIndex = Number(certCard.getAttribute("data-cert-index"));
      renderCertifications();
    }

    // AI Assistant toggle
    if (event.target.closest("#assistant-toggle")) {
      if (assistantIsOpen) closeAssistant();
      else openAssistant();
    }
    if (event.target.closest("#assistant-close")) {
      closeAssistant();
    }

    // Quick action chips
    var assistantQuestion = event.target.closest("[data-assistant-question]");
    if (assistantQuestion) {
      openAssistant();
      sendAssistantMessage(assistantQuestion.getAttribute("data-assistant-question"));
    }
  });

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
      if (entries[i].isIntersecting) entries[i].target.classList.add("in-view");
    }
  }, { threshold: 0.15 });

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
        video.play().catch(function () {});
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
    var certLen = (window.AI_CONTEXT && window.AI_CONTEXT.certifications) ? window.AI_CONTEXT.certifications.length : 1;
    certificationsIndex = (certificationsIndex + 1) % certLen;
    renderCertifications();
  }, 5000);
}

function pauseCertAutoplay() {
  clearInterval(certificationTimer);
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
function renderPage() {
  renderNavigation();
  renderHonors();
  renderCertifications();
  renderAssistant();
  attachEvents();
  observeReveals();
  setupAutoplayVideos();
  setupStreakCounter();
  startCertAutoplay();
}

document.addEventListener("DOMContentLoaded", renderPage);
