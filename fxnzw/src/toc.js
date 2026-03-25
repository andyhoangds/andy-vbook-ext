function execute(url) {
    // 1. Tải nội dung HTML của trang mục lục [cite: 17, 21]
    let response = fetch(url);
    let doc = response.html();

    // 2. Xác định vùng chứa danh sách chương
    // Trên fxnzw, danh sách chương thường nằm trong thẻ div có id là 'list' hoặc 'chapterlist'
    let el = doc.select("#list dl dd a"); 
    
    let list = [];
    for (let i = 0; i < el.size(); i++) {
        let e = el.get(i);
        
        // 3. Thêm từng chương vào danh sách 
        list.push({
            name: e.text(),           // Tên chương [cite: 16]
            url: e.attr("href"),      // Đường dẫn chương [cite: 16]
            host: "https://www.fxnzw.com" // Host để app tự nối link nếu là link rút gọn [cite: 16]
        });
    }

    // 4. Trả về kết quả thành công cho vBook [cite: 25]
    return Response.success(list);
}