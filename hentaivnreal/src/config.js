let BASE_URL = "https://hentaivnreal.com";
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
    if (/\/truyen\/[^\/]+\/$/.test(url)) {
        url = url.replace(/\/$/, "");
    }
    return url;
}

function isChapterHref(href) {
    href = String(href || "");
    return href.indexOf("/chap-") >= 0 || href.indexOf("/phan-") >= 0 || href.indexOf("/chuong-") >= 0;
}

function unwrapTemplates(html) {
    html = String(html || "");
    html = html.replace(/<template\b/gi, "<div");
    html = html.replace(/<\/template>/gi, "</div>");
    return html;
}

function httpGet(url) {
    let until = new Date().getTime() + 365 * 24 * 3600 * 1000;
    return fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "vi,en;q=0.9",
            "Cookie": "hvnr_vn_verify=" + until,
            "Referer": BASE_URL + "/"
        }
    });
}

function fetchDoc(url) {
    let response = httpGet(url);
    if (!response || !response.ok) {
        return { ok: false, status: response ? response.status : 0, doc: null, html: "" };
    }
    let html = "";
    try {
        html = response.text() || "";
    } catch (e) {
        html = "";
    }
    let doc = null;
    try {
        doc = Html.parse(unwrapTemplates(html));
    } catch (e2) {
        try {
            doc = response.html();
        } catch (e3) {
            doc = null;
        }
    }
    return { ok: true, status: 200, doc: doc, html: html };
}

function collectMangaImages(doc, html) {
    let data = [];
    let seen = {};
    function add(img) {
        if (!img) return;
        img = String(img);
        if (img.indexOf("manga-images") < 0) return;
        if (img.indexOf("http") !== 0) img = absUrl(img);
        img = img.replace(/[\"'].*$/, "");
        if (seen[img]) return;
        seen[img] = true;
        let proxy = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image/*&url=" + encodeURIComponent(img);
        data.push({
            link: img,
            fallback: [proxy]
        });
    }
    if (doc) {
        let imgs = doc.select("img");
        for (let i = 0; i < imgs.size(); i++) {
            let e = imgs.get(i);
            add(e.attr("src"));
            add(e.attr("data-src"));
        }
    }
    if (data.length === 0 && html) {
        let re = /https?:\/\/[^\"'\s>]+manga-images\/[^\"'\s>]+/g;
        let m = re.exec(html);
        while (m) {
            add(m[0]);
            m = re.exec(html);
        }
    }
    if (data.length === 0 && html) {
        let re2 = /cdn\.hentaivnreal\.com\/manga-images\/[A-Za-z0-9._-]+/g;
        let m2 = re2.exec(html);
        while (m2) {
            add("https://" + m2[0]);
            m2 = re2.exec(html);
        }
    }
    return data;
}

function parseBookList(doc) {
    let data = [];
    let seen = {};
    let els = doc.select("ul.item-list li.item");
    if (els.size() === 0) els = doc.select("ul.page-item li.item");
    if (els.size() === 0) els = doc.select("li.item");
    for (let i = 0; i < els.size(); i++) {
        let e = els.get(i);
        let a = e.select(".box-description a[href*='/truyen/']").first();
        if (!a) a = e.select("a[href*='/truyen/']").first();
        if (!a) continue;
        let href = a.attr("href");
        if (!href || isChapterHref(href)) continue;
        let link = absUrl(href).replace(/\/$/, "");
        if (!/\/truyen\/[^\/]+$/.test(link)) continue;
        if (seen[link]) continue;
        seen[link] = true;
        let img = e.select("img.img-list").first();
        if (!img) img = e.select("img").first();
        let cover = "";
        if (img) cover = img.attr("src") || img.attr("data-src") || "";
        let thumb = e.select(".thumb-box").first();
        if (!cover && thumb) {
            let m = String(thumb.attr("style") || "").match(/url\((['\"]?)([^)'\"]+)\1\)/);
            if (m) cover = m[2];
        }
        let name = a.text() || a.attr("title") || e.select(".film-name").text();
        name = String(name).replace(/\s+-\s+\d+\s*chap.*$/i, "");
        data.push({
            name: name,
            link: link,
            cover: absUrl(cover),
            description: e.select(".box-description p").last() ? e.select(".box-description p").first().text() : "",
            host: BASE_URL
        });
    }
    return data;
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
    let probe = doc.select('a[href*="page=' + next + '"]');
    if (probe.size() === 0) return "";
    if (/[?&]sort=/.test(String(listUrl || ""))) {
        return withPage(listUrl, next);
    }
    return absUrl(probe.first().attr("href"));
}
