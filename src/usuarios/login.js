if (!user) {
  reply.status(401).send({ message: "Usuário ou senha incorretos!" });
}
