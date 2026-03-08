const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * Modelo de Pedido com campos: orderId, value, creationDate
 * Relacionamento: 1 Pedido tem N Itens
 */
const Order = sequelize.define(
  "Order",
  {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  },
);

module.exports = Order;
