load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://mimihentai.moe/manga/68195");
    let id = mangaIdFromUrl(url);
    if (!id) return Response.error("URL không phải trang truyện mimihentai.moe");
    let r = fetchJson(BASE_URL + "/api/manga/" + id + "/chapters");
    if (!r.ok) return Response.error("HTTP " + r.status);
    let list = r.data;
    if (!list || !list.length) {
        return Response.error("Không lấy được danh sách chương");
    }
    let data = [];
    let seen = {};
    for (let i = 0; i < list.length; i++) {
        let c = list[i];
        if (!c || !c.id) continue;
        let link = BASE_URL + "/manga/" + id + "/chapter/" + c.id;
        if (seen[link]) continue;
        seen[link] = true;
        data.push({
            name: c.title || ("Chapter " + (c.order || c.id)),
            url: link,
            host: BASE_URL
        });
    }
    if (data.length === 0) {
        return Response.error("Không lấy được danh sách chương");
    }
    // API thường trả mới → cũ; đảo lại để đọc từ chap đầu
    let out = [];
    for (let i = data.length - 1; i >= 0; i--) {
        out.push(data[i]);
    }
    return Response.success(out);
}
