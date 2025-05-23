const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

router.post('/create-intent', async (req, res) => {
  const { amount } = req.body;
  console.log("💰 Received amount:", amount); // 👉 перевір значення

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // у центах!
      currency: "usd",  
      automatic_payment_methods: { enabled: true },
    });
    
    console.log("✅ Created intent:", paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("❌ Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});
router.post("/payment-success", async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Знаходимо замовлення
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Оновлюємо статус замовлення
    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    res.status(200).json({
      message: "Order paid successfull",
    });
  } catch (err) {
    console.error("❌ payment-success error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;