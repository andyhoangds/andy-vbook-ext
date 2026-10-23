"use strict";

/**
 * Local development shim for the vBook extension runtime.
 *
 * The vBook Android app executes each plugin script inside an embedded JS
 * engine and injects a handful of globals (Http, Html, Response, Console).
 * Those globals do not exist in Node.js, so this module re-implements just
 * enough of them to let the existing scraper scripts run unmodified on a
 * desktop for local development/testing.
 *
 * - Http.get(url).string()        -> synchronous HTTP GET (via curl)
 * - Html.parse(html)              -> Jsoup-like wrapper backed by cheerio
 * - Response.success(data)        -> wraps a result the way vBook expects
 * - Console.log(...)              -> console.log passthrough
 */

const { execFileSync } = require("child_process");
const cheerio = require("cheerio");

const DEFAULT_UA =
  "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36";

/**
 * Wraps a cheerio selection to mimic the subset of the Jsoup `Elements`/
 * `Element` API that the vBook scripts rely on.
 */
function wrap($, selection) {
  return {
    size: () => selection.length,
    get: (i) => wrap($, selection.eq(i)),
    first: () => wrap($, selection.first()),
    select: (sel) => wrap($, selection.find(sel)),
    text: () => selection.text().trim(),
    html: () => selection.html(),
    attr: (name) => selection.attr(name) || "",
  };
}

const Html = {
  parse(html) {
    const $ = cheerio.load(html || "");
    // doc.select(sel) must search the whole document, so anchor on the root.
    return wrap($, $.root());
  },
};

const Http = {
  get(url, opts) {
    return {
      string() {
        try {
          const args = [
            "-sS",
            "-L",
            "--compressed",
            "-m",
            "45",
            "-A",
            (opts && opts.userAgent) || DEFAULT_UA,
            url,
          ];
          return execFileSync("curl", args, {
            encoding: "utf-8",
            maxBuffer: 64 * 1024 * 1024,
          });
        } catch (err) {
          Console.log("Http.get failed for " + url + ": " + err.message);
          return null;
        }
      },
    };
  },
};

const Response = {
  success(data) {
    return { success: true, data };
  },
  error(message) {
    return { success: false, error: message };
  },
};

const Console = {
  log: (...args) => console.log(...args),
};

module.exports = { Http, Html, Response, Console };
