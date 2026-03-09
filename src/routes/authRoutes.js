const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validateAuth");
const { authenticate } = require("../middlewares/auth");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authenticate, me);

module.exports = router;
