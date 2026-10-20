load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://valvrareteam.net/truyen/bi-mat-cua-phu-thuy-tinh-lang-4b74a318/chuong/chuong-1-vikeliywon-9a60e439");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let html = extractChapterHtml(r.html || "");
    if (!html || html.replace(/\s/g, "").length < 80) {
        return Response.error("Không lấy được nội dung chương");
    }
    return Response.success(html);
}
