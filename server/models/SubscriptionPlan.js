const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true, // одна категорія = один план
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
//   description: {
//     type: String,
//     default: ""
//   },
  boxCount: {
    type: Number,
    default: 12 // скільки місяців триває підписка
  },
  isVisible: {
    type: Boolean,
    default: true // чи показувати публічно на фронті
  }
}, { timestamps: true });

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
