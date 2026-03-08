/**
 * Converte formato de requisição para formato de banco de dados
 * numeroPedido → orderId, valorTotal → value, etc.
 */
function mapRequestToOrder(body) {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: (body.items || []).map((item) => ({
      productId: parseInt(item.idItem, 10),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}

module.exports = { mapRequestToOrder };
