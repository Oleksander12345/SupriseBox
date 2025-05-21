const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.Mixed, refPath: "items.itemType" }, // Змішаний тип для ObjectId або об'єкта
      itemType: { type: String, enum: ["box", "subscription"], required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);
