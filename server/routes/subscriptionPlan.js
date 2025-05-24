const express = require("express");
const router = express.Router();
const SubscriptionPlan = require("../models/SubscriptionPlan");

// 🔓 GET /api/subscription/plans
// Отримати всі доступні плани (можна без авторизації)
router.get("/", async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isVisible: true });
    res.json(plans);
  } catch (err) {
    console.error("❌ Failed to fetch plans:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /api/subscription/plans
// Створити новий план підписки (можна обмежити доступ адміну)
router.post("/", async (req, res) => {
  try {
    const { category, price, image, boxCount } = req.body;

    if (!category || !price) {
      return res.status(400).json({ message: "Category and price are required" });
    }

    const exists = await SubscriptionPlan.findOne({ category });
    if (exists) {
      return res.status(400).json({ message: "Plan already exists for this category" });
    }

    const plan = new SubscriptionPlan({
      category,
      price,
      image,
      boxCount
    });

    await plan.save();
    res.status(201).json({ message: "Plan created", plan });
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
