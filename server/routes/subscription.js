const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const auth = require("../middleware/authMiddleware");
const Box = require("../models/Box");
const User = require("../models/User");

router.post("/", auth, async (req, res) => {
  const { category } = req.body;

  if (!category) return res.status(400).json({ message: "Category is required" });

  const existing = await Subscription.findOne({ user: req.user._id, category, status: "active" });
  if (existing) return res.status(400).json({ message: "You already have this subscription" });

  // 🔍 Знаходимо відповідний бокс за назвою
  const box = await Box.findOne({ name: category });
  if (!box) return res.status(404).json({ message: "Box not found" });

  
  const subscription = new Subscription({
    user: req.user._id,
    category,
    price: box.price,
    image: box.image,
    status: "pending",
    nextDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  await subscription.save();
  res.status(201).json({ message: "Subscription created", subscription });
});

router.get("/", auth, async (req, res) => {
  const subs = await Subscription.find({ user: req.user._id });
  res.json(subs);
});

router.patch("/cancel/:id", auth, async (req, res) => {
  const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
  if (!sub) return res.status(404).json({ message: "Subscription not found" });
  sub.status = "cancelled";
  await sub.save();
  res.json({ message: "Subscription cancelled" });
});

router.patch("/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["active", "paused", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
  if (!sub) return res.status(404).json({ message: "Subscription not found" });

  sub.status = status;

  // Якщо відновлюємо — оновлюємо дату наступної доставки
  if (status === "active") {
    sub.nextDelivery = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  await sub.save();
  res.json({ message: "Status updated", subscription: sub });
});

router.patch("/:id/plan", auth, async (req, res) => {
  const { category } = req.body;

  const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
  if (!sub) return res.status(404).json({ message: "Subscription not found" });

  const box = await Box.findOne({ name: category });
  if (!box) return res.status(404).json({ message: "New box not found" });

  sub.category = category;
  sub.price = box.price;
  sub.image = box.image;
  await sub.save();

  res.json({ message: "Plan changed", subscription: sub });
});

module.exports = router;


router.put("/activate/:id", auth, async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Subscription not found" });
    res.json({ message: "Subscription activated", subscription: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});