/**
 * ai-service.js — AI Chat Engine (Server-Proxy Mode)
 * -----------------------------------------------------------------------------
 * 1. Local FAQ & Navigation Bridge: Handles common questions instantly (0 tokens).
 * 2. Dynamic Context Builder: Slices AI_CONTEXT into a rich system prompt.
 * 3. Server Proxy (SSE Streaming): Streams tokens live from /api/chat.
 * 4. Action Calling: Automatically launches project modals (window.openProjectModal).
 * 5. Multi-Key Failover: Managed server-side in api/chat.js (Gemini → Groq → ...).
 * 6. Executive Standby Card: Displays an elegant standby card on total pool exhaustion.
 * 7. Universal Auto-Scroll Buttons & Compact Sanitizer: Preserved for rich portfolio UX.
 */

(function () {
  "use strict";

  /* ── Universal Auto-Scroll Buttons ─────────────────────── */

  var SCROLL_BUTTONS = {
    projects: '<button onclick="document.getElementById(\'projects\').scrollIntoView({behavior: \'smooth\'})" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-lg border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer">🚀 View All Projects in Portfolio</button>',
    certifications: '<button onclick="document.getElementById(\'certifications\').scrollIntoView({behavior: \'smooth\'})" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-lg border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer">📜 View All Certifications</button>',
    experience: '<button onclick="document.getElementById(\'experience\').scrollIntoView({behavior: \'smooth\'})" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-lg border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer">💼 View Full Experience</button>',
    honors: '<button onclick="document.getElementById(\'honors\').scrollIntoView({behavior: \'smooth\'})" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-lg border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer">🏆 View All Honors & Ranks</button>',
    contact: '<button onclick="document.getElementById(\'contact\').scrollIntoView({behavior: \'smooth\'})" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-lg border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer">📬 Get in Touch</button>'
  };

  /* ── Executive Standby Error Card (No Raw Errors) ────── */

  function getStandbyErrorCard() {
    return (
      '<div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 my-1">' +
        '<div class="flex items-center gap-2 text-indigo-700 font-bold text-sm">' +
          '<span>⚡ Assistant Momentarily Busy</span>' +
        '</div>' +
        '<p class="text-xs text-slate-600 leading-relaxed margin-0">' +
          'Rohan\'s AI representative is currently receiving high inquiry traffic. You can explore his featured projects or connect with him directly below.' +
        '</p>' +
        '<div class="pt-1 flex flex-wrap gap-2">' +
          '<button onclick="document.getElementById(\'contact\').scrollIntoView({behavior: \'smooth\'})" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-medium text-xs rounded-lg shadow-sm hover:bg-indigo-700 transition cursor-pointer">📬 Contact Rohan Directly</button>' +
          '<button onclick="document.getElementById(\'projects\').scrollIntoView({behavior: \'smooth\'})" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 font-medium text-xs rounded-lg hover:bg-slate-50 transition cursor-pointer">🚀 View Featured Projects</button>' +
        '</div>' +
      '</div>'
    );
  }

  /* ── Helper: Execute Smooth Scroll safely ──────────────── */
  function scrollToSection(id) {
    setTimeout(function () {
      var elem = document.getElementById(id);
      if (elem) elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  /* ── 1. Local FAQ & Navigation Bridge (0 Tokens) ──────── */

  function tryLocalFAQ(text) {
    var raw = String(text || "").trim();
    var lower = raw.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    var ctx = window.AI_CONTEXT || {};
    var contact = ctx.contact || {};

    // Direct Scroll Navigation Intent Triggers
    if (/go to projects|scroll to projects|take me to projects|show projects section|view all projects/i.test(raw)) {
      scrollToSection("projects");
      return (
        "Scrolling you directly to <strong class=\"font-semibold text-indigo-700\">Featured Projects</strong> section in the portfolio!<br>" +
        SCROLL_BUTTONS.projects
      );
    }

    if (/go to cert|scroll to cert|take me to cert|show cert|view all cert|certifications section/i.test(raw)) {
      scrollToSection("certifications");
      return (
        "Navigating to the <strong class=\"font-semibold text-indigo-700\">Certifications</strong> section!<br>" +
        SCROLL_BUTTONS.certifications
      );
    }

    if (/go to experience|scroll to experience|take me to experience|show experience|full experience|experience section/i.test(raw)) {
      scrollToSection("experience");
      return (
        "Scrolling to the <strong class=\"font-semibold text-indigo-700\">Experience</strong> section!<br>" +
        SCROLL_BUTTONS.experience
      );
    }

    if (/go to honors|scroll to honors|take me to honors|show honors|view honors|ranks section|achievements section/i.test(raw)) {
      scrollToSection("honors");
      return (
        "Navigating to <strong class=\"font-semibold text-indigo-700\">Honors & Achievements</strong>!<br>" +
        SCROLL_BUTTONS.honors
      );
    }

    if (/go to contact|scroll to contact|take me to contact|show contact|get in touch/i.test(raw)) {
      scrollToSection("contact");
      return (
        "Navigating to the <strong class=\"font-semibold text-indigo-700\">Contact & Connect</strong> section!<br>" +
        SCROLL_BUTTONS.contact
      );
    }

    // Basic greetings
    if (/^(hi|hello|hey|namaste|hola|good morning|good afternoon|good evening|whats up|what is up)$/.test(lower)) {
      return (
        "Hello! I am <strong class=\"font-semibold text-indigo-700\">Rohan Nimje's Personal AI Representative</strong>. " +
        "How can I help you today? You can ask about his projects, skills, certifications, experience, or how to get in touch!"
      );
    }

    // Quick links / Contact
    if (/^(contact|contact rohan|show links|links|email|linkedin|github|reach rohan|how to reach rohan)$/.test(lower)) {
      return (
        "Here are the best ways to reach and connect with <strong class=\"font-semibold text-indigo-700\">Rohan Nimje</strong>:<br>" +
        "<ul class=\"list-disc pl-4 space-y-1 text-sm my-1\">" +
        "<li><strong class=\"font-semibold text-indigo-700\">Email:</strong> <a href=\"mailto:" + (contact.email || "rohannimje53@gmail.com") + "\" class=\"text-indigo-600 font-semibold underline\">" + (contact.email || "rohannimje53@gmail.com") + "</a></li>" +
        "<li><strong class=\"font-semibold text-indigo-700\">LinkedIn:</strong> <a href=\"" + (contact.linkedin || "https://www.linkedin.com/in/rohannimje/") + "\" target=\"_blank\" rel=\"noopener\" class=\"text-indigo-600 font-semibold underline\">linkedin.com/in/rohannimje</a></li>" +
        "<li><strong class=\"font-semibold text-indigo-700\">GitHub:</strong> <a href=\"" + (contact.github || "https://github.com/RohanNimje") + "\" target=\"_blank\" rel=\"noopener\" class=\"text-indigo-600 font-semibold underline\">github.com/RohanNimje</a></li>" +
        "</ul>" +
        SCROLL_BUTTONS.contact
      );
    }

    // Thanks / Gratitude
    if (/^(thanks|thank you|thank you so much|thx|ty)$/.test(lower)) {
      return "You're very welcome! Let me know if you need anything else regarding Rohan's work or experience.";
    }

    // Bye / Goodbye
    if (/^(bye|goodbye|see ya|see you|take care)$/.test(lower)) {
      return "Goodbye! Have a great day ahead. Feel free to return anytime to learn more about Rohan's work.";
    }

    return null;
  }

  /* ── 2. Comprehensive Dynamic Context Slicing ──────────── */

  function buildDynamicSystemPrompt(userQuery) {
    var ctx = window.AI_CONTEXT;
    if (!ctx) return "You are a helpful AI assistant.";

    var p = ctx.personal || {};
    var contact = ctx.contact || {};
    var query = String(userQuery || "").toLowerCase();

    var wantsProjects = /project|build|app|scanzy|trinity|cosmolyze|agent|bot|automation|demo|video|watch|code|system|mcp|portfolio|work|product|mvp|screenshot/i.test(query);
    var wantsCerts = /certificat|credential|course|nxtwave|aws|salesforce|microsoft|python|sql|html|css|boostrap|flexbox|xpm|learning/i.test(query);
    var wantsHonors = /honor|achievement|hackathon|award|rank|codeverse|qualifier|contest|competition|streak|winner|innovators|buildathon|sparky/i.test(query);
    var wantsExp = /experience|work|job|role|trainee|company|nxtwave|career|employment|position/i.test(query);
    var wantsEdu = /education|college|university|degree|bca|cgpa|grade|study|studying|school|sgbau|shivaji/i.test(query);
    var wantsSkills = /skill|tech|stack|language|framework|python|javascript|react|node|sql|mongodb|supabase|n8n|tool|expert|capability|capabilities/i.test(query);
    var wantsPitches = /hire|why|role|apm|product manager|sde|software engineer|architect|position|opportunity|recruitment|value|strengths/i.test(query);

    var isGeneral = !wantsProjects && !wantsCerts && !wantsHonors && !wantsExp && !wantsEdu && !wantsSkills && !wantsPitches;

    var promptParts = [];

    promptParts.push(
      "You are the Personal AI Representative of " + p.name + " — acting as his professional advocate on his portfolio website.\n\n" +
      "IDENTITY & PERSONA RULES:\n" +
      "- Always speak AS Rohan's representative — warm, confident, professional.\n" +
      "- Refer to Rohan in third person ('Rohan', 'he', 'him', 'his').\n" +
      "- NEVER invent facts not listed in this knowledge base.\n" +
      "- NEVER output raw Markdown syntax like **bold** or *italic* or ```code``` or # headings. Use clean HTML formatting: <strong class=\"font-semibold text-indigo-700\">, <ul class=\"list-disc pl-4 space-y-1 my-1\">, <li>, <br>, <a href=\"...\" target=\"_blank\" rel=\"noopener\" class=\"text-indigo-600 font-semibold underline\">.\n" +
      "- Detect the language of the user's message AUTOMATICALLY and reply in the EXACT SAME language (English, Hindi, Marathi, Hinglish, etc.).\n" +
      "- When asked for project videos/demos, ALWAYS output clickable HTML links:\n" +
      "  <a href=\"[URL]\" target=\"_blank\" rel=\"noopener\" class=\"inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 transition-colors\">🎬 Watch Demo Video</a>\n" +
      "- When asked for certificates, output image cards:\n" +
      "  <div class=\"mt-2\"><img src=\"[CertImgUrl]\" alt=\"[name]\" class=\"w-full max-w-xs rounded-xl border border-slate-200 shadow-sm\" loading=\"lazy\" /><p class=\"text-xs text-slate-500 mt-1\">[name] — [issuer]</p></div>\n" +
      "- PROJECT MODAL ACTION TRIGGER:\n" +
      "  When the user asks to see, view, open, or watch project demos/videos/modals (e.g. ScanZy Rewards, Cosmolyze, Trinity X, Sparky, etc.), append [[ACTION:openProjectModal:ID]] with the matching project ID (e.g. [[ACTION:openProjectModal:1]] for ScanZy Rewards, [[ACTION:openProjectModal:2]] for Cosmolyze, [[ACTION:openProjectModal:3]] for Trinity X, [[ACTION:openProjectModal:4]] for Sparky, [[ACTION:openProjectModal:5]] for Automation Engine, [[ACTION:openProjectModal:6]] for Hackathon Bot).\n" +
      "- AUTO-SCROLL BUTTON INSTRUCTIONS:\n" +
      "  When answering inquiries about projects, append: " + SCROLL_BUTTONS.projects + "\n" +
      "  When answering inquiries about certifications, append: " + SCROLL_BUTTONS.certifications + "\n" +
      "  When answering inquiries about experience, append: " + SCROLL_BUTTONS.experience + "\n" +
      "  When answering inquiries about honors/ranks, append: " + SCROLL_BUTTONS.honors + "\n" +
      "  When answering inquiries about contact, append: " + SCROLL_BUTTONS.contact + "\n\n" +
      "BASICS:\n" +
      "Name: " + p.name + " | Location: " + (p.location || "Maharashtra, India") + "\n" +
      "Tagline: " + p.tagline + "\n" +
      "Summary: " + p.summary + "\n" +
      "Email: " + (contact.email || "rohannimje53@gmail.com") + "\n" +
      "LinkedIn: " + (contact.linkedin || "https://www.linkedin.com/in/rohannimje/") + "\n" +
      "GitHub: " + (contact.github || "https://github.com/RohanNimje")
    );

    if (wantsProjects || isGeneral) {
      var projectsList = (ctx.projects || []).map(function (proj) {
        var details = [];
        details.push("ID: " + proj.id);
        details.push("Title: " + proj.title);
        details.push("Tech Stack: " + (proj.techStack || []).join(", "));
        details.push("Description: " + proj.description);
        if (proj.laptopVideoUrl || proj.videoUrl || proj.videoUrlmvp) details.push("Video Demo URL: " + (proj.laptopVideoUrl || proj.videoUrlmvp || proj.videoUrl));
        if (proj.mobileVideoUrl || proj.productDemoUrl) details.push("Product Demo URL: " + (proj.mobileVideoUrl || proj.productDemoUrl));
        if (proj.projectCertImgUrl) details.push("Certificate Image URL: " + proj.projectCertImgUrl);
        if (proj.screenshotUrl) details.push("Screenshot URL: " + proj.screenshotUrl);
        if (proj.highlights && proj.highlights.length) details.push("Highlights: " + proj.highlights.join("; "));
        return details.join("\n  ");
      }).join("\n\n");
      promptParts.push("ALL PROJECTS DATA (EXHAUSTIVE):\n" + projectsList);
    }

    if (wantsCerts || isGeneral) {
      var certsList = (ctx.certifications || []).map(function (c) {
        return "- " + c.name + " | Issuer: " + c.issuer + " | CertImgUrl: " + c.CertImgUrl;
      }).join("\n");
      promptParts.push("ALL CERTIFICATIONS DATA:\n" + certsList);
    }

    if (wantsHonors || isGeneral) {
      var honorsList = (ctx.honors || []).map(function (h) {
        return "- " + h.title + " | Event: " + h.event + " | Description: " + h.description + " | CertImgUrl: " + h.CertImgUrl;
      }).join("\n");
      var metricsList = (ctx.metrics || []).map(function (m) {
        return "- " + m.label + ": " + m.value + " (" + m.description + ")";
      }).join("\n");
      promptParts.push("HONORS & METRICS DATA:\nMetrics:\n" + metricsList + "\nHonors:\n" + honorsList);
    }

    if (wantsExp || isGeneral) {
      var expList = (ctx.experience || []).map(function (e) {
        return "- Role: " + e.role + " | Company: " + e.company + " | Duration: " + e.duration + " | Location: " + e.location + " | Details: " + e.description;
      }).join("\n");
      promptParts.push("EXPERIENCE DATA:\n" + expList);
    }

    if (wantsEdu || isGeneral) {
      var eduList = (ctx.education || []).map(function (e) {
        return "- Degree: " + e.degree + " | Specialization: " + e.specialization + " | Institution: " + e.institution + " | CGPA: " + e.grade + " | Duration: " + e.duration + " | Description: " + e.description;
      }).join("\n");
      promptParts.push("EDUCATION DATA:\n" + eduList);
    }

    if (wantsSkills || isGeneral) {
      var skillsList = Object.keys(ctx.skills || {}).map(function (cat) {
        return cat + ": " + (ctx.skills[cat] || []).join(", ");
      }).join("\n");
      promptParts.push("SKILLS DATA:\n" + skillsList);
    }

    if (wantsPitches) {
      var pitches = ctx.rolePitches || {};
      var pitchBlocks = Object.keys(pitches).map(function (role) {
        var rp = pitches[role];
        return "[" + rp.title + "]\nPitch: " + rp.pitch + "\nHighlights: " + (rp.highlights || []).join(" | ");
      }).join("\n\n");
      promptParts.push("ROLE PITCHES DATA:\n" + pitchBlocks);
    }

    return promptParts.join("\n\n");
  }

  /* ── 3. Server Proxy Call (SSE Streaming) ──────────────────
   * POSTs conversation history and system prompt to /api/chat.
   * Streams tokens via SSE and triggers project modal actions.
   */

  async function callProxyAPIStream(conversationHistory, systemInstruction, onChunk) {
    console.info("[AI Service] Sending streaming request to /api/chat.");

    var res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages:     conversationHistory,
        systemPrompt: systemInstruction,
        stream:       true
      })
    });

    if (!res.ok) {
      throw new Error("Proxy HTTP Error " + res.status);
    }

    if (!res.body) {
      throw new Error("Streaming not supported.");
    }

    var reader = res.body.getReader();
    var decoder = new TextDecoder("utf-8");
    var buffer = "";
    var fullRawText = "";

    while (true) {
      var { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      var lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line || !line.startsWith("data:")) continue;
        var dataStr = line.replace(/^data:\s*/, "");
        if (dataStr === "[DONE]") return fullRawText;

        try {
          var payload = JSON.parse(dataStr);
          if (payload.error) {
            var err = new Error(payload.error);
            err.fullRawText = fullRawText;
            throw err;
          }
          if (payload.chunk) {
            fullRawText += payload.chunk;
            if (typeof onChunk === "function") {
              onChunk(fullRawText, payload.chunk);
            }
          }
        } catch (e) {
          if (e.message && e.message.indexOf("JSON") === -1) {
            e.fullRawText = fullRawText;
            throw e;
          }
        }
      }
    }

    return fullRawText;
  }

  /* ── Conversation History ─────────────────────────────── */
  var _conversationHistory = [];
  var MAX_HISTORY_TURNS = 6;

  function addToHistory(role, text) {
    // Strip internal action tags before storing in conversational history
    var cleanText = String(text || "").replace(/\[\[ACTION:openProjectModal:[^\]]+\]\]/g, "").trim();
    _conversationHistory.push({
      role: role,
      parts: [{ text: cleanText }]
    });
    if (_conversationHistory.length > MAX_HISTORY_TURNS * 2) {
      _conversationHistory = _conversationHistory.slice(-MAX_HISTORY_TURNS * 2);
    }
  }

  /* ── 4. Compact Markdown/HTML Formatter & Sanitizer ────── */

  function sanitiseResponse(text) {
    if (!text || typeof text !== "string") return "";

    // Strip action tags from visible HTML
    var str = text.replace(/\[\[ACTION:openProjectModal:[^\]]+\]\]/g, "").trim();

    // ── Step 1: Headers (### → styled paragraph) ───────────
    str = str.replace(/^#{1,6}\s+(.*?)$/gm, '<p class="font-bold text-slate-800 mt-2.5 mb-1">$1</p>');

    // ── Step 2: Markdown links [label](url) → HTML anchors ──
    str = str.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, function (match, label, url) {
      if (/watch demo|demo video|product demo|video/i.test(label)) {
        return '<a href="' + url + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 transition-colors my-1">🎬 ' + label + '</a>';
      }
      return '<a href="' + url + '" target="_blank" rel="noopener" class="text-indigo-600 font-semibold underline">' + label + '</a>';
    });

    // ── Step 3: Inline bold (**text** → <strong>) ───────────
    str = str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-indigo-700">$1</strong>');

    // ── Step 4: Inline code (`code`) ────────────────────────
    str = str.replace(/`([^`]+)`/g, '<code class="ai-code">$1</code>');

    // ── Step 5: Parse bullet/numbered lists line-by-line ────
    var lines = str.split(/\r?\n/);
    var inList   = false;
    var listType = null;
    var out      = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();

      // Skip blank lines inside a list (Groq/Gemini inter-item padding)
      if (inList && trimmed === "") continue;

      var bulletMatch = line.match(/^\s*[-*\u2022]\s+(.+)$/);
      var numMatch    = line.match(/^\s*(\d+)[.)]\s+(.+)$/);

      // Check if this line contains block-level elements (cards, buttons, divs, images)
      var hasBlockTag = /<(div|button|img|video|form|iframe|section|article)/i.test(line) ||
                        /class="inline-flex/i.test(line) ||
                        /scrollIntoView/i.test(line);

      // Check if a numbered line is actually a prominent title/heading (e.g. "1. ScanZy Rewards...", "1. As a Software Engineer...")
      var isNumberedTitle = false;
      if (numMatch) {
        var numContent = numMatch[2].trim();
        if (numContent.startsWith("<strong") || numContent.startsWith("<p") || hasBlockTag || numContent.length > 180 || /:\s*$/.test(numContent)) {
          isNumberedTitle = true;
        }
      }

      if (hasBlockTag || isNumberedTitle) {
        // Close any active list
        if (inList) {
          out.push(listType === "ul" ? "</ul>" : "</ol>");
          inList = false;
          listType = null;
        }

        if (isNumberedTitle) {
          out.push('<p class="font-bold text-slate-800 mt-2.5 mb-1">' + numMatch[1] + '. ' + numMatch[2] + '</p>');
        } else {
          out.push(line);
        }
      } else if (bulletMatch) {
        if (!inList || listType !== "ul") {
          if (inList) out.push(listType === "ul" ? "</ul>" : "</ol>");
          out.push('<ul class="ai-clean-list">');
          inList   = true;
          listType = "ul";
        }
        var itemContent = bulletMatch[1].trim().replace(/(?:<br\s*\/?>)+$/gi, "");
        out.push("<li>" + itemContent + "</li>");

      } else if (numMatch) {
        if (!inList || listType !== "ol") {
          if (inList) out.push(listType === "ul" ? "</ul>" : "</ol>");
          out.push('<ol class="ai-clean-list ai-clean-list-decimal">');
          inList   = true;
          listType = "ol";
        }
        var itemContent = numMatch[2].trim().replace(/(?:<br\s*\/?>)+$/gi, "");
        out.push("<li>" + itemContent + "</li>");

      } else {
        if (inList) {
          out.push(listType === "ul" ? "</ul>" : "</ol>");
          inList   = false;
          listType = null;
        }
        out.push(line);
      }
    }
    if (inList) out.push(listType === "ul" ? "</ul>" : "</ol>");

    str = out.join("\n");

    // ── Step 6: Un-nest cards, buttons, images from <li>/<ul>/<ol>
    str = str.replace(/<li[^>]*>\s*(<(?:div|button|a\s+class="inline-flex|img|video)[^>]*>[\s\S]*?<\/(?:div|button|a|video)>|<img[^>]*>)\s*<\/li>/gi, "$1");
    str = str.replace(/<ul(\s+class="[^"]*")?>/gi, '<ul class="ai-clean-list">');
    str = str.replace(/<ol(\s+class="[^"]*")?>/gi, '<ol class="ai-clean-list ai-clean-list-decimal">');
    str = str.replace(/<ul[^>]*>\s*<\/ul>/gi, "");
    str = str.replace(/<ol[^>]*>\s*<\/ol>/gi, "");

    // ── Step 7: Clean inner <li> formatting
    str = str.replace(/<li>\s*(?:<br\s*\/?>\s*)+/gi, "<li>");
    str = str.replace(/(?:<br\s*\/?>\s*)+<\/li>/gi, "</li>");
    str = str.replace(/(<strong[^>]*>.*?<\/strong>)\s*<br\s*\/?>\s*/gi, "$1 ");

    // ── Step 8: Clean stray newlines around block tags ───────
    str = str
      .replace(/<\/(ul|ol|li|div|p|button)>\n+/gi, "</$1>")
      .replace(/\n+<(ul|ol|li|div|p|button)/gi, "<$1")
      .replace(/<p>\s*<\/p>/gi, "");

    // ── Step 9: Remaining \n → <br> (non-list prose) ────────
    str = str.replace(/\n/g, "<br>");

    // ── Step 10: Collapse multiple consecutive <br> ───────────
    str = str.replace(/(<br\s*\/?>\s*){2,}/gi, "<br>");

    return str.trim();
  }

  /* ── Main Public Function (Streaming & Action Aware) ───── */

  function sendAIMessage(userText, onChunk) {
    var text = String(userText || "").trim();
    if (!text) {
      if (typeof onChunk === "function") onChunk("Please type a message.", true);
      return Promise.resolve("Please type a message.");
    }

    // 1. Check Local FAQ & Navigation Bridge (0 Tokens, instant reply)
    var localResponse = tryLocalFAQ(text);
    if (localResponse) {
      if (typeof onChunk === "function") onChunk(localResponse, true);
      return Promise.resolve(localResponse);
    }

    // 2. Multi-Provider Pool Availability Check
    if (!window.AI_CONFIG.hasTargets()) {
      var standby = getStandbyErrorCard();
      if (typeof onChunk === "function") onChunk(standby, true);
      return Promise.resolve(standby);
    }

    addToHistory("user", text);

    var systemPrompt = buildDynamicSystemPrompt(text);
    var contents = _conversationHistory.slice();
    var openedModals = {};

    return callProxyAPIStream(contents, systemPrompt, function (fullRawText) {
      // Check for project modal action tag in the live stream (supports numbers & string slugs)
      var modalMatches = fullRawText.matchAll(/\[\[ACTION:openProjectModal:([^\]]+)\]\]/g);
      for (var match of modalMatches) {
        var projectTarget = match[1].trim();
        if (!openedModals[projectTarget]) {
          openedModals[projectTarget] = true;
          if (typeof window.openProjectModal === "function") {
            window.openProjectModal(projectTarget);
          }
        }
      }

      // Live partial HTML formatting
      var partialHtml = sanitiseResponse(fullRawText);
      if (typeof onChunk === "function") {
        onChunk(partialHtml, false);
      }
    })
      .then(function (rawResponse) {
        var html = sanitiseResponse(rawResponse);
        addToHistory("model", rawResponse);
        if (typeof onChunk === "function") {
          onChunk(html, true);
        }
        return html;
      })
      .catch(function (err) {
        if (_conversationHistory.length > 0) _conversationHistory.pop();
        console.error("[AI Service] Streaming failed:", err);

        // Check if we exhausted mid-stream and already have partial text
        if ((err.message && err.message.indexOf("EXHAUSTED_MIDSTREAM") !== -1) || (err.fullRawText && err.fullRawText.trim().length > 0)) {
          var partialHtml = sanitiseResponse(err.fullRawText || "");
          // Cleanly terminate the partial sentence
          if (partialHtml.length > 0 && !/[.!?]$/.test(partialHtml.trim())) {
            partialHtml += ".";
          }
          
          var actionChips = '<div class="mt-4 flex flex-wrap gap-2">' +
            '<button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors cursor-pointer" onclick="sendAIMessage(\'Explore Technical Architecture\', window._aiActiveStreamCallback)">Explore Technical Architecture &rarr;</button>' +
            '<button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm hover:bg-indigo-100 transition-colors cursor-pointer" onclick="sendAIMessage(\'Ask About System Implementation\', window._aiActiveStreamCallback)">Ask About System Implementation</button>' +
            '</div>';
            
          var finalHtml = partialHtml + actionChips;
          if (typeof onChunk === "function") {
             onChunk(finalHtml, true);
          }
          return finalHtml;
        }

        // Initial Handshake Failure
        var standbyCard = getStandbyErrorCard();
        if (typeof onChunk === "function") {
          onChunk(standbyCard, true);
        }
        return standbyCard;
      });
  }

  function resetConversation() {
    _conversationHistory = [];
  }

  /* ── Expose Globals ───────────────────────────────────── */
  window.sendAIMessage = sendAIMessage;
  window.resetAIConversation = resetConversation;

})();
