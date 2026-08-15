load('config.js');
function execute() {
    return Response.success([
        { title: "首页推荐", input: BASE_URL + "/", script: "gen.js" },
        { title: "排行榜", input: BASE_URL + "/top/allvisit/1.html", script: "gen.js" },
        { title: "玄幻魔法", input: BASE_URL + "/sort/xuanhuan/1.html", script: "gen.js" },
        { title: "都市言情", input: BASE_URL + "/sort/dushi/1.html", script: "gen.js" },
        { title: "最近更新", input: BASE_URL + "/top/lastupdate/1.html", script: "gen.js" }
    ]);
}
