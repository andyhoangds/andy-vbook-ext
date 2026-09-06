let BASE_URL = "https://mimihentai.moe";
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
    url = url.replace(/^http:\/\//, "https://");
    if (/\/manga\/\d+\/$/.test(url)) {
        url = url.replace(/\/$/, "");
    }
    return url;
}

function mangaIdFromUrl(url) {
    let m = String(url || "").match(/\/manga\/(\d+)/);
    return m ? m[1] : "";
}

function chapterIdFromUrl(url) {
    let m = String(url || "").match(/\/chapter\/(\d+)/);
    return m ? m[1] : "";
}

function withPage(url, page) {
    url = String(url || "");
    if (/[?&]page=\d+/.test(url)) {
        return url.replace(/([?&]page=)\d+/, "$1" + page);
    }
    if (url.indexOf("?") >= 0) return url + "&page=" + page;
    return url + "?page=" + page;
}

function httpGet(url) {
    return fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/html",
            "Accept-Language": "vi,en;q=0.9",
            "Referer": BASE_URL + "/"
        }
    });
}

function fetchJson(url) {
    let response = httpGet(url);
    if (!response || !response.ok) {
        return { ok: false, status: response ? response.status : 0, data: null };
    }
    let data = null;
    try {
        data = response.json();
    } catch (e) {
        data = null;
    }
    return { ok: true, status: 200, data: data };
}

function mapMangaItem(item) {
    if (!item || !item.id) return null;
    let authors = [];
    if (item.authors) {
        for (let i = 0; i < item.authors.length; i++) {
            if (item.authors[i] && item.authors[i].name) authors.push(item.authors[i].name);
        }
    }
    return {
        name: item.title || ("Manga " + item.id),
        link: BASE_URL + "/manga/" + item.id,
        cover: item.cover_url || "",
        description: authors.join(", ") || (item.chapter_count ? (item.chapter_count + " chap") : ""),
        host: BASE_URL
    };
}

function parseMangaPage(data) {
    let out = [];
    let seen = {};
    if (!data) return { items: out, next: "" };
    let list = data.items || data;
    if (!list || !list.length) list = [];
    for (let i = 0; i < list.length; i++) {
        let book = mapMangaItem(list[i]);
        if (!book) continue;
        if (seen[book.link]) continue;
        seen[book.link] = true;
        out.push(book);
    }
    let next = "";
    if (data.has_next) {
        let page = data.page ? parseInt(data.page, 10) : 1;
        next = String(page + 1);
    }
    return { items: out, next: next, page: data.page || 1 };
}
