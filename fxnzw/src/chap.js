function execute(url) {
    let response = Http.get(url).string();
    if (response) {
        let doc = Html.parse(response);
        
        // [Suy luận] Nội dung truyện thường nằm trong div có id="content" hoặc tương tự
        // Cậu hãy soi mã nguồn trên PC để điền đúng Selector vào đây nhé
        let content = doc.select("#Lab_Contents").html();

        // Bước dọn dẹp nội dung để tăng trải nghiệm đọc
        if (content) {
            content = content.replace(/&nbsp;/g, " ") // Đổi khoảng trắng mã hóa thành khoảng trắng thường
                             .replace(/<br\s*\/?>/gi, "\n") // Đổi thẻ <br> thành xuống dòng
                             .replace(/Thêm các từ khóa quảng cáo cần xóa ở đây/g, "　　……：mayiwsk←→新书推荐：");
        }

        return Response.success(content);
    }
    return null;
}