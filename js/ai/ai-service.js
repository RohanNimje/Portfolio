/**
 * ai-service.js — Multi-Provider (Gemini + Groq) AI Engine with Professional Standby UI
 * -----------------------------------------------------------------------------
 * 1. Multi-Provider Router: Routes requests dynamically to Gemini or Groq endpoints.
 * 2. Zero-Code Model Merging: Hot-reloads target model strings from window.ENV_CONFIG.
 * 3. Multi-Key Failover: Seamlessly rotates from target 1 -> target 2 -> target 3...
 * 4. Executive Standby Card: Displays an elegant standby card on total pool exhaustion.
 * 5. Universal Auto-Scroll Buttons & Compact Sanitizer: Preserved for rich portfolio UX.
 */

(function () {
  "use strict";

  var GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
  var GROQ_API_BASE = "https://api.groq.com/openai/v1/chat/completions";

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
    var p = ctx.personal || {};
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

    // Who is Rohan? / Identity
    if (/^(who is rohan|who is rohan nimje|who are you|about rohan|tell me about rohan|tell me about rohan nimje)$/.test(lower)) {
      return (
        "<strong class=\"font-semibold text-indigo-700\">Rohan Nimje</strong> is an AI Systems Architect & Full-Stack Engineer who loves turning complex tech ideas into fast, real-world solutions.<br>" +
        "He is pursuing his <strong class=\"font-semibold text-indigo-700\">BCA in AI & Machine Learning (8.38 CGPA)</strong> at Shri Shivaji Science College while sharpening his skills via NxtWave's CCBP 4.0 program.<br>" +
        "<ul class=\"list-disc pl-4 space-y-1 text-sm my-1\">" +
        "<li><strong class=\"font-semibold text-indigo-700\">365-Day Streak:</strong> Unbroken daily coding streak on NxtWave Academy</li>" +
        "<li><strong class=\"font-semibold text-indigo-700\">Global Rank 27:</strong> DSA CodeVerse Bi-Weekly Contest #25</li>" +
        "<li><strong class=\"font-semibold text-indigo-700\">Key Builds:</strong> ScanZy Rewards MVP, Trinity X Fraud Detector, AI Agent Ecosystem</li>" +
        "</ul>" +
        SCROLL_BUTTONS.projects
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
        details.push("Title: " + proj.title);
        details.push("Tech Stack: " + (proj.techStack || []).join(", "));
        details.push("Description: " + proj.description);
        if (proj.videoUrl || proj.videoUrlmvp) details.push("Video Demo URL: " + (proj.videoUrlmvp || proj.videoUrl));
        if (proj.productDemoUrl) details.push("Product Demo URL: " + proj.productDemoUrl);
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

  /* ── 3. Multi-Provider API Handlers (Gemini + Groq) ─────── */

  /**
   * Gemini API Endpoint Call
   */
  function callGeminiAPI(target, conversationHistory, systemInstruction) {
    var url = GEMINI_API_BASE + target.model + ":generateContent?key=" + target.key;
    var body = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        responseMimeType: "text/plain"
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
      ]
    };

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Gemini HTTP Error " + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data !== "object") throw new Error("Invalid Gemini response.");
        if (data.promptFeedback && data.promptFeedback.blockReason) {
          throw new Error("Gemini Blocked: " + data.promptFeedback.blockReason);
        }
        var candidate = data.candidates && data.candidates[0];
        if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
          throw new Error("Empty Gemini response candidate.");
        }
        return candidate.content.parts[0].text || "";
      });
  }

  /**
   * Groq OpenAI-Compatible Chat Completions API Call
   */
  function callGroqAPI(target, conversationHistory, systemInstruction) {
    var messages = [
      { role: "system", content: systemInstruction }
    ];

    for (var i = 0; i < conversationHistory.length; i++) {
      var turn = conversationHistory[i];
      var role = turn.role === "user" ? "user" : "assistant";
      var text = (turn.parts && turn.parts[0] && turn.parts[0].text) || "";
      if (text) {
        messages.push({ role: role, content: text });
      }
    }

    var body = {
      model: target.model || "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048
    };

    return fetch(GROQ_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + target.key
      },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Groq HTTP Error " + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data !== "object") throw new Error("Invalid Groq response.");
        var choice = data.choices && data.choices[0];
        if (!choice || !choice.message || !choice.message.content) {
          throw new Error("Empty Groq response content.");
        }
        return choice.message.content || "";
      });
  }

  /**
   * Multi-Provider Failover Dispatcher (Gemini -> Groq -> Target N)
   */
  function callAIWithFailover(conversationHistory, systemInstruction, attempt) {
    attempt = attempt || 0;
    var totalTargets = window.AI_CONFIG.targetCount() || 1;

    if (attempt >= totalTargets + 1) {
      return Promise.reject(new Error("ALL_TARGETS_EXHAUSTED"));
    }

    var target = window.AI_CONFIG.getActiveTarget();
    if (!target || !target.key) {
      return Promise.reject(new Error("NO_TARGETS_AVAILABLE"));
    }

    console.info("[AI Service] Executing request via Provider: " + target.provider + " | Model: " + target.model + " (Group: " + target.group + ")");

    var apiPromise = (target.provider === "groq")
      ? callGroqAPI(target, conversationHistory, systemInstruction)
      : callGeminiAPI(target, conversationHistory, systemInstruction);

    return apiPromise.catch(function (err) {
      console.warn("[AI Service] Target failed (Group: " + target.group + ", Provider: " + target.provider + "). Error: " + err.message + ". Triggering failover...");
      window.AI_CONFIG.markTargetFailed(target);
      return callAIWithFailover(conversationHistory, systemInstruction, attempt + 1);
    });
  }

  /* ── Conversation History ─────────────────────────────── */
  var _conversationHistory = [];
  var MAX_HISTORY_TURNS = 6;

  function addToHistory(role, text) {
    _conversationHistory.push({
      role: role,
      parts: [{ text: text }]
    });
    if (_conversationHistory.length > MAX_HISTORY_TURNS * 2) {
      _conversationHistory = _conversationHistory.slice(-MAX_HISTORY_TURNS * 2);
    }
  }

  /* ── 4. Compact Markdown/HTML Formatter & Sanitizer ────── */

  function sanitiseResponse(text) {
    if (!text || typeof text !== "string") return "";

    var str = text.trim();

    // Headers (### Header -> bold text block)
    str = str.replace(/^#{1,6}\s+(.*?)$/gm, '<p class="font-bold text-slate-800 mt-2 mb-1">$1</p>');

    // Convert Markdown links [label](url) to HTML links
    str = str.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, function (match, label, url) {
      if (/watch demo|demo video|product demo|video/i.test(label)) {
        return '<a href="' + url + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 transition-colors">🎬 ' + label + '</a>';
      }
      return '<a href="' + url + '" target="_blank" rel="noopener" class="text-indigo-600 font-semibold underline">' + label + '</a>';
    });

    // Bold text (**bold**)
    str = str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-indigo-700">$1</strong>');

    // Bullet lists (* item, - item, • item) and numbered lists (1. item)
    var lines = str.split(/\r?\n/);
    var inList = false;
    var listType = null;
    var processedLines = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var bulletMatch = line.match(/^\s*[\*•\-]\s+(.*)$/);
      var numMatch = line.match(/^\s*\d+[\.\)]\s+(.*)$/);

      if (bulletMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          processedLines.push('<ul class="list-disc pl-4 space-y-1 my-1 text-sm">');
          inList = true;
          listType = 'ul';
        }
        processedLines.push('<li>' + bulletMatch[1] + '</li>');
      } else if (numMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          processedLines.push('<ol class="list-decimal pl-4 space-y-1 my-1 text-sm">');
          inList = true;
          listType = 'ol';
        }
        processedLines.push('<li>' + numMatch[1] + '</li>');
      } else {
        if (inList) {
          processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = null;
        }
        processedLines.push(line);
      }
    }
    if (inList) {
      processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
    }

    str = processedLines.join('\n');

    // Clean up line break bloat and empty paragraphs
    str = str
      .replace(/<\/(ul|ol|li|div|p|button)>\n+/gi, '</$1>')
      .replace(/\n+<(ul|ol|li|div|p|button)/gi, '<$1')
      .replace(/(<br\s*\/?>\s*){2,}/gi, '<br>')
      .replace(/<p>\s*<\/p>/gi, '')
      .replace(/\n/g, '<br>');

    return str.trim();
  }

  /* ── Main Public Function ─────────────────────────────── */

  function sendAIMessage(userText) {
    var text = String(userText || "").trim();
    if (!text) return Promise.resolve("Please type a message.");

    // 1. Check Local FAQ & Navigation Bridge (0 Tokens, instant reply)
    var localResponse = tryLocalFAQ(text);
    if (localResponse) {
      return Promise.resolve(localResponse);
    }

    // 2. Multi-Provider Pool Availability Check
    if (!window.AI_CONFIG.hasTargets()) {
      return Promise.resolve(getStandbyErrorCard());
    }

    addToHistory("user", text);

    var systemPrompt = buildDynamicSystemPrompt(text);
    var contents = _conversationHistory.slice();

    // Reset failed targets list if fresh message
    window.AI_CONFIG.resetFailedTargets();

    return callAIWithFailover(contents, systemPrompt, 0)
      .then(function (rawResponse) {
        var html = sanitiseResponse(rawResponse);
        addToHistory("model", rawResponse);
        return html;
      })
      .catch(function (err) {
        if (_conversationHistory.length > 0) _conversationHistory.pop();
        console.error("[AI Service] All provider targets failed:", err);

        // Always display executive standby card on failure (NO raw technical errors!)
        return getStandbyErrorCard();
      });
  }

  function resetConversation() {
    _conversationHistory = [];
  }

  /* ── Expose Globals ───────────────────────────────────── */
  window.sendAIMessage = sendAIMessage;
  window.resetAIConversation = resetConversation;

})();
