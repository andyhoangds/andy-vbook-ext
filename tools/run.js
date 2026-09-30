"use strict";

/**
 * Local dev runner for vBook extension scripts.
 *
 * Loads a plugin's scripts (detail/toc/chap/search), injects the vBook runtime
 * shim, and executes a given entry point against the inputs declared in the
 * plugin's test.json. This lets you exercise the scraping logic end-to-end
 * against the live source site without the vBook Android app.
 *
 * Usage:
 *   node tools/run.js <plugin> [entry]
 *
 *   <plugin>  Plugin folder name (e.g. fxnzw). Defaults to "fxnzw".
 *   [entry]   One of: detail | toc | chap | search | all. Defaults to "all".
 *
 * Examples:
 *   node tools/run.js fxnzw search
 *   node tools/run.js fxnzw all
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const runtime = require("./vbook-runtime");

const ENTRY_FILES = {
  detail: "detail.js",
  toc: "toc.js",
  chap: "chap.js",
  search: "search.js",
};

function loadScript(scriptPath) {
  const code = fs.readFileSync(scriptPath, "utf-8");
  const sandbox = {
    Http: runtime.Http,
    Html: runtime.Html,
    Response: runtime.Response,
    Console: runtime.Console,
    encodeURI,
    encodeURIComponent,
    JSON,
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: scriptPath });
  if (typeof sandbox.execute !== "function") {
    throw new Error("No execute() function exported by " + scriptPath);
  }
  return sandbox.execute;
}

function preview(value) {
  const json = JSON.stringify(value, null, 2);
  if (!json) return String(value);
  return json.length > 1200 ? json.slice(0, 1200) + "\n... (truncated)" : json;
}

function summarize(entry, result) {
  if (result == null) {
    return { ok: false, note: "returned null/undefined" };
  }
  const data = result.data !== undefined ? result.data : result;
  if (Array.isArray(data)) {
    return { ok: data.length > 0, note: data.length + " item(s)" };
  }
  if (typeof data === "string") {
    return { ok: data.trim().length > 0, note: data.length + " chars" };
  }
  if (data && typeof data === "object") {
    const filled = Object.values(data).filter(
      (v) => v !== undefined && v !== null && String(v).trim() !== ""
    ).length;
    return { ok: filled > 0, note: filled + " populated field(s)" };
  }
  return { ok: false, note: "unrecognized result" };
}

function runEntry(pluginDir, testData, entry) {
  const file = ENTRY_FILES[entry];
  const scriptPath = path.join(pluginDir, "src", file);
  const execute = loadScript(scriptPath);
  const input = testData[file];

  console.log("\n========================================");
  console.log("[" + entry + "] " + file + "  input=" + JSON.stringify(input));
  console.log("========================================");

  let result;
  if (entry === "search") {
    result = execute(input, 1);
  } else {
    result = execute(input);
  }

  console.log(preview(result));
  const status = summarize(entry, result);
  console.log("--> " + (status.ok ? "PASS" : "FAIL") + " (" + status.note + ")");
  return status.ok;
}

function main() {
  const plugin = process.argv[2] || "fxnzw";
  const entry = process.argv[3] || "all";

  const repoRoot = path.resolve(__dirname, "..");
  const pluginDir = path.join(repoRoot, plugin);
  const testPath = path.join(pluginDir, "test.json");

  if (!fs.existsSync(pluginDir)) {
    console.error("Plugin folder not found: " + pluginDir);
    process.exit(1);
  }
  const testData = JSON.parse(fs.readFileSync(testPath, "utf-8"));

  const entries =
    entry === "all" ? ["search", "detail", "toc", "chap"] : [entry];

  if (entry !== "all" && !ENTRY_FILES[entry]) {
    console.error("Unknown entry: " + entry + " (use detail|toc|chap|search|all)");
    process.exit(1);
  }

  const results = {};
  for (const e of entries) {
    try {
      results[e] = runEntry(pluginDir, testData, e);
    } catch (err) {
      console.error("\n[" + e + "] ERROR: " + err.stack);
      results[e] = false;
    }
  }

  console.log("\n================ SUMMARY ================");
  let allPass = true;
  for (const e of entries) {
    const ok = results[e];
    allPass = allPass && ok;
    console.log("  " + (ok ? "PASS" : "FAIL") + "  " + e);
  }
  console.log("========================================");
  process.exit(allPass ? 0 : 1);
}

main();
