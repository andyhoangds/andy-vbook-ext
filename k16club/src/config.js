let BASE_URL = "https://16k.club";
let PAGE_SIZE = 30;
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
    if (/\/post\/\d+$/.test(url)) url = url + "/";
    if (/\/pack\/\d+$/.test(url)) url = url + ".html";
    return url;
}

function packLink(page) {
    return BASE_URL + "/pack/" + page + ".html";
}

function listUrlFromPack(url) {
    url = normalizeIncomingUrl(url);
    if (/\/top\.html/.test(url)) return BASE_URL + "/top.html";
    let m = String(url).match(/\/pack\/(\d+)/);
    if (m) return BASE_URL + "/index.php?p=" + m[1] + "&size=" + PAGE_SIZE;
    let p = String(url).match(/[?&]p=(\d+)/);
    if (p) return BASE_URL + "/index.php?p=" + p[1] + "&size=" + PAGE_SIZE;
    return BASE_URL + "/index.php?p=1&size=" + PAGE_SIZE;
}

function pageNumFromUrl(url) {
    let m = String(url).match(/\/pack\/(\d+)/);
    if (m) return parseInt(m[1], 10);
    m = String(url).match(/[?&]p=(\d+)/);
    if (m) return parseInt(m[1], 10);
    return 1;
}

function httpGet(url) {
    return fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "zh-CN,zh;q=0.9,vi;q=0.8",
            "Referer": BASE_URL + "/"
        }
    });
}

function parsePosts(doc) {
    let data = [];
    let seen = {};
    let els = doc.select(".grid-item a[href*='/post/']");
    if (els.size() === 0) els = doc.select("a[href*='/post/']");
    for (let i = 0; i < els.size(); i++) {
        let a = els.get(i);
        let href = a.attr("href") || "";
        let idm = href.match(/\/post\/(\d+)/);
        if (!idm) continue;
        let link = BASE_URL + "/post/" + idm[1] + "/";
        if (seen[link]) continue;
        seen[link] = true;
        let img = a.select("img").first();
        if (!img) img = a.parent() ? a.parent().select("img").first() : null;
        let name = "";
        if (img) name = img.attr("alt") || "";
        if (!name) name = a.attr("title") || a.text();
        name = String(name).replace(/^\s+|\s+$/g, "");
        if (!name) name = "Post " + idm[1];
        let cover = "";
        if (img) cover = img.attr("src") || img.attr("data-src") || "";
        data.push({
            name: name,
            url: link,
            cover: absUrl(cover),
            host: BASE_URL
        });
    }
    return data;
}

function hasNextPage(doc) {
    let disabled = doc.select("span.m-pagination-next.disabled");
    if (disabled.size() > 0) return false;
    let next = doc.select("span.m-pagination-next a").first();
    if (!next) return false;
    let href = next.attr("href") || "";
    return href.indexOf("p=") >= 0;
}
