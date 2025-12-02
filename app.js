const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // 設定 CORS 和 JSON 回應標頭
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // Health API（/api/health）
  if ((req.url === "/api/health" || req.url === "/health") && req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        status: "OK",
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // 首頁
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "歡迎使用旨褘的 API 服務",
        endpoints: {
          health: "/api/health",
          products: "/api/products?min=5000&max=20000",
        },
      })
    );
    return;
  }

  // 商品查詢 API - 支援價格區間篩選
  if (req.url.startsWith("/api/products") && req.method === "GET") {
    const products = [
      { id: 1, name: "手機", price: 12900 },
      { id: 2, name: "筆電", price: 32900 },
      { id: 3, name: "平板", price: 15900 },
      { id: 4, name: "耳機", price: 2990 },
      { id: 5, name: "螢幕", price: 6990 },
      { id: 6, name: "Dell大螢幕", price: 12990 },
    ];

    const parsedUrl = url.parse(req.url, true);
    const min = Number(parsedUrl.query.min) || 0;
    const max = Number(parsedUrl.query.max) || Infinity;

    const matched = products.filter((p) => p.price >= min && p.price <= max);

    const result = {
      min,
      max,
      totalProducts: products.length,
      matchedCount: matched.length,
      matchedProducts: matched,
    };

    res.statusCode = 200;
    res.end(JSON.stringify(result));
    return;
  }

  // 404 處理
  res.statusCode = 404;
  res.end(
    JSON.stringify({
      error: "找不到此路徑",
    })
  );
});

server.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
  console.log(`📍 NODE_ENV: ${process.env.NODE_ENV || "development"}`);
});
