load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://www.biquge.tw/book/9002/286409.html");
    let response = httpGet(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let content = doc.select("#chaptercontent").first();
    if (!content) content = doc.select("div.read-content").first();
    if (!content) {
        return Response.error("Không lấy được nội dung chương");
    }
    let html = content.html() || "";
    html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<div class="read-page"[\s\S]*?<\/div>/gi, "");
    return Response.success(html);
}
