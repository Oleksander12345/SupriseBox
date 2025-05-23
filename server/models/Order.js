const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  boxes: [
    {
      name: String,
      description: String,
      image: String,
      price: Number,
      type: { type: String, enum: ["box", "subscription"], required: true },
      quantity: { type: Number, default: 1 },
      items: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
          name: String,
          price: Number,
          category: String
        }
      ]
    }
  ],
  subscriptions: [
        {
            subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "subscription" },
        },
    ],
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
