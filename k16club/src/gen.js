load('config.js');
function execute(url, page) {
    if (page) url = page;
    url = normalizeIncomingUrl(String(url || packLink(1)));
    let fetchUrl = listUrlFromPack(url);
    let response = httpGet(fetchUrl);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let posts = parsePosts(doc);
    if (posts.length === 0) return Response.success([]);
    let p = pageNumFromUrl(url);
    let isTop = fetchUrl.indexOf("top.html") >= 0;
    let name = isTop ? "16K TOP" : ("16K 第" + p + "辑 · " + posts.length + "套");
    let book = {
        name: name,
        link: isTop ? (BASE_URL + "/top.html") : packLink(p),
        cover: posts[0].cover,
        description: posts[0].name,
        host: BASE_URL
    };
    let next = "";
    if (!isTop && hasNextPage(doc)) {
        next = packLink(p + 1);
    }
    return Response.success([book], next);
}
