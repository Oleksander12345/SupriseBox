const Subscription = require("../models/Subscription");
const Item = require("../models/Item");
const Order = require("../models/Order");

async function processSubscriptions() {
  const today = new Date();
  const dueSubs = await Subscription.find({
    status: "active",
    nextDelivery: { $lte: today },
    monthsLeft: { $gt: 0 }
  });

  for (const sub of dueSubs) {
    const items = await Item.find({ category: sub.category });
    const shuffled = items.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    const price = selected.reduce((sum, i) => sum + i.price, 0);

    const order = new Order({
      user: sub.user,
      boxes: [{
        name: `${sub.category} Subscription Box`,
        items: selected.map(i => i._id),
        quantity: 1,
        price
      }],
      totalPrice: price
    });

    await order.save();
    sub.monthsLeft--;
    sub.nextDelivery = new Date(today.setMonth(today.getMonth() + 1));
    await sub.save();
  }
}

module.exports = processSubscriptions;
