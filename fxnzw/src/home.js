load('config.js');
function execute() {
    return Response.success([
        { title: "全部榜单", input: BASE_URL + "/fxnlist/topall_.html", script: "gen.js" },
        { title: "完本", input: BASE_URL + "/fxnlist/topend_.html", script: "gen.js" },
        { title: "更新榜", input: BASE_URL + "/fxnlist/topupdate_.html", script: "gen.js" },
        { title: "女生", input: BASE_URL + "/fxnlist/topmm_.html", script: "gen.js" },
        { title: "玄幻", input: BASE_URL + "/fxnlist/topall_玄幻.html", script: "gen.js" }
    ]);
}
