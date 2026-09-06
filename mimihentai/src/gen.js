load('config.js');
function execute(url, page) {
    if (!url) url = BASE_URL + "/api/manga?sort=updated_at";
    url = String(url);
    url = normalizeIncomingUrl(url);
    if (url.indexOf("/api/") < 0) {
        if (/\/genres\/(\d+)/.test(url)) {
            let gid = url.match(/\/genres\/(\d+)/)[1];
            url = BASE_URL + "/api/manga/by-genre/" + gid;
        } else {
            url = BASE_URL + "/api/manga?sort=updated_at";
        }
    }
    let p = 1;
    if (page) {
        let ps = String(page);
        if (/^\d+$/.test(ps)) {
            p = parseInt(ps, 10);
        } else if (/[?&]page=\d+/.test(ps) || ps.indexOf("http") === 0) {
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
