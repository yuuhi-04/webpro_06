"use strict";
const express = require("express");
const app = express();

// データの保持（サーバ再起動でリセットされます）
let inventory = [
    { id: 1, name: "ノートPC", quantity: 5 },
    { id: 2, name: "プロジェクター", quantity: 2 }
];

let attendees = [
    { id: 1, name: "小室 春空 ", isPresent: false },
    { id: 2, name: "板橋 優毘", isPresent: true }
];

let assets = [
    { id: 1, name: "会議室A", status: "available", user: "" },
    { id: 2, name: "社用車1号", status: "borrowed", user: "鈴木" }
];

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// --- 在庫管理システムルーティング ---
app.get("/inventory", (req, res) => {
    res.render("inventory", { items: inventory });
});

app.post("/inventory/add", (req, res) => {
    const newItem = {
        id: Date.now(),
        name: req.body.name,
        quantity: Number(req.body.quantity)
    };
    inventory.push(newItem);
    res.redirect("/inventory");
});

app.post("/inventory/delete", (req, res) => {
    const id = Number(req.body.id);
    inventory = inventory.filter(item => item.id !== id);
    res.redirect("/inventory");
});

// --- イベント出席管理システムルーティング ---
app.get("/event", (req, res) => {
    res.render("event", { attendees: attendees });
});

app.post("/attendees/post", (req, res) => {
    const person = {
        id: Date.now(),
        name: req.body.name,
        isPresent: false
    };
    attendees.push(person);
    res.redirect("/event");
});

app.post("/attendees/update", (req, res) => {
    const id = Number(req.body.id);
    const person = attendees.find(p => p.id === id);
    if (person) {
        person.isPresent = !person.isPresent;
    }
    res.redirect("/event");
});

// --- 備品貸出管理システムルーティング ---
app.get("/assets", (req, res) => {
    res.render("assets", { assets: assets });
});

app.post("/assets/borrow", (req, res) => {
    const id = Number(req.body.id);
    const asset = assets.find(a => a.id === id);
    if (asset) {
        asset.status = "borrowed";
        asset.user = req.body.user;
    }
    res.redirect("/assets");
});

app.post("/assets/return", (req, res) => {
    const id = Number(req.body.id);
    const asset = assets.find(a => a.id === id);
    if (asset) {
        asset.status = "available";
        asset.user = "";
    }
    res.redirect("/assets");
});

// サーバ起動
app.listen(8080, () => {
    console.log("Unified Management System listening on port 8080．");
});