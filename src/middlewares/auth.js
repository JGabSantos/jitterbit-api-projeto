const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

/**
 * Middleware de autenticação JWT
 * Valida token no header Authorization e extrai dados do usuário
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError("Token não informado");
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new BadRequestError(
        "Formato inválido de Authorization. Use: Bearer <token>",
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new BadRequestError("JWT_SECRET não configurado no ambiente");
    }

    const payload = jwt.verify(token, secret);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
    };

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token inválido ou expirado"));
    }

    return next(err);
  }
}

module.exports = {
  authenticate,
};
