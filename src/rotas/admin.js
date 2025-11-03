app.delete('/admin/usuarios/:id', async (req, reply) => {
  const { id } = req.params;
  await prisma.usuario.delete({ where: { id } });
  reply.send({ message: "Usuário excluído com sucesso!" });
});

app.delete('/admin/carrinhos/:id', async (req, reply) => {
  const { id } = req.params;
  await prisma.carrinho.deleteMany({ where: { usuarioId: id } });
  reply.send({ message: "Carrinho excluído com sucesso!" });
});
