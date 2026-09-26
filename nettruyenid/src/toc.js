load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://nettruyen.gg/truyen-tranh/anh-hung-giai-cap-tu-san");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let data = [];
    let seen = {};
    let els = r.doc.select("#nt_listchapter li.row .chapter a");
    if (els.size() === 0) els = r.doc.select("#chapter_list li.row .chapter a");
    if (els.size() === 0) els = r.doc.select("li.row .chapter a[href*='/chuong-']");
    for (let i = 0; i < els.size(); i++) {
        let a = els.get(i);
        let href = a.attr("href");
        if (!href) continue;
        let link = absUrl(href);
        if (seen[link]) continue;
        seen[link] = true;
        data.push({
            name: a.text(),
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
