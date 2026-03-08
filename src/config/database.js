const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configuração da conexão com MySQL
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false, // Desativa logs SQL (ativar para debug)
    // Pool de conexões para gerenciar múltiplas conexões
    pool: {
      max: 5, // Máximo de conexões simultâneas
      min: 0, // Mínimo de conexões
      acquire: 30000, // Tempo máximo para adquirir conexão (ms)
      idle: 10000, // Tempo máximo inativo (ms)
    },
  },
);

module.exports = sequelize;
