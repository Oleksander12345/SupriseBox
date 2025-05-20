const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  price: {type: Number, required: true},
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Box", boxSchema);
