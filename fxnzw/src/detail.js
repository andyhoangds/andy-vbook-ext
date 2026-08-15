load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://www.fxnzw.com/fxnbook/54234.html");
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let nameEl = doc.select("span[style*=font-size: 24px]").first();
    let coverEl = doc.select("img.imgwidth").first();
    let authorEl = doc.select("div[style*=width: 60%] a[href*=/fxnlist/]").first();
    let introEl = doc.select("div[style*=min-height: 100px]").first();
    let status = doc.select("meta[property=og:novel:status]").attr("content") || "";

    let genres = [];
    doc.select("span.typebut a").forEach(function (e) {
        genres.push({
            title: e.text(),
            input: absUrl(e.attr("href")),
            script: "gen.js"
        });
    });

    let cover = coverEl ? coverEl.attr("src") : bookCover(url);
    let author = authorEl ? authorEl.text() : "";
    let intro = introEl ? introEl.html() : "";

    return Response.success({
        name: nameEl ? nameEl.text() : "",
        cover: absUrl(cover),
        author: author,
        description: intro,
        detail: author ? ("作者：" + author + "<br>" + status) : status,
        ongoing: status.indexOf("连载") >= 0,
        genres: genres,
        host: BASE_URL
    });
}
