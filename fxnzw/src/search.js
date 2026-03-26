function execute(key, page) {
    // 1. Tái tạo đúng logic của hàm Search() trên web
    // Thay dấu ":" thành khoảng trắng và nối đuôi .html
    let keyword = key.replace(":", " ");
    let searchUrl = "https://www.fxnzw.com/fxnlist/" + encodeURI(keyword) + ".html";
    
    Console.log("Đường dẫn tìm kiếm thực tế: " + searchUrl);

    // 2. Tải trang kết quả
    let response = Http.get(searchUrl).string();

    if (response) {
        let doc = Html.parse(response);
        let list = [];

        // 3. Sử dụng Selector #ListContents mà Hiếu đã soi được từ Inspector
        let items = doc.select("#ListContents > div[style*='margin: 10px']");

        for (let i = 0; i < items.size(); i++) {
            let item = items.get(i);

            // Bóc tách thông tin dựa trên cấu trúc Class chuẩn
            let name = item.select("a.fonttext").text();
            let link = item.select("a.fonttext").attr("href");
            let author = item.select("a[href*='/fxnlist/']").first().text();
            let cover = item.select("img").attr("src");
            let description = item.select(".neirongh5").text();

            if (name && link) {
                list.push({
                    name: name,
                    link: link,
                    author: author || "Chưa rõ",
                    description: description || "",
                    cover: cover || "https://www.fxnzw.com/images/default.jpg",
                    host: "https://www.fxnzw.com"
                });
            }
        }

        return Response.success(list);
    }
    return null;
}