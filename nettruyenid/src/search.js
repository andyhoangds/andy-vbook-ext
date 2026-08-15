load('config.js');
function execute(key, page) {
    let q = String(key || "").replace(/^\s+|\s+$/g, "");
    if (!q) return Response.error("Nhập từ khóa tìm kiếm");
    let url = BASE_URL + "/tim-kiem-nang-cao?keyword=" + encodeURIComponent(q);
    if (page && String(page) !== "1") {
        url = String(page);
        if (url.indexOf("http") !== 0) {
            url = BASE_URL + "/tim-kiem-nang-cao?keyword=" + encodeURIComponent(q) + "&page=" + page;
        }
    }
    let response = httpGet(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = parseBookList(doc);
    let next = "";
    try {
        next = nextPageUrl(url, doc);
    } catch (e) {
        next = "";
    }
    return Response.success(data, next);
}
