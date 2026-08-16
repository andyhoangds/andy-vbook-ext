load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://hentaivnreal.com/truyen/mat-kiem-soat");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let data = [];
    let seen = {};
    let els = r.doc.select("table.listing a[href*='/truyen/']");
    for (let i = 0; i < els.size(); i++) {
        let a = els.get(i);
        let href = a.attr("href");
        if (!href || !isChapterHref(href)) continue;
        let link = absUrl(href);
        if (seen[link]) continue;
        seen[link] = true;
        let h = a.select("h2.chuong_t").first();
        data.push({
            name: h ? h.text() : a.text(),
            url: link,
            host: BASE_URL
        });
    }
    if (data.length === 0) {
        return Response.error("Không lấy được danh sách chương");
    }
    let out = [];
    for (let i = data.length - 1; i >= 0; i--) {
        out.push(data[i]);
    }
    return Response.success(out);
}
