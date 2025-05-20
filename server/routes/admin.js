const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Order = require("../models/Order");
const Box = require("../models/Box");

// Middleware для перевірки адміністратора
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Access denied" });
};

// Кількість користувачів
router.get("/stats/users", isAdmin, async (req, res) => {
  const total = await User.countDocuments();
  res.json({ total });
});

// Кількість замовлень
router.get("/stats/orders", isAdmin, async (req, res) => {
  const total = await Order.countDocuments();
  res.json({ total });
});

// Кількість активних підписок
router.get("/stats/subscriptions", isAdmin, async (req, res) => {
  const total = await Subscription.countDocuments();
  res.json({ total });
});

// Кількість продуктів (боксів)
router.get("/stats/boxes", isAdmin, async (req, res) => {
  const total = await Box.countDocuments();
  res.json({ total });
});

// Всі користувачі
router.get("/users", isAdmin, async (req, res) => {
  const users = await User.find().select("name email");
  res.json(users);
});

// Всі активні підписки
router.get("/subscriptions/active", isAdmin, async (req, res) => {
  const subs = await Subscription.find({ status: "active" })
    .populate("user", "name")
    .select("category nextDelivery");
  const result = subs.map(sub => ({
    user: sub.user.name,
    subscription: sub.category,
    nextDelivery: sub.nextDelivery
  }));
  res.json(result);
});

// Всі замовлення
router.get("/orders", isAdmin, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name")
    .select("createdAt boxes");
  const formatted = orders.map(order => ({
    id: order._id,
    user: order.user.name,
    date: order.createdAt,
    products: order.boxes.map(b => b.name).join(", ")
  }));
  res.json(formatted);
});

module.exports = router;
