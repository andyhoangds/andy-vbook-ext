load('config.js');
function execute(key, page) {
    if (!key) return Response.error("Thiếu từ khóa tìm kiếm");
    key = String(key).replace(/:/g, " ");
    let url = BASE_URL + "/fxnlist/" + encodeURI(key) + ".html";
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = parseBookList(doc);
    return Response.success(data);
}
