const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const auth = require("../middleware/authMiddleware");
const Box = require("../models/Box");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");

// router.post("/", auth, async (req, res) => {
//   const { category } = req.body;

//   if (!category) return res.status(400).json({ message: "Category is required" });

//   const existing = await Subscription.findOne({ user: req.user._id, category, status: "active" });
//   if (existing) return res.status(400).json({ message: "You already have this subscription" });

//   // 🔍 Знаходимо відповідний бокс за назвою
//   const box = await Box.findOne({ name: category });
//   if (!box) return res.status(404).json({ message: "Box not found" });

  
//   const subscription = new Subscription({
//     user: req.user._id,
//     category,
//     price: box.price,
//     image: box.image,
//     status: "pending",
//     nextDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//   });

//   await subscription.save();
//   res.status(201).json({ message: "Subscription created", subscription });
// });

router.post("/", auth, async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) return res.status(400).json({ message: "planId is required" });

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const existing = await Subscription.findOne({
      user: req.user._id,
      category: plan.category,
      status: "active"
    });

    if (existing) return res.status(400).json({ message: "You already have this subscription active" });

    const sub = new Subscription({
      user: req.user._id,
      category: plan.category,
      image: plan.image,
      price: plan.price,
      monthsLeft: plan.boxCount || 12,
      status: "pending",
      nextDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 днів
    });

    await sub.save();
    res.status(201).json({ message: "Subscription created", subscription: sub });

  } catch (err) {
    console.error("❌ Subscription creation failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const userSubscriptions = await Subscription.find({
      user: req.user._id,
      status: { $in: ["active", "paused"] }  // тільки активні або на паузі
    });

    res.json(userSubscriptions);
  } catch (err) {
    console.error("❌ Fetch subscriptions error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
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
    const subscriptionId = req.params.id;

    // 🔍 Перевіримо, чи справді належить цьому користувачу
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found or access denied" });
    }

    // 🔄 Оновлюємо статус і дату наступної доставки
    subscription.status = "active";
    console.log(subscription.status)
    subscription.nextDelivery = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await subscription.save();

    res.json({ message: "Subscription activated", subscription });
  } catch (err) {
    console.error("❌ Subscription activation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
