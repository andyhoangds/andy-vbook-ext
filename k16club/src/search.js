load('config.js');
function execute(key, page) {
    let q = String(key || "").replace(/^\s+|\s+$/g, "");
    if (!q) return Response.error("Nhập số trang (ví dụ 1) hoặc id bài /post/");
    if (/^\d+$/.test(q)) {
        let p = parseInt(q, 10);
        if (p < 1) p = 1;
        return Response.success([{
            name: "16K 第" + p + "辑",
            link: packLink(p),
            cover: "",
            description: PAGE_SIZE + "套/辑",
            host: BASE_URL
        }]);
    }
    return Response.error("Trang này không tìm theo tên. Gõ số trang (1, 2, 3…) hoặc mở tab Home.");
}
