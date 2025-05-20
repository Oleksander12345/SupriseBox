const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Cart = require("../models/Cart"); 
const Box = require("../models/Box");
const Item = require("../models/Item");
const Subscription = require("../models/Subscription");


router.get("/", auth, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.item",
      populate: { path: "items", model: "Item" }
    });
    if (!cart) return res.json([]);

    const cleanedItems = cart.items.filter(entry => entry.item !== null);
    res.json(cleanedItems);
});

// router.post("/add", auth, async (req, res) => {
//   const { boxId } = req.body;
//   const userId = req.user._id;

//   let cart = await Cart.findOne({ user: userId });

//   if (!cart) {
//     cart = new Cart({ user: userId, items: [] });
//   }

//   const existing = cart.items.find(i => i.item.toString() === boxId);
//   if (existing) {
//     existing.quantity += 1;
//   } else {
//     cart.items.push({ item: boxId });
//   }

//   await cart.save();
//   const updated = await Cart.findOne({ user: userId }).populate({
//     path: "items.item",
//     populate: { path: "items", model: "Item" } // тобто Box → items (Item)
//   });
//   res.json({ cart: updated.items });
// });

router.delete("/remove/:boxId", auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const boxId = req.params.boxId;

  cart.items = cart.items.filter(i => i._id.toString() !== req.params.boxId);
  await cart.save();

  res.json({ message: "Item removed", cart: cart.items });
});


router.patch('/increase/:boxId', auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const boxId = req.params.boxId;
  const item = cart.items.find(i => i._id.toString() === req.params.boxId);
  if (item) {
    item.quantity++;
    await cart.save();
  }

  res.json({ cart: cart.items });
});

router.patch('/decrease/:boxId', auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const boxId = req.params.boxId;
  const item = cart.items.find(i => i._id.toString() === req.params.boxId);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(i => i.item?._id?.toString() !== boxId);
    }
    await cart.save();
  }

  res.json({ cart: cart.items });
});

router.post("/add-random/:boxId", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Знаходимо шаблонний бокс
    const templateBox = await Box.findById(req.params.boxId);
    if (!templateBox) {
      return res.status(404).json({ message: "Template box not found" });
    }

    // Отримуємо оригінальні айтеми з цього боксу
    const originalItems = await Item.find({ _id: { $in: templateBox.items } });
    if (!originalItems.length) {
      return res.status(404).json({ message: "No items found in the template box" });
    }

    // Отримуємо унікальні категорії цих айтемів
    const categories = [...new Set(originalItems.map((item) => item.category))];

    // Знаходимо всі предмети з тих самих категорій
    const pool = await Item.find({ category: { $in: categories } });
    if (!pool.length) {
      return res.status(404).json({ message: "No items available in the same categories" });
    }

    // Перемішуємо всі товари й вибираємо випадкові по кількості як у оригіналі
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, originalItems.length);

    // Розрахунок загальної ціни
    const totalPrice = selected.reduce((sum, item) => sum + (item.price || 0), 0);

    // Формуємо новий "випадковий" бокс
    const randomizedBox = {
      name: templateBox.name,
      description: templateBox.description || "",
      image: templateBox.image || "",
      items: selected.map((item) => item._id),
      itemsDetailed: selected.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        category: item.category,
      })),
      price: parseFloat(totalPrice.toFixed(2)),
      type: "box",
    };

    // Отримуємо або створюємо кошик
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Додаємо до кошика
    cart.items.push({
      item: randomizedBox,
      itemType: "box",
      quantity: 1,
    });

    await cart.save();

    res.status(201).json({ message: "Random box added to cart", cart: cart.items });
  } catch (err) {
    console.error("❌ Add-random error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/add-subscription/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const subscriptionId = req.params.id;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const tempSubscription = {
      _id: subscription._id,
      category: subscription.category,
      image: subscription.image,
      price: subscription.price,
      monthsLeft: subscription.monthsLeft,
      type: "subscription",
    };

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    cart.items.push({ item: tempSubscription, itemType: "subscription", quantity: 1 });
    await cart.save();

    res.json({ cart: cart.items });
  } catch (err) {
    console.error("Add-subscription error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;