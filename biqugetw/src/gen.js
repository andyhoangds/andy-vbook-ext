load('config.js');
function execute(url, page) {
    if (page) url = page;
    url = listUrl(String(url || BASE_URL + "/"));
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
