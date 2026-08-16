load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://hentaivnreal.com/truyen/mat-kiem-soat");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let doc = r.doc;

    let nameEl = doc.select("h1").first();
    let coverEl = doc.select("img[src*='cdn.hentaivnreal.com']").first();
    let authorEl = doc.select("a[href*='/tac-gia/']").first();
    if (!authorEl) authorEl = doc.select("a[href*='/author/']").first();

    let genres = [];
    let seen = {};
    let tags = doc.select("a.tag[href*='/the-loai/']");
    if (tags.size() === 0) tags = doc.select("a[href*='/the-loai/']");
    for (let i = 0; i < tags.size(); i++) {
        let e = tags.get(i);
        let href = e.attr("href");
        if (!href) continue;
        let link = absUrl(href).split("?")[0];
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
        cover: coverEl ? absUrl(coverEl.attr("src")) : "",
        author: authorEl ? authorEl.text() : "",
        description: "",
        detail: "",
        ongoing: true,
        genres: genres,
        host: BASE_URL
    });
}
