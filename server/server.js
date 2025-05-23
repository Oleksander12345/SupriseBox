require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const boxRoutes = require("./routes/box");
const itemRoutes = require("./routes/item");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");
const subscriptionRoutes = require("./routes/subscription");
const subscriptionPlanRoutes = require("./routes/subscriptionPlan");
const adminRoutes = require("./routes/admin");
const statsRoutes = require("./routes/stats");
const authMiddleware = require("./middleware/authMiddleware")
const app = express();
const cron = require("node-cron");
const processSubscriptions = require("./utils/processSubscriptions");

cron.schedule("0 0 * * *", processSubscriptions); // запускає щодня о 00:00

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/boxes", boxRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", subscriptionRoutes)
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/stats", statsRoutes)
app.use("/api/subscriptionPlan", subscriptionPlanRoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
  .catch(err => console.log(err));
