load('config.js');
function execute() {
    let r = fetchDoc(BASE_URL + "/");
    if (r.ok) {
        let genres = [];
        let seen = {};
        let els = r.doc.select("a[href*='/the-loai/']");
        for (let i = 0; i < els.size(); i++) {
            let e = els.get(i);
            let href = e.attr("href");
            if (!href) continue;
            let path = String(href).split("?")[0];
            if (!/\/the-loai\/[^\/]+/.test(path)) continue;
            if (/\/the-loai\/?$/.test(path.replace(/\/$/, ""))) continue;
            let link = absUrl(path).replace(/\/$/, "");
            if (seen[link]) continue;
            seen[link] = true;
            let title = String(e.text()).replace(/^\s+|\s+$/g, "");
            if (!title) continue;
            genres.push({
                title: title,
                input: link,
                script: "gen.js"
            });
        }
        if (genres.length > 0) {
            return Response.success(genres);
        }
    }
    return Response.success([
        { title: "Action", input: BASE_URL + "/the-loai/action", script: "gen.js" },
        { title: "Manhwa", input: BASE_URL + "/the-loai/manhwa", script: "gen.js" },
        { title: "Manhua", input: BASE_URL + "/the-loai/manhua", script: "gen.js" },
        { title: "Manga", input: BASE_URL + "/the-loai/manga", script: "gen.js" }
    ]);
}
