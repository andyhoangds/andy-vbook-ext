load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://valvrareteam.net/truyen/bi-mat-cua-phu-thuy-tinh-lang-4b74a318");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let doc = r.doc;
    let html = r.html || "";

    let book = parseLdBook(html);
    let name = book && book.name ? book.name : "";
    let author = book && book.author && book.author.name ? book.author.name : "";
    let cover = book && book.image ? book.image : "";
    let description = book && book.description ? book.description : "";

    if (doc) {
        if (!name) {
            let titleEl = doc.select("h1.rd-novel-title").first();
            if (!titleEl) titleEl = doc.select("h1").first();
            if (titleEl) name = titleEl.text();
        }
        if (!cover) {
            let imgEl = doc.select("img.rd-novel-cover").first();
            if (!imgEl) imgEl = doc.select("img[src*='cdn.valvrareteam.net/illustrations']").first();
            if (imgEl) cover = imgEl.attr("src") || imgEl.attr("data-src") || "";
        }
        if (!author) {
            let authorEl = doc.select(".rd-novel-author").first();
            if (authorEl) author = authorEl.text();
        }
        if (!description) {
            let descEl = doc.select(".rd-description-content").first();
            if (descEl) description = descEl.html() || descEl.text();
        }
    }

    let ongoing = html.indexOf("Đang tiến hành") >= 0;
    if (html.indexOf("Hoàn thành") >= 0 && html.indexOf("Đang tiến hành") < 0) {
        ongoing = false;
    }

    let genres = [];
    if (book && book.genre) {
        let parts = String(book.genre).split(",");
        for (let i = 0; i < parts.length; i++) {
            let title = String(parts[i]).replace(/^\s+|\s+$/g, "");
            if (!title) continue;
            genres.push({
                title: title,
                input: BASE_URL + "/danh-sach-truyen/trang/1",
                script: "gen.js"
            });
        }
    }

    return Response.success({
        name: decodeHtmlEntities(name),
        cover: absUrl(cover),
        author: decodeHtmlEntities(author),
        description: description,
        detail: "",
        ongoing: ongoing,
        genres: genres,
        host: BASE_URL
    });
}
