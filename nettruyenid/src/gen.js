load('config.js');
function execute(url, page) {
    if (page) url = page;
    url = String(url || BASE_URL + "/?page=1");
    url = normalizeIncomingUrl(url);
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let data = parseBookList(r.doc);
    if (data.length === 0) data = parseBookListRegex(r.html);
    let next = "";
    try {
        next = nextPageUrl(url, r.doc);
    } catch (e) {
        next = "";
    }
    return Response.success(data, next);
}
