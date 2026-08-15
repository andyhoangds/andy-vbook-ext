load('config.js');
function execute() {
    return Response.success([
        { title: "玄幻", input: BASE_URL + "/fxnlist/topall_玄幻.html", script: "gen.js" },
        { title: "奇幻", input: BASE_URL + "/fxnlist/topall_奇幻.html", script: "gen.js" },
        { title: "武侠", input: BASE_URL + "/fxnlist/topall_武侠.html", script: "gen.js" },
        { title: "仙侠", input: BASE_URL + "/fxnlist/topall_仙侠.html", script: "gen.js" },
        { title: "都市", input: BASE_URL + "/fxnlist/topall_都市.html", script: "gen.js" },
        { title: "言情", input: BASE_URL + "/fxnlist/topall_言情.html", script: "gen.js" },
        { title: "历史", input: BASE_URL + "/fxnlist/topall_历史.html", script: "gen.js" },
        { title: "军事", input: BASE_URL + "/fxnlist/topall_军事.html", script: "gen.js" },
        { title: "游戏", input: BASE_URL + "/fxnlist/topall_游戏.html", script: "gen.js" },
        { title: "科幻", input: BASE_URL + "/fxnlist/topall_科幻.html", script: "gen.js" },
        { title: "灵异", input: BASE_URL + "/fxnlist/topall_灵异.html", script: "gen.js" },
        { title: "二次元", input: BASE_URL + "/fxnlist/topall_二次元.html", script: "gen.js" }
    ]);
}
