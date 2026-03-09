const { BadRequestError } = require("../utils/errors");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegister(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      throw new BadRequestError(
        "Campo 'name' é obrigatório e deve ter ao menos 2 caracteres",
      );
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      throw new BadRequestError(
        "Campo 'email' é obrigatório e deve ser válido",
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      throw new BadRequestError(
        "Campo 'password' é obrigatório e deve ter ao menos 6 caracteres",
      );
    }

    next();
  } catch (err) {
    next(err);
  }
}

function validateLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      throw new BadRequestError(
        "Campo 'email' é obrigatório e deve ser válido",
      );
    }

    if (!password || typeof password !== "string") {
      throw new BadRequestError("Campo 'password' é obrigatório");
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateRegister,
  validateLogin,
};
