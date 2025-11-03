import {Router} from 'express'

import carrinhoController from '../carrinho/carrinho.controller.js'
import jogosController from '../produtos/jogos.controller.js'

const rotas = Router()
rotas.post('/jogos',jogosController.adicionar)
rotas.get('/jogos',jogosController.listar)

rotas.post('/adicionarItem',carrinhoController.adicionarItem)
rotas.post('/removerItem',carrinhoController.removerItem)
rotas.get('/carrinho/:usuarioId',carrinhoController.listar)
rotas.delete('/carrinho/:usuarioId',carrinhoController.remover)

export default rotas