const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Створити один товар
router.post("/", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Item POST error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Отримати всі товари
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("Item POST error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
