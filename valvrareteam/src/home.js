load('config.js');
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/", script: "gen.js" },
        { title: "Danh sách truyện", input: BASE_URL + "/danh-sach-truyen/trang/1", script: "gen.js" },
        { title: "OLN", input: BASE_URL + "/oln/trang/1", script: "gen.js" }
    ]);
}
