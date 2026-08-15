load('config.js');
function execute(url) {
    url = tocUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://www.biquge.tw/book/9002.html");
    let response = httpGet(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = [];
    let seen = {};
    let els = doc.select(".list-chapter ul li a");
    if (els.size() === 0) els = doc.select("ul li a[href*='/book/']");
    for (let i = 0; i < els.size(); i++) {
        let a = els.get(i);
        let href = a.attr("href") || "";
        if (!/\/book\/\d+\/\d+\.html/.test(href)) continue;
        let link = absUrl(href);
        if (seen[link]) continue;
        seen[link] = true;
        data.push({
            name: a.text(),
            url: link,
            host: BASE_URL
        });
    }
    if (data.length === 0) {
        return Response.error("Không lấy được danh sách chương");
    }
    return Response.success(data);
}
