let BASE_URL = "https://www.fxnzw.com";
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

function bookIdFromLink(link) {
    let m = String(link).match(/\/fxnbook\/(\d+)\.html/);
    return m ? m[1] : "";
}

function bookCover(link) {
    let id = bookIdFromLink(link);
    if (!id) return "";
    return BASE_URL + "/images/fxnid/" + id + ".jpg";
}

function normalizeIncomingUrl(url) {
    if (!url) return "";
    return String(url).replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
}

function parseBookList(doc) {
    let data = [];
    let seen = {};
    let items = doc.select("#ListContents > div");
    if (items.size() === 0) {
        items = doc.select("div[style*=margin: 10px]");
    }
    items.forEach(function (e) {
        let a = e.select("a.fonttext").first();
        if (!a) return;
        let link = a.attr("href");
        if (!link || seen[link]) return;
        seen[link] = true;
        let authorEl = e.select("a[href*=/fxnlist/]").first();
        let img = e.select("img").first();
        let cover = "";
        if (img) {
            cover = img.attr("src") || img.attr("data-original");
        }
        if (!cover) cover = bookCover(link);
        data.push({
            name: a.text(),
            link: absUrl(link),
            cover: absUrl(cover),
            description: authorEl ? authorEl.text() : "",
            host: BASE_URL
        });
    });
    return data;
}

function parseListKey(url) {
    let m = String(url).match(/\/fxnlist\/([^/?]+)\.html/);
    if (!m) return { toptype: "topall", keywords: "" };
    let name = decodeURIComponent(m[1]);
    if (name.indexOf("top") === 0) {
        let i = name.indexOf("_");
        if (i < 0) return { toptype: name, keywords: "" };
        return { toptype: name.substring(0, i), keywords: name.substring(i + 1) };
    }
    if (name === "index") return { toptype: "topall", keywords: "" };
    return { toptype: "topall", keywords: name };
}
