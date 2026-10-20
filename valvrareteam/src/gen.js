load('config.js');
function execute(url, page) {
    if (page) url = page;
    url = String(url || BASE_URL + "/");
    url = normalizeIncomingUrl(url);
    if (url === BASE_URL) {
        url = BASE_URL + "/";
    }
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let data = parseBookList(r.doc, r.html);
    if (data.length === 0) {
        return Response.error("Không lấy được danh sách truyện");
    }
    let next = nextPageUrl(url, r.doc, r.html);
    return Response.success(data, next);
}
