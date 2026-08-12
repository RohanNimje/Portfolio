/**
 * api/chat.js — Vercel Serverless Function & Express-compatible Handler
 * -----------------------------------------------------------------------
 * Works as:
 *   - A Vercel Serverless Function (exports default handler)
 *   - A plain Express middleware (module.exports for server.js)
 *
 * Reads API keys from process.env (never exposed to the browser).
 * Handles multi-provider failover: Gemini → Groq → next target.
 * Supports:
 *   - Real-Time Token Streaming via Server-Sent Events (SSE)
 *   - Non-streaming JSON fallback
 *
 * Expected request body:
 *   { messages: [...], systemPrompt: "...", stream: true }
 *
 * SSE Response:
 *   data: {"chunk":"..."}
 *   ...
 *   data: [DONE]
 */

"use strict";

/* ── Constants ─────────────────────────────────────────────── */
var GEMINI_STREAM_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
var GEMINI_BASE        = "https://generativelanguage.googleapis.com/v1beta/models/";
var GROQ_BASE          = "https://api.groq.com/openai/v1/chat/completions";
var FETCH_TIMEOUT_MS   = 5000;   // Per-provider attempt timeout (ms)
var TOTAL_TIMEOUT_MS   = 15000;  // Outer hard deadline for the whole request (ms)

/* ── Timeout-aware Fetch ────────────────────────────────────── */
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
    if (p === "gemini") return "gemini";
    // Everything else (groq, anthropic, openrouter) assumes openai_compatible
    return "openai_compatible";
  }
  if (key && String(key).indexOf("gsk_") === 0) return "openai_compatible";
  return "gemini";
}

function defaultModel(provider) {
  return provider === "openai_compatible" ? "llama-3.3-70b-versatile" : "gemini-2.5-flash";
}

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

    if (ORDINAL_MAP[prefix] === undefined) return;

    if (!groups[prefix]) groups[prefix] = { prefix: prefix };

    if (suffix === "KEY" || suffix === "API_KEY") {
      groups[prefix].key = val.trim();
    } else if (suffix === "MODEL" || suffix === "MODEL_NAME") {
      groups[prefix].model = val.trim();
    } else if (suffix === "PROVIDER") {
      groups[prefix].provider = val.trim().toLowerCase();
    } else if (suffix === "BASE_URL" || suffix === "ENDPOINT") {
      groups[prefix].baseUrl = val.trim();
    }
  });

  var targets = [];
  Object.keys(groups).forEach(function (prefix) {
    var g = groups[prefix];
    if (!g.key) return;
    var provider = detectProvider(g.key, g.provider);
    var model    = g.model || defaultModel(provider);
    var baseUrl  = g.baseUrl || (provider === "openai_compatible" ? "https://api.groq.com/openai/v1/chat/completions" : "");
    targets.push({
      group:    prefix,
      key:      g.key,
      model:    model,
      provider: provider,
      baseUrl:  baseUrl,
      priority: ORDINAL_MAP[prefix] || 99
    });
  });

  targets.sort(function (a, b) { return a.priority - b.priority; });
  return targets;
}

/* ── Stream Line Parser Helper ──────────────────────────────── */
async function processSSEStream(response, onChunk) {
  if (!response.body) throw new Error("No response body to stream.");

  var reader = response.body.getReader();
  var decoder = new TextDecoder("utf-8");
  var buffer = "";

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
      if (dataStr === "[DONE]") return;

      try {
        var parsed = JSON.parse(dataStr);
        onChunk(parsed);
      } catch (e) {}
    }
  }

  if (buffer.trim().startsWith("data:")) {
    var trailingData = buffer.trim().replace(/^data:\s*/, "");
    if (trailingData !== "[DONE]") {
      try { onChunk(JSON.parse(trailingData)); } catch (e) {}
    }
  }
}

/* ── Dynamic Provider Adapters ──────────────────────────────── */
var PROVIDER_ADAPTERS = {
  gemini: async function(target, messages, systemPrompt, onToken) {
    var url = GEMINI_STREAM_BASE + target.model + ":streamGenerateContent?alt=sse&key=" + target.key;
    var body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
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

    await processSSEStream(res, function (data) {
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        var parts = data.candidates[0].content.parts;
        for (var p = 0; p < parts.length; p++) {
          if (parts[p].text) {
            onToken(parts[p].text);
          }
        }
      }
    });
  },

  openai_compatible: async function(target, messages, systemPrompt, onToken) {
    var oaiMessages = [{ role: "system", content: systemPrompt }];
    messages.forEach(function (turn) {
      var role    = turn.role === "user" ? "user" : "assistant";
      var content = (turn.parts && turn.parts[0] && turn.parts[0].text) || "";
      if (content) oaiMessages.push({ role: role, content: content });
    });

    var body = {
      model:       target.model,
      messages:    oaiMessages,
      stream:      true,
      temperature: 0.7,
      max_tokens:  2048
    };

    var res = await fetchWithTimeout(target.baseUrl, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": "Bearer " + target.key
      },
      body: JSON.stringify(body)
    }, FETCH_TIMEOUT_MS);

    if (!res.ok) throw new Error("OpenAI-Compatible HTTP " + res.status + " (" + target.model + ")");

    await processSSEStream(res, function (data) {
      if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
        onToken(data.choices[0].delta.content);
      }
    });
  }
};

/* ── Streaming Failover Dispatcher ──────────────────────────── */
async function callWithFailoverStream(messages, systemPrompt, onToken) {
  var targets = discoverTargets();
  if (targets.length === 0) throw new Error("NO_TARGETS_CONFIGURED");

  var failed = {};
  var accumulatedText = "";
  var hasYieldedAtAll = false;

  for (var i = 0; i < targets.length; i++) {
    var t = targets[i];
    if (failed[t.key]) continue;

    console.log("[api/chat] Trying " + t.provider + " | " + t.model + " (group: " + t.group + ")");
    
    var currentHasYielded = false;
    var currentSystemPrompt = systemPrompt;
    var currentMessages = messages.slice();

    // Context-Aware State Handoff
    if (hasYieldedAtAll && accumulatedText.length > 0) {
      currentMessages.push({
        role: "assistant",
        parts: [{ text: accumulatedText }]
      });
      currentMessages.push({
        role: "user",
        parts: [{ text: "Your previous response was interrupted due to a network error. Please continue writing your response seamlessly from exactly the last word you wrote. Do NOT apologize, do NOT repeat what you already said, and do NOT add conversational filler. Just resume the exact sentence seamlessly." }]
      });
    }

    try {
      var tokenWrapper = function (token) {
        hasYieldedAtAll = true;
        currentHasYielded = true;
        accumulatedText += token;
        onToken(token);
      };

      var adapter = PROVIDER_ADAPTERS[t.provider];
      if (!adapter) throw new Error("No adapter for provider: " + t.provider);

      await adapter(t, currentMessages, currentSystemPrompt, tokenWrapper);
      return; // Stream finished successfully
    } catch (err) {
      var reason = err.name === "AbortError" ? "timeout (" + FETCH_TIMEOUT_MS + "ms)" : err.message;
      console.warn("[api/chat] Target failed (" + t.group + "): " + reason + ". Rotating immediately...");
      failed[t.key] = true;
      // Loop continues instantly to the next provider
    }
  }

  // Exhaustion States
  if (hasYieldedAtAll) {
    throw new Error("EXHAUSTED_MIDSTREAM: " + accumulatedText.length + " chars sent.");
  } else {
    throw new Error("EXHAUSTED_INITIAL");
  }
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
    var isStream     = body.stream !== false; // Default to streaming

    if (isStream) {
      res.writeHead(200, {
        "Content-Type":  "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection":    "keep-alive",
        "X-Accel-Buffering": "no"
      });

      var streamDone = false;

      var timeoutTimer = setTimeout(function () {
        if (!streamDone) {
          try {
            res.write("data: " + JSON.stringify({ error: "TOTAL_TIMEOUT_EXCEEDED" }) + "\n\n");
            res.end();
          } catch (e) {}
        }
      }, TOTAL_TIMEOUT_MS);

      try {
        await callWithFailoverStream(messages, systemPrompt, function (token) {
          if (!streamDone) {
            res.write("data: " + JSON.stringify({ chunk: token }) + "\n\n");
          }
        });
        streamDone = true;
        clearTimeout(timeoutTimer);
        res.write("data: [DONE]\n\n");
        res.end();
      } catch (err) {
        streamDone = true;
        clearTimeout(timeoutTimer);
        res.write("data: " + JSON.stringify({ error: err.message || "Failed to generate reply" }) + "\n\n");
        res.end();
      }

    } else {
      var fullText = "";
      await callWithFailoverStream(messages, systemPrompt, function (token) {
        fullText += token;
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ reply: fullText }));
    }

  } catch (err) {
    console.error("[api/chat] Fatal error:", err.message);
    var statusCode = err.message === "TOTAL_TIMEOUT_EXCEEDED" ? 503 : 500;
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message || "Internal server error" }));
  }
}

/* ── Exports ────────────────────────────────────────────────── */
module.exports = handler;
module.exports.default = handler;
