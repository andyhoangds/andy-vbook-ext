load('config.js');
function execute() {
    return Response.success([
        { title: "最新 30套/辑", input: packLink(1), script: "gen.js" },
        { title: "TOP", input: BASE_URL + "/top.html", script: "gen.js" }
    ]);
}
