load('config.js');
function execute(url, page) {
    if (!url) return Response.error("Thiếu URL danh sách");
    url = normalizeIncomingUrl(url);
    if (!page) page = "1";
    let response;
    if (page === "1") {
        response = fetch(url);
    } else {
        let key = parseListKey(url);
        let req = BASE_URL + "/fxnzw/listreq.aspx?toptype=" + encodeURIComponent(key.toptype) + "&keywords=" + encodeURIComponent(key.keywords) + "&pageid=" + page;
        response = fetch(req);
    }
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = parseBookList(doc);
    let next = "";
    if (data.length >= 20) {
        next = (parseInt(page, 10) + 1).toString();
    }
    return Response.success(data, next);
}
