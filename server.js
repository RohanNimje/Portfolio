/**
 * server.js — Local Express Development Server
 * -----------------------------------------------
 * Serves static portfolio files and proxies /api/chat
 * to the same handler used by Vercel Serverless Functions.
 *
 * Usage:
 *   npm start          →  node server.js
 *   npm run dev        →  node server.js
 *
 * Then visit: http://localhost:3000
 */

"use strict";

require("dotenv").config();

var express  = require("express");
var cors     = require("cors");
var path     = require("path");
var chatHandler = require("./api/chat");

var app  = express();
var PORT = process.env.PORT || 3000;

/* ── Middleware ─────────────────────────────────────────────── */
app.use(cors());
app.use(express.json());

/* ── API Route ──────────────────────────────────────────────── */
// Mount the same handler used by Vercel
app.post("/api/chat", function (req, res) {
  return chatHandler(req, res);
});

/* ── Static Files ───────────────────────────────────────────── */
// Serve the project root as a static directory
// (index.html, css/, js/, public/ — everything)
app.use(express.static(path.join(__dirname)));

// SPA fallback — serve index.html for any unmatched routes
// Note: Express 5 requires named wildcard params (/*splat) instead of bare *
app.get("/*splat", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* ── Start ──────────────────────────────────────────────────── */
app.listen(PORT, function () {
  console.log("");
  console.log("┌─────────────────────────────────────────────┐");
  console.log("│  Rohan Nimje Portfolio — Local Dev Server   │");
  console.log("│  http://localhost:" + PORT + "                       │");
  console.log("└─────────────────────────────────────────────┘");
  console.log("");

  var target = process.env.GEMINI_API_KEY ? "✓ GEMINI_API_KEY (Set)" : "✗ GEMINI_API_KEY (not set)";
  console.log("  API Targets:");
  console.log("    " + target);
  console.log("");
});
