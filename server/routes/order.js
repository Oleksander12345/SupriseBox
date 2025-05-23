const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Subscription = require("../models/Subscription");
const Cart = require("../models/Cart");
const auth = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const boxes = [];
    const subscriptions = [];
    let total = 0;

    for (const entry of cart.items) {
      const { item, itemType, quantity } = entry;

      if (itemType === "box") {
        // Якщо box зберігається як об'єкт (а не _id)
        if (item?.itemsDetailed) {
          boxes.push({
            name: item.name || "Unnamed Box",
            description: item.description || "",
            image: item.image || "",
            price: item.price || 0,
            quantity: quantity || 1,
            type: "box",
            items: item.itemsDetailed.map((i) => ({
              _id: i._id,
              name: i.name,
              price: i.price,
              category: i.category,
            })),
          });
          total += (item.price || 0) * (quantity || 1);
        }
      }

      if (itemType === "subscription") {
        // item — це ObjectId
        const subscription = await Subscription.findById(item);
        if (subscription) {
          subscriptions.push({
            subscriptionId: subscription._id,
            quantity: quantity || 1,
          });
          total += subscription.price * (quantity || 1);
        }
      }
    }

    const order = new Order({
      user: userId,
      boxes,
      subscriptions,
      totalPrice: parseFloat(total.toFixed(2)),
    });

    await order.save();
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error("❌ POST /order error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("subscriptions.subscriptionId")  // 👈 ключовий момент
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ GET /order error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/paid", auth, async (req, res) => {
  try {
    const paidOrders = await Order.find({
      user: req.user._id,
      isPaid: true
    }).sort({ createdAt: -1 });

    res.json(paidOrders);
  } catch (err) {
    console.error("❌ Failed to fetch paid orders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/paid-subscriptions", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      isPaid: true
    }).sort({ createdAt: -1 });

    // Витягуємо лише бокси з типом "subscription"
    const subscriptions = orders.flatMap(order =>
      order.boxes.filter(box => box.type === "subscription")
    );

    res.json(subscriptions);
  } catch (err) {
    console.error("❌ Failed to fetch paid subscriptions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
