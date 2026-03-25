function execute(key, page) {
    if (!page) page = '1';
    
    // Gửi yêu cầu tìm kiếm (fxnzw thường dùng GET với param searchkey)
    let response = fetch("https://www.fxnzw.com/search.php", {
        method: "GET",
        queries: {
            "searchkey": key,
            "page": page
        }
    });

    let doc = response.html();
    let results = [];
    
    // Bóc tách danh sách truyện từ trang kết quả
    // Selector này cần khớp với cấu trúc thực tế của trang search
    let items = doc.select(".search-list li"); 
    
    items.forEach(item => {
        results.push({
            name: item.select(".bookname").text(),
            link: item.select("a").first().attr("href"),
            cover: item.select("img").attr("src"),
            description: item.select(".intro").text(),
            host: "https://www.fxnzw.com"
        });
    });

    // Tính toán trang tiếp theo (nếu có)
    let next = (parseInt(page) + 1).toString();
    
    // Trả về danh sách kết quả và vị trí trang tiếp theo [cite: 13, 25]
    return Response.success(results, next);
}