load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://mimihentai.moe/manga/68195");
    let id = mangaIdFromUrl(url);
    if (!id) return Response.error("URL không phải trang truyện mimihentai.moe");
    let r = fetchJson(BASE_URL + "/api/manga/" + id);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let item = r.data;
    if (!item) return Response.error("Không lấy được thông tin truyện");

    let authors = [];
    if (item.authors) {
        for (let i = 0; i < item.authors.length; i++) {
            if (item.authors[i] && item.authors[i].name) authors.push(item.authors[i].name);
        }
    }

    let genres = [];
    if (item.genres) {
        for (let i = 0; i < item.genres.length; i++) {
            let g = item.genres[i];
            if (!g || !g.id) continue;
            genres.push({
                title: g.name || ("Genre " + g.id),
                input: BASE_URL + "/api/manga/by-genre/" + g.id,
                script: "gen.js"
            });
        }
    }

    let detail = "";
    if (item.view) detail += "View: " + item.view;
    if (item.follows) detail += (detail ? " | " : "") + "Follow: " + item.follows;
    if (item.chapter_count) detail += (detail ? " | " : "") + item.chapter_count + " chap";

    return Response.success({
        name: item.title || "",
        cover: item.cover_url || "",
        author: authors.join(", "),
        description: item.description || "",
        detail: detail,
        ongoing: true,
        genres: genres,
        host: BASE_URL
    });
}
