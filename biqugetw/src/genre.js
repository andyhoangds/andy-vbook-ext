load('config.js');
function execute() {
    let response = httpGet(BASE_URL + "/sort/xuanhuan/1.html");
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        let seen = {};
        let els = doc.select("ul.sortlist li a");
        for (let i = 0; i < els.size(); i++) {
            let e = els.get(i);
            let href = e.attr("href");
            if (!href) continue;
            let link = listUrl(absUrl(href));
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
        { title: "玄幻魔法", input: BASE_URL + "/sort/xuanhuan/1.html", script: "gen.js" },
        { title: "武侠修真", input: BASE_URL + "/sort/wuxia/1.html", script: "gen.js" },
        { title: "都市言情", input: BASE_URL + "/sort/dushi/1.html", script: "gen.js" },
        { title: "历史军事", input: BASE_URL + "/sort/lishi/1.html", script: "gen.js" },
        { title: "科幻灵异", input: BASE_URL + "/sort/kehuan/1.html", script: "gen.js" },
        { title: "游戏竞技", input: BASE_URL + "/sort/youxi/1.html", script: "gen.js" },
        { title: "女生耽美", input: BASE_URL + "/sort/nvsheng/1.html", script: "gen.js" }
    ]);
}
