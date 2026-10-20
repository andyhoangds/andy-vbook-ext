load('config.js');
function execute(key, page) {
    key = String(key || "").replace(/^\s+|\s+$/g, "");
    if (!key) return Response.error("Nhập tên truyện cần tìm");
    let startPage = page ? parseInt(page, 10) : 1;
    if (!startPage || startPage < 1) startPage = 1;

    let data = [];
    let seen = {};
    let maxPages = 8;
    for (let p = startPage; p < startPage + maxPages; p++) {
        let listUrl = BASE_URL + "/danh-sach-truyen/trang/" + p;
        let r = fetchDoc(listUrl);
        if (!r.ok) break;
        let items = parseBookList(r.doc, r.html);
        if (items.length === 0) break;
        let keyLower = key.toLowerCase();
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let name = String(item.name || "").toLowerCase();
            let desc = String(item.description || "").toLowerCase();
            if (name.indexOf(keyLower) >= 0 || desc.indexOf(keyLower) >= 0) {
                if (!seen[item.link]) {
                    seen[item.link] = true;
                    data.push(item);
                }
            }
        }
        if (!nextPageUrl(listUrl, r.doc, r.html)) break;
    }

    if (data.length === 0) {
        return Response.error("Không tìm thấy truyện phù hợp trong danh sách (thử từ khóa ngắn hơn)");
    }
    return Response.success(data);
}
