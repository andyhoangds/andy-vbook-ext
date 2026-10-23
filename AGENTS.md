# andy-vbook-ext

vBook reader extensions (scraper plugins). Each plugin folder (e.g. `fxnzw/`)
holds plain-JS scraper scripts under `src/` (`detail.js`, `toc.js`, `chap.js`,
`search.js`) plus a `plugin.json` manifest and a `test.json` with sample inputs.
Root `plugin.json` is the extension catalog used by the vBook app.

## Cursor Cloud specific instructions

### What this repo is

- The real runtime is the **vBook Android app's embedded JS engine**, which
  injects globals (`Http`, `Html`, `Response`, `Console`) and calls each
  script's `execute(...)`. Those globals do not exist in Node, so the plugin
  scripts cannot be run directly with `node src/<script>.js`.
- There is **no production build/server**. "Running" a plugin means scraping the
  live source site (`https://www.fxnzw.com`) and returning structured data.

### Local dev harness (how to run/test without the Android app)

A Node harness under `tools/` re-implements the vBook globals so the existing
scraper scripts run unmodified on a desktop, against the live site:

- `tools/vbook-runtime.js` — shims `Http`/`Html`/`Response`/`Console`.
  `Http.get(url).string()` is synchronous (uses `curl`, matching vBook's blocking
  API); `Html.parse(html)` is a Jsoup-like wrapper backed by `cheerio`.
- `tools/run.js` — loads a plugin's scripts and runs an entry point against the
  inputs in that plugin's `test.json`.

Commands (see `package.json` scripts):

- Lint (syntax check only): `npm run lint`
- Test all entries end-to-end against the live site: `npm test`
- Run one plugin/entry: `node tools/run.js fxnzw search` (entry =
  `detail|toc|chap|search|all`).

### Caveats

- `npm test`/`npm run` hit the **live internet** (`www.fxnzw.com`). They fail
  without outbound network access, and selectors can break if the site's markup
  changes — that's a real signal the scraper needs updating, not a harness bug.
- The harness is an approximation of Jsoup. `cheerio` covers the CSS selectors
  used here, but if you add scripts relying on Jsoup-specific behavior, extend
  `tools/vbook-runtime.js` rather than changing the plugin scripts (they must
  stay runnable inside the vBook app).
- Packaging for distribution is a manual zip, e.g.
  `cd fxnzw && zip -r plugin.zip src plugin.json icon.png`.
