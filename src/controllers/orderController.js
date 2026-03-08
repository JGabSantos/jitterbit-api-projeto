const { mapRequestToOrder } = require("../utils/mapOrder");
const orderService = require("../services/orderService");
const { NotFoundError } = require("../utils/errors");

/**
 * Cria um novo pedido
 * Mapeia dados da requisição e chama serviço de criação
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
