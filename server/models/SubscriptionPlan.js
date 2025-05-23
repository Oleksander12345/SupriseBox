const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String }
});

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
