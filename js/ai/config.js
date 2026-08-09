/**
 * config.js — Single-Source Config & Multi-Provider Target Manager
 * -----------------------------------------------------------------------------
 * 1. Single Source: Reads strictly from window.ENV_CONFIG in js/ai/env-config.js.
 *    (Deprecated HTTP .env fetching completely for 100% reliable zero-network config).
 * 2. Unlimited Multi-Provider Pool: Dynamically parses & indexes all provider groups
 *    (first_*, second_*, third_*, fourth_*, etc.) for Gemini and Groq endpoints.
 * 3. Dynamic Model Merging: Target models are read dynamically from window.ENV_CONFIG.
 * 4. Silent Failover Tracking: Tracks failed targets (429/403/5xx) and rotates targets.
 */

(function () {
  "use strict";

  /* ── Ordinal Ranking Map ──────────────────────────────── */
  var ORDINAL_MAP = {
    first: 1, "1st": 1, "one": 1, "1": 1,
    second: 2, "2nd": 2, "two": 2, "2": 2,
    third: 3, "3rd": 3, "three": 3, "3": 3,
    fourth: 4, "4th": 4, "four": 4, "4": 4,
    fifth: 5, "5th": 5, "five": 5, "5": 5,
    sixth: 6, "6th": 6, "six": 6, "6": 6,
    seventh: 7, "7th": 7, "seven": 7, "7": 7,
    eighth: 8, "8th": 8, "eight": 8, "8": 8,
    ninth: 9, "9th": 9, "nine": 9, "9": 9,
    tenth: 10, "10th": 10, "ten": 10, "10": 10
  };

  /* ── Internal State ───────────────────────────────────── */
  var _targets = [];
  var _failedTargets = {};
  var _initialized = false;

  /* ── Provider Auto-Detection ──────────────────────────── */
  function detectProvider(key, configuredProvider) {
    if (configuredProvider && typeof configuredProvider === "string") {
      var p = configuredProvider.trim().toLowerCase();
      if (p === "groq" || p === "gemini") return p;
    }
    // Auto-detect based on API Key prefix
    if (key && String(key).indexOf("gsk_") === 0) return "groq";
    return "gemini";
  }

  /* ── Model Auto-Detection Fallback ────────────────────── */
  function defaultModelForProvider(provider) {
    if (provider === "groq") return "llama-3.3-70b-versatile";
    return "gemini-2.5-flash";
  }

  /* ── Dynamic Target Discovery ─────────────────────────── */

  function discoverTargetsFromConfig(cfg) {
    if (!cfg || typeof cfg !== "object") return [];

    var groups = {};
    var standaloneKeys = [];
    var keys = Object.keys(cfg);

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var val = cfg[k];
      if (!val || typeof val !== "string" || val.trim().length < 5) continue;
      var cleanVal = val.trim();

      // Check if key follows prefix_SUFFIX pattern (e.g. first_KEY, second_MODEL, third_PROVIDER)
      var splitIdx = k.indexOf("_");
      if (splitIdx > 0) {
        var prefix = k.substring(0, splitIdx).toLowerCase();
        var suffix = k.substring(splitIdx + 1).toUpperCase();

        if (!groups[prefix]) {
          groups[prefix] = { prefix: prefix };
        }

        if (suffix === "KEY" || suffix === "API_KEY") {
          groups[prefix].key = cleanVal;
        } else if (suffix === "MODEL" || suffix === "MODEL_NAME") {
          groups[prefix].model = cleanVal;
        } else if (suffix === "PROVIDER") {
          groups[prefix].provider = cleanVal.toLowerCase();
        }
      } else {
        // Standalone key (e.g. GEMINI_API_KEY, GROQ_KEY)
        var upperKey = k.toUpperCase();
        if (upperKey.indexOf("KEY") !== -1 || upperKey.indexOf("TOKEN") !== -1) {
          standaloneKeys.push({ name: k, value: cleanVal });
        }
      }
    }

    var targetsList = [];

    // Process prefix groups
    Object.keys(groups).forEach(function (prefix) {
      var g = groups[prefix];
      if (g.key) {
        var provider = detectProvider(g.key, g.provider);
        var model = g.model || defaultModelForProvider(provider);
        var priority = ORDINAL_MAP[prefix] || (100 + targetsList.length);

        targetsList.push({
          group: prefix,
          key: g.key,
          model: model,
          provider: provider,
          priority: priority
        });
      }
    });

    // Process standalone fallback keys if no prefix groups existed
    if (targetsList.length === 0 && standaloneKeys.length > 0) {
      standaloneKeys.forEach(function (sk, idx) {
        var provider = detectProvider(sk.value, null);
        var model = cfg.GEMINI_MODEL || cfg.GROQ_MODEL || cfg.MODEL || defaultModelForProvider(provider);
        targetsList.push({
          group: "standalone_" + idx,
          key: sk.value,
          model: model,
          provider: provider,
          priority: 100 + idx
        });
      });
    }

    // Sort by priority (first -> 1, second -> 2, third -> 3...)
    targetsList.sort(function (a, b) {
      return a.priority - b.priority;
    });

    return targetsList;
  }

  /* ── Core Configuration Init ─────────────────────────── */

  function loadConfig() {
    _targets = discoverTargetsFromConfig(window.ENV_CONFIG);
    _initialized = true;

    if (_targets.length === 0) {
      console.warn("[AI Config] No provider targets found in window.ENV_CONFIG.");
    } else {
      console.info(
        "[AI Config] Initialized " + _targets.length + " provider target(s) from window.ENV_CONFIG:\n" +
        _targets.map(function (t, idx) {
          return "  " + (idx + 1) + ". [" + t.group + "] Provider: " + t.provider + " | Model: " + t.model;
        }).join("\n")
      );
    }

    return Promise.resolve();
  }

  /* ── Public API ───────────────────────────────────────── */

  function markTargetFailed(target) {
    if (target && target.key) {
      _failedTargets[target.key] = true;
      console.warn("[AI Config] Target marked as failed (Group: " + target.group + ", Provider: " + target.provider + "). Rotating to next target.");
    }
  }

  function getActiveTarget() {
    loadConfig(); // Always refresh to support zero-code hot dynamic updates to window.ENV_CONFIG

    for (var i = 0; i < _targets.length; i++) {
      if (!_failedTargets[_targets[i].key]) {
        return _targets[i];
      }
    }

    // Reset failed state if all targets in pool are exhausted
    _failedTargets = {};
    return _targets.length > 0 ? _targets[0] : null;
  }

  function resetFailedTargets() {
    _failedTargets = {};
  }

  function hasTargets() {
    loadConfig();
    return _targets.length > 0;
  }

  function targetCount() {
    loadConfig();
    return _targets.length;
  }

  /* ── Expose Globals ───────────────────────────────────── */

  window.AI_CONFIG = {
    loadConfig: loadConfig,
    getActiveTarget: getActiveTarget,
    markTargetFailed: markTargetFailed,
    resetFailedTargets: resetFailedTargets,
    hasTargets: hasTargets,
    targetCount: targetCount
  };

  // Synchronous init on script load
  loadConfig();

})();
