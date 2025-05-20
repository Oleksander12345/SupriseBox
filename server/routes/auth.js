const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/admin-only", isAdmin, (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});
router.get("/me", auth, (req, res) => {
  res.json({ message: "🔒 Ви авторизовані", user: req.user });
});
  

module.exports = router;