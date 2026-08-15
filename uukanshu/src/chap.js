load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://uukanshu.cc/book/17474/10328712.html");
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let content = doc.select("div.readcotent");
    if (content.isEmpty()) {
        return Response.error("Không lấy được nội dung chương");
    }
    let html = content.html() || "";
    html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
    html = html.replace(/&emsp;/g, "");
    return Response.success(html);
}
