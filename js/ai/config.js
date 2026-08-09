/**
 * config.js — Compatibility Stub
 * --------------------------------
 * The full multi-provider target management logic has been moved server-side
 * into api/chat.js. This stub exposes a minimal window.AI_CONFIG interface
 * so that existing guard checks in ai-service.js (hasTargets, getActiveTarget)
 * continue to work without modification.
 *
 * All API keys are now read from process.env on the server — never in the browser.
 */

(function () {
  "use strict";

  window.AI_CONFIG = {
    /** Always true — the server handles key availability checks. */
    hasTargets: function () { return true; },

    /** Returns a dummy sentinel; ai-service.js no longer uses this for API calls. */
    getActiveTarget: function () {
      return { group: "server-proxy", provider: "server", model: "server", key: null };
    },

    /** No-op — failover is managed server-side. */
    markTargetFailed: function () {},

    /** No-op — failover is managed server-side. */
    resetFailedTargets: function () {},

    /** Always 1 — the /api/chat proxy counts as one logical target. */
    targetCount: function () { return 1; },

    /** No-op for compatibility. */
    loadConfig: function () { return Promise.resolve(); }
  };

  console.info("[AI Config] Server-proxy mode active — keys managed server-side via /api/chat.");

})();
