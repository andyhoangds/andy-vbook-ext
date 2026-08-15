load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://www.biquge.tw/book/9002.html");
    if (/\/book\/\d+$/.test(url)) url = url + ".html";
    if (/\/book\/\d+\/$/.test(url)) url = url.replace(/\/$/, ".html");
    let response = httpGet(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let nameEl = doc.select("h1 a").first();
    if (!nameEl) nameEl = doc.select("h1").first();

    let cover = "";
    let coverEl = doc.select(".book .cover img").first();
    if (!coverEl) coverEl = doc.select("img[src*='img.biquge.tw']").first();
    if (coverEl) cover = imgSrc(coverEl);

    let authorEl = doc.select("a[href*='/author/']").first();
    let introEl = doc.select(".intro p").first();
    if (!introEl) introEl = doc.select(".intro").first();

    let h2 = doc.select("h2").text() || "";
    let ongoing = h2.indexOf("连载") >= 0;

    let genres = [];
    let g = doc.select(".header-common-nav a[href*='/sort/']").first();
    if (!g) g = doc.select("a[href*='/sort/']").first();
    if (g) {
        genres.push({
            title: g.text(),
            input: listUrl(absUrl(g.attr("href"))),
            script: "gen.js"
        });
    }

    return Response.success({
        name: nameEl ? nameEl.text() : "",
        cover: cover,
        author: authorEl ? authorEl.text() : "",
        description: introEl ? introEl.text() : "",
        detail: h2,
        ongoing: ongoing,
        genres: genres,
        host: BASE_URL
    });
}
