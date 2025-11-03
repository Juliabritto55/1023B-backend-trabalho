import { Request, Response } from 'express'
import { db } from '../database/banco-mongo.js'
class jogosController {
    async adicionar(req: Request, res: Response) {
        const { titulo, preco, descricao, imagem } = req.body
        if (!titulo || !preco || !descricao || !imagem)
            return res.status(400).json({ error: "Todos os campo (titulo, preço, descrição, imagem) são obrigatórios!" })

        const jogo = { titulo, preco, descricao, imagem }
        const resultado = await db.collection('jogos').insertOne(jogo)
        res.status(201).json({ titulo, preco, descricao, imagem, _id: resultado.insertedId })
    }
    async listar(req: Request, res: Response) {
        const jogos = await db.collection('jogos').find().toArray()
        res.status(200).json(jogos)
    }
}

export default new jogosController()