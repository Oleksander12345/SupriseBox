const express = require("express");
const router = express.Router();
const Box = require("../models/Box");
const Item = require("../models/Item");

router.post("/generate", async (req, res) => {
  try {
    const { name, description, image, categories = [] } = req.body;
    const allItems = await Item.find({ category: { $in: categories } });

    if (!allItems || allItems.length === 0) {
      return res.status(400).json({ message: "No items found for these categories" });
    }

    if (allItems.length < 2) {
      return res.status(400).json({ message: "Not enough items to generate a box (need at least 3)" });
    }
    const min = 2;
    const max = allItems.length;
    const itemsPerBox = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = allItems.sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, itemsPerBox);
    const validItems = selectedItems.filter(item => item && item._id);
    const totalPrice = validItems.reduce((sum, item) => sum + (item.price || 0), 0);

    const box = new Box({
      name,
      description,
      image,
      price: totalPrice,
      items: validItems.map(item => item._id)
    });

    await box.save();
    res.status(201).json(box);
  } catch (err) {
    console.error("Box generation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const boxes = await Box.find().populate("items");
    res.json(boxes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const box = await Box.findById(req.params.id).populate("items");
    if (!box) return res.status(404).json({ message: "Box not found" });
    res.json(box);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
