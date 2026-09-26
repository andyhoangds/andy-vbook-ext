load('config.js');
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/trang-chu?page=1", script: "gen.js" },
        { title: "Manhwa", input: BASE_URL + "/tim-truyen/manhwa-11400", script: "gen.js" },
        { title: "Manhua", input: BASE_URL + "/tim-truyen/manhua", script: "gen.js" },
        { title: "Manga", input: BASE_URL + "/tim-truyen/manga-112", script: "gen.js" },
        { title: "Truyện màu", input: BASE_URL + "/tim-truyen/truyen-mau", script: "gen.js" }
    ]);
}
