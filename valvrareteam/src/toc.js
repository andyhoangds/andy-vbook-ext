load('config.js');
function execute(url) {
    url = normalizeIncomingUrl(url);
    if (!url) return Response.error("Thiếu URL truyện. Dán ví dụ: https://valvrareteam.net/truyen/bi-mat-cua-phu-thuy-tinh-lang-4b74a318");
    let r = fetchDoc(url);
    if (!r.ok) return Response.error("HTTP " + r.status);
    let data = [];
    let seen = {};
    let doc = r.doc;
    let html = r.html || "";

    if (doc) {
        let links = doc.select("a.chapter-title-link");
        for (let i = 0; i < links.size(); i++) {
            let a = links.get(i);
            let href = a.attr("href");
            if (!href || !isChapterHref(href)) continue;
            let link = absUrl(href);
            if (seen[link]) continue;
            seen[link] = true;
            data.push({
                name: a.text(),
                url: link,
                host: BASE_URL
            });
        }
    }

    if (data.length === 0 && html) {
        let re = /href="(\/truyen\/[^"]+\/chuong\/[^"]+)"[^>]*class="[^"]*chapter-title-link[^"]*"[^>]*>([^<]+)</g;
        let m = re.exec(html);
        while (m) {
            let link = absUrl(m[1]);
            if (!seen[link]) {
                seen[link] = true;
                data.push({
                    name: decodeHtmlEntities(m[2]),
                    url: link,
                    host: BASE_URL
                });
            }
            m = re.exec(html);
        }
    }

    if (data.length === 0 && html) {
        let re2 = /href="(\/truyen\/[^"]+\/chuong\/[^"]+)"/g;
        let m2 = re2.exec(html);
        while (m2) {
            let link = absUrl(m2[1]);
            if (!seen[link]) {
                seen[link] = true;
                data.push({
                    name: link.substring(link.lastIndexOf("/") + 1).replace(/-/g, " "),
                    url: link,
                    host: BASE_URL
                });
            }
            m2 = re2.exec(html);
        }
    }

    if (data.length === 0) {
        return Response.error("Không lấy được danh sách chương");
    }
    return Response.success(data);
}
