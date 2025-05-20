const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: Number
});

module.exports = mongoose.model("Item", itemSchema);
