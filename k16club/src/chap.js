load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://16k.club/post/23179/");
    let response = httpGet(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = [];
    let seen = {};
    let imgs = doc.select(".container img.img-fluid");
    for (let i = 0; i < imgs.size(); i++) {
        let e = imgs.get(i);
        let full = e.attr("data-src") || "";
        let thumb = e.attr("src") || "";
        let link = full || thumb;
        if (!link) continue;
        if (link.indexOf("img.16k.club") < 0) continue;
        link = absUrl(link);
        if (seen[link]) continue;
        seen[link] = true;
        let fb = [];
        if (thumb && absUrl(thumb) !== link) fb.push(absUrl(thumb));
        data.push({
            link: link,
            fallback: fb
        });
    }
    if (data.length === 0) {
        let poster = doc.select("video").first();
        if (poster) {
            let p = poster.attr("poster") || "";
            if (p) {
                data.push({
                    link: absUrl(p),
                    fallback: []
                });
            }
        }
    }
    if (data.length === 0) {
        return Response.error("Không lấy được ảnh chương");
    }
    return Response.success(data);
}
