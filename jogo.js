app.put('/jogos/:id', async (req, res) => {
  try {
    const jogoAtualizado = await jogo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(jogoAtualizado);
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao editar jogo' });
  }
});