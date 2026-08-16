load('config.js');
function execute(url) {
    try {
        url = normalizeIncomingUrl(url);
        if (!url) return Response.error("Thiếu URL chương. Dán ví dụ: https://hentaivnreal.com/truyen/mat-kiem-soat/chuong-11");
        let r = fetchDoc(url);
        if (!r.ok) return Response.error("HTTP " + r.status);
        let data = collectMangaImages(r.doc, r.html);
        if (data.length === 0) {
            return Response.error("Không lấy được ảnh chương");
        }
        return Response.success(data);
    } catch (e) {
        return Response.error("chap: " + e);
    }
}
