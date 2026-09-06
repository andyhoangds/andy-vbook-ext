load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://mimihentai.moe/manga/68195/chapter/130498");
    let chapId = chapterIdFromUrl(url);
    if (!chapId) return Response.error("URL không phải trang chương mimihentai.moe");
    let r = fetchJson(BASE_URL + "/api/chapters/" + chapId);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let pages = r.data && r.data.pages ? r.data.pages : [];
    let data = [];
    let seen = {};
    for (let i = 0; i < pages.length; i++) {
        let img = pages[i] ? pages[i].image_url : "";
        if (!img) continue;
        img = absUrl(img);
        if (seen[img]) continue;
        seen[img] = true;
        data.push({
            link: img,
            fallback: []
        });
    }
    if (data.length === 0) {
        return Response.error("Không lấy được ảnh chương");
    }
    return Response.success(data);
}
