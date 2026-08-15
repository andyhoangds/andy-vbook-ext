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

function httpGet(url) {
    return fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "vi,en;q=0.9"
        }
    });
}

function unwrapTemplates(html) {
    html = String(html || "");
    html = html.replace(/<template\b/gi, "<div");
    html = html.replace(/<\/template>/gi, "</div>");
    return html;
}

function fetchDoc(url) {
    let response = httpGet(url);
    if (!response || !response.ok) {
        return {
            ok: false,
            status: response ? response.status : 0,
            doc: null,
            html: ""
        };
    }
    let html = "";
    try {
        html = response.text() || "";
    } catch (e) {
        html = "";
    }
    html = unwrapTemplates(html);
    return {
        ok: true,
        status: 200,
        doc: Html.parse(html),
        html: html
    };
}

function nextPageUrl(listUrl, doc) {
    let m = String(listUrl || "").match(/[?&]page=(\d+)/);
    let page = m ? parseInt(m[1], 10) : 1;
    let next = page + 1;
    let found = false;
    let links = doc.select("ul.pagination a.page-link");
    for (let i = 0; i < links.size(); i++) {
        let t = String(links.get(i).text()).replace(/^\s+|\s+$/g, "");
        if (t === String(next)) found = true;
    }
    if (!found) return "";
    return withPage(listUrl, next);
}

function parseBookList(doc) {
    let data = [];
    let seen = {};
    let els = doc.select(".items .item");
    if (els.size() === 0) els = doc.select("div.item");
    for (let i = 0; i < els.size(); i++) {
        let e = els.get(i);
        let a = e.select("h3 a[href*='/truyen-tranh/']").first();
        if (!a) a = e.select("a[href*='/truyen-tranh/']").first();
        if (!a) continue;
        let href = a.attr("href");
        if (!isComicDetailHref(href)) continue;
        let link = absUrl(href).replace(/\/$/, "");
        if (seen[link]) continue;
        seen[link] = true;
        let img = e.select("img").first();
        let cover = "";
        if (img) {
            cover = img.attr("src") || img.attr("data-src") || "";
        }
        let name = a.attr("title") || a.text();
        let chap = e.select("li.chapter a").first();
        data.push({
            name: name,
            link: link,
            cover: absUrl(cover),
            description: chap ? chap.text() : "",
            host: BASE_URL
        });
    }
    return data;
}

function parseBookListRegex(html) {
    let data = [];
    let seen = {};
    let re = /<a[^>]*title="([^"]+)"[^>]*href="([^"]*\/truyen-tranh\/[^"]+)"[^>]*>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
        let href = m[2];
        if (!isComicDetailHref(href)) continue;
        let link = absUrl(href).replace(/\/$/, "");
        if (seen[link]) continue;
        seen[link] = true;
        data.push({
            name: m[1],
            link: link,
            cover: "",
            description: "",
            host: BASE_URL
        });
    }
    return data;
}
