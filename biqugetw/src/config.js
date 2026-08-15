let BASE_URL = "https://www.biquge.tw";
try {
    if (CONFIG_URL) {
        let origin = String(CONFIG_URL).match(/^(https?:\/\/[^\/]+)/);
        if (origin) {
            BASE_URL = origin[1];
        }
    }
} catch (error) {
}

function absUrl(href, base) {
    if (!href) return "";
    href = String(href);
    if (href.indexOf("http") === 0) return href;
    if (href.indexOf("//") === 0) return "https:" + href;
    if (href.indexOf("?") === 0) {
        let u = String(base || BASE_URL);
        let q = u.indexOf("?");
        if (q >= 0) u = u.substring(0, q);
        if (u.charAt(u.length - 1) !== "/") u = u + "/";
        return u + href;
    }
    if (href.indexOf("/") === 0) return BASE_URL + href;
    return BASE_URL + "/" + href;
}

function normalizeIncomingUrl(url) {
    if (!url) return "";
    url = String(url).replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    return url;
}

function tocUrl(url) {
    url = normalizeIncomingUrl(url);
    if (/\/book\/\d+\.html$/.test(url)) {
        return url.replace(/\.html$/, "/");
    }
    if (/\/book\/\d+$/.test(url)) {
        return url + "/";
    }
    return url;
}

function listUrl(url) {
    url = normalizeIncomingUrl(url);
    if (/\/sort\/[^\/]+\/?$/.test(url)) {
        return url.replace(/\/$/, "") + "/1.html";
    }
    if (/\/top\/[^\/]+\/?$/.test(url)) {
        return url.replace(/\/$/, "") + "/1.html";
    }
    return url;
}

function httpGet(url) {
    return fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": BASE_URL + "/"
        }
    });
}

function imgSrc(img) {
    if (!img) return "";
    let src = img.attr("data-src") || img.attr("src") || "";
    if (!src || src.indexOf("nocover") >= 0) {
        src = img.attr("data-src") || src;
    }
    return absUrl(src);
}

function parseBookList(doc) {
    let data = [];
    let seen = {};
    let cards = doc.select(".result-card");
    if (cards.size() > 0) {
        for (let i = 0; i < cards.size(); i++) {
            let e = cards.get(i);
            let a = e.select("a.book-title").first();
            if (!a) a = e.select("a[href*='/book/']").first();
            if (!a) continue;
            let href = a.attr("href");
            if (!/\/book\/\d+\.html/.test(href)) continue;
            let link = absUrl(href);
            if (seen[link]) continue;
            seen[link] = true;
            let img = e.select("img").first();
            let author = e.select(".author").first();
            data.push({
                name: a.text(),
                link: link,
                cover: imgSrc(img),
                description: author ? author.text() : "",
                host: BASE_URL
            });
        }
        return data;
    }
    let els = doc.select("div.item");
    for (let i = 0; i < els.size(); i++) {
        let e = els.get(i);
        let a = e.select("dt a[href*='/book/']").first();
        if (!a) a = e.select("a[href*='/book/']").first();
        if (!a) continue;
        let href = a.attr("href");
        if (!/\/book\/\d+\.html/.test(String(href).split("?")[0])) continue;
        let link = absUrl(href);
        if (seen[link]) continue;
        seen[link] = true;
        let img = e.select("img").first();
        let author = e.select("dd.author").first();
        data.push({
            name: a.attr("title") || a.text(),
            link: link,
            cover: imgSrc(img),
            description: author ? author.text() : "",
            host: BASE_URL
        });
    }
    return data;
}

function nextPageUrl(listUrl, doc) {
    let a = doc.select("#pagelink li.next a").first();
    if (a) {
        let href = a.attr("href");
        if (href) return absUrl(href, listUrl);
    }
    let btns = doc.select("a.page-btn");
    for (let i = 0; i < btns.size(); i++) {
        let t = btns.get(i).text();
        if (t.indexOf("下一") >= 0) {
            return absUrl(btns.get(i).attr("href"), listUrl);
        }
    }
    return "";
}
