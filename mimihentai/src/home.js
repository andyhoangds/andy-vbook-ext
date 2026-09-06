load('config.js');
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/api/manga?sort=updated_at", script: "gen.js" },
        { title: "Xem nhiều", input: BASE_URL + "/api/manga?sort=views", script: "gen.js" },
        { title: "Theo dõi nhiều", input: BASE_URL + "/api/manga?sort=follows", script: "gen.js" },
        { title: "Oneshot", input: BASE_URL + "/api/manga/by-genre/273", script: "gen.js" },
        { title: "Full màu", input: BASE_URL + "/api/manga/by-genre/245", script: "gen.js" }
    ]);
}
