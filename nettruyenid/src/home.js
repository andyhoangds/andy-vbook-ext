load('config.js');
function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/?page=1", script: "gen.js" },
        { title: "Manhwa", input: BASE_URL + "/the-loai/manhwa", script: "gen.js" },
        { title: "Manhua", input: BASE_URL + "/the-loai/manhua", script: "gen.js" },
        { title: "Manga", input: BASE_URL + "/the-loai/manga", script: "gen.js" },
        { title: "Truyện màu", input: BASE_URL + "/the-loai/truyen-mau", script: "gen.js" }
    ]);
}
