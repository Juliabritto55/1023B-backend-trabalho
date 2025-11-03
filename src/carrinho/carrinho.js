app.delete('/carrinho', async (req, reply) => {
  const userId = req.user.id;
  await prisma.carrinho.deleteMany({ where: { usuarioId: userId } });
  reply.send({ message: "Carrinho esvaziado com sucesso!" });
});
