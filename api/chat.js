/**
 * api/chat.js — Vercel Serverless Function & Express-compatible Handler
 * -----------------------------------------------------------------------
 * Works as:
 *   - A Vercel Serverless Function (exports default handler)
 *   - A plain Express middleware (module.exports for server.js)
 *
 * Fully dynamic failover & zero artificial timers:
 *   - Relies purely on natural network/HTTP lifecycles (no arbitrary timeouts).
 *   - Universal catch-all for any HTTP error status (4xx, 5xx), network resets, or stream parsing errors.
 *   - Seamlessly fails over from primary to fallback model if 0 tokens delivered.
 *   - Locks stream to prevent mid-stream model mixing if tokens have started flowing.
 */

"use strict";

/* ── Constants ─────────────────────────────────────────────── */
var GEMINI_STREAM_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

/* ── Configuration ─────────────────────────────────────────── */
var CONFIG = {
  primaryModel: 'gemini-3.5-flash-lite',
  fallbackModel: 'gemini-3.1-flash-lite'
};

/* ── Stream Line Parser Helper ──────────────────────────────── */
async function processSSEStream(response, onChunk) {
  if (!response.body) throw new Error("NO_RESPONSE_BODY");

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
      } catch (e) {
        // Skip unparseable lines gracefully
      }
    }
  }

  if (buffer.trim().startsWith("data:")) {
    var trailingData = buffer.trim().replace(/^data:\s*/, "");
    if (trailingData !== "[DONE]") {
      try { onChunk(JSON.parse(trailingData)); } catch (e) { }
    }
  }
}

/* ── Gemini Adapter ─────────────────────────────────────────── */
async function fetchGeminiStream(model, key, messages, systemPrompt, onToken) {
  var url = GEMINI_STREAM_BASE + model + ":streamGenerateContent?alt=sse&key=" + key;
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
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
    ]
  };

  var res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  // Dynamic status check: ANY non-2xx status triggers failure
  if (!res.ok) {
    throw new Error("HTTP_STATUS_" + res.status);
  }

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
}

/* ── Dynamic Streaming Failover Dispatcher ─────────────────── */
async function callWithFailoverStream(messages, systemPrompt, onToken) {
  var key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");

  var modelsToTry = [CONFIG.primaryModel, CONFIG.fallbackModel];
  var totalTokensDelivered = 0;

  for (var i = 0; i < modelsToTry.length; i++) {
    var model = modelsToTry[i];
    console.log("[api/chat] Attempting model (" + (i + 1) + "/" + modelsToTry.length + "): " + model);

    var currentModelTokens = 0;

    try {
      var tokenCallback = function (token) {
        currentModelTokens++;
        totalTokensDelivered++;
        onToken(token);
      };

      await fetchGeminiStream(model, key, messages, systemPrompt, tokenCallback);

      // Model successfully completed its stream
      if (currentModelTokens > 0) {
        return;
      }

      // If stream ended with 0 tokens and no error, treat as empty response failure
      throw new Error("EMPTY_STREAM_RESPONSE");

    } catch (err) {
      // If tokens were already delivered to the client, do NOT switch fallback mid-stream
      if (currentModelTokens > 0) {
        console.warn("[api/chat] Model failed mid-stream (" + model + "): " + err.message);
        throw new Error("EXHAUSTED_MIDSTREAM: " + err.message);
      }

      // Universal Failover: Any failure before first token triggers next fallback model
      console.warn("[api/chat] Model failed before yielding tokens (" + model + "): " + err.message + ". Triggering fallback immediately...");
    }
  }

  // If all models in the pool failed to deliver any token
  if (totalTokensDelivered > 0) {
    throw new Error("EXHAUSTED_MIDSTREAM");
  } else {
    throw new Error("EXHAUSTED_INITIAL");
  }
}

/* ── CORS Helper ────────────────────────────────────────────── */
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/* ── Request Body Parser ────────────────────────────────────── */
function parseBody(req) {
  return new Promise(function (resolve, reject) {
    if (req.body) return resolve(req.body);

    var raw = "";
    req.on("data", function (chunk) { raw += chunk.toString(); });
    req.on("end", function () {
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
    var body = await parseBody(req);
    var messages = body.messages || [];
    var systemPrompt = body.systemPrompt || "You are a helpful assistant.";
    var isStream = body.stream !== false; // Default to streaming

    if (isStream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
      });

      try {
        await callWithFailoverStream(messages, systemPrompt, function (token) {
          res.write("data: " + JSON.stringify({ chunk: token }) + "\n\n");
        });
        res.write("data: [DONE]\n\n");
        res.end();
      } catch (err) {
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
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message || "Internal server error" }));
  }
}

/* ── Exports ────────────────────────────────────────────────── */
module.exports = handler;
module.exports.default = handler;
