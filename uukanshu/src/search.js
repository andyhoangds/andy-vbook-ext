load('config.js');
function execute(key, page) {
    let response = fetch(BASE_URL + "/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": BASE_URL + "/search"
        },
        body: {
            searchtype: "all",
            searchkey: key,
            action: "login"
        }
    });
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();
    let data = parseBookList(doc);
    return Response.success(data);
}
