const express = require("express");
const app = express();
const orderRoutes = require("./routes/orderRoutes");
const { AppError } = require("./utils/errors");

// Middleware para parsear JSON
app.use(express.json());

// Rotas da API
app.use(orderRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
});

// Middleware centralizado de tratamento de erros (deve ser o último)
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Erros operacionais customizados (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Erros de validação do Sequelize
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      error: "Erro de validação",
      details: err.errors.map((e) => e.message),
    });
  }

  // Erros de conexão com BD
  if (err.name === "SequelizeConnectionError") {
    return res.status(503).json({
      success: false,
      error: "Erro de conexão com o banco de dados",
    });
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
  });
});

module.exports = app;
