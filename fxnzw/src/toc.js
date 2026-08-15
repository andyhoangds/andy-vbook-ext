load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://www.fxnzw.com/fxnbook/54234.html");
    let tocUrl = url.replace("/fxnbook/", "/fxnchapter/");
    let response = fetch(tocUrl);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = [];
    let seen = {};
    doc.select("span[style*=width:31%] a[href*=/fxnread/]").forEach(function (e) {
        let href = e.attr("href");
        if (!href || seen[href]) return;
        seen[href] = true;
        data.push({
            name: e.text(),
            url: absUrl(href),
            host: BASE_URL
        });
    });
    if (data.length === 0) {
        doc.select("a[href*=/fxnread/]").forEach(function (e) {
            let href = e.attr("href");
            if (!href || seen[href]) return;
            seen[href] = true;
            let name = e.text();
            if (!name || name.indexOf("最新") >= 0) return;
            data.push({
                name: name,
                url: absUrl(href),
                host: BASE_URL
            });
        });
    }
    return Response.success(data);
}
