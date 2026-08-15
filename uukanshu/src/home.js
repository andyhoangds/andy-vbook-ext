load('config.js');
function execute() {
    return Response.success([
        { title: "熱門推薦", input: BASE_URL + "/", script: "gen.js" },
        { title: "閱讀排行", input: BASE_URL + "/top/allvisit_1.html", script: "gen.js" },
        { title: "全本", input: BASE_URL + "/quanben/1.html", script: "gen.js" },
        { title: "玄幻奇幻", input: BASE_URL + "/class_1_1.html", script: "gen.js" }
    ]);
}
