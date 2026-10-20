let BASE_URL = "https://valvrareteam.net";
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
    url = url.split("#")[0];
    if (/\/truyen\/[^\/]+\/$/.test(url)) {
        url = url.replace(/\/$/, "");
    }
    return url;
}

function isChapterHref(href) {
    let path = String(href || "").split("?")[0].replace(/\/$/, "");
    return /\/truyen\/[^\/]+\/chuong\//.test(path);
}

function isNovelDetailHref(href) {
    if (!href) return false;
    let path = String(href || "").split("?")[0].replace(/\/$/, "");
    if (isChapterHref(path)) return false;
    return /\/truyen\/[^\/]+$/.test(path);
}

function unwrapTemplates(html) {
    html = String(html || "");
    html = html.replace(/<template\b/gi, "<div");
    html = html.replace(/<\/template>/gi, "</div>");
    return html;
}

function httpGet(url) {
    return fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "vi,en;q=0.9",
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
    html = unwrapTemplates(html);
    let doc = null;
    try {
        doc = Html.parse(html);
    } catch (e2) {
        try {
            doc = response.html();
        } catch (e3) {
            doc = null;
        }
    }
    return { ok: true, status: 200, doc: doc, html: html };
}

function decodeJsUnicode(str) {
    return String(str || "").replace(/\\u([0-9a-fA-F]{4})/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
    });
}

function collectNextFlight(raw) {
    raw = String(raw || "");
    let joined = "";
    let re = /self\.__next_f\.push\(\[1,"((?:\\.|[^"\\])*)"\]\)/g;
    let m = re.exec(raw);
    while (m) {
        joined += m[1];
        m = re.exec(raw);
    }
    return joined;
}

function parseLdBook(html) {
    html = String(html || "");
    let re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let m = re.exec(html);
    while (m) {
        try {
            let data = JSON.parse(m[1]);
            if (data && data["@type"] === "Book") {
                return data;
            }
        } catch (e) {
        }
        m = re.exec(html);
    }
    return null;
}

function cleanChapterHtml(html) {
    html = String(html || "");
    html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
    let idx = html.lastIndexOf("</p>");
    if (idx >= 0) {
        html = html.substring(0, idx + 4);
    }
    html = html.replace(/\d+:\[\[\s*"\$[\s\S]*$/g, "");
    html = html.replace(/\[\\"\$[\s\S]*$/g, "");
    return html;
}

function extractChapterHtml(raw) {
    raw = String(raw || "");
    if (raw.indexOf("chapter-content") >= 0) {
        try {
            let doc = Html.parse(unwrapTemplates(raw));
            let box = doc.select(".chapter-content").first();
            if (box) {
                let inner = box.html() || "";
                if (inner.indexOf("skl-line") < 0 && inner.replace(/\s/g, "").length > 80) {
                    return cleanChapterHtml(inner);
                }
            }
        } catch (e) {
        }
    }
    let joined = collectNextFlight(raw);
    if (!joined) return "";
    let best = "";
    let re = /:T([0-9a-f]+),/g;
    let m = re.exec(joined);
    while (m) {
        let start = m.index + m[0].length;
        let slice = joined.substring(start, start + 120000);
        let cut = slice.search(/\\n\d+[a-zA-Z0-9_]*:|\\",\\"link\\"|\[\\"\$/);
        if (cut >= 0) {
            slice = slice.substring(0, cut);
        }
        if (slice.indexOf("\\u003c") >= 0 || slice.indexOf("\\u003cbr") >= 0) {
            let dec = cleanChapterHtml(decodeJsUnicode(slice));
            if (dec.length > best.length) {
                best = dec;
            }
        }
        m = re.exec(joined);
    }
    if (best.length >= 200) {
        return best;
    }
    let fallbackRe = /\\u003c(?:p|br|img|div|span|h2|h3|blockquote)[\s\S]{100,80000}/g;
    let fm = fallbackRe.exec(joined);
    while (fm) {
        let dec = cleanChapterHtml(decodeJsUnicode(fm[0]));
        if (dec.length > best.length && dec.indexOf("skl") < 0) {
            best = dec;
        }
        fm = fallbackRe.exec(joined);
    }
    return best;
}

function decodeHtmlEntities(text) {
    text = String(text || "");
    text = text.replace(/&quot;/g, "\"");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/&#39;/g, "'");
    return text;
}

function pushBookItem(data, seen, item) {
    if (!item || !item.link) return;
    if (!isNovelDetailHref(item.link)) return;
    item.link = absUrl(item.link).replace(/\/$/, "");
    if (seen[item.link]) return;
    seen[item.link] = true;
    item.name = decodeHtmlEntities(item.name || "");
    item.description = decodeHtmlEntities(item.description || "");
    item.cover = absUrl(item.cover || "");
    item.host = BASE_URL;
    data.push(item);
}

function parseBookList(doc, html) {
    let data = [];
    let seen = {};
    if (doc) {
        let cards = doc.select(".nd-novel-card");
        for (let i = 0; i < cards.size(); i++) {
            let e = cards.get(i);
            let a = e.select("a.nd-novel-title-link").first();
            if (!a) continue;
            let img = e.select("img.nd-novel-image").first();
            let desc = e.select(".nd-novel-description").first();
            pushBookItem(data, seen, {
                name: a.text(),
                link: a.attr("href"),
                cover: img ? (img.attr("src") || img.attr("data-src")) : "",
                description: desc ? desc.text() : ""
            });
        }
        if (data.length === 0) {
            cards = doc.select(".novel-card");
            for (let j = 0; j < cards.size(); j++) {
                let card = cards.get(j);
                let linkEl = card.select("a.novel-list-title-link").first();
                if (!linkEl) continue;
                let titleEl = card.select("h3.novel-title").first();
                let imgEl = card.select("img.novel-cover").first();
                let descEl = card.select(".novel-description").first();
                if (!descEl) descEl = card.select(".novel-summary").first();
                pushBookItem(data, seen, {
                    name: titleEl ? titleEl.text() : linkEl.text(),
                    link: linkEl.attr("href"),
                    cover: imgEl ? (imgEl.attr("src") || imgEl.attr("data-src")) : "",
                    description: descEl ? descEl.text() : ""
                });
            }
        }
    }
    if (data.length === 0 && html) {
        let re = /href="(\/truyen\/[a-z0-9-]+)"/g;
        let m = re.exec(html);
        while (m) {
            pushBookItem(data, seen, {
                name: "",
                link: m[1],
                cover: "",
                description: ""
            });
            m = re.exec(html);
        }
    }
    return data;
}

function currentPageFromUrl(url) {
    url = String(url || "");
    let m = url.match(/\/trang\/(\d+)/);
    if (m) return parseInt(m[1], 10);
    if (/\/oln\/trang\//.test(url)) return 1;
    if (/\/danh-sach-truyen\/trang\//.test(url)) return 1;
    if (url === BASE_URL || url === BASE_URL + "/") return 1;
    return 1;
}

function nextPageUrl(listUrl, doc, html) {
    listUrl = String(listUrl || "");
    html = String(html || "");
    let page = currentPageFromUrl(listUrl);
    let nextPath = "";
    if (/\/danh-sach-truyen\//.test(listUrl)) {
        nextPath = "/danh-sach-truyen/trang/" + (page + 1);
    } else if (/\/oln\//.test(listUrl)) {
        nextPath = "/oln/trang/" + (page + 1);
    } else if (listUrl === BASE_URL || listUrl === BASE_URL + "/" || /\/trang\/\d+/.test(listUrl)) {
        nextPath = "/trang/" + (page + 1);
    }
    if (!nextPath) return "";
    if (html.indexOf(nextPath) >= 0) {
        return absUrl(nextPath);
    }
    if (doc) {
        let links = doc.select('a[href*="' + nextPath + '"]');
        if (links.size() > 0) {
            return absUrl(links.first().attr("href"));
        }
    }
    return "";
}
