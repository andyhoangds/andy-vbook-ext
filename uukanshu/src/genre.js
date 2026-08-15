load('config.js');
function execute() {
    let response = fetch(BASE_URL + "/class_1_1.html");
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        doc.select(".class ul li a").forEach(function (e) {
            genres.push({
                title: e.text(),
                input: absUrl(e.attr("href")),
                script: "gen.js"
            });
        });
        if (genres.length > 0) {
            return Response.success(genres);
        }
    }
    return Response.success([
        { title: "玄幻奇幻", input: BASE_URL + "/class_1_1.html", script: "gen.js" },
        { title: "武俠仙俠", input: BASE_URL + "/class_2_1.html", script: "gen.js" },
        { title: "現代都市", input: BASE_URL + "/class_3_1.html", script: "gen.js" },
        { title: "歷史軍事", input: BASE_URL + "/class_4_1.html", script: "gen.js" },
        { title: "科幻小說", input: BASE_URL + "/class_5_1.html", script: "gen.js" },
        { title: "遊戲競技", input: BASE_URL + "/class_6_1.html", script: "gen.js" },
        { title: "恐怖靈異", input: BASE_URL + "/class_7_1.html", script: "gen.js" },
        { title: "言情小說", input: BASE_URL + "/class_8_1.html", script: "gen.js" },
        { title: "動漫同人", input: BASE_URL + "/class_9_1.html", script: "gen.js" },
        { title: "其他類型", input: BASE_URL + "/class_10_1.html", script: "gen.js" }
    ]);
}
