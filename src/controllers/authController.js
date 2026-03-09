const authService = require("../services/authService");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      data: result,
      message: "Usuário registrado com sucesso",
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      data: result,
      message: "Login realizado com sucesso",
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.auth.userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  me,
};
