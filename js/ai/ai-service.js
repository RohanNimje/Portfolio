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
    projects: '<button onclick="document.getElementById(\'projects\').scrollIntoView({behavior: \'smooth\'})" class="ai-action-chip">🚀 View All Projects</button>',
    certifications: '<button onclick="document.getElementById(\'certifications\').scrollIntoView({behavior: \'smooth\'})" class="ai-action-chip">📜 View All Certifications</button>',
    experience: '<button onclick="document.getElementById(\'experience\').scrollIntoView({behavior: \'smooth\'})" class="ai-action-chip">💼 View Full Experience</button>',
    honors: '<button onclick="document.getElementById(\'honors\').scrollIntoView({behavior: \'smooth\'})" class="ai-action-chip">🏆 View All Honors & Ranks</button>',
    contact: '<button onclick="document.getElementById(\'contact\').scrollIntoView({behavior: \'smooth\'})" class="ai-action-chip">📬 Get in Touch</button>'
  };

  /* ── Executive Standby Error Card (No Raw Errors) ────── */

  function getStandbyErrorCard() {
    return (
      '<div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 my-1">' +
      '<div class="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">' +
      '<span>⚡ Assistant Momentarily Busy</span>' +
      '</div>' +
      '<p class="text-xs text-slate-600 leading-relaxed margin-0">' +
      'Rohan\'s AI representative is currently receiving high inquiry traffic. You can explore his featured projects or connect with him directly below.' +
      '</p>' +
      '<div class="ai-action-container">' +
      '<button onclick="document.getElementById(\'contact\').scrollIntoView({behavior: \'smooth\'})" class="ai-action-chip">📬 Contact Rohan Directly</button>' +
      '<button onclick="document.getElementById(\'projects\').scrollIntoView({behavior: \'smooth\'})" class="ai-action-chip">🚀 View Featured Projects</button>' +
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
        "Scrolling you directly to <strong class=\"font-semibold\">Featured Projects</strong> section in the portfolio!" +
        '<div class="ai-action-container">' + SCROLL_BUTTONS.projects + '</div>'
      );
    }

    if (/go to cert|scroll to cert|take me to cert|show cert|view all cert|certifications section/i.test(raw)) {
      scrollToSection("certifications");
      return (
        "Navigating to the <strong class=\"font-semibold\">Certifications</strong> section!" +
        '<div class="ai-action-container">' + SCROLL_BUTTONS.certifications + '</div>'
      );
    }

    if (/go to experience|scroll to experience|take me to experience|show experience|full experience|experience section/i.test(raw)) {
      scrollToSection("experience");
      return (
        "Scrolling to the <strong class=\"font-semibold\">Experience</strong> section!" +
        '<div class="ai-action-container">' + SCROLL_BUTTONS.experience + '</div>'
      );
    }

    if (/go to honors|scroll to honors|take me to honors|show honors|view honors|ranks section|achievements section/i.test(raw)) {
      scrollToSection("honors");
      return (
        "Navigating to <strong class=\"font-semibold\">Honors & Achievements</strong>!" +
        '<div class="ai-action-container">' + SCROLL_BUTTONS.honors + '</div>'
      );
    }

    if (/go to contact|scroll to contact|take me to contact|show contact|get in touch/i.test(raw)) {
      scrollToSection("contact");
      return (
        "Navigating to the <strong class=\"font-semibold\">Contact & Connect</strong> section!" +
        '<div class="ai-action-container">' + SCROLL_BUTTONS.contact + '</div>'
      );
    }

    // Basic greetings
    if (/^(hi|hello|hey|namaste|hola|good morning|good afternoon|good evening|whats up|what is up)$/.test(lower)) {
      return (
        "Hello! I am <strong class=\"font-semibold\">Rohan Nimje's Personal AI Representative</strong>. " +
        "How can I help you today? You can ask about his projects, skills, certifications, experience, or how to get in touch!"
      );
    }

    // Math & arithmetic queries (Token Protection: Zero-Explanation & Immediate Pivot)
    if (/^(what\s+is\s+|calculate\s+|solve\s+)?\s*\d+\s*[\+\-\*\/\^%]\s*\d+[\s\d\+\-\*\/\^%]*\??$/i.test(raw)) {
      return (
        "I'm exclusively dedicated to discussing Rohan's engineering work and systems. Would you like to explore his AI skincare analyzer Cosmolyze, or check out his GovTech fraud detector Trinity X?" +
        '<div class="ai-action-container">' + SCROLL_BUTTONS.projects + '</div>'
      );
    }

    // Quick links / Contact
    if (/^(contact|contact rohan|show links|links|email|linkedin|github|reach rohan|how to reach rohan)$/.test(lower)) {
      return (
        "Here are the best ways to reach and connect with <strong class=\"font-semibold\">Rohan Nimje</strong>:<br>" +
        "<ul class=\"list-disc pl-4 space-y-1 text-sm my-1\">" +
        "<li><strong class=\"font-semibold\">Email:</strong> <a href=\"mailto:" + (contact.email || "rohannimje53@gmail.com") + "\" class=\"text-indigo-600 font-semibold underline\">" + (contact.email || "rohannimje53@gmail.com") + "</a></li>" +
        "<li><strong class=\"font-semibold\">LinkedIn:</strong> <a href=\"" + (contact.linkedin || "https://www.linkedin.com/in/rohannimje/") + "\" target=\"_blank\" rel=\"noopener\" class=\"text-indigo-600 font-semibold underline\">linkedin.com/in/rohannimje</a></li>" +
        "<li><strong class=\"font-semibold\">GitHub:</strong> <a href=\"" + (contact.github || "https://github.com/RohanNimje") + "\" target=\"_blank\" rel=\"noopener\" class=\"text-indigo-600 font-semibold underline\">github.com/RohanNimje</a></li>" +
        "</ul>" +
        '<div class="ai-action-container">' + SCROLL_BUTTONS.contact + '</div>'
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
    var behavior = ctx.agentBehavior || {};
    var query = String(userQuery || "").toLowerCase();

    var wantsProjects = /project|build|app|scanzy|trinity|cosmolyze|sparky|agent|bot|automation|demo|video|watch|code|system|mcp|portfolio|work|product|mvp|screenshot|loyalty|skincare|infrastructure|fraud|qr|reward/i.test(query);
    var wantsCerts = /certificat|credential|course|nxtwave|aws|salesforce|microsoft|python|sql|html|css|bootstrap|flexbox|xpm|learning/i.test(query);
    var wantsHonors = /honor|achievement|hackathon|award|rank|codeverse|qualifier|contest|competition|streak|winner|innovators|buildathon|finalist/i.test(query);
    var wantsExp = /experience|work|job|role|trainee|company|nxtwave|career|employment|position/i.test(query);
    var wantsEdu = /education|college|university|degree|bca|cgpa|grade|study|studying|school|sgbau|shivaji/i.test(query);
    var wantsSkills = /skill|tech|stack|language|framework|python|javascript|react|node|sql|mongodb|supabase|n8n|tool|expert|capabilit/i.test(query);
    var wantsContact = /contact|email|linkedin|github|reach|connect|hire|message/i.test(query);
    var wantsMetrics = /metric|streak|365|week|latency|speed|performance|stat|number/i.test(query);

    var isGeneral = !wantsProjects && !wantsCerts && !wantsHonors && !wantsExp && !wantsEdu && !wantsSkills && !wantsContact;

    var promptParts = [];

    // ── Core system identity & guardrails block ──
    promptParts.push(
      "CRITICAL GUARDRAIL (ZERO-EXPLANATION & IMMEDIATE PIVOT FOR TOKEN PROTECTION):\n" +
      "If the user asks ANY off-topic or generic query (such as math like '2+2', tech/concept tutorials or definitions like 'What is LangGraph', movies, trivia, weather, or general coding help unrelated to Rohan):\n" +
      "- Strictly DO NOT explain, define, solve, or teach the concept. Zero tutorials.\n" +
      "- Politely decline in exactly ONE single sentence stating your exclusive focus on Rohan's engineering work and systems.\n" +
      "- Immediately follow up in that same single response with an engaging question inviting the user to explore Rohan's work (e.g. \"I'm exclusively dedicated to discussing Rohan's engineering work and systems. Would you like to explore his AI skincare analyzer Cosmolyze, or check out his GovTech fraud detector Trinity X?\").\n\n" +
      "SUBTLE & EXECUTIVE HIGHLIGHTING RULE:\n" +
      "- Do NOT over-color or bold every piece of text, tool name, or buzzword.\n" +
      "- Keep typography clean, understated, and executive.\n" +
      "- Normal narrative sentences must stay regular font weight.\n" +
      "- Use <strong class=\"font-semibold\"> ONLY for primary section anchors/titles or key standalone metrics (e.g., '365+ Days', 'Top 0.5%'). Never apply color classes to strong tags.\n\n" +
      "IDENTITY: " + (behavior.identity || "You are Rohan Nimje's personal AI assistant.") + "\n" +
      "PERSONA: " + (behavior.persona || "Professional, warm, confident, minimalist executive tone.") + "\n" +
      "LANGUAGE RULE: " + (behavior.languageRule || "Match user's language automatically.") + "\n" +
      "CONVERSATION RULE: " + (behavior.conversationRule || "After on-topic responses, end with one smart follow-up question.") + "\n" +
      "OFF-TOPIC RULE: " + (behavior.offTopicRule || "Politely decline off-topic queries in 1 sentence and pivot immediately to Rohan's work.") + "\n" +
      "FORMAT RULE: " + (behavior.formatRule || "Mix short paragraphs with bullet points. Keep vertical spacing compact.") + "\n" +
      "HTML RULE: " + (behavior.htmlRule || "Use clean HTML formatting only, no markdown asterisks.") + "\n" +
      "HONESTY: " + (behavior.honesty || "Never fabricate facts.") + "\n\n" +
      "PROJECT MODAL TRIGGER — When user asks to see/open/watch a project, append the action tag:\n" +
      "  ScanZy Rewards: [[ACTION:openProjectModal:1]]\n" +
      "  Cosmolyze: [[ACTION:openProjectModal:2]]\n" +
      "  Trinity X: [[ACTION:openProjectModal:3]]\n" +
      "  Sparky: [[ACTION:openProjectModal:4]]\n" +
      "  Business Workflow Engine: [[ACTION:openProjectModal:5]]\n" +
      "  Smart Hackathon Bot: [[ACTION:openProjectModal:6]]\n\n" +
      "AUTO-SCROLL BUTTONS — Append these when relevant:\n" +
      "  Projects section: " + SCROLL_BUTTONS.projects + "\n" +
      "  Certifications section: " + SCROLL_BUTTONS.certifications + "\n" +
      "  Experience section: " + SCROLL_BUTTONS.experience + "\n" +
      "  Honors section: " + SCROLL_BUTTONS.honors + "\n" +
      "  Contact section: " + SCROLL_BUTTONS.contact + "\n\n" +
      "ROHAN'S PROFILE:\n" +
      "Name: " + p.fullName + "\n" +
      "Location: " + (p.location || "Maharashtra, India") + "\n" +
      "Tagline: " + (p.tagline || "") + "\n" +
      "Summary: " + (p.summary || "") + "\n" +
      "Email: " + (p.email || "rohannimje53@gmail.com") + "\n" +
      "LinkedIn: " + (p.linkedin || "https://www.linkedin.com/in/rohannimje/") + "\n" +
      "GitHub: " + (p.github || "https://github.com/RohanNimje")
    );

    if (wantsProjects || isGeneral) {
      var projectsList = (ctx.projects || []).map(function (proj) {
        var d = [];
        d.push("ID: " + proj.id + " | Name: " + (proj.title || proj.name));
        d.push("Role: " + (proj.role || "Builder"));
        d.push("Domain: " + (proj.domain || ""));
        d.push("Tech Stack: " + (proj.techStack || []).join(", "));
        if (proj.badge) d.push("Badge: " + proj.badge);
        if (proj.problem) d.push("Problem Solved: " + proj.problem);
        if (proj.whyExistingFail) d.push("Why Existing Solutions Failed: " + proj.whyExistingFail);
        if (proj.solution) d.push("Solution: " + proj.solution);
        if (proj.howItWorks) d.push("How It Works: " + proj.howItWorks);
        if (proj.coreInnovation) d.push("Core Innovation: " + proj.coreInnovation);
        if (proj.description) d.push("Description: " + proj.description);
        if (proj.architecture && proj.architecture.length) d.push("Architecture: " + proj.architecture.join(" | "));
        if (proj.businessImpact && proj.businessImpact.length) d.push("Business Impact: " + proj.businessImpact.join(" | "));
        if (proj.achievement) d.push("Achievement: " + proj.achievement);
        if (proj.laptopVideoUrl || proj.videoUrl || proj.videoUrlMvp) d.push("Video Demo URL: " + (proj.laptopVideoUrl || proj.videoUrlMvp || proj.videoUrl));
        if (proj.mobileVideoUrl || proj.productDemoUrl) d.push("Product Demo URL: " + (proj.mobileVideoUrl || proj.productDemoUrl));
        if (proj.projectCertImgUrl) d.push("Certificate Image: " + proj.projectCertImgUrl);
        if (proj.screenshotUrl) d.push("Screenshot: " + proj.screenshotUrl);
        return d.join("\n  ");
      }).join("\n\n");
      promptParts.push("PROJECTS KNOWLEDGE BASE:\n" + projectsList);
    }

    if (wantsCerts || isGeneral) {
      var certsList = (ctx.certifications || []).map(function (c) {
        return "- " + c.name + " | Issuer: " + c.issuer + " | CertImgUrl: " + c.CertImgUrl;
      }).join("\n");
      promptParts.push("CERTIFICATIONS:\n" + certsList);
    }

    if (wantsHonors || wantsMetrics || isGeneral) {
      var metricsList = (ctx.metrics || []).map(function (m) {
        return "- " + m.label + ": " + m.value + " — " + m.detail;
      }).join("\n");
      var honorsList = (ctx.honors || []).map(function (h) {
        return "- " + h.title + " | Event: " + h.event + " | Standing: " + (h.standing || "") + " | Description: " + (h.description || "") + " | CertImgUrl: " + h.CertImgUrl;
      }).join("\n");
      promptParts.push("KEY METRICS:\n" + metricsList + "\n\nHONORS & ACHIEVEMENTS:\n" + honorsList);
    }

    if (wantsExp || isGeneral) {
      var expList = (ctx.experience || []).map(function (e) {
        return "- Role: " + e.role + " | Company: " + e.company + " | Duration: " + e.duration + " | Location: " + e.location + " | Details: " + (e.description || "");
      }).join("\n");
      promptParts.push("EXPERIENCE:\n" + expList);
    }

    if (wantsEdu || isGeneral) {
      var eduList = (ctx.education || []).map(function (e) {
        return "- Degree: " + e.degree + " | Specialization: " + e.specialization + " | Institution: " + e.institution + (e.grade ? " | CGPA: " + e.grade : "") + " | Duration: " + e.duration + " | Details: " + (e.description || "");
      }).join("\n");
      promptParts.push("EDUCATION:\n" + eduList);
    }

    if (wantsSkills || isGeneral) {
      var skillsList = Object.keys(ctx.skills || {}).map(function (cat) {
        return cat + ": " + (ctx.skills[cat] || []).join(", ");
      }).join("\n");
      promptParts.push("SKILLS:\n" + skillsList);
    }

    if (wantsContact) {
      promptParts.push(
        "CONTACT:\nEmail: " + (p.email || "rohannimje53@gmail.com") +
        "\nLinkedIn: " + (p.linkedin || "https://www.linkedin.com/in/rohannimje/") +
        "\nGitHub: " + (p.github || "https://github.com/RohanNimje")
      );
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
        messages: conversationHistory,
        systemPrompt: systemInstruction,
        stream: true
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
    str = str.replace(/^#{1,6}\s+(.*?)$/gm, '<p class="font-bold mt-1.5 mb-1">$1</p>');

    // ── Step 2: Markdown links [label](url) → HTML anchors ──
    str = str.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, function (match, label, url) {
      if (/watch demo|demo video|product demo|video/i.test(label)) {
        return '<a href="' + url + '" target="_blank" rel="noopener" class="ai-action-chip">🎬 ' + label + '</a>';
      }
      return '<a href="' + url + '" target="_blank" rel="noopener" class="text-indigo-600 font-semibold underline">' + label + '</a>';
    });

    // ── Step 3: Inline bold (**text** → <strong>) ───────────
    str = str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

    // ── Step 4: Inline code (`code`) ────────────────────────
    str = str.replace(/`([^`]+)`/g, '<code class="ai-code">$1</code>');

    // ── Step 5: Parse bullet/numbered lists line-by-line ────
    var lines = str.split(/\r?\n/);
    var inList = false;
    var listType = null;
    var out = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();

      // Skip blank lines inside a list (Groq/Gemini inter-item padding)
      if (inList && trimmed === "") continue;

      var bulletMatch = line.match(/^\s*[-*\u2022]\s+(.+)$/);
      var numMatch = line.match(/^\s*(\d+)[.)]\s+(.+)$/);

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
          out.push('<p class="font-bold mt-1.5 mb-1">' + numMatch[1] + '. ' + numMatch[2] + '</p>');
        } else {
          out.push(line);
        }
      } else if (bulletMatch) {
        if (!inList || listType !== "ul") {
          if (inList) out.push(listType === "ul" ? "</ul>" : "</ol>");
          out.push('<ul class="ai-clean-list">');
          inList = true;
          listType = "ul";
        }
        var itemContent = bulletMatch[1].trim().replace(/(?:<br\s*\/?>)+$/gi, "");
        out.push("<li>" + itemContent + "</li>");

      } else if (numMatch) {
        if (!inList || listType !== "ol") {
          if (inList) out.push(listType === "ul" ? "</ul>" : "</ol>");
          out.push('<ol class="ai-clean-list ai-clean-list-decimal">');
          inList = true;
          listType = "ol";
        }
        var itemContent = numMatch[2].trim().replace(/(?:<br\s*\/?>)+$/gi, "");
        out.push("<li>" + itemContent + "</li>");

      } else {
        if (inList) {
          out.push(listType === "ul" ? "</ul>" : "</ol>");
          inList = false;
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

    // ── Step 11: Wrap consecutive action chips in a container ──
    str = str.replace(/(?:<(?:button|a)[^>]*class="[^"]*ai-action-chip[^"]*"[^>]*>[\s\S]*?<\/(?:button|a)>(?:\s|<br\s*\/?>)*)+/gi, function (match) {
      var cleanMatch = match.replace(/<br\s*\/?>/gi, '').trim();
      return '<div class="ai-action-container">' + cleanMatch + '</div>';
    });

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

          var actionChips = '<div class="ai-action-container">' +
            '<button type="button" class="ai-action-chip" onclick="sendAIMessage(\'Explore Technical Architecture\', window._aiActiveStreamCallback)">Explore Technical Architecture &rarr;</button>' +
            '<button type="button" class="ai-action-chip" onclick="sendAIMessage(\'Ask About System Implementation\', window._aiActiveStreamCallback)">Ask About System Implementation</button>' +
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
