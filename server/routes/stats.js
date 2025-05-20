const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
// const Box = require("../models/Box");

router.get("/popular-boxes", async (req, res) => {
  try {
    const pipeline = [
      { $unwind: "$boxes" },
      { $group: { _id: "$boxes.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: "boxes",
          localField: "_id",      // це name боксу з order
          foreignField: "name",   // це name боксу з boxSchema
          as: "boxDetails"
        }
      },
      { $unwind: "$boxDetails" },
      {
        $project: {
          name: "$_id",
          count: 1,
          image: "$boxDetails.image",
          price: "$boxDetails.price"
        }
      }
    ];

    const result = await Order.aggregate(pipeline);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in popular-boxes:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
