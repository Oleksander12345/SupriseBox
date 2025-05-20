const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
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

    console.log("🛒 Cart data:", JSON.stringify(cart, null, 2));

    const total = cart.items.reduce(
      (sum, i) => sum + ((i.item?.price || 0) * (i.quantity || 1)),
      0
    );

    const order = new Order({
      user: userId,
      boxes: cart.items.map((i) => {
        const item = i.item;
        const isBox = i.itemType === "box";
        const isObjectId = typeof item === "string" || mongoose.Types.ObjectId.isValid(item);

        if (!isBox || !isObjectId) {
          return {
            name: item?.name || item?.category || "Unknown",
            description: item?.description || "",
            image: item?.image || "",
            price: item?.price || 0,
            quantity: i.quantity || 1,
            items: (item?.itemsDetailed || []).map((subItem) => ({
              _id: subItem._id || null,
              name: subItem.name || "Unknown",
              price: subItem.price || 0,
              category: subItem.category || "Unknown",
            })),
            type: i.itemType || "box",
          };
        }

        return {
          name: "Unknown (ObjectId)",
          description: "",
          image: "",
          price: 0,
          quantity: i.quantity || 1,
          items: [],
          type: i.itemType || "box",
        };
      }),
      totalPrice: total,
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
    console.log("🔍 GET /order for user:", req.user);
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log("📦 Orders found:", orders.length);
    res.json(orders);
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
