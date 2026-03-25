function execute(url) {
    // 1. Tải nội dung HTML của trang truyện
    let doc = fetch(url).html();

    // 2. Bóc tách tên truyện từ thẻ span có font 24px
    let name = doc.select("span[style*='font-size: 24px']").text();

    // 3. Bóc tách ảnh bìa từ class imgwidth
    let cover = doc.select("img.imgwidth").first().attr("src");

    // 4. Bóc tách tên tác giả từ link dẫn đến fxnlist
    let author = doc.select("a[href*='/fxnlist/']").first().text();

    // 5. Bóc tách mô tả từ khối div có min-height 100px
    let description = doc.select("div[style*='min-height: 100px']").html();

    // Làm sạch nội dung mô tả (xóa ký tự khoảng trắng dư thừa)
    if (description) {
        description = description.replace(/&nbsp;/g, "").trim();
    }

    // Kiểm tra trạng thái truyện (Ongoing hay Completed)
    let ongoing = doc.text().indexOf("大结局") === -1;

    // 6. Trả về kết quả đúng chuẩn vBook
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