load('config.js');
function execute() {
    let r = fetchJson(BASE_URL + "/api/genres");
    if (r.ok && r.data && r.data.length) {
        let genres = [];
        for (let i = 0; i < r.data.length; i++) {
            let g = r.data[i];
            if (!g || !g.id) continue;
            let title = g.name || ("Genre " + g.id);
            if (g.manga_count) title = title + " (" + g.manga_count + ")";
            genres.push({
                title: title,
                input: BASE_URL + "/api/manga/by-genre/" + g.id,
                script: "gen.js"
            });
        }
        if (genres.length > 0) return Response.success(genres);
    }
    return Response.success([
        { title: "Oneshot", input: BASE_URL + "/api/manga/by-genre/273", script: "gen.js" },
        { title: "Full màu", input: BASE_URL + "/api/manga/by-genre/245", script: "gen.js" }
    ]);
}
