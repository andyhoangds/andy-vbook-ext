load('config.js');
function execute() {
    let response = httpGet(BASE_URL + "/");
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        let seen = {};
        doc.select("a[href*='/the-loai/']").forEach(function (e) {
            let href = e.attr("href");
            if (!href) return;
            let path = String(href).split("?")[0];
            if (!/\/the-loai\/[^\/]+/.test(path)) return;
            if (/\/the-loai\/?$/.test(path.replace(/\/$/, ""))) return;
            let link = absUrl(path).replace(/\/$/, "");
            if (seen[link]) return;
            seen[link] = true;
            let title = String(e.text()).replace(/^\s+|\s+$/g, "");
            if (!title) return;
            genres.push({
                title: title,
                input: link,
                script: "gen.js"
            });
        });
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
