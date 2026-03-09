const { BadRequestError } = require("../utils/errors");

/**
 * Middleware de validação de dados do pedido
 * Valida numeroPedido, valorTotal, dataCriacao e items
 */
function validateOrderData(req, res, next) {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido) {
      return next(new BadRequestError("Campo 'numeroPedido' é obrigatório"));
    }

    if (!valorTotal || typeof valorTotal !== "number" || valorTotal <= 0) {
      return next(
        new BadRequestError(
          "Campo 'valorTotal' é obrigatório e deve ser um número maior que zero",
        ),
      );
    }

    if (!dataCriacao) {
      return next(new BadRequestError("Campo 'dataCriacao' é obrigatório"));
    }

    const date = new Date(dataCriacao);
    if (isNaN(date.getTime())) {
      return next(
        new BadRequestError("Campo 'dataCriacao' deve ser uma data válida"),
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(
        new BadRequestError(
          "Campo 'items' é obrigatório e deve conter ao menos um item",
        ),
      );
    }

    items.forEach((item, index) => {
      if (!item.idItem) {
        throw new BadRequestError(
          `Item ${index + 1}: campo 'idItem' é obrigatório`,
        );
      }

      if (
        !item.quantidadeItem ||
        typeof item.quantidadeItem !== "number" ||
        item.quantidadeItem <= 0
      ) {
        throw new BadRequestError(
          `Item ${index + 1}: campo 'quantidadeItem' deve ser um número maior que zero`,
        );
      }

      if (
        !item.valorItem ||
        typeof item.valorItem !== "number" ||
        item.valorItem <= 0
      ) {
        throw new BadRequestError(
          `Item ${index + 1}: campo 'valorItem' deve ser um número maior que zero`,
        );
      }
    });

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware de validação do parâmetro orderId
 */
function validateOrderId(req, res, next) {
  try {
    const { orderId } = req.params;

    if (!orderId || orderId.trim() === "") {
      return next(new BadRequestError("Parâmetro 'orderId' é obrigatório"));
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateOrderData,
  validateOrderId,
};
