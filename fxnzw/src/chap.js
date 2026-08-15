load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://www.fxnzw.com/fxnread/54234_14852146.html");
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let content = doc.select("#Lab_Contents");
    if (content.isEmpty()) {
        return Response.error("Không lấy được nội dung chương");
    }
    let html = content.html() || "";
    html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<p id="txt_0">[\s\S]*?<\/p>/i, "");
    html = html.replace(/影书[\s\S]{0,40}yingsx[\s\S]{0,40}/g, "");
    html = html.replace(/&nbsp;/g, " ");
    html = html.replace(/&larr;&rarr;：?/g, "");
    return Response.success(html);
}
