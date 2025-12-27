const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// 商品データの初期値（メモリ保存）
let products = [
  { productId: 1, name: "高性能マウス", price: 5000, stock: 10, category: "周辺機器" },
  { productId: 2, name: "メカニカルキーボード", price: 12000, stock: 5, category: "周辺機器" },
  { productId: 3, name: "4Kモニター", price: 45000, stock: 3, category: "ディスプレイ" }
];

// 一覧ページ: GET /products
app.get("/products", (req, res) => {
  res.render('product_list', { data: products });
});

// 新規作成画面へのリダイレクト
app.get("/products/create", (req, res) => {
  res.redirect('/public/product_new.html');
});

// 詳細ページ: GET /products/:index
app.get("/products/:index", (req, res) => {
  const index = req.params.index;
  const item = products[index];
  res.render('product_detail', { id: index, data: item });
});

// カート（注文）モックページ: GET /cart
app.get("/cart", (req, res) => {
  // 本来はセッション等で管理するが、今回は全リストを表示
  res.render('cart', { data: products });
});

// データ追加: POST /products
app.post("/products", (req, res) => {
  const newProduct = {
    productId: products.length + 1,
    name: req.body.name,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    category: req.body.category
  };
  products.push(newProduct);
  res.redirect('/products');
});

app.listen(8080, () => console.log("EC App listening on port 8080!"));