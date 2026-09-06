load('config.js');
function execute(key, page) {
    let q = String(key || "").replace(/^\s+|\s+$/g, "");
    if (!q) return Response.error("Nhập từ khóa tìm kiếm");
    let p = 1;
    let url = BASE_URL + "/api/manga/search?q=" + encodeURIComponent(q);
    if (page) {
        let ps = String(page);
        if (/^\d+$/.test(ps)) {
            p = parseInt(ps, 10);
        } else if (ps.indexOf("http") === 0 || ps.indexOf("/api/") >= 0) {
            url = normalizeIncomingUrl(ps);
            let m = String(url).match(/[?&]page=(\d+)/);
            if (m) p = parseInt(m[1], 10);
        }
    }
    let apiUrl = withPage(url, p);
    let r = fetchJson(apiUrl);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let parsed = parseMangaPage(r.data);
    let next = "";
    if (parsed.next) {
        next = withPage(url, parsed.next);
    }
    return Response.success(parsed.items, next);
}
