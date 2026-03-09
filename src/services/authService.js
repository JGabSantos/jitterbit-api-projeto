const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");

/**
 * Obtém a chave secreta JWT do ambiente
 * @throws {BadRequestError} Se JWT_SECRET não estiver configurado
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new BadRequestError("JWT_SECRET não configurado no ambiente");
  }

  return secret;
}

/**
 * Gera um token JWT para o usuário
 */
function generateToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

/**
 * Remove dados sensíveis do usuário (exclui passwordHash)
 */
function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Registra um novo usuário no sistema
 * @throws {ConflictError} Se o e-mail já estiver cadastrado
 */
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

/**
 * Autentica usuário e retorna token JWT
 * @throws {UnauthorizedError} Se credenciais forem inválidas
 */
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

/**
 * Busca dados do usuário autenticado pelo ID
 * @throws {NotFoundError} Se usuário não for encontrado
 */
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
