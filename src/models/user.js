const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * Modelo de Usuário para autenticação JWT
 * Hash de senha gerado via bcrypt no authService
 */
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

module.exports = User;
