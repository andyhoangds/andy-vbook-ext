load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://nettruyen.id/truyen-tranh/toi-tro-thanh-chong-cua-giao-chu-ma-giao");
    let response = httpGet(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let nameEl = doc.select("h1.title-detail").first();
    if (!nameEl) nameEl = doc.select("h1").first();

    let cover = "";
    let coverEl = doc.select(".detail-info img").first();
    if (coverEl) cover = coverEl.attr("src") || coverEl.attr("data-src") || "";
    if (!cover) {
        let thumb = doc.select("img[src*='thumbnails']").first();
        if (thumb) cover = thumb.attr("src");
    }

    let authors = [];
    doc.select("a[href*='/tac-gia/']").forEach(function (e) {
        let t = e.text();
        if (t) authors.push(t);
    });

    let statusEl = doc.select("li.status .col-xs-8").first();
    let status = statusEl ? statusEl.text() : "";
    let ongoing = status.indexOf("Đang") >= 0;

    let descEl = doc.select(".detail-content p").first();

    let genres = [];
    let seen = {};
    doc.select("li.kind a[href*='/the-loai/']").forEach(function (e) {
        let href = e.attr("href");
        if (!href) return;
        let link = absUrl(href).split("?")[0].replace(/\/$/, "");
        if (seen[link]) return;
        seen[link] = true;
        genres.push({
            title: e.text(),
            input: link,
            script: "gen.js"
        });
    });

    return Response.success({
        name: nameEl ? nameEl.text() : "",
        cover: absUrl(cover),
        author: authors.join(", "),
        description: descEl ? descEl.text() : "",
        detail: status,
        ongoing: ongoing,
        genres: genres,
        host: BASE_URL
    });
}
