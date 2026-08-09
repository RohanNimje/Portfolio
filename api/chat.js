/**
 * api/chat.js — Vercel Serverless Function & Express-compatible Handler
 * -----------------------------------------------------------------------
 * Works as:
 *   - A Vercel Serverless Function (exports default handler)
 *   - A plain Express middleware (module.exports for server.js)
 *
 * Reads API keys from process.env (never exposed to the browser).
 * Handles multi-provider failover: Gemini → Groq → next target.
 *
 * Expected request body:
 *   { messages: [...], systemPrompt: "..." }
 *
 * Response:
 *   { reply: "..." }  on success
 *   { error: "..." }  on failure
 */

"use strict";

/* ── Constants ─────────────────────────────────────────────── */
var GEMINI_BASE      = "https://generativelanguage.googleapis.com/v1beta/models/";
var GROQ_BASE        = "https://api.groq.com/openai/v1/chat/completions";
var FETCH_TIMEOUT_MS = 4000;   // Per-provider attempt timeout (ms)
var TOTAL_TIMEOUT_MS = 12000;  // Outer hard deadline for the whole request (ms)

/* ── Timeout-aware Fetch ────────────────────────────────────── */
/**
 * Wraps native fetch() with an AbortController timeout.
 * Throws an AbortError if the upstream doesn't respond within timeoutMs.
 */
async function fetchWithTimeout(url, options, timeoutMs) {
  var controller = new AbortController();
  var timer = setTimeout(function () {
    controller.abort();
  }, timeoutMs || FETCH_TIMEOUT_MS);

  try {
    var res = await fetch(url, Object.assign({}, options, { signal: controller.signal }));
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/* ── Provider Discovery ─────────────────────────────────────── */
var ORDINAL_MAP = {
  first: 1, second: 2, third: 3, fourth: 4,
  fifth: 5, sixth: 6, seventh: 7, eighth: 8
};

function detectProvider(key, configured) {
  if (configured && typeof configured === "string") {
    var p = configured.trim().toLowerCase();
    if (p === "groq" || p === "gemini") return p;
  }
  if (key && String(key).indexOf("gsk_") === 0) return "groq";
  return "gemini";
}

function defaultModel(provider) {
  return provider === "groq" ? "llama-3.3-70b-versatile" : "gemini-2.5-flash";
}

/**
 * Reads process.env for keys named first_KEY / first_MODEL / first_PROVIDER
 * (second_*, third_*, …) and returns sorted target array.
 */
function discoverTargets() {
  var env = process.env;
  var groups = {};

  Object.keys(env).forEach(function (k) {
    var val = env[k];
    if (!val || val.trim().length < 5) return;
    var idx = k.indexOf("_");
    if (idx <= 0) return;

    var prefix = k.substring(0, idx).toLowerCase();
    var suffix = k.substring(idx + 1).toUpperCase();

    // Only handle known ordinal prefixes
    if (ORDINAL_MAP[prefix] === undefined) return;

    if (!groups[prefix]) groups[prefix] = { prefix: prefix };

    if (suffix === "KEY" || suffix === "API_KEY") {
      groups[prefix].key = val.trim();
    } else if (suffix === "MODEL" || suffix === "MODEL_NAME") {
      groups[prefix].model = val.trim();
    } else if (suffix === "PROVIDER") {
      groups[prefix].provider = val.trim().toLowerCase();
    }
  });

  var targets = [];
  Object.keys(groups).forEach(function (prefix) {
    var g = groups[prefix];
    if (!g.key) return;
    var provider = detectProvider(g.key, g.provider);
    var model    = g.model || defaultModel(provider);
    targets.push({
      group:    prefix,
      key:      g.key,
      model:    model,
      provider: provider,
      priority: ORDINAL_MAP[prefix] || 99
    });
  });

  targets.sort(function (a, b) { return a.priority - b.priority; });
  return targets;
}

/* ── Gemini API Call ────────────────────────────────────────── */
async function callGemini(target, messages, systemPrompt) {
  var url  = GEMINI_BASE + target.model + ":generateContent?key=" + target.key;
  var body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: messages,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: "text/plain"
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH",        threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",  threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT",  threshold: "BLOCK_ONLY_HIGH" }
    ]
  };

  var res = await fetchWithTimeout(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body)
  }, FETCH_TIMEOUT_MS);

  if (!res.ok) throw new Error("Gemini HTTP " + res.status + " (" + target.model + ")");

  var data = await res.json();
  if (data.promptFeedback && data.promptFeedback.blockReason) {
    throw new Error("Gemini blocked: " + data.promptFeedback.blockReason);
  }
  var candidate = data.candidates && data.candidates[0];
  if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
    throw new Error("Empty Gemini candidate.");
  }
  return candidate.content.parts[0].text || "";
}

/* ── Groq API Call ──────────────────────────────────────────── */
async function callGroq(target, messages, systemPrompt) {
  // Convert Gemini-style {role, parts:[{text}]} to OpenAI-style {role, content}
  var oaiMessages = [{ role: "system", content: systemPrompt }];
  messages.forEach(function (turn) {
    var role    = turn.role === "user" ? "user" : "assistant";
    var content = (turn.parts && turn.parts[0] && turn.parts[0].text) || "";
    if (content) oaiMessages.push({ role: role, content: content });
  });

  var body = {
    model:       target.model || "llama-3.3-70b-versatile",
    messages:    oaiMessages,
    temperature: 0.7,
    max_tokens:  2048
  };

  var res = await fetchWithTimeout(GROQ_BASE, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": "Bearer " + target.key
    },
    body: JSON.stringify(body)
  }, FETCH_TIMEOUT_MS);

  if (!res.ok) throw new Error("Groq HTTP " + res.status + " (" + target.model + ")");

  var data   = await res.json();
  var choice = data.choices && data.choices[0];
  if (!choice || !choice.message || !choice.message.content) {
    throw new Error("Empty Groq response.");
  }
  return choice.message.content || "";
}

/* ── Failover Dispatcher ────────────────────────────────────── */
async function callWithFailover(messages, systemPrompt) {
  var targets = discoverTargets();
  if (targets.length === 0) throw new Error("NO_TARGETS_CONFIGURED");

  var failed = {};
  for (var i = 0; i < targets.length; i++) {
    var t = targets[i];
    if (failed[t.key]) continue;

    console.log("[api/chat] Trying " + t.provider + " | " + t.model + " (group: " + t.group + ")");
    try {
      var reply = t.provider === "groq"
        ? await callGroq(t, messages, systemPrompt)
        : await callGemini(t, messages, systemPrompt);
      return reply;
    } catch (err) {
      var reason = err.name === "AbortError" ? "timeout (" + FETCH_TIMEOUT_MS + "ms)" : err.message;
      console.warn("[api/chat] Target failed (" + t.group + "): " + reason + ". Rotating...");
      failed[t.key] = true;
    }
  }

  throw new Error("ALL_TARGETS_EXHAUSTED");
}

/* ── CORS Helper ────────────────────────────────────────────── */
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/* ── Request Body Parser ────────────────────────────────────── */
function parseBody(req) {
  return new Promise(function (resolve, reject) {
    // If body is already parsed (Express with bodyParser), use it directly
    if (req.body) return resolve(req.body);

    var raw = "";
    req.on("data", function (chunk) { raw += chunk.toString(); });
    req.on("end",  function () {
      try { resolve(JSON.parse(raw || "{}")); }
      catch (e) { reject(new Error("Invalid JSON body")); }
    });
    req.on("error", reject);
  });
}

/* ── Main Handler ───────────────────────────────────────────── */
async function handler(req, res) {
  setCORSHeaders(res);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    var body         = await parseBody(req);
    var messages     = body.messages     || [];
    var systemPrompt = body.systemPrompt || "You are a helpful assistant.";

    // Outer deadline: if all failovers together exceed TOTAL_TIMEOUT_MS, give up cleanly
    var timeoutPromise = new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error("TOTAL_TIMEOUT_EXCEEDED"));
      }, TOTAL_TIMEOUT_MS);
    });

    var reply = await Promise.race([callWithFailover(messages, systemPrompt), timeoutPromise]);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ reply: reply }));
  } catch (err) {
    console.error("[api/chat] Fatal error:", err.message);
    var statusCode = err.message === "TOTAL_TIMEOUT_EXCEEDED" ? 503 : 500;
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message || "Internal server error" }));
  }
}

/* ── Exports ────────────────────────────────────────────────── */
// Vercel expects a default export
module.exports = handler;
module.exports.default = handler;
