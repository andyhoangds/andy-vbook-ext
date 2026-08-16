load('config.js');
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/danh-sach?sort=latest", script: "gen.js" },
        { title: "Xem nhiều", input: BASE_URL + "/danh-sach?sort=most-viewed", script: "gen.js" },
        { title: "Full màu", input: BASE_URL + "/the-loai/full-color", script: "gen.js" },
        { title: "Không che", input: BASE_URL + "/the-loai/khong-che", script: "gen.js" }
    ]);
}
