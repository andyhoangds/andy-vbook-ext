function execute(url) {
    let response = Http.get(url).string();
    let doc = Html.parse(response);

    // 1. Lấy tên truyện (giữ nguyên vì đã chuẩn)
    let name = doc.select("span[style*='font-size: 24px']").text();

    // 2. Lấy tên tác giả - Nhắm vào thẻ <a> đầu tiên nằm trong cấu trúc span > span
    // Chúng ta lấy text và xóa chữ "著" nếu có
    let author = doc.select("div span span a[href*='/fxnlist/']").first().text();

    // 3. Lấy ảnh bìa
    let cover = doc.select("img.imgwidth").first().attr("src");

    // 4. Lấy mô tả - Dùng .text() thay vì .html() để sạch thẻ <p>
    let description = doc.select("div[style*='min-height: 100px']").text();

    // 5. Kiểm tra trạng thái (nếu thấy chữ "大结局" trong toàn bộ text thì là đã hoàn thành)
    let ongoing = doc.text().indexOf("大结局") === -1;

    return Response.success({
        name: name,
        cover: cover,
        author: author,
        description: description,
        detail: "Tác giả: " + author,
        ongoing: ongoing,
        host: "https://www.fxnzw.com"
    });
}