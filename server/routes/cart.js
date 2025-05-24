const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Cart = require("../models/Cart"); 
const Box = require("../models/Box");
const Item = require("../models/Item");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const Subscription = require("../models/Subscription");
const mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json([]);

    const populatedItems = await Promise.all(
      cart.items.map(async (entry) => {
        if (entry.itemType === "subscription" && mongoose.isValidObjectId(entry.item)) {
          // Підписка — підтягуємо дані через populate вручну
          const sub = await Subscription.findById(entry.item);
          return sub
            ? { ...entry.toObject(), item: sub }
            : null;
        } else {
          // Бокс — нічого не чіпаємо
          return entry;
        }
      })
    );

    const cleaned = populatedItems.filter((entry) => entry && entry.item !== null);
    res.json(cleaned);
  } catch (err) {
    console.error("❌ Get cart error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



router.delete("/remove/:cartItemId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const cartItemId = req.params.cartItemId;

    // Знаходимо сам елемент
    const itemToRemove = cart.items.find(i => i._id.toString() === cartItemId);
    if (!itemToRemove) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Якщо це підписка — видаляємо також з колекції Subscription
    if (itemToRemove.itemType === "subscription") {
      try {
        await Subscription.findByIdAndDelete(itemToRemove.item);
      } catch (err) {
        console.warn(`⚠ Failed to delete subscription with ID ${itemToRemove.item}:`, err.message);
      }
    }

    // Видаляємо сам елемент з масиву кошика
    cart.items = cart.items.filter(i => i._id.toString() !== cartItemId);
    await cart.save();

    res.json({ message: "Item removed from cart", cart: cart.items });

  } catch (err) {
    console.error("❌ Remove item error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch('/increase/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemId = req.params.itemId;
    const item = cart.items.find(i => i._id.toString() === itemId);
    if (item) {
      item.quantity++;
      await cart.save();
      return res.json({ cart: cart.items });
    }

    res.status(404).json({ message: "Item not found in cart" });
  } catch (err) {
    console.error("❌ Increase quantity error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch('/decrease/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemId = req.params.itemId;
    const item = cart.items.find(i => i._id.toString() === itemId);

    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(i => i._id.toString() !== itemId);

        // Якщо це підписка — видаляємо з колекції Subscription
        if (item.itemType === "subscription") {
          try {
            await Subscription.findByIdAndDelete(item.item);
          } catch (err) {
            console.warn(`⚠ Failed to delete subscription with ID ${item.item}:`, err.message);
          }
        }
      }

      await cart.save();
      return res.json({ cart: cart.items });
    }

    res.status(404).json({ message: "Item not found in cart" });
  } catch (err) {
    console.error("❌ Decrease quantity error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/add-random/:boxId", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const templateBox = await Box.findById(req.params.boxId);
    if (!templateBox) return res.status(404).json({ message: "Template box not found" });

    const originalItems = await Item.find({ _id: { $in: templateBox.items } });
    const categories = [...new Set(originalItems.map(item => item.category))];
    const pool = await Item.find({ category: { $in: categories } });
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, originalItems.length);

    const totalPrice = selected.reduce((sum, item) => sum + (item.price || 0), 0);

    const randomizedBox = {
      name: templateBox.name,
      description: templateBox.description || "",
      image: templateBox.image || "",
      items: selected.map(item => item._id),
      itemsDetailed: selected.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        category: item.category,
      })),
      price: parseFloat(totalPrice.toFixed(2)),
      type: "box",
    };

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    cart.items.push({
      item: randomizedBox, // ⚠️ Повний об'єкт
      itemType: "box",
      quantity: 1,
    });

    await cart.save();
    res.status(201).json({ message: "Random box added (inline)", cart: cart.items });
  } catch (err) {
    console.error("❌ Add-random-inline error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/add-subscription/:planId", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const planId = req.params.planId;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    // Перевірка: чи вже існує така підписка у користувача
    const existingSub = await Subscription.findOne({
      user: userId,
      category: plan.category,
      status: { $in: ["pending", "active"] } // уникаємо дублів
    });

    if (existingSub) {
      return res.status(400).json({ message: "You already have this subscription" });
    }

    // Створення нової персональної підписки
    const subscription = new Subscription({
      user: userId,
      category: plan.category,
      image: plan.image,
      price: plan.price,
      monthsLeft: plan.boxCount || 12,
      status: "pending",
      nextDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await subscription.save();

    // Додаємо до кошика
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    cart.items.push({
      item: subscription._id,
      itemType: "subscription",
      quantity: 1
    });

    await cart.save();

    res.status(201).json({
      message: "Subscription created and added to cart",
      cart: cart.items
    });

  } catch (err) {
    console.error("❌ Add-subscription error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;