function execute(url) {
    // 1. Chuyển đổi link linh hoạt
    let tocUrl = url.replace("fxnbook", "fxnchapter");
    let response = Http.get(tocUrl).string();
    
    if (response) {
        let doc = Html.parse(response);
        let list = [];
        
        // 2. CHIẾN THUẬT MỚI: Nhặt tất cả thẻ <a> có link chứa '/fxnread/'
        // Bỏ qua div.listmain để tránh việc sai lệch cấu trúc giữa các giao diện
        let items = doc.select("a[href*='/fxnread/']");

        for (let i = 0; i < items.size(); i++) {
            let item = items.get(i);
            let name = item.text();
            let path = item.attr("href");

            // Chỉ đẩy vào danh sách nếu có đủ tên và đường dẫn
            if (name && path) {
                list.push({
                    name: name,
                    url: path,
                    host: "https://www.fxnzw.com"
                });
            }
        }

        // 3. Xử lý "rác" mục lục: 
        // Trang này thường lặp lại 12 chương mới nhất ở đầu rồi mới đến danh sách từ chương 1.
        // Nếu cậu thấy bị lặp, hãy dùng: return Response.success(list.slice(12));
        
        Console.log("Số lượng chương tìm thấy: " + list.length);
        return Response.success(list);
    }
    return null;
}