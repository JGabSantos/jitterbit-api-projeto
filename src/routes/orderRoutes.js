const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  validateOrderData,
  validateOrderId,
} = require("../middlewares/validateOrder");
const { authenticate } = require("../middlewares/auth");

// Todas as rotas de pedidos exigem autenticação JWT
router.use(authenticate);

router.post("/order", validateOrderData, createOrder);
router.get("/order/list", listOrders);
router.get("/order/:orderId", validateOrderId, getOrderById);
router.put("/order/:orderId", validateOrderId, validateOrderData, updateOrder);
router.delete("/order/:orderId", validateOrderId, deleteOrder);

module.exports = router;
