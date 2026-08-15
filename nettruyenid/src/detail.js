load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://nettruyen.id/truyen-tranh/toi-tro-thanh-chong-cua-giao-chu-ma-giao");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let doc = r.doc;

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
    let authorEls = doc.select("a[href*='/tac-gia/']");
    for (let i = 0; i < authorEls.size(); i++) {
        let t = authorEls.get(i).text();
        if (t) authors.push(t);
    }

    let statusEl = doc.select("li.status .col-xs-8").first();
    let status = statusEl ? statusEl.text() : "";
    let ongoing = status.indexOf("Đang") >= 0;

    let descEl = doc.select(".detail-content p").first();

    let genres = [];
    let seen = {};
    let genreEls = doc.select("li.kind a[href*='/the-loai/']");
    for (let i = 0; i < genreEls.size(); i++) {
        let e = genreEls.get(i);
        let href = e.attr("href");
        if (!href) continue;
        let link = absUrl(href).split("?")[0].replace(/\/$/, "");
        if (seen[link]) continue;
        seen[link] = true;
        genres.push({
            title: e.text(),
            input: link,
            script: "gen.js"
        });
    }

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
