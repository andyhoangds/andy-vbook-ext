load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://nettruyen.id/truyen-tranh/toi-tro-thanh-chong-cua-giao-chu-ma-giao");
    let response = httpGet(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = [];
    let seen = {};
    doc.select("#nt_listchapter li.row .chapter a").forEach(function (a) {
        let href = a.attr("href");
        if (!href) return;
        let link = absUrl(href);
        if (seen[link]) return;
        seen[link] = true;
        data.push({
            name: a.text(),
            url: link,
            host: BASE_URL
        });
    });
    if (data.length === 0) {
        return Response.error("Không lấy được danh sách chương");
    }
    let out = [];
    for (let i = data.length - 1; i >= 0; i--) {
        out.push(data[i]);
    }
    return Response.success(out);
}
