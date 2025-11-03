app.put('/carrinho/item', async (req, res) => {
  const { produtoId, novaQuantidade } = req.body;

  try {
    const carrinho = await Carrinho.findOne({ usuarioId: req.user.id });
    const item = carrinho.itens.find(i => i.produtoId.toString() === produtoId);

    if (!item) return res.status(404).json({ msg: 'Item não encontrado' });

    item.quantidade = novaQuantidade;
    await carrinho.save();

    res.json(carrinho);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar item' });
  }
});
