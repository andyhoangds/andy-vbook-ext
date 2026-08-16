load('config.js');
function execute() {
    let r = fetchDoc(BASE_URL + "/the-loai");
    if (r.ok) {
        let genres = [];
        let seen = {};
        let els = r.doc.select("a[href*='/the-loai/']");
        for (let i = 0; i < els.size(); i++) {
            let e = els.get(i);
            let href = e.attr("href");
            if (!href) continue;
            let link = absUrl(href).split("?")[0];
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
        { title: "Full màu", input: BASE_URL + "/the-loai/full-color", script: "gen.js" },
        { title: "Không che", input: BASE_URL + "/the-loai/khong-che", script: "gen.js" }
    ]);
}
