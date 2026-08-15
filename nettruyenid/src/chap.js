load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://nettruyen.id/truyen-tranh/toi-tro-thanh-chong-cua-giao-chu-ma-giao/chapter-66");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let data = [];
    let seen = {};
    let els = r.doc.select("div.page-chapter img");
    for (let i = 0; i < els.size(); i++) {
        let e = els.get(i);
        let img = e.attr("data-src") || e.attr("src") || "";
        if (!img) continue;
        if (img.indexOf("data:") === 0) continue;
        let link = absUrl(img);
        if (seen[link]) continue;
        seen[link] = true;
        data.push({
            link: link,
            fallback: []
        });
    }
    if (data.length === 0) {
        let re = /data-src="(https?:\/\/[^"]+)"/gi;
        let m;
        while ((m = re.exec(r.html)) !== null) {
            let link = m[1];
            if (seen[link]) continue;
            if (link.indexOf("/chapter_") < 0 && link.indexOf("/page_") < 0) continue;
            seen[link] = true;
            data.push({
                link: link,
                fallback: []
            });
        }
    }
    if (data.length === 0) {
        return Response.error("Không lấy được ảnh chương");
    }
    return Response.success(data);
}
