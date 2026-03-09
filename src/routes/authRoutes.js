const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validateAuth");
const { authenticate } = require("../middlewares/auth");

// POST /auth/register - Cria novo usuário e retorna token JWT
router.post("/register", validateRegister, register);

// POST /auth/login - Autentica usuário e retorna token JWT
router.post("/login", validateLogin, login);

// GET /auth/me - Retorna dados do usuário autenticado (requer token)
router.get("/me", authenticate, me);

module.exports = router;
