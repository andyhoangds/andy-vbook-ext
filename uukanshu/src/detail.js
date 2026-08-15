load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://uukanshu.cc/book/17474/");
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let coverEl = doc.select(".bookcover img").first();
    let coverImg = coverEl ? coverEl.attr("src") : "";
    if (!coverImg) {
        let mob = doc.select("p.bookintro img").first();
        coverImg = mob ? mob.attr("src") : bookCover(url);
    }

    let authorEl = doc.select("p.booktag a.red").first();
    let introEl = doc.select("p.bookintro").first();
    let intro = introEl ? introEl.html() : "";
    intro = intro.replace(/<img[^>]*>/g, "");

    let genres = [];
    let crumbs = doc.select("ol.breadcrumb li a");
    if (crumbs.size() > 1) {
        let g = crumbs.get(1);
        genres.push({
            title: g.text(),
            input: absUrl(g.attr("href")),
            script: "gen.js"
        });
    }

    let tagHtml = doc.select("p.booktag").html() || "";
    let timeEl = doc.select("p.booktime").first();

    return Response.success({
        name: doc.select("h1.booktitle").text(),
        cover: coverImg,
        author: authorEl ? authorEl.text() : "",
        description: intro,
        detail: tagHtml + (timeEl ? "<br>" + timeEl.text() : ""),
        ongoing: tagHtml.indexOf("連載") >= 0,
        genres: genres,
        host: BASE_URL
    });
}
