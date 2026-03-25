function execute(url) {
    // Tải mã nguồn của chương truyện
    let response = fetch(url);
    let doc = response.html();

    // Loại bỏ các thẻ script và quảng cáo lọt vào trong nội dung
    // Chúng ta dùng selector để nhắm thẳng vào các phần tử rác
    doc.select("#content script").remove();
    doc.select("#content style").remove();
    
    // Lấy nội dung HTML thô từ thẻ chứa truyện
    let rawContent = doc.select("#content").html();

    // Sử dụng hàm bổ trợ Html.clean để chỉ giữ lại các thẻ p và br
    // Giúp nội dung hiển thị trên vBook mượt mà và đúng định dạng
    let cleanContent = Html.clean(rawContent, ["p", "br"]);

    // Trả về nội dung sạch cho người đọc
    return Response.success(cleanContent);
}