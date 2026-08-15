load('config.js');
function execute(url, page) {
    if (page) url = page;
    url = String(url || "");
    // App cắt dấu / cuối: /quanben/ thành /quanben (404). Trang thật là /quanben/1.html
    if (/\/quanben\/?$/.test(url)) {
        url = BASE_URL + "/quanben/1.html";
    }
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = parseBookList(doc);
    let next = nextPageUrl(doc);
    return Response.success(data, next);
}
