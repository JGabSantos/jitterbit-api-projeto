const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new BadRequestError("JWT_SECRET não configurado no ambiente");
  }

  return secret;
}

function generateToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register({ name, email, password }) {
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    throw new ConflictError("Usuário com este e-mail já existe");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  return {
    token: generateToken(user),
    user: sanitizeUser(user),
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Credenciais inválidas");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new UnauthorizedError("Credenciais inválidas");
  }

  return {
    token: generateToken(user),
    user: sanitizeUser(user),
  };
}

async function getMe(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }

  return sanitizeUser(user);
}

module.exports = {
  register,
  login,
  getMe,
};
