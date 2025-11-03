function ItemCarrinho({ item, atualizarQuantidade }) {
  return (
    <div>
      <span>{item.nome}</span>
      <input
        type="number"
        min="1"
        value={item.quantidade}
        onChange={(e) => atualizarQuantidade(item.id, e.target.value)}
      />
    </div>
  );
}

const atualizarQuantidade = async (produtoId, novaQuantidade) => {
  await fetch('/api/carrinho/item', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ produtoId, novaQuantidade })
  });
};
