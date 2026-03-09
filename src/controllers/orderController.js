const { mapRequestToOrder } = require("../utils/mapOrder");
const orderService = require("../services/orderService");
const { NotFoundError } = require("../utils/errors");

/**
 * Controller para criação de pedido
 */
async function createOrder(req, res, next) {
  try {
    const mapped = mapRequestToOrder(req.body);
    const order = await orderService.createOrder(mapped);

    return res.status(201).json({
      success: true,
      data: order,
      message: "Pedido criado com sucesso",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller para buscar pedido por ID
 */
async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.orderId);

    if (!order) {
      throw new NotFoundError("Pedido não encontrado");
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller para listar todos os pedidos
 */
async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders();

    return res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller para atualizar pedido
 */
async function updateOrder(req, res, next) {
  try {
    const mapped = mapRequestToOrder(req.body);
    const order = await orderService.updateOrder(req.params.orderId, mapped);

    return res.status(200).json({
      success: true,
      data: order,
      message: "Pedido atualizado com sucesso",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller para deletar pedido
 */
async function deleteOrder(req, res, next) {
  try {
    await orderService.deleteOrder(req.params.orderId);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
};
