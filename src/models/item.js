const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./order");

/**
 * Modelo de Item (Produto em um Pedido)
 * Cada item pertence a um pedido (Many-to-One)
 */
const Item = sequelize.define(
  "Item",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Order,
        key: "orderId",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "items",
    timestamps: false,
  },
);

Order.hasMany(Item, { foreignKey: "orderId", as: "items" });
Item.belongsTo(Order, { foreignKey: "orderId" });

module.exports = Item;
