load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://nettruyen.id/truyen-tranh/toi-tro-thanh-chong-cua-giao-chu-ma-giao/chapter-66");
    let response = httpGet(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = [];
    let seen = {};
    doc.select("div.page-chapter img").forEach(function (e) {
        let img = e.attr("data-src") || e.attr("src") || "";
        if (!img) return;
        if (img.indexOf("data:") === 0) return;
        let link = absUrl(img);
        if (seen[link]) return;
        seen[link] = true;
        data.push({
            link: link,
            fallback: []
        });
    });
    if (data.length === 0) {
        return Response.error("Không lấy được ảnh chương");
    }
    return Response.success(data);
}
