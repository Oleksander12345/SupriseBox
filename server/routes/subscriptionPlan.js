const express = require("express");
const router = express.Router();
const SubscriptionPlan = require("../models/SubscriptionPlan");


router.get("/plans", async (req, res) => {
  const plans = await SubscriptionPlan.find();
  res.json(plans);
});
// 🔐 Якщо хочеш обмежити доступ — додай auth + isAdmin
router.post("/", async (req, res) => {
  try {
    const { category, price, image, description } = req.body;

    if (!category || !price) {
      return res.status(400).json({ message: "Category and price are required" });
    }

    const existing = await SubscriptionPlan.findOne({ category });
    if (existing) {
      return res.status(400).json({ message: "Plan already exists" });
    }

    const newPlan = new SubscriptionPlan({ category, price, image, description });
    await newPlan.save();

    res.status(201).json({ message: "Subscription plan created", plan: newPlan });
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
