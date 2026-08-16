load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://hentaivnreal.com/truyen/mat-kiem-soat/chuong-11");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let data = [];
    let seen = {};
    let imgs = r.doc.select("img[src*='/manga-images/']");
    for (let i = 0; i < imgs.size(); i++) {
        let img = imgs.get(i).attr("src") || imgs.get(i).attr("data-src") || "";
        if (!img) continue;
        let link = absUrl(img);
        if (seen[link]) continue;
        seen[link] = true;
        data.push({
            link: link,
            fallback: []
        });
    }
    if (data.length === 0) {
        return Response.error("Không lấy được ảnh chương");
    }
    return Response.success(data);
}
