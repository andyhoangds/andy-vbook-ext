load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL quyển. Dán ví dụ: https://16k.club/pack/1.html");
    let fetchUrl = listUrlFromPack(url);
    let response = httpGet(fetchUrl);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let posts = parsePosts(doc);
    let data = [];
    for (let i = 0; i < posts.length; i++) {
        data.push({
            name: (i + 1) + ". " + posts[i].name,
            url: posts[i].url,
            host: BASE_URL
        });
    }
    if (data.length === 0) {
        return Response.error("Không lấy được danh sách bộ ảnh");
    }
    return Response.success(data);
}
