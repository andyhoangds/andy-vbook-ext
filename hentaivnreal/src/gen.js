load('config.js');
function execute(url, page) {
    if (page) url = page;
    url = String(url || BASE_URL + "/danh-sach?sort=latest");
    url = normalizeIncomingUrl(url);
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let data = parseBookList(r.doc);
    let next = "";
    try {
        next = nextPageUrl(url, r.doc);
    } catch (e) {
        next = "";
    }
    return Response.success(data, next);
}
