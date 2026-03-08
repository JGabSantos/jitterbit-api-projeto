const Order = require("../models/order");
const Item = require("../models/item");
const { NotFoundError, ConflictError } = require("../utils/errors");

/**
 * Cria um novo pedido com seus itens associados
 * @param {Object} mapped - Dados do pedido (orderId, value, creationDate, items[])
 * @returns {Promise<Object>} Pedido criado com itens inclusos
 * @throws {ConflictError} Se o pedido já existe
 */
async function createOrder(mapped) {
  // Verifica se o pedido já existe (evita duplicatas)
  const exists = await Order.findOne({ where: { orderId: mapped.orderId } });
  if (exists) {
    throw new ConflictError("Pedido com este número já existe");
  }

  const order = await Order.create({
    orderId: mapped.orderId,
    value: mapped.value,
    creationDate: mapped.creationDate,
  });

  // Cria todos os itens em paralelo
  await Promise.all(
    mapped.items.map((item) =>
      Item.create({ ...item, orderId: mapped.orderId }),
    ),
  );

  return await Order.findOne({
    where: { orderId: mapped.orderId },
    include: [{ model: Item, as: "items" }],
  });
}

/**
 * Busca um pedido pelo ID com seus itens inclusos
 * @param {string} orderId - ID do pedido
 * @returns {Promise<Object|null>} Pedido encontrado ou null
 */
async function getOrderById(orderId) {
  return await Order.findOne({
    where: { orderId },
    include: [{ model: Item, as: "items" }],
  });
}

/**
 * Lista todos os pedidos ordenados por data de criação (mais recentes primeiro)
 * @returns {Promise<Array>} Array de pedidos com itens inclusos
 */
async function listOrders() {
  return await Order.findAll({
    include: [{ model: Item, as: "items" }],
    order: [["creationDate", "DESC"]],
  });
}

/**
 * Atualiza um pedido e seus itens (remove antigos e cria novos)
 * @param {string} orderId - ID do pedido a atualizar
 * @param {Object} mapped - Novos dados do pedido
 * @returns {Promise<Object>} Pedido atualizado
 * @throws {NotFoundError} Se o pedido não existe
 */
async function updateOrder(orderId, mapped) {
  const order = await Order.findOne({ where: { orderId } });
  if (!order) {
    throw new NotFoundError("Pedido não encontrado");
  }

  await order.update({
    value: mapped.value,
    creationDate: mapped.creationDate,
  });

  // Remove itens antigos e cria novos
  await Item.destroy({ where: { orderId } });
  await Promise.all(
    mapped.items.map((item) => Item.create({ ...item, orderId })),
  );

  return await Order.findOne({
    where: { orderId },
    include: [{ model: Item, as: "items" }],
  });
}

/**
 * Deleta um pedido e todos seus itens
 * @param {string} orderId - ID do pedido a deletar
 * @throws {NotFoundError} Se o pedido não existe
 */
async function deleteOrder(orderId) {
  const order = await Order.findOne({ where: { orderId } });
  if (!order) {
    throw new NotFoundError("Pedido não encontrado");
  }

  await Item.destroy({ where: { orderId } });
  await order.destroy();
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
};
