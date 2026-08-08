var GRADIENT_HEADING = "bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900";
var ELEVATED_CARD = "surface-card";
var ELEVATED_CARD_HOVER = "surface-card-hover";
var PRIMARY_BUTTON = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 border border-indigo-700/20 shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200";
var SECONDARY_BUTTON = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 shadow-sm hover:shadow transition-all duration-200";
var GHOST_BUTTON = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200";

var activeNavId = "hero";
var honorsIndex = window.innerWidth >= 768 ? 1 : 0;
var certificationsIndex = 0;
var certificationTimer;
var assistantIsOpen = false;
var assistantMessages = [];
var assistantLead = {
  name: "",
  contact: "",
  purpose: "",
  started: false,
  notified: false,
  type: ""
};
var assistantMemory = {
  turns: [],
  focusTopics: [],
  focusEntities: [],
  lastIntent: "",
  opportunity: "",
  awaitingLead: false,
  greeted: true
};
var assistantKnowledge = null;

function getTechPillClass(tech, index) {
  var base = "px-3 py-1 text-xs font-semibold rounded-full border";
  var map = {
    "Next.js": "bg-slate-800 text-white border-slate-800",
    Nextjs: "bg-slate-800 text-white border-slate-800",
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

  return '<svg class="' + className + '" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + icons[name] + "</svg>";
}

function techPills(items, small) {
  var html = "";
  for (var i = 0; i < items.length; i++) {
    var extra = small ? " !px-2 !py-0.5 !text-[10px]" : "";
    html += '<span class="' + getTechPillClass(items[i], i) + extra + '">' + items[i] + "</span>";
  }
  return html;
}

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

function renderHero() {
  var info = portfolioData.personalInfo;
  var stack = ["Next.js", "Supabase", "MongoDB", "n8n", "TypeScript", "Vercel"];

  document.getElementById("hero").innerHTML =
    '<div class="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">' +
      '<div class="absolute inset-0 overflow-hidden pointer-events-none">' +
        '<div class="absolute -top-24 right-0 w-[28rem] h-[28rem] rounded-full bg-indigo-100/70 blur-3xl"></div>' +
        '<div class="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-violet-100/50 blur-3xl"></div>' +
        '<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(67,56,202,0.07),transparent_55%)]"></div>' +
      "</div>" +
      '<div class="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">' +
        '<div class="space-y-6 reveal">' +
          '<div class="space-y-3">' +
            '<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ' + GRADIENT_HEADING + '">' + info.name + "</h1>" +
            '<p class="text-xs sm:text-sm md:text-base text-slate-600 font-mono tracking-wide uppercase leading-relaxed">' + info.tagline + "</p>" +
          "</div>" +
          '<p class="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">' + info.summary + "</p>" +
          '<div class="flex flex-wrap gap-2 pt-1">' + techPills(stack, false) + "</div>" +
          '<div class="pt-2"><button type="button" data-scroll="contact" class="magnetic-button ' + PRIMARY_BUTTON + ' overflow-hidden group cursor-pointer"><span class="relative flex items-center gap-2">Get In Touch' + icon("arrowRight", "w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200") + "</span></button></div>" +
        "</div>" +
        '<div class="relative h-72 sm:h-96 flex items-center justify-center lg:justify-end reveal">' +
          '<div class="absolute w-64 sm:w-80 md:w-96 aspect-square rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(67,56,202,0.2) 0%, rgba(139,92,246,0.1) 45%, transparent 70%);"></div>' +
          '<div class="relative rounded-full p-1.5 bg-white ring-1 ring-slate-200/80 shadow-lg shadow-slate-300/60">' +
            '<div class="rounded-full overflow-hidden aspect-square w-52 sm:w-64 md:w-72 shadow-[0_20px_50px_-12px_rgba(67,56,202,0.25)]">' +
              '<img src="' + info.profileImages[0] + '" alt="' + info.name + '" class="w-full h-full object-cover" loading="eager" />' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>";
}

function renderProjects(showAll) {
  var projects = portfolioData.projects;
  var featured = projects.find(function (project) { return project.isFeatured; });
  var others = projects.filter(function (project) { return !project.isFeatured; });
  var otherCards = "";

  for (var i = 0; i < others.length; i++) {
    var project = others[i];
    otherCards +=
      '<div class="group relative overflow-hidden text-left h-full reveal">' +
        '<div class="relative h-64 sm:h-60 p-5 flex flex-col overflow-hidden ' + ELEVATED_CARD + ' ' + ELEVATED_CARD_HOVER + '">' +
          '<div class="relative z-10 space-y-2">' +
            '<h3 class="text-sm md:text-base font-bold text-slate-800 line-clamp-2">' + project.title + "</h3>" +
            '<p class="text-slate-600 text-xs line-clamp-2">' + project.description + "</p>" +
            '<div class="flex flex-wrap gap-1 pt-0.5">' + techPills(project.techStack, true) + "</div>" +
          "</div>" +
          '<div class="relative z-10 mt-auto pt-3">' +
            '<button type="button" data-project-id="' + project.id + '" class="' + SECONDARY_BUTTON + ' w-full text-xs py-2.5 hover:border-indigo-200 hover:text-indigo-700">View Details' + icon("arrowRight", "w-3 h-3") + "</button>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  document.getElementById("projects").innerHTML =
    '<div class="py-12 px-4 sm:px-6 lg:px-8 bg-[#F7F9FC] relative">' +
      '<div class="max-w-7xl mx-auto space-y-8">' +
        '<div class="text-center reveal">' +
          '<h2 class="text-4xl sm:text-5xl font-bold mb-4 ' + GRADIENT_HEADING + '">Featured Projects</h2>' +
          '<p class="text-slate-600 max-w-2xl mx-auto">Premium architectures showcasing AI automation, full-stack development, and MVP deployment.</p>' +
        "</div>" +
        '<div class="group relative rounded-3xl overflow-hidden ' + ELEVATED_CARD + ' ' + ELEVATED_CARD_HOVER + ' reveal">' +
          '<div class="p-8 md:p-12 space-y-8">' +
            '<div class="space-y-4">' +
              '<div class="inline-block px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200"><span class="text-violet-700 text-xs font-semibold">Featured Project</span></div>' +
              '<h3 class="text-3xl sm:text-4xl md:text-5xl font-bold ' + GRADIENT_HEADING + '">' + featured.title + "</h3>" +
              '<p class="text-base md:text-lg text-slate-600 max-w-3xl">' + featured.description + "</p>" +
            "</div>" +
            '<div class="flex flex-wrap gap-2">' + techPills(featured.techStack, false) + "</div>" +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4">' +
              '<div class="space-y-3 reveal"><h4 class="text-sm font-semibold text-slate-800">MVP Architecture</h4><div class="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md"><div class="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center gap-2"><div class="flex gap-2"><div class="w-2.5 h-2.5 rounded-full bg-red-500"></div><div class="w-2.5 h-2.5 rounded-full bg-yellow-500"></div><div class="w-2.5 h-2.5 rounded-full bg-green-500"></div></div></div><video src="' + featured.videoUrlmvp + '" autoplay muted loop playsinline controls preload="auto" class="autoplay-video w-full bg-black aspect-video object-cover"></video></div></div>' +
              '<div class="space-y-3 flex flex-col items-center reveal"><h4 class="text-sm font-semibold text-slate-800 self-start">Product Demo</h4><div class="relative w-full max-w-[280px] aspect-[9/16] mx-auto rounded-[2.5rem] overflow-hidden border-[6px] border-gray-900 bg-black shadow-2xl flex-1"><video src="' + featured.productDemoUrl + '" autoplay muted loop playsinline controls preload="auto" class="autoplay-video w-full h-full bg-black object-cover"></video><div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-20 flex items-center justify-center pointer-events-none"><div class="w-1 h-1 bg-gray-700 rounded-full"></div></div></div></div>' +
            "</div>" +
            '<div class="flex flex-col sm:flex-row items-center gap-4 pt-4">' +
              '<button type="button" data-project-id="' + featured.id + '" class="' + PRIMARY_BUTTON + '">View Full Project Details' + icon("arrowRight", "w-4 h-4") + "</button>" +
              '<button type="button" id="toggle-projects" class="' + SECONDARY_BUTTON + '">' + (showAll ? "Hide Projects" : "Show All Projects (" + others.length + ")") + icon("arrowDown", "w-4 h-4 " + (showAll ? "rotate-180" : "")) + "</button>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="projects-grid-wrap ' + (showAll ? "open" : "") + '"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">' + otherCards + "</div></div>" +
      "</div>" +
      '<div id="project-modal-root"></div>' +
    "</div>";
}

function renderProjectModal(project) {
  var media = "";
  if (project.videourlproduct) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Product Demo</h3><div class="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm"><video preload="none" src="' + project.videourlproduct + '" controls class="w-full h-full object-cover"></video></div></div>';
  } else if (project.videoUrl) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Video Demo</h3><div class="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm"><video preload="none" src="' + project.videoUrl + '" controls class="w-full h-full object-cover"></video></div></div>';
  }
  if (project.screenshoturl) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Screenshots</h3><img src="' + project.screenshoturl + '" alt="Project screenshot" class="w-full rounded-xl border border-border" loading="lazy" /></div>';
  }
  if (project.projectCertImgUrl) {
    media += '<div><h3 class="text-lg font-semibold text-foreground mb-3">Certificate</h3><img src="' + project.projectCertImgUrl + '" alt="Project certificate" class="w-full rounded-xl border border-glass-border max-h-96 object-cover" loading="lazy" /></div>';
  }

  document.getElementById("project-modal-root").innerHTML =
    '<div id="project-modal" class="modal-backdrop fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">' +
      '<div class="modal-panel relative w-full max-w-2xl max-h-[90vh] bg-white border border-border rounded-2xl shadow-xl overflow-hidden">' +
        '<button type="button" id="close-modal" class="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white border border-border hover:border-indigo-200 hover:bg-slate-50 transition-all shadow-sm">' + icon("close", "w-6 h-6 text-foreground") + "</button>" +
        '<div class="overflow-y-auto max-h-[90vh] p-8 space-y-6">' +
          '<div><h2 class="text-3xl sm:text-4xl font-bold mb-2 ' + GRADIENT_HEADING + '">' + project.title + '</h2><p class="text-muted-foreground">' + project.description + "</p></div>" +
          '<div><h3 class="text-lg font-semibold text-foreground mb-3">Tech Stack</h3><div class="flex flex-wrap gap-2">' + techPills(project.techStack, false) + "</div></div>" +
          media +
        "</div>" +
      "</div>" +
    "</div>";
}

function renderExperience() {
  var html = "";
  for (var i = 0; i < portfolioData.experience.length; i++) {
    var job = portfolioData.experience[i];
    html +=
      '<div class="relative reveal">' +
        '<div class="flex gap-6 sm:gap-8">' +
          '<div class="hidden sm:flex relative flex-col items-center flex-shrink-0"><div class="w-16 h-16 rounded-full border border-indigo-200 bg-white flex items-center justify-center shadow-sm">' + icon("zap", "w-8 h-8 text-indigo-600") + "</div></div>" +
          '<div class="flex-1 hover:translate-x-1 transition-transform duration-300">' +
            '<div class="p-6 ' + ELEVATED_CARD + ' ' + ELEVATED_CARD_HOVER + '">' +
              '<div class="flex sm:hidden gap-3 mb-3"><div class="w-12 h-12 rounded-full border border-indigo-200 bg-indigo-50 flex items-center justify-center flex-shrink-0">' + icon("zap", "w-6 h-6 text-indigo-600") + '</div><div><h3 class="text-lg font-bold text-foreground">' + job.role + '</h3><p class="text-indigo-600 font-semibold text-sm">' + job.company + "</p></div></div>" +
              '<div class="hidden sm:flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3"><div><h3 class="text-xl font-bold text-foreground">' + job.role + '</h3><p class="text-indigo-600 font-semibold">' + job.company + '</p></div><span class="text-sm text-muted-foreground whitespace-nowrap font-mono">' + job.duration + "</span></div>" +
              '<p class="sm:hidden text-xs text-muted-foreground font-mono mb-2">' + job.duration + '</p><p class="text-sm text-muted-foreground mb-2">' + job.location + '</p><p class="text-foreground leading-relaxed">' + job.description + "</p>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  document.getElementById("experience").innerHTML =
    '<div class="py-20 px-4 sm:px-6 lg:px-8 bg-white relative"><div class="max-w-4xl mx-auto">' +
      '<div class="mb-16 text-center reveal"><h2 class="text-4xl sm:text-5xl font-bold mb-4 ' + GRADIENT_HEADING + '">Experience</h2><p class="text-slate-600">Professional journey and key roles.</p></div>' +
      '<div class="space-y-8">' + html + "</div>" +
    "</div></div>";
}

function renderHonors() {
  var honors = portfolioData.honors;
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
        '<div class="mb-10 text-center reveal"><h2 class="text-4xl sm:text-5xl font-bold mb-4 ' + GRADIENT_HEADING + '">Honors & Achievements</h2><p class="text-slate-600">Recognitions from national-level competitions.</p></div>' +
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

function getRelativePosition(index, activeIndex, total) {
  var diff = index - activeIndex;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function renderCertifications() {
  var certs = portfolioData.certifications;
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
        '<div data-cert-index="' + i + '" class="coverflow-card absolute cursor-pointer" style="z-index:' + zIndex + ';opacity:' + opacity + ';transform:translateX(' + x + 'px) scale(' + scale + ') rotateY(' + rotate + 'deg);">' +
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

function renderEducation() {
  var streak = portfolioData.streak;
  var edu = portfolioData.education[0];
  var highlights = ["Core CS Fundamentals", "Data Structures & Algorithms", "AI/ML Principles", "Full-Stack Development"];

  document.getElementById("education").innerHTML =
    '<div class="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F9FC] relative">' +
      '<div class="max-w-6xl mx-auto">' +
        '<div class="mb-20 reveal"><div class="grid md:grid-cols-2 gap-12 items-center">' +
          '<div class="flex flex-col items-center justify-center"><div class="relative w-64 h-64 flex items-center justify-center"><svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256"><circle cx="128" cy="128" r="120" fill="none" stroke="url(#grad)" stroke-width="2" opacity="0.35"></circle><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4338ca"></stop><stop offset="100%" stop-color="#0ea5e9"></stop></linearGradient></defs></svg><div class="relative z-10 text-center space-y-3"><div id="streak-count" data-target="' + streak.days + '" class="streak-pulse text-6xl sm:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">0</div><p class="text-lg font-semibold text-foreground">Day Streak</p></div></div></div>' +
          '<div class="space-y-6"><div><h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-3">' + streak.title + '</h2><p class="text-lg text-muted-foreground leading-relaxed">' + streak.description + '</p></div><div class="p-6 ' + ELEVATED_CARD + ' space-y-3"><div class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div><p class="text-foreground">Consistency is the foundation of mastery</p></div><div class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2"></div><p class="text-foreground">Every day builds towards excellence</p></div><div class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div><p class="text-foreground">One year of dedicated execution</p></div></div></div>' +
        '</div></div><div class="h-px bg-gradient-to-r from-transparent via-border to-transparent my-20 origin-left reveal"></div>' +
        '<div class="reveal"><h2 class="text-4xl sm:text-5xl font-bold mb-12 text-center ' + GRADIENT_HEADING + '">Education & Foundation</h2><div class="grid md:grid-cols-1 gap-8"><div class="p-8 ' + ELEVATED_CARD + ' ' + ELEVATED_CARD_HOVER + ' group"><div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"><div><h3 class="text-2xl font-bold text-foreground mb-1">' + edu.degree + '</h3><p class="text-lg text-indigo-600 font-semibold">' + edu.institution + '</p><p class="text-sm text-muted-foreground mt-1">' + edu.specialization + '</p></div><div class="text-right"><p class="font-mono text-emerald-600 font-bold text-lg">' + edu.grade + '</p><p class="text-sm text-muted-foreground">' + edu.duration + '</p></div></div><p class="text-foreground leading-relaxed">' + edu.description + '</p><div class="flex flex-wrap gap-3">' + techPills(highlights, false) + "</div></div></div></div></div>" +
      "</div>" +
    "</div>";
}

function renderContact() {
  var contact = portfolioData.contact;
  var info = portfolioData.personalInfo;
  document.getElementById("contact").innerHTML =
    '<div class="py-20 px-4 sm:px-6 lg:px-8 bg-white relative border-t border-slate-200/60">' +
      '<div class="max-w-5xl mx-auto">' +
        '<div class="mb-16 text-center reveal"><h2 class="text-4xl sm:text-5xl font-bold mb-4 ' + GRADIENT_HEADING + '">Let\'s Build Together</h2><p class="text-lg text-slate-600">Ready to turn ideas into reality? Let\'s connect and create something extraordinary.</p></div>' +
        '<div class="grid md:grid-cols-3 gap-12 items-start">' +
          '<div class="space-y-6 reveal"><div><h3 class="text-xl font-bold text-foreground mb-2">' + info.name + '</h3><p class="text-sm text-muted-foreground">' + info.tagline + '</p></div><p class="text-sm leading-relaxed text-foreground">' + info.summary + '</p></div>' +
          '<div class="space-y-6 reveal"><h3 class="text-lg font-bold text-foreground">Quick Links</h3><nav class="space-y-3"><a href="#projects" class="flex items-center gap-2 text-muted-foreground hover:text-indigo-600 transition-colors text-sm"><div class="w-1 h-1 rounded-full bg-indigo-400"></div>Projects</a><a href="#experience" class="flex items-center gap-2 text-muted-foreground hover:text-indigo-600 transition-colors text-sm"><div class="w-1 h-1 rounded-full bg-indigo-400"></div>Experience</a><a href="#honors" class="flex items-center gap-2 text-muted-foreground hover:text-indigo-600 transition-colors text-sm"><div class="w-1 h-1 rounded-full bg-indigo-400"></div>Honors</a><a href="#certifications" class="flex items-center gap-2 text-muted-foreground hover:text-indigo-600 transition-colors text-sm"><div class="w-1 h-1 rounded-full bg-indigo-400"></div>Certifications</a></nav></div>' +
          '<div class="space-y-6 reveal"><h3 class="text-lg font-bold text-foreground">Connect</h3><a href="mailto:' + contact.email + '" class="flex items-start gap-3 p-4 ' + ELEVATED_CARD + ' ' + ELEVATED_CARD_HOVER + ' group"><div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">' + icon("mail", "w-5 h-5 text-indigo-600") + '</div><div class="min-w-0"><p class="text-xs text-muted-foreground">Email</p><p class="text-sm font-semibold text-foreground truncate">' + contact.email + '</p></div></a><div class="flex gap-3"><a href="' + contact.linkedin + '" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-xl border border-border bg-white hover:bg-slate-50 hover:border-blue-200 flex items-center justify-center transition-all shadow-sm"><svg class="w-6 h-6 text-slate-600 hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg></a><a href="' + contact.github + '" target="_blank" rel="noopener noreferrer" class="w-12 h-12 rounded-xl border border-border bg-white hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-all shadow-sm"><svg class="w-6 h-6 text-slate-600 hover:text-slate-900 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg></a></div></div>' +
        '</div><div class="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-16 mb-8 origin-left reveal"></div><div class="text-center space-y-2 reveal"><p class="text-sm text-muted-foreground">Crafted with precision. Built to perform.</p><p class="text-xs text-muted-foreground/60">&copy; 2026 ' + info.name + '. All rights reserved.</p></div>' +
      "</div>" +
    "</div>";
}

function attachEvents() {
  document.addEventListener("click", function (event) {
    var scrollButton = event.target.closest("[data-scroll]");
    if (scrollButton) {
      var id = scrollButton.getAttribute("data-scroll");
      var section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    var toggleProjects = event.target.closest("#toggle-projects");
    if (toggleProjects) {
      var wrap = document.querySelector(".projects-grid-wrap");
      var isOpen = wrap.classList.toggle("open");
      toggleProjects.innerHTML = (isOpen ? "Hide Projects" : "Show All Projects (" + (portfolioData.projects.length - 1) + ")") + icon("arrowDown", "w-4 h-4 " + (isOpen ? "rotate-180" : ""));
      observeReveals();
    }

    var projectButton = event.target.closest("[data-project-id]");
    if (projectButton) {
      var projectId = Number(projectButton.getAttribute("data-project-id"));
      var project = portfolioData.projects.find(function (item) { return item.id === projectId; });
      if (project) renderProjectModal(project);
    }

    if (event.target.id === "project-modal" || event.target.closest("#close-modal")) {
      var modalRoot = document.getElementById("project-modal-root");
      if (modalRoot) modalRoot.innerHTML = "";
    }

    if (event.target.closest("#honor-prev")) {
      honorsIndex = Math.max(0, honorsIndex - 1);
      renderHonors();
    }

    if (event.target.closest("#honor-next")) {
      honorsIndex = Math.min(portfolioData.honors.length - 1, honorsIndex + 1);
      renderHonors();
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

    if (event.target.closest("#cert-prev")) {
      pauseCertAutoplay();
      certificationsIndex = (certificationsIndex - 1 + portfolioData.certifications.length) % portfolioData.certifications.length;
      renderCertifications();
    }

    if (event.target.closest("#cert-next")) {
      pauseCertAutoplay();
      certificationsIndex = (certificationsIndex + 1) % portfolioData.certifications.length;
      renderCertifications();
    }

    var certCard = event.target.closest("[data-cert-index]");
    if (certCard) {
      pauseCertAutoplay();
      certificationsIndex = Number(certCard.getAttribute("data-cert-index"));
      renderCertifications();
    }

    if (event.target.closest("#assistant-toggle")) {
      if (assistantIsOpen) closeAssistant();
      else openAssistant();
    }

    if (event.target.closest("#assistant-close")) {
      closeAssistant();
    }

    var assistantQuestion = event.target.closest("[data-assistant-question]");
    if (assistantQuestion) {
      openAssistant();
      sendAssistantMessage(assistantQuestion.getAttribute("data-assistant-question"));
    }
  });

  document.addEventListener("submit", function (event) {
    if (event.target.id !== "assistant-form") return;
    event.preventDefault();
    var input = document.getElementById("assistant-input");
    if (!input) return;
    sendAssistantMessage(input.value);
    input.value = "";
  });

  document.addEventListener("mousemove", function (event) {
    var button = event.target.closest(".magnetic-button");
    if (!button) return;
    var rect = button.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var x = ((event.clientX - centerX) / 50) * 4;
    var y = ((event.clientY - centerY) / 50) * 4;
    button.style.transform = "translate(" + x + "px, " + y + "px)";
  });

  document.addEventListener("mouseleave", function (event) {
    var button = event.target.closest && event.target.closest(".magnetic-button");
    if (button) button.style.transform = "translate(0, 0)";
  }, true);

  window.addEventListener("scroll", updateActiveNavigation);
}

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

function startCertAutoplay() {
  clearInterval(certificationTimer);
  certificationTimer = setInterval(function () {
    certificationsIndex = (certificationsIndex + 1) % portfolioData.certifications.length;
    renderCertifications();
  }, 5000);
}

function pauseCertAutoplay() {
  clearInterval(certificationTimer);
}

function renderAssistant() {
  var existingAssistant = document.getElementById("portfolio-assistant");
  if (existingAssistant) existingAssistant.remove();

  var shell = document.createElement("div");
  shell.id = "portfolio-assistant";
  shell.className = "assistant-shell";
  var ownerName = (portfolioData.personalInfo && portfolioData.personalInfo.name) || "Portfolio";
  var ownerFirstName = getPersonFirstName(ownerName) || "Portfolio";
  shell.innerHTML =
    '<section id="assistant-panel" class="assistant-panel is-hidden" aria-label="' + ownerName + ' personal AI assistant">' +
      '<div class="assistant-header">' +
        '<div class="flex items-start justify-between gap-3">' +
          '<div class="flex items-center gap-3 min-w-0">' +
            '<div class="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-sm">' + icon("zap", "w-6 h-6") + '</div>' +
            '<div class="min-w-0">' +
              '<p class="text-sm font-bold leading-tight">' + ownerFirstName + '\'s AI Assistant</p>' +
              '<div class="mt-1 flex items-center gap-2 text-xs text-white/80"><span class="assistant-status-dot"></span><span>Personal representative</span></div>' +
            '</div>' +
          '</div>' +
          '<button type="button" id="assistant-close" aria-label="Close assistant" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors">' + icon("close", "w-5 h-5") + '</button>' +
        '</div>' +
      '</div>' +
      '<div id="assistant-messages" class="assistant-messages"></div>' +
      '<div id="assistant-quick-actions" class="assistant-quick-actions"></div>' +
      '<form id="assistant-form" class="assistant-input-row">' +
        '<input id="assistant-input" class="assistant-input" type="text" autocomplete="off" placeholder="Ask about ' + ownerFirstName + ', hiring, projects..." aria-label="Ask ' + ownerFirstName + '\'s assistant" />' +
        '<button type="submit" class="assistant-send" aria-label="Send message">' + icon("arrowRight", "w-5 h-5") + '</button>' +
      '</form>' +
    '</section>' +
    '<button type="button" id="assistant-toggle" class="assistant-toggle" aria-label="Open ' + ownerFirstName + '\'s AI assistant">' + icon("mail", "w-7 h-7") + '</button>';

  document.body.appendChild(shell);

  assistantMessages = [
    {
      sender: "bot",
      text: "Hi, I am " + ownerFirstName + "'s personal AI assistant. I can help you understand his background, skills, projects, experience, education, achievements, and the best way to contact him."
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
    if (message.sender === "bot" && message.highlights && message.highlights.length) {
      bubble.innerHTML = formatAssistantHtml(message.text, message.highlights);
    } else {
      bubble.textContent = message.text;
    }
    container.appendChild(bubble);

    if (message.showEmail) {
      var contactEmail = (portfolioData.contact && portfolioData.contact.email) || "";
      if (contactEmail) {
        var emailLink = document.createElement("a");
        emailLink.className = "assistant-email-card";
        emailLink.href = "mailto:" + contactEmail;
        emailLink.textContent = contactEmail;
        bubble.appendChild(emailLink);
      }
    }
  }

  container.scrollTop = container.scrollHeight;
}

function escapeAssistantHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatAssistantHtml(text, highlights) {
  var safe = escapeAssistantHtml(text);
  var terms = (highlights || []).slice().sort(function (a, b) {
    return String(b).length - String(a).length;
  });
  for (var i = 0; i < terms.length; i++) {
    var term = escapeAssistantHtml(terms[i]);
    if (!term || term.length < 2) continue;
    var pattern = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    safe = safe.replace(pattern, '<span class="assistant-highlight">$1</span>');
  }
  return safe;
}

function renderAssistantQuickActions() {
  var firstName = (portfolioData.personalInfo && portfolioData.personalInfo.name)
    ? getPersonFirstName(portfolioData.personalInfo.name)
    : "him";
  var actions = [
    "Who is " + firstName + "?",
    "What is his current role?",
    "View his skills",
    "Show me his projects",
    "Why should I hire " + firstName + "?",
    "Contact " + firstName
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

function addAssistantMessage(sender, text, showEmail, highlights) {
  assistantMessages.push({
    sender: sender,
    text: text,
    showEmail: !!showEmail,
    highlights: highlights || []
  });
  renderAssistantMessages();
}

function showAssistantTyping(callback) {
  var container = document.getElementById("assistant-messages");
  if (!container) return callback();

  var typing = document.createElement("div");
  typing.id = "assistant-typing";
  typing.className = "assistant-message bot";
  typing.innerHTML = '<span class="assistant-typing"><span></span><span></span><span></span></span>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;

  setTimeout(function () {
    typing.remove();
    callback();
  }, 180);
}

function normalizeAssistantText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9@.+\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeAssistant(text) {
  var stop = {
    a: 1, an: 1, the: 1, and: 1, or: 1, of: 1, to: 1, in: 1, on: 1, for: 1, with: 1, is: 1, are: 1,
    was: 1, were: 1, be: 1, been: 1, am: 1, i: 1, me: 1, my: 1, you: 1, your: 1, we: 1, they: 1,
    this: 1, that: 1, these: 1, those: 1, it: 1, its: 1, as: 1, at: 1, by: 1, from: 1, about: 1,
    can: 1, could: 1, would: 1, should: 1, please: 1, just: 1, also: 1, any: 1, some: 1, into: 1,
    do: 1, does: 1, did: 1, what: 1, which: 1, who: 1, whom: 1, how: 1, when: 1, where: 1, why: 1,
    tell: 1, show: 1, give: 1, know: 1, like: 1, want: 1, need: 1, looking: 1
  };
  var raw = normalizeAssistantText(text).split(" ");
  var tokens = [];
  for (var i = 0; i < raw.length; i++) {
    var t = raw[i];
    if (!t || stop[t] || t.length < 2) continue;
    if (tokens.indexOf(t) === -1) tokens.push(t);
  }
  return tokens;
}

function uniquePush(list, value) {
  if (!value) return;
  if (list.indexOf(value) === -1) list.push(value);
}

function joinNatural(items, max) {
  var list = items.slice(0, max || items.length);
  if (!list.length) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return list[0] + " and " + list[1];
  return list.slice(0, -1).join(", ") + ", and " + list[list.length - 1];
}

function getAssistantLexicon() {
  return {
    greeting: ["hi", "hello", "hey", "hola", "namaste", "good morning", "good afternoon", "good evening", "howdy"],
    thanks: ["thanks", "thank", "appreciate", "grateful"],
    bye: ["bye", "goodbye", "see you", "later", "take care"],
    about: ["about", "bio", "profile", "summary", "background", "introduce", "introduction", "overview", "himself"],
    role: ["role", "job", "position", "currently", "current", "working", "work", "trainee", "experience", "employment", "company"],
    skills: ["skill", "skills", "tech", "technology", "technologies", "stack", "tool", "tools", "framework", "language", "expertise", "capable", "capability", "proficient"],
    projects: ["project", "projects", "built", "build", "portfolio", "mvp", "product", "demo", "showcase"],
    education: ["education", "college", "university", "degree", "student", "studying", "study", "cgpa", "grade", "academic", "school"],
    certifications: ["certification", "certifications", "certificate", "certificates", "credential", "credentials", "course", "courses"],
    honors: ["honor", "honors", "achievement", "achievements", "award", "awards", "hackathon", "rank", "qualifier", "contest", "competition"],
    streak: ["streak", "consistency", "discipline", "daily"],
    services: ["service", "services", "offer", "offers", "capabilities", "capability", "freelance", "can he help", "what can he do"],
    contact: ["contact", "email", "mail", "reach", "linkedin", "github", "connect", "message", "write"],
    hire: ["hire", "hiring", "recruit", "recruiter", "recruitment", "interview", "candidate", "offer", "opening", "vacancy", "junior", "internship", "intern", "fit", "talent"],
    business: ["business", "client", "freelance", "contract", "proposal", "partnership", "collaborate", "collaboration", "opportunity"],
    value: ["value", "strength", "strengths", "strong", "impressive", "standout", "unique", "recommend"],
    social: ["how are you", "whats up", "who are you", "are you real", "are you ai"]
  };
}

function getPersonFirstName(fullName) {
  var parts = String(fullName || "").trim().split(/\s+/);
  return parts[0] || "";
}

function getField(obj, keys) {
  if (!obj) return "";
  for (var i = 0; i < keys.length; i++) {
    if (obj[keys[i]] != null && String(obj[keys[i]]).trim() !== "") return obj[keys[i]];
  }
  return "";
}

function asArray(value) {
  if (!value) return [];
  if (Object.prototype.toString.call(value) === "[object Array]") return value;
  return [value];
}

function extractSpecializingPhrases(summary) {
  var text = String(summary || "");
  var match = text.match(/specializing in ([^.]+)/i);
  if (!match) return [];
  return match[1]
    .split(/,| and /i)
    .map(function (part) { return part.replace(/\.$/, "").trim(); })
    .filter(function (part) { return part.length > 2; });
}

function collectSkillsFromPortfolio(data) {
  var skills = [];
  var i;
  var j;

  asArray(data.skills).forEach(function (item) {
    if (typeof item === "string") uniquePush(skills, item);
    else if (item && item.name) uniquePush(skills, item.name);
    else if (item && item.title) uniquePush(skills, item.title);
  });

  asArray(data.capabilities).forEach(function (item) {
    if (typeof item === "string") uniquePush(skills, item);
    else if (item && (item.name || item.title)) uniquePush(skills, item.name || item.title);
  });

  extractSpecializingPhrases((data.personalInfo && data.personalInfo.summary) || "").forEach(function (phrase) {
    uniquePush(skills, phrase);
  });

  asArray(data.projects).forEach(function (project) {
    asArray(project.techStack || project.stack || project.technologies || project.tech).forEach(function (tech) {
      uniquePush(skills, tech);
    });
  });

  asArray(data.education).forEach(function (edu) {
    var specialization = getField(edu, ["specialization", "major", "focus"]);
    if (specialization) uniquePush(skills, specialization);
  });

  return skills;
}

function buildDynamicAliases(title, extras) {
  var stop = {
    the: 1, and: 1, for: 1, with: 1, from: 1, into: 1, onto: 1, a: 1, an: 1, of: 1, in: 1, on: 1, to: 1, or: 1,
    mvp: 1, product: 1, project: 1, bot: 1, engine: 1, system: 1
  };
  var lower = normalizeAssistantText(title);
  var aliases = [lower];
  var parts = lower.split(/\s+/).filter(function (part) { return part && part.length > 2 && !stop[part]; });
  var i;
  for (i = 0; i < parts.length; i++) uniquePush(aliases, parts[i]);
  for (i = 0; i < parts.length - 1; i++) uniquePush(aliases, parts[i] + " " + parts[i + 1]);
  asArray(extras).forEach(function (extra) {
    var value = normalizeAssistantText(extra);
    if (value) uniquePush(aliases, value);
  });
  return aliases.filter(Boolean);
}

function classifyPortfolioSection(key) {
  var map = {
    personalInfo: "about",
    personal: "about",
    about: "about",
    experience: "role",
    experiences: "role",
    work: "role",
    jobs: "role",
    skills: "skills",
    technologies: "skills",
    techStack: "skills",
    projects: "projects",
    project: "projects",
    education: "education",
    certifications: "certifications",
    certificates: "certifications",
    honors: "honors",
    achievements: "honors",
    awards: "honors",
    streak: "streak",
    contact: "contact",
    services: "services",
    capabilities: "services",
    offerings: "services"
  };
  if (map[key]) return map[key];
  var lower = String(key || "").toLowerCase();
  if (/skill|tech|tool/.test(lower)) return "skills";
  if (/project|worksample|portfolioitem/.test(lower)) return "projects";
  if (/educat|degree|college|school/.test(lower)) return "education";
  if (/cert/.test(lower)) return "certifications";
  if (/honor|award|achiev/.test(lower)) return "honors";
  if (/service|capabilit|offer/.test(lower)) return "services";
  if (/experience|employ|career|role/.test(lower)) return "role";
  if (/contact|social|link/.test(lower)) return "contact";
  return "custom:" + key;
}

function formatRecordLine(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  var title = getField(item, ["title", "name", "role", "label", "event"]);
  var detail = getField(item, ["description", "summary", "details", "about"]);
  var company = getField(item, ["company", "issuer", "organization", "institution"]);
  var extras = [];
  if (company) extras.push(company);
  var duration = getField(item, ["duration", "date", "dates", "period"]);
  if (duration) extras.push(duration);
  var grade = getField(item, ["grade", "cgpa", "score"]);
  if (grade) extras.push(grade);
  var line = title || "";
  if (extras.length) line += (line ? " — " : "") + extras.join(", ");
  if (detail) line += (line ? ". " : "") + detail;
  return line.trim();
}

function buildAssistantKnowledge() {
  var data = portfolioData || {};
  var info = data.personalInfo || data.personal || {};
  var experiences = asArray(data.experience || data.experiences || data.work);
  var educationList = asArray(data.education);
  var projects = asArray(data.projects);
  var honors = asArray(data.honors || data.achievements || data.awards);
  var certifications = asArray(data.certifications || data.certificates);
  var services = asArray(data.services || data.offerings);
  var capabilities = asArray(data.capabilities);
  var streak = data.streak || null;
  var contact = data.contact || {};
  var name = getField(info, ["name", "fullName"]) || "the portfolio owner";
  var firstName = getPersonFirstName(name);
  var currentJob = null;
  var i;

  for (i = 0; i < experiences.length; i++) {
    var duration = String(getField(experiences[i], ["duration", "date", "dates"]) || "");
    if (/present|current|now/i.test(duration)) {
      currentJob = experiences[i];
      break;
    }
  }
  if (!currentJob && experiences.length) currentJob = experiences[0];

  var skills = collectSkillsFromPortfolio(data);
  var entities = [];
  var sections = {};
  var sectionIntents = {};
  var availableTopics = [];

  function registerTopic(topic) {
    if (topic && availableTopics.indexOf(topic) === -1) availableTopics.push(topic);
  }

  projects.forEach(function (project, index) {
    var title = getField(project, ["title", "name"]) || ("Project " + (index + 1));
    var description = getField(project, ["description", "summary", "details"]);
    var tech = asArray(project.techStack || project.stack || project.technologies || project.tech);
    entities.push({
      id: "project-" + (project.id != null ? project.id : index),
      type: "project",
      title: title,
      aliases: buildDynamicAliases(title, tech.concat([description])),
      summary: description,
      tech: tech,
      featured: !!project.isFeatured,
      keywords: tokenizeAssistant([title, description].concat(tech).join(" "))
    });
  });

  honors.forEach(function (honor, index) {
    var title = getField(honor, ["title", "name"]);
    var event = getField(honor, ["event", "organization", "issuer"]);
    var description = getField(honor, ["description", "summary"]);
    entities.push({
      id: "honor-" + (honor.id != null ? honor.id : index),
      type: "honor",
      title: title,
      aliases: buildDynamicAliases(title, [event]),
      summary: title + (event ? (" at " + event) : "") + (description ? (". " + description) : ""),
      keywords: tokenizeAssistant([title, event, description].join(" "))
    });
  });

  certifications.forEach(function (cert, index) {
    var title = getField(cert, ["name", "title"]);
    var issuer = getField(cert, ["issuer", "organization", "company"]);
    entities.push({
      id: "cert-" + (cert.id != null ? cert.id : index),
      type: "certification",
      title: title,
      aliases: buildDynamicAliases(title, [issuer]),
      summary: title + (issuer ? (" from " + issuer) : ""),
      keywords: tokenizeAssistant([title, issuer].join(" "))
    });
  });

  Object.keys(data).forEach(function (key) {
    var intent = classifyPortfolioSection(key);
    sectionIntents[key] = intent;
    if (intent.indexOf("custom:") === 0) {
      var value = data[key];
      if (value && typeof value === "object") {
        sections[key] = value;
        registerTopic(intent);
        asArray(value).forEach(function (item, index) {
          if (!item || typeof item !== "object") return;
          var title = getField(item, ["title", "name", "label"]);
          if (!title) return;
          entities.push({
            id: key + "-" + (item.id != null ? item.id : index),
            type: intent,
            title: title,
            aliases: buildDynamicAliases(title, [getField(item, ["description", "summary"])]),
            summary: formatRecordLine(item),
            keywords: tokenizeAssistant(formatRecordLine(item))
          });
        });
      }
    } else {
      registerTopic(intent === "about" ? "about" : intent);
    }
  });

  [
    ["about", !!(info.summary || info.tagline || info.name)],
    ["role", experiences.length > 0],
    ["skills", skills.length > 0],
    ["projects", projects.length > 0],
    ["education", educationList.length > 0],
    ["certifications", certifications.length > 0],
    ["honors", honors.length > 0],
    ["streak", !!(streak && (streak.title || streak.days || streak.description))],
    ["services", services.length > 0 || capabilities.length > 0],
    ["contact", !!(contact.email || contact.linkedin || contact.github)]
  ].forEach(function (pair) {
    if (pair[1]) registerTopic(pair[0]);
  });

  return {
    name: name,
    firstName: firstName,
    tagline: getField(info, ["tagline", "headline"]),
    summary: getField(info, ["summary", "bio", "about", "description"]),
    experiences: experiences,
    currentJob: currentJob,
    role: currentJob ? getField(currentJob, ["role", "title", "position"]) : "",
    company: currentJob ? getField(currentJob, ["company", "organization", "employer"]) : "",
    duration: currentJob ? getField(currentJob, ["duration", "date", "dates", "period"]) : "",
    location: currentJob ? getField(currentJob, ["location", "place"]) : "",
    roleDescription: currentJob ? getField(currentJob, ["description", "summary", "details"]) : "",
    educationList: educationList,
    education: educationList[0] || null,
    skills: skills,
    streak: streak,
    contact: contact,
    entities: entities,
    projects: projects,
    honors: honors,
    certifications: certifications,
    services: services,
    capabilities: capabilities,
    sections: sections,
    sectionIntents: sectionIntents,
    availableTopics: availableTopics,
    companies: experiences.map(function (job) { return getField(job, ["company", "organization", "employer"]); }).filter(Boolean)
  };
}

function ensureAssistantKnowledge() {
  assistantKnowledge = buildAssistantKnowledge();
  return assistantKnowledge;
}

function personRef(knowledge) {
  return knowledge.firstName || knowledge.name || "He";
}

function scorePhraseHits(normalized, phrases) {
  var score = 0;
  for (var i = 0; i < phrases.length; i++) {
    if (normalized.indexOf(phrases[i]) !== -1) score += phrases[i].split(" ").length > 1 ? 2.4 : 1.2;
  }
  return score;
}

function detectAssistantIntents(rawText, normalized) {
  var lexicon = getAssistantLexicon();
  var knowledge = ensureAssistantKnowledge();
  var scores = {};
  var keys = Object.keys(lexicon);
  var i;
  for (i = 0; i < keys.length; i++) {
    scores[keys[i]] = scorePhraseHits(normalized, lexicon[keys[i]]);
  }

  var first = normalizeAssistantText(knowledge.firstName);
  var full = normalizeAssistantText(knowledge.name);
  var namePattern = full ? full.replace(/\s+/g, "\\s+") : "the portfolio owner";

  if (/\b(hi|hello|hey)\b/.test(normalized) && normalized.split(" ").length <= 4) scores.greeting += 3;
  if (new RegExp("who (is|are) (he|" + first + "|" + namePattern + ")").test(normalized) ||
      new RegExp("tell me about (him|" + first + "|" + namePattern + ")(?!\\s+\\w)").test(normalized) ||
      /\b(his background|his profile|his bio)\b/.test(normalized)) {
    scores.about += 3.5;
  }
  if (/tell me about his (skills|projects|education|role|experience|work|certifications|achievements|services)/.test(normalized)) {
    scores.about = Math.max(0, scores.about - 2);
  }
  if (/current(ly)? (role|job|position|doing|working)/.test(normalized)) scores.role += 3.5;
  if (/tech stack|technologies|what can he|what does he know/.test(normalized)) scores.skills += 3;
  if (/his projects|show .*project|what .*built|portfolio projects/.test(normalized)) scores.projects += 3;
  if (/why (should|would).*(hire|choose)|good (fit|candidate)|hire him|why hire/.test(normalized)) {
    scores.hire += 2.5;
    scores.value += 3.5;
  }
  if (new RegExp("email|linkedin|github|how (do|can) i (reach|contact|connect)|contact (" + first + "|him|" + namePattern + ")|^contact\\b|\\bget in touch\\b").test(normalized)) {
    scores.contact += 3.5;
  }
  if (/recruit|recruiter|hiring|looking (for|to hire)|open to work|available for/.test(normalized)) scores.hire += 3.5;
  if (/collaborat|freelance|client work|build (me|us|something)|business (opportunity|inquiry|project)/.test(normalized)) scores.business += 3;
  if (/\bbusiness\b/.test(normalized) && /mvp|workflow|automation|retail|project|need|looking/.test(normalized)) scores.business += 2.5;
  if (/cgpa|college|degree|studying|study|university|education/.test(normalized)) scores.education += 3;
  if (/certificat|credential/.test(normalized)) scores.certifications += 3;
  if (/hackathon|award|achievement|rank/.test(normalized)) scores.honors += 3;
  if (/streak|daily consistency|discipline/.test(normalized)) scores.streak += 3;
  if (/service|services|what can he (do|offer)|capabilities|freelance help/.test(normalized)) scores.services += 3.2;
  if (/how are you|who are you|are you (an )?ai|thanks|thank you|bye|goodbye/.test(normalized)) scores.social += 2.5;
  if (/what (is he|does he) (doing|do)|right now|nowadays/.test(normalized)) scores.role += 3.2;

  for (i = 0; i < knowledge.companies.length; i++) {
    var company = normalizeAssistantText(knowledge.companies[i]);
    if (company && normalized.indexOf(company) !== -1) scores.role += 2.5;
  }

  Object.keys(knowledge.sections).forEach(function (sectionKey) {
    var label = normalizeAssistantText(sectionKey.replace(/([A-Z])/g, " $1"));
    if (label && normalized.indexOf(label) !== -1) {
      var customIntent = knowledge.sectionIntents[sectionKey];
      scores[customIntent] = (scores[customIntent] || 0) + 3;
    }
  });

  if (assistantMemory.awaitingLead || assistantLead.started) scores.contact += 1.2;
  if (assistantMemory.focusTopics.indexOf("projects") !== -1 && /\b(that|those|it|them|first|second|featured|more)\b/.test(normalized)) {
    scores.projects += 2.2;
  }
  if (assistantMemory.focusTopics.indexOf("skills") !== -1 && /\b(those|them|that|more)\b/.test(normalized)) {
    scores.skills += 2.2;
  }
  if (assistantMemory.focusTopics.indexOf("honors") !== -1 && /\b(that|those|it|more)\b/.test(normalized)) {
    scores.honors += 2.2;
  }
  if (assistantMemory.lastIntent && /\b(he|him|his)\b/.test(normalized) && topIntentBoostable(assistantMemory.lastIntent)) {
    scores[assistantMemory.lastIntent] = (scores[assistantMemory.lastIntent] || 0) + 1.8;
  }

  var ranked = [];
  var allIntentKeys = {};
  for (i = 0; i < keys.length; i++) allIntentKeys[keys[i]] = 1;
  Object.keys(scores).forEach(function (key) { allIntentKeys[key] = 1; });
  Object.keys(allIntentKeys).forEach(function (key) {
    if (scores[key] > 0) ranked.push({ intent: key, score: scores[key] });
  });
  ranked.sort(function (a, b) { return b.score - a.score; });
  return ranked;
}

function topIntentBoostable(intent) {
  return ["about", "role", "skills", "projects", "education", "certifications", "honors", "streak", "services", "value"].indexOf(intent) !== -1 || String(intent).indexOf("custom:") === 0;
}

function findMentionedEntities(normalized) {
  var knowledge = ensureAssistantKnowledge();
  var found = [];
  for (var i = 0; i < knowledge.entities.length; i++) {
    var entity = knowledge.entities[i];
    var hit = 0;
    for (var a = 0; a < entity.aliases.length; a++) {
      if (entity.aliases[a] && normalized.indexOf(entity.aliases[a]) !== -1) {
        hit += entity.aliases[a].length > 4 ? 3 : 1.5;
      }
    }
    for (var k = 0; k < entity.keywords.length; k++) {
      if (normalized.indexOf(entity.keywords[k]) !== -1) hit += 0.35;
    }
    if (hit >= 1.5) found.push({ entity: entity, score: hit });
  }
  found.sort(function (a, b) { return b.score - a.score; });
  return found;
}

function resolveFollowUpFocus(normalized, intents, entities) {
  var topic = intents[0] ? intents[0].intent : "";
  if (entities.length) {
    return {
      topic: entities[0].entity.type === "project" ? "projects" : topic,
      entities: entities
    };
  }

  var ref = /\b(he|him|his|that|those|it|them|this one|the project|that project|those skills|same|more|another|details|elaborate|tell me more)\b/.test(normalized);
  if (!ref) return { topic: topic, entities: entities };

  var focused = [];
  for (var i = 0; i < assistantMemory.focusEntities.length; i++) {
    focused.push({ entity: assistantMemory.focusEntities[i], score: 2 });
  }
  return {
    topic: topic || assistantMemory.lastIntent || (assistantMemory.focusTopics[0] || ""),
    entities: focused.length ? focused : entities
  };
}

function looksLikePersonName(value) {
  var name = String(value || "").trim();
  if (!name || name.length < 2 || name.length > 40) return false;
  var parts = name.split(/\s+/);
  if (parts.length > 3) return false;
  var blocked = {
    interested: 1, looking: 1, trying: 1, wondering: 1, here: 1, from: 1, with: 1,
    email: 1, contacting: 1, reaching: 1, hiring: 1, recruiting: 1, available: 1,
    based: 1, currently: 1, also: 1, just: 1, really: 1, very: 1, the: 1, a: 1, an: 1
  };
  for (var i = 0; i < parts.length; i++) {
    if (blocked[parts[i].toLowerCase()]) return false;
    if (!/^[a-zA-Z][a-zA-Z'.-]*$/.test(parts[i])) return false;
  }
  return true;
}

function extractLeadDetails(originalText) {
  var text = String(originalText || "");
  var emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  var phoneMatch = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/);
  var nameMatch =
    text.match(/\bmy name is\s+([a-zA-Z][a-zA-Z\s'.-]{1,40})/i) ||
    text.match(/\b(?:i am|i'm|this is)\s+([a-zA-Z]{2,20}(?:\s+[a-zA-Z]{2,20})?)\b/i);
  var extractedName = "";

  if (nameMatch) {
    extractedName = nameMatch[1].replace(/\s+(and|from|with|my|email|contact|here).*$/i, "").trim();
    if (!assistantLead.name && looksLikePersonName(extractedName)) assistantLead.name = extractedName;
  }
  if (emailMatch && !assistantLead.contact) assistantLead.contact = emailMatch[0].trim();
  if (phoneMatch && !assistantLead.contact) assistantLead.contact = phoneMatch[0].trim();

  if (assistantLead.started || assistantMemory.awaitingLead) {
    var purposeCandidate = text.trim();
    var isNameOnly = !!(extractedName && looksLikePersonName(extractedName) && purposeCandidate.replace(nameMatch[0], "").trim().length < 8);
    var isContactOnly = !!(emailMatch && purposeCandidate.replace(emailMatch[0], "").trim().length < 8);
    if (!isNameOnly && !isContactOnly && (!assistantLead.purpose || purposeCandidate.length > assistantLead.purpose.length)) {
      if (!emailMatch || purposeCandidate.length > (emailMatch[0].length + 8)) {
        assistantLead.purpose = purposeCandidate;
      }
    }
  }
}

function getMissingLeadFields() {
  var missing = [];
  if (!assistantLead.name) missing.push("your name");
  if (!assistantLead.contact) missing.push("your email or preferred contact");
  if (!assistantLead.purpose || assistantLead.purpose.length < 12) missing.push("a short note on the purpose");
  return missing;
}

function queueContactNotification(lead) {
  var knowledge = ensureAssistantKnowledge();
  var payload = {
    createdAt: new Date().toISOString(),
    source: "portfolio-ai-assistant",
    type: lead.type || "contact-intent",
    visitorName: lead.name,
    visitorContact: lead.contact,
    message: lead.purpose,
    ownerEmail: knowledge.contact.email || ""
  };

  try {
    var storedLeads = JSON.parse(localStorage.getItem("portfolioAssistantLeads") || "[]");
    storedLeads.push(payload);
    localStorage.setItem("portfolioAssistantLeads", JSON.stringify(storedLeads));
  } catch (error) {
    console.info("Portfolio assistant lead prepared for future secure backend delivery.", payload);
  }

  return payload;
}

function collectHighlights() {
  var knowledge = ensureAssistantKnowledge();
  var highlights = [
    knowledge.name,
    knowledge.firstName,
    knowledge.role,
    knowledge.company,
    knowledge.contact.email,
    knowledge.contact.linkedin,
    knowledge.contact.github
  ];
  var i;
  if (knowledge.education) {
    uniquePush(highlights, getField(knowledge.education, ["degree", "title"]));
    uniquePush(highlights, getField(knowledge.education, ["specialization", "major"]));
    uniquePush(highlights, getField(knowledge.education, ["institution", "school", "college", "university"]));
    uniquePush(highlights, getField(knowledge.education, ["grade", "cgpa"]));
  }
  for (i = 0; i < knowledge.skills.length; i++) uniquePush(highlights, knowledge.skills[i]);
  for (i = 0; i < knowledge.projects.length; i++) uniquePush(highlights, getField(knowledge.projects[i], ["title", "name"]));
  for (i = 0; i < knowledge.honors.length; i++) {
    uniquePush(highlights, getField(knowledge.honors[i], ["title", "name"]));
    uniquePush(highlights, getField(knowledge.honors[i], ["event", "organization"]));
  }
  for (i = 0; i < knowledge.certifications.length; i++) uniquePush(highlights, getField(knowledge.certifications[i], ["name", "title"]));
  for (i = 0; i < knowledge.services.length; i++) {
    if (typeof knowledge.services[i] === "string") uniquePush(highlights, knowledge.services[i]);
    else uniquePush(highlights, getField(knowledge.services[i], ["title", "name"]));
  }
  return highlights.filter(function (item) { return item && String(item).length > 2; });
}

function pickHighlightsForText(text, preferred) {
  var source = (preferred && preferred.length ? preferred : collectHighlights()).slice().sort(function (a, b) {
    return String(b).length - String(a).length;
  });
  var used = [];
  var lower = String(text || "").toLowerCase();
  for (var i = 0; i < source.length; i++) {
    var term = String(source[i]);
    if (lower.indexOf(term.toLowerCase()) !== -1) uniquePush(used, term);
    if (used.length >= 10) break;
  }
  return used;
}

function stripUglySyntax(text) {
  return String(text || "")
    .replace(/\*\*/g, "")
    .replace(/(^|\s)\*(\S)/g, "$1$2")
    .replace(/`+/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/Contest\s*#(\d+)/gi, "Contest No. $1")
    .replace(/[|_~]{2,}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function composeBulletBlock(lines) {
  var out = [];
  for (var i = 0; i < lines.length; i++) {
    if (lines[i]) out.push("• " + lines[i]);
  }
  return out.join("\n");
}

function describeProject(project, detailed) {
  var title = getField(project, ["title", "name"]);
  var description = getField(project, ["description", "summary", "details"]);
  var tech = asArray(project.techStack || project.stack || project.technologies || project.tech);
  var line = title + (description ? (" — " + description) : "");
  if (detailed && tech.length) line += " Tech involved: " + joinNatural(tech, 6) + ".";
  return line;
}

function unavailableTopic(topic) {
  var k = ensureAssistantKnowledge();
  return "That " + topic + " detail is not listed in " + personRef(k) + "'s current portfolio data, so I will not invent it.";
}

function composeAboutResponse(depth) {
  var k = ensureAssistantKnowledge();
  if (!k.summary && !k.tagline) return unavailableTopic("profile");
  var parts = [];
  if (k.summary) parts.push(k.name + ". " + k.summary);
  else parts.push(k.name + (k.tagline ? (" — " + k.tagline) : "."));
  if (depth !== "short") {
    if (k.role && k.company) {
      parts.push("He is currently a " + k.role + " at " + k.company + ".");
    }
    if (k.education) {
      var degree = getField(k.education, ["degree", "title"]);
      var specialization = getField(k.education, ["specialization", "major"]);
      if (degree) {
        parts.push(
          "He is pursuing a " + degree +
          (specialization ? (" with a specialization in " + specialization) : "") + "."
        );
      }
    }
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function composeRoleResponse() {
  var k = ensureAssistantKnowledge();
  if (!k.experiences.length) return unavailableTopic("experience");

  if (k.experiences.length === 1 && k.currentJob) {
    var meta = [];
    if (k.duration) meta.push(k.duration);
    if (k.location) meta.push(k.location);
    return personRef(k) + " is currently a " + k.role +
      (k.company ? (" at " + k.company) : "") +
      (meta.length ? (" (" + meta.join(", ") + ")") : "") +
      (k.roleDescription ? (". " + k.roleDescription) : ".");
  }

  var lines = k.experiences.map(function (job) {
    return formatRecordLine(job);
  });
  return personRef(k) + "'s experience listed in the portfolio:\n\n" + composeBulletBlock(lines);
}

function composeSkillsResponse(focusSkill) {
  var k = ensureAssistantKnowledge();
  if (!k.skills.length) return unavailableTopic("skills");
  if (focusSkill) {
    var known = k.skills.some(function (skill) {
      return normalizeAssistantText(skill).indexOf(normalizeAssistantText(focusSkill)) !== -1;
    });
    if (!known) return "I do not see " + focusSkill + " listed directly in the current portfolio data.";
    return "Yes — " + focusSkill + " appears in " + personRef(k) + "'s portfolio work.";
  }
  var core = k.skills.slice(0, 10);
  return personRef(k) + "'s portfolio currently reflects strengths in " + joinNatural(core, 10) + ".";
}

function composeProjectsResponse(entities, wantDetail) {
  var k = ensureAssistantKnowledge();
  if (!k.projects.length) return unavailableTopic("projects");

  if (entities && entities.length && entities[0].entity.type === "project") {
    var match = null;
    for (var p = 0; p < k.projects.length; p++) {
      var projectId = "project-" + (k.projects[p].id != null ? k.projects[p].id : p);
      if (projectId === entities[0].entity.id || getField(k.projects[p], ["title", "name"]) === entities[0].entity.title) {
        match = k.projects[p];
      }
    }
    if (match) {
      return describeProject(match, true) + (wantDetail ? "" : " I can also compare it with his other projects if useful.");
    }
  }

  var featured = [];
  var rest = [];
  for (var i = 0; i < k.projects.length; i++) {
    if (k.projects[i].isFeatured) featured.push(k.projects[i]);
    else rest.push(k.projects[i]);
  }
  var ordered = featured.concat(rest);
  var intro = personRef(k) + "'s portfolio currently highlights these builds:";
  var lines = [];
  var limit = wantDetail ? ordered.length : Math.min(3, ordered.length);
  for (var j = 0; j < limit; j++) lines.push(describeProject(ordered[j], wantDetail));
  if (!wantDetail && ordered.length > limit) {
    return intro + "\n\n" + composeBulletBlock(lines) + "\n\nI can go deeper on any one of them.";
  }
  return intro + "\n\n" + composeBulletBlock(lines);
}

function composeEducationResponse() {
  var k = ensureAssistantKnowledge();
  if (!k.educationList.length) return unavailableTopic("education");
  if (k.educationList.length === 1) {
    var e = k.educationList[0];
    var parts = [];
    var degree = getField(e, ["degree", "title"]);
    var institution = getField(e, ["institution", "school", "college", "university"]);
    var specialization = getField(e, ["specialization", "major"]);
    var duration = getField(e, ["duration", "date", "dates"]);
    var grade = getField(e, ["grade", "cgpa"]);
    var description = getField(e, ["description", "summary"]);
    if (degree && institution) parts.push(personRef(k) + " is pursuing a " + degree + " at " + institution);
    else if (degree) parts.push(personRef(k) + " is pursuing a " + degree);
    else if (institution) parts.push(personRef(k) + " studied at " + institution);
    if (specialization) parts.push("specializing in " + specialization);
    var sentence = parts.join(", ") + ".";
    if (duration) sentence += " Duration: " + duration + ".";
    if (grade) sentence += " Current grade: " + grade + ".";
    if (description) sentence += " " + description;
    return sentence;
  }
  return personRef(k) + "'s education listed in the portfolio:\n\n" + composeBulletBlock(k.educationList.map(formatRecordLine));
}

function composeCertificationsResponse() {
  var k = ensureAssistantKnowledge();
  if (!k.certifications.length) return unavailableTopic("certifications");
  var lines = k.certifications.map(function (cert) {
    var name = getField(cert, ["name", "title"]);
    var issuer = getField(cert, ["issuer", "organization", "company"]);
    return name + (issuer ? (" — " + issuer) : "");
  });
  return personRef(k) + "'s listed certifications include:\n\n" + composeBulletBlock(lines);
}

function composeHonorsResponse(entities) {
  var k = ensureAssistantKnowledge();
  if (entities && entities.length && entities[0].entity.type === "honor") {
    return entities[0].entity.summary;
  }
  if (!k.honors.length) return unavailableTopic("achievements");
  var lines = k.honors.map(function (honor) {
    var title = getField(honor, ["title", "name"]);
    var event = getField(honor, ["event", "organization"]);
    var description = getField(honor, ["description", "summary"]);
    return title + (event ? (" — " + event) : "") + (description ? (". " + description) : "");
  });
  return "Standout achievements from the portfolio:\n\n" + composeBulletBlock(lines);
}

function composeStreakResponse() {
  var streak = ensureAssistantKnowledge().streak;
  if (!streak) return unavailableTopic("streak");
  var title = getField(streak, ["title", "name"]) || "Streak";
  var days = getField(streak, ["days", "count", "value"]);
  var description = getField(streak, ["description", "summary"]);
  return title + (days ? (": " + days + " days") : "") + (description ? (". " + description) : ".");
}

function composeServicesResponse() {
  var k = ensureAssistantKnowledge();
  if (k.services.length) {
    var lines = k.services.map(function (item) {
      return typeof item === "string" ? item : formatRecordLine(item);
    });
    return personRef(k) + "'s listed services include:\n\n" + composeBulletBlock(lines);
  }
  if (k.capabilities.length) {
    var caps = k.capabilities.map(function (item) {
      return typeof item === "string" ? item : formatRecordLine(item);
    });
    return personRef(k) + "'s listed capabilities include:\n\n" + composeBulletBlock(caps);
  }
  return composeCapabilitiesResponse();
}

function composeValueResponse(opportunity) {
  var k = ensureAssistantKnowledge();
  var who = personRef(k);
  var opener = who + " brings a portfolio grounded in the work and credentials listed here.";
  if (opportunity === "hire") {
    opener = "For hiring conversations, " + who + "'s portfolio shows practical delivery across the skills and projects listed below.";
  } else if (opportunity === "business") {
    opener = "For business or collaboration work, " + who + "'s portfolio shows relevant builds and capabilities from current data.";
  }

  var points = [];
  if (k.skills.length) points.push("Relevant strengths: " + joinNatural(k.skills.slice(0, 6), 6));
  if (k.role && k.company) points.push("Current role: " + k.role + " at " + k.company);
  if (k.projects.length) {
    points.push(
      "Project proof: " +
      joinNatural(k.projects.slice(0, 4).map(function (project) { return getField(project, ["title", "name"]); }), 4)
    );
  }
  if (k.honors.length) {
    points.push(
      "Achievements: " +
      joinNatural(k.honors.slice(0, 3).map(function (honor) { return getField(honor, ["title", "name"]); }), 3)
    );
  }
  if (k.education) {
    var degree = getField(k.education, ["degree", "title"]);
    var specialization = getField(k.education, ["specialization", "major"]);
    var grade = getField(k.education, ["grade", "cgpa"]);
    points.push(
      "Education: " +
      [degree, specialization, grade].filter(Boolean).join(" | ")
    );
  }
  if (!points.length) return unavailableTopic("professional value");
  return opener + "\n\n" + composeBulletBlock(points);
}

function composeContactResponse(opportunity) {
  var k = ensureAssistantKnowledge();
  var email = k.contact.email;
  var who = personRef(k);
  var channels = [];
  if (k.contact.linkedin) channels.push("LinkedIn");
  if (k.contact.github) channels.push("GitHub");
  if (!email && !channels.length) return unavailableTopic("contact");

  if (opportunity === "hire") {
    return "If this is a recruiting or interview conversation, the cleanest next step is emailing " + who +
      (email ? (" at " + email) : "") +
      ". If helpful, share your name, contact details, and role context here and I will prepare it privately.";
  }
  if (opportunity === "business") {
    return "For a collaboration or project discussion, reach " + who +
      (email ? (" at " + email) : "") +
      ". You may also share your name, preferred contact, and what you need built, and I will prepare that as a private lead.";
  }
  return "You can reach " + who +
    (email ? (" at " + email) : "") +
    (channels.length ? (". " + channels.join(" and ") + " are also listed on this portfolio") : "") +
    ". If you prefer, share your name, contact, and purpose here.";
}

function composeCapabilitiesResponse() {
  var k = ensureAssistantKnowledge();
  if (k.services.length || k.capabilities.length) return composeServicesResponse();
  if (!k.skills.length && !k.projects.length) {
    return "There is no services or capabilities section in the current portfolio data, so I will not invent one.";
  }
  var bits = [];
  if (k.skills.length) bits.push(joinNatural(k.skills.slice(0, 8), 8));
  var text = "There is no separate services section in the portfolio right now. From the work currently listed, " +
    personRef(k) + "'s demonstrated capabilities include " + (bits[0] || "the projects shown on this site") + ".";
  if (k.projects.length) {
    text += " Notable builds include " +
      joinNatural(k.projects.slice(0, 3).map(function (project) { return getField(project, ["title", "name"]); }), 3) + ".";
  }
  text += " For a specific brief, contacting him directly is the most reliable next step.";
  return text;
}

function composeCustomSectionResponse(intentKey) {
  var k = ensureAssistantKnowledge();
  var sectionKey = String(intentKey || "").replace(/^custom:/, "");
  var value = k.sections[sectionKey];
  if (!value) return unavailableTopic(sectionKey || "section");
  if (typeof value === "string") return value;
  var lines = asArray(value).map(formatRecordLine).filter(Boolean);
  if (!lines.length) return unavailableTopic(sectionKey || "section");
  return "From the portfolio's " + sectionKey + " section:\n\n" + composeBulletBlock(lines);
}

function composeSocialResponse(normalized) {
  var k = ensureAssistantKnowledge();
  var who = personRef(k);
  if (/thank/.test(normalized)) return "You're welcome. Happy to help with anything else about " + who + "'s background or work.";
  if (/bye|goodbye|see you|take care/.test(normalized)) return "Glad I could help. Feel free to return anytime if you want more detail on " + who + "'s work.";
  if (/how are you/.test(normalized)) return "I'm doing well, thank you. I am here as " + who + "'s personal representative — what would you like to know about him?";
  if (/who are you|are you (an )?ai|are you real/.test(normalized)) {
    return "I am " + who + "'s personal AI assistant for this portfolio. I can walk you through his experience, projects, skills, and the best way to reach him.";
  }
  if (/^(hi|hello|hey|hola|namaste)\b/.test(normalized)) {
    return "Hello — I represent " + k.name + ". Ask me about his background, current role, skills, projects, education, achievements, or how to get in touch.";
  }
  return "I'm here to represent " + who + " professionally. What would you like to explore?";
}

function composeUnknownResponse(normalized) {
  var k = ensureAssistantKnowledge();
  var who = personRef(k);
  if (/salary|age|address|phone number|married|religion|politics/.test(normalized)) {
    return "That detail is not available in " + who + "'s portfolio, so I will not speculate. I can share what is listed in the current portfolio data instead.";
  }
  if (/service|freelance|can he (build|make|develop|help)/.test(normalized)) {
    return composeCapabilitiesResponse();
  }
  var topics = k.availableTopics.filter(function (topic) {
    return ["about", "role", "skills", "projects", "education", "certifications", "honors", "streak", "services", "contact"].indexOf(topic) !== -1;
  });
  return "I do not have enough portfolio-backed detail to answer that precisely, and I will not invent it. I can help with " +
    (topics.length ? joinNatural(topics, 8) : "the information currently listed in the portfolio") + ".";
}

function shouldOfferContact(intents, opportunity) {
  if (opportunity === "hire" || opportunity === "business") return true;
  for (var i = 0; i < Math.min(2, intents.length); i++) {
    if (intents[i].intent === "contact") return true;
    if (intents[i].intent === "hire" && intents[i].score >= 3) return true;
    if (intents[i].intent === "business" && intents[i].score >= 3) return true;
  }
  return false;
}

function detectOpportunity(intents, normalized) {
  var hireScore = 0;
  var businessScore = 0;
  for (var i = 0; i < intents.length; i++) {
    if (intents[i].intent === "hire" || intents[i].intent === "value") hireScore += intents[i].score;
    if (intents[i].intent === "business") businessScore += intents[i].score;
  }
  if (/recruit|hiring manager|we are hiring|open role|interview/.test(normalized)) hireScore += 2;
  if (/client|freelance|paid project|build for (us|me|our)/.test(normalized)) businessScore += 2;
  if (hireScore >= 3 && hireScore >= businessScore) return "hire";
  if (businessScore >= 3) return "business";
  return assistantMemory.opportunity || "";
}

function beginLeadFlow(opportunity) {
  assistantLead.started = true;
  assistantLead.type = opportunity || "contact";
  assistantMemory.awaitingLead = true;
}

function handleLeadConversation(originalText, opportunity) {
  extractLeadDetails(originalText);
  var missing = getMissingLeadFields();
  var activelyCollecting = assistantLead.started || assistantMemory.awaitingLead;
  var knowledge = ensureAssistantKnowledge();
  var who = personRef(knowledge);

  if (!activelyCollecting) return null;

  if (missing.length) {
    beginLeadFlow(opportunity || assistantLead.type || "contact");
    var ask;
    if (missing.length === 3) {
      ask = "I can help route this professionally. Please share your name, email or preferred contact, and a short purpose.";
    } else {
      ask = "Thanks — I still need " + joinNatural(missing, 3) + " to prepare this properly.";
    }
    return {
      text: stripUglySyntax(ask + " You can also email " + who + " directly using the address below."),
      showEmail: !!knowledge.contact.email,
      highlights: pickHighlightsForText(ask, [knowledge.contact.email, who])
    };
  }

  if (!assistantLead.notified) {
    queueContactNotification(assistantLead);
    assistantLead.notified = true;
    assistantMemory.awaitingLead = false;
  }

  var done = "Thank you" + (assistantLead.name ? ", " + assistantLead.name : "") +
    ". I have prepared your details as a private lead for secure notification once the backend endpoint is connected. For the fastest direct reply, email " + who + " using the address below.";
  return {
    text: stripUglySyntax(done),
    showEmail: !!knowledge.contact.email,
    highlights: pickHighlightsForText(done, [assistantLead.name, knowledge.contact.email, who])
  };
}

function updateAssistantMemory(userText, intents, entities, opportunity, responseMeta) {
  var topic = intents[0] ? intents[0].intent : "";
  var mappedTopic = topic;
  if (topic === "value") mappedTopic = opportunity || "hire";
  assistantMemory.turns.push({
    text: userText,
    intent: topic,
    entityIds: entities.map(function (item) { return item.entity.id; })
  });
  if (assistantMemory.turns.length > 12) assistantMemory.turns.shift();
  if (mappedTopic) {
    assistantMemory.lastIntent = mappedTopic;
    assistantMemory.focusTopics = [mappedTopic].concat(
      assistantMemory.focusTopics.filter(function (t) { return t !== mappedTopic; })
    ).slice(0, 4);
  }
  if (entities.length) {
    assistantMemory.focusEntities = entities.map(function (item) { return item.entity; }).slice(0, 4);
  } else if (responseMeta && responseMeta.focusEntities && responseMeta.focusEntities.length) {
    assistantMemory.focusEntities = responseMeta.focusEntities.slice(0, 4);
  }
  if (opportunity) assistantMemory.opportunity = opportunity;
}

function getIntentScore(intents, name) {
  for (var i = 0; i < intents.length; i++) {
    if (intents[i].intent === name) return intents[i].score;
  }
  return 0;
}

function getAssistantResponse(question) {
  var knowledge = ensureAssistantKnowledge();
  var original = String(question || "").trim();
  var normalized = normalizeAssistantText(original);
  var intents = detectAssistantIntents(original, normalized);
  var entities = findMentionedEntities(normalized);
  var focus = resolveFollowUpFocus(normalized, intents, entities);
  entities = focus.entities;
  var opportunity = detectOpportunity(intents, normalized);
  var top = intents[0] ? intents[0].intent : "";
  var topScore = intents[0] ? intents[0].score : 0;
  var wantDetail = /\b(more|detail|details|deep|elaborate|explain|full|everything)\b/.test(normalized);
  var mixedAsk = /\band\b|\balso\b/.test(normalized);
  var contactPrimary = getIntentScore(intents, "contact") >= 2.5 && getIntentScore(intents, "contact") >= topScore - 0.5;
  var socialTop = ["greeting", "thanks", "bye", "social"].indexOf(top) !== -1;
  var socialPrimary =
    getIntentScore(intents, "greeting") >= 2 ||
    getIntentScore(intents, "thanks") >= 2 ||
    getIntentScore(intents, "bye") >= 2 ||
    getIntentScore(intents, "social") >= 2.5;
  var opportunityStrong = opportunity === "hire" || opportunity === "business";
  var sections = [];
  var showEmail = false;
  var preferredHighlights = [];
  var responseMeta = { focusEntities: [] };

  if (assistantLead.started || assistantMemory.awaitingLead) {
    var missingNow = getMissingLeadFields();
    var providingLeadInfo =
      contactPrimary ||
      /@/.test(original) ||
      /\bmy name is\b/i.test(original) ||
      (/\b(?:i am|i'm|this is)\s+[a-zA-Z]{2,20}(?:\s+[a-zA-Z]{2,20})?\b/i.test(original) && !/\b(interested|looking|wondering|trying|here to)\b/i.test(original)) ||
      (missingNow.length === 1 && missingNow[0].indexOf("purpose") !== -1 && original.length >= 12);

    if (providingLeadInfo) {
      var leadReply = handleLeadConversation(original, opportunity);
      if (leadReply) {
        updateAssistantMemory(original, intents, entities, opportunity, responseMeta);
        return leadReply;
      }
    }
  }

  if (socialPrimary && socialTop && !entities.length && !opportunityStrong) {
    var social = composeSocialResponse(normalized);
    updateAssistantMemory(original, intents, entities, opportunity, responseMeta);
    return { text: stripUglySyntax(social), showEmail: false, highlights: pickHighlightsForText(social) };
  }

  if (
    contactPrimary &&
    !getIntentScore(intents, "hire") &&
    !getIntentScore(intents, "business") &&
    !getIntentScore(intents, "value")
  ) {
    beginLeadFlow("contact");
    var contactOnly = composeContactResponse("");
    updateAssistantMemory(original, intents, entities, opportunity, responseMeta);
    return {
      text: stripUglySyntax(contactOnly),
      showEmail: true,
      highlights: pickHighlightsForText(contactOnly, [knowledge.contact.email, knowledge.firstName, "LinkedIn", "GitHub"].filter(Boolean))
    };
  }

  var entityPreferred =
    entities.length &&
    entities[0].score >= 2.2 &&
    !opportunityStrong &&
    (!top || topScore < entities[0].score + 0.8 || top === "projects" || top === "honors" || top === "certifications" || top === "skills");

  if (entityPreferred) {
    var entity = entities[0].entity;
    if (entity.type === "project") {
      sections.push(composeProjectsResponse(entities, true));
      responseMeta.focusEntities = [entity];
    } else if (entity.type === "honor") sections.push(composeHonorsResponse(entities));
    else if (entity.type === "certification") sections.push(entity.summary + ".");
    preferredHighlights.push(entity.title);
  } else {
    var used = {};
    function addIntentSection(intentName) {
      if (used[intentName]) return;
      used[intentName] = true;
      if (intentName === "about") sections.push(composeAboutResponse(wantDetail ? "full" : "short"));
      else if (intentName === "role") sections.push(composeRoleResponse());
      else if (intentName === "skills") sections.push(composeSkillsResponse(null));
      else if (intentName === "projects") {
        sections.push(composeProjectsResponse(entities, wantDetail));
        if (!entities.length && knowledge.projects.length) {
          responseMeta.focusEntities = [{
            id: "project-" + (knowledge.projects[0].id != null ? knowledge.projects[0].id : 0),
            type: "project",
            title: getField(knowledge.projects[0], ["title", "name"]),
            summary: getField(knowledge.projects[0], ["description", "summary"]),
            tech: asArray(knowledge.projects[0].techStack || knowledge.projects[0].stack || knowledge.projects[0].technologies || knowledge.projects[0].tech)
          }];
        }
      } else if (intentName === "education") sections.push(composeEducationResponse());
      else if (intentName === "certifications") sections.push(composeCertificationsResponse());
      else if (intentName === "honors") sections.push(composeHonorsResponse(entities));
      else if (intentName === "streak") sections.push(composeStreakResponse());
      else if (intentName === "services") sections.push(composeServicesResponse());
      else if (intentName === "value") sections.push(composeValueResponse(opportunity || "hire"));
      else if (intentName === "hire" && getIntentScore(intents, "value") < 2) sections.push(composeValueResponse("hire"));
      else if (intentName === "business" && getIntentScore(intents, "value") < 2) sections.push(composeValueResponse("business"));
      else if (String(intentName).indexOf("custom:") === 0) sections.push(composeCustomSectionResponse(intentName));
    }

    if (top && topScore >= 1.2) addIntentSection(top);
    var secondThreshold = mixedAsk ? 1.2 : 2;
    for (var i = 1; i < intents.length && sections.length < (mixedAsk ? 3 : 2); i++) {
      if (
        intents[i].score >= secondThreshold &&
        (
          ["about", "role", "skills", "projects", "education", "certifications", "honors", "streak", "services", "value"].indexOf(intents[i].intent) !== -1 ||
          String(intents[i].intent).indexOf("custom:") === 0
        )
      ) {
        addIntentSection(intents[i].intent);
      }
    }
  }

  if (!sections.length && /service|freelance|can he (help|build|make|develop)|does he (offer|provide)|what services/.test(normalized)) {
    sections.push(composeCapabilitiesResponse());
  }

  if (!sections.length && focus.topic) {
    if (focus.topic === "about") sections.push(composeAboutResponse("short"));
    else if (focus.topic === "role") sections.push(composeRoleResponse());
    else if (focus.topic === "skills") sections.push(composeSkillsResponse(null));
    else if (focus.topic === "projects") sections.push(composeProjectsResponse(entities, wantDetail || true));
    else if (focus.topic === "education") sections.push(composeEducationResponse());
    else if (focus.topic === "certifications") sections.push(composeCertificationsResponse());
    else if (focus.topic === "honors") sections.push(composeHonorsResponse(entities));
    else if (focus.topic === "streak") sections.push(composeStreakResponse());
    else if (focus.topic === "services") sections.push(composeServicesResponse());
    else if (String(focus.topic).indexOf("custom:") === 0) sections.push(composeCustomSectionResponse(focus.topic));
  }

  if (!sections.length) {
    var unknown = composeUnknownResponse(normalized);
    updateAssistantMemory(original, intents, entities, opportunity, responseMeta);
    return { text: stripUglySyntax(unknown), showEmail: false, highlights: pickHighlightsForText(unknown) };
  }

  if (shouldOfferContact(intents, opportunity) && !contactPrimary) {
    if (opportunityStrong || getIntentScore(intents, "value") >= 2.5) {
      sections.push(composeContactResponse(opportunity || "hire"));
      showEmail = true;
      if (opportunityStrong) beginLeadFlow(opportunity);
    }
  }

  if (contactPrimary) {
    beginLeadFlow(opportunity || "contact");
    var leadSoft = handleLeadConversation(original, opportunity);
    if (leadSoft) {
      updateAssistantMemory(original, intents, entities, opportunity, responseMeta);
      return leadSoft;
    }
  }

  var text = stripUglySyntax(sections.join("\n\n"));
  updateAssistantMemory(original, intents, entities, opportunity, responseMeta);
  return {
    text: text,
    showEmail: showEmail,
    highlights: pickHighlightsForText(text, preferredHighlights.concat(collectHighlights()))
  };
}

function sendAssistantMessage(text) {
  var cleanText = String(text || "").trim();
  if (!cleanText) return;

  addAssistantMessage("user", cleanText, false, []);
  showAssistantTyping(function () {
    var response = getAssistantResponse(cleanText);
    addAssistantMessage("bot", response.text, response.showEmail, response.highlights || []);
  });
}

function renderPage() {
  renderNavigation();
  renderHero();
  renderProjects(false);
  renderExperience();
  renderHonors();
  renderCertifications();
  renderEducation();
  renderContact();
  renderAssistant();
  attachEvents();
  observeReveals();
  setupAutoplayVideos();
  setupStreakCounter();
  startCertAutoplay();
}

document.addEventListener("DOMContentLoaded", renderPage);
