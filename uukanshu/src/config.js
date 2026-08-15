let BASE_URL = "https://uukanshu.cc";
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}

function absUrl(href) {
    if (!href) return "";
    href = String(href);
    if (href.indexOf("http") === 0) return href;
    if (href.indexOf("//") === 0) return "https:" + href;
    if (href.indexOf("/") === 0) return BASE_URL + href;
    return BASE_URL + "/" + href;
}

function bookCover(link) {
    let m = String(link).match(/\/book\/(\d+)/);
    if (!m) return "";
    let id = m[1];
    let folder = Math.floor(parseInt(id, 10) / 1000);
    return "https://image.uukanshu.cc/" + folder + "/" + id + "/" + id + "s.jpg";
}

function parseBookList(doc) {
    let data = [];
    let boxes = doc.select(".bookbox");
    if (boxes.size() > 0) {
        boxes.forEach(function (e) {
            let a = e.select("h4.bookname a").first();
            if (!a) return;
            let link = a.attr("href");
            let author = e.select(".author").first();
            data.push({
                name: a.text(),
                link: absUrl(link),
                cover: bookCover(link),
                description: author ? author.text() : "",
                host: BASE_URL
            });
        });
        return data;
    }
    doc.select(".item").forEach(function (e) {
        let a = e.select("dt a").first();
        if (!a) return;
        let img = e.select(".image img").first();
        let dd = e.select("dd").first();
        data.push({
            name: a.text(),
            link: absUrl(a.attr("href")),
            cover: img ? img.attr("src") : bookCover(a.attr("href")),
            description: dd ? dd.text() : "",
            host: BASE_URL
        });
    });
    return data;
}

function nextPageUrl(doc) {
    let href = doc.select(".pagelink a.next").attr("href");
    if (!href) return "";
    return absUrl(href);
}

function normalizeIncomingUrl(url) {
    if (!url) return "";
    url = String(url).replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    // App cắt / cuối: /book/17474 cần thành /book/17474/ (không áp dụng URL chương .html)
    if (/\/book\/\d+$/.test(url)) {
        url = url + "/";
    }
    return url;
}
