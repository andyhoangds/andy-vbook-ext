let BASE_URL = "https://nettruyen.id";
try {
    if (CONFIG_URL) {
        let origin = String(CONFIG_URL).match(/^(https?:\/\/[^\/]+)/);
        if (origin) {
            BASE_URL = origin[1];
        }
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

function normalizeIncomingUrl(url) {
    if (!url) return "";
    url = String(url).replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (/\/truyen-tranh\/[^\/]+\/$/.test(url)) {
        url = url.replace(/\/$/, "");
    }
    return url;
}

function isComicDetailHref(href) {
    if (!href) return false;
    let path = String(href).split("?")[0].replace(/\/$/, "");
    return /\/truyen-tranh\/[^\/]+$/.test(path);
}

function withPage(url, page) {
    url = String(url);
    if (/[?&]page=\d+/.test(url)) {
        return url.replace(/([?&]page=)\d+/, "$1" + page);
    }
    if (url.indexOf("?") >= 0) return url + "&page=" + page;
    return url + "?page=" + page;
}

function nextPageUrl(listUrl, doc) {
    let m = String(listUrl || "").match(/[?&]page=(\d+)/);
    let page = m ? parseInt(m[1], 10) : 1;
    let next = page + 1;
    let found = false;
    doc.select("ul.pagination a.page-link").forEach(function (a) {
        let t = String(a.text()).replace(/^\s+|\s+$/g, "");
        if (t === String(next)) found = true;
    });
    if (!found) return "";
    return withPage(listUrl, next);
}

function httpGet(url) {
    return fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "vi,en;q=0.9"
        }
    });
}

function parseBookList(doc) {
    let data = [];
    let seen = {};
    doc.select(".items .item").forEach(function (e) {
        let a = e.select("a[href*='/truyen-tranh/']").first();
        if (!a) return;
        let href = a.attr("href");
        if (!isComicDetailHref(href)) return;
        let link = absUrl(href).replace(/\/$/, "");
        if (seen[link]) return;
        seen[link] = true;
        let img = e.select("img").first();
        let cover = "";
        if (img) {
            cover = img.attr("src") || img.attr("data-src") || "";
        }
        let name = a.attr("title") || e.select("h3 a").text() || a.text();
        let chap = e.select("li.chapter a").first();
        data.push({
            name: name,
            link: link,
            cover: absUrl(cover),
            description: chap ? chap.text() : "",
            host: BASE_URL
        });
    });
    return data;
}
