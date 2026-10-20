load('config.js');
function execute() {
    return Response.success([
        { title: "Danh sách truyện", input: BASE_URL + "/danh-sach-truyen/trang/1", script: "gen.js" },
        { title: "OLN (truyện sáng tác)", input: BASE_URL + "/oln/trang/1", script: "gen.js" },
        { title: "Trang chủ", input: BASE_URL + "/", script: "gen.js" }
    ]);
}
