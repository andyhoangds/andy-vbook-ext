load('config.js');
function execute(key, page) {
    let q = String(key || "").replace(/^\s+|\s+$/g, "");
    if (!q) return Response.error("Nhập từ khóa tìm kiếm");
    let url = BASE_URL + "/tim-kiem?type=title&q=" + encodeURIComponent(q);
    if (page && String(page) !== "1") {
        url = String(page);
        if (url.indexOf("http") !== 0) {
            url = BASE_URL + "/tim-kiem?type=title&q=" + encodeURIComponent(q) + "&page=" + page;
        }
    }
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
