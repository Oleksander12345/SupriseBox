// models/Subscription.js
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  category: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  nextDelivery: { type: Date },
  status: { type: String, enum: ["active", "cancelled", "pending"], default: "pending" },
  monthsLeft: { type: Number, default: 12 },
  image: { type: String, required: true },
  price: { type: Number, required: true }
});


module.exports = mongoose.model("subscription", subscriptionSchema);
