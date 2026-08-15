load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL quyển. Dán ví dụ: https://16k.club/pack/1.html");
    let fetchUrl = listUrlFromPack(url);
    let response = httpGet(fetchUrl);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let posts = parsePosts(doc);
    let p = pageNumFromUrl(url);
    let isTop = fetchUrl.indexOf("top.html") >= 0;
    let name = isTop ? "16K TOP" : ("16K 第" + p + "辑 · " + posts.length + "套");
    return Response.success({
        name: name,
        cover: posts.length > 0 ? posts[0].cover : "",
        author: "16k.club",
        description: isTop ? "Bảng TOP" : ("Gom " + PAGE_SIZE + " bộ ảnh thành 1 quyển. Mỗi bộ = 1 chương."),
        detail: posts.length + " chương",
        ongoing: !isTop,
        host: BASE_URL
    });
}
