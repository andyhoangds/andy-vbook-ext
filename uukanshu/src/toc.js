load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://uukanshu.cc/book/17474/");
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = [];
    doc.select("#list-chapterAll dd a").forEach(function (e) {
        data.push({
            name: e.text(),
            url: absUrl(e.attr("href")),
            host: BASE_URL
        });
    });
    return Response.success(data);
}
