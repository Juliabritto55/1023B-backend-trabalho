import { Request, Response } from "express";
//import aqui as dependências necessárias
import { ObjectId } from "bson";
import { db } from "../database/banco-mongo.js";

interface ItemCarrinho {
    jogoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
}

interface Carrinho {
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}
interface AutenticacaoRequest extends Request {
    usuarioId?:string;
}
class CarrinhoController {
    //adicionarItem
    async adicionarItem(req:AutenticacaoRequest, res:Response) {
        console.log("Chegou na rota de adicionar item ao carrinho");
    const { jogoId, quantidade } = req.body;
        if(!req.usuarioId)
            return res.status(401).json({mensagem:"Usuário inválido!"})
        const usuarioId = req.usuarioId 
        //Buscar o produto no banco de dados
    const jogo = await db.collection("jogos").findOne({ _id: ObjectId.createFromHexString(jogoId)});
        if (!jogo) {
            return res.status(400).json({ mensagem: "Jogo não encontrado" });
        }
        //Pegar o preço do produto
        //Pegar o nome do produto
        const precoUnitario = jogo.preco; // Supondo que o produto tenha um campo 'preco'
        const nome = jogo.nome; // Supondo que o produto tenha um campo 'nome'
        
        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });
         // Verificar se um carrinho com o usuário já existe
        if (!carrinho) {
            // Se não existir deve criar um novo carrinho
            const novoCarrinho: Carrinho = {
                usuarioId: usuarioId,
                itens: [{
                    jogoId: jogoId,
                    quantidade: quantidade,
                    precoUnitario: precoUnitario,
                    nome: nome
                }],
                dataAtualizacao: new Date(),
                total: precoUnitario * quantidade
            };
            await db.collection("carrinhos").insertOne(novoCarrinho);
            return res.status(201).json(novoCarrinho);
        }
        // Se existir, deve adicionar o item ao carrinho existente
    const itemExistente = carrinho.itens.find(item => item.jogoId === jogoId);
        if (itemExistente) {
            // Se o item já existir no carrinho, atualizar a quantidade
            itemExistente.quantidade += quantidade;
        } else {
            // Se o item não existir, adicionar ao carrinho
            carrinho.itens.push({
                jogoId: jogoId,
                quantidade: quantidade,
                precoUnitario: precoUnitario,
                nome: nome
            });
        }
        // Calcular o total do carrinho
        const total = carrinho.itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
        carrinho.total = total; 
        // Atualizar a data de atualização do carrinho
        carrinho.dataAtualizacao = new Date();

        // Salvar as alterações no banco de dados
        await db.collection("carrinhos").updateOne(
            { usuarioId: usuarioId },
            { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
        );

        //Responder com o carrinho atualizado
        return res.status(200).json(carrinho);
    } 
    //removerItem
    async removerItem(req:Request, res:Response) {
        const { usuarioId, jogoId } = req.body;
        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });
        if (!carrinho) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }
        const itemIndex = carrinho.itens.findIndex(item => item.jogoId === jogoId);
        if (itemIndex === -1) {
            return res.status(404).json({ mensagem: "Item não encontrado no carrinho" });
        }
        carrinho.itens.splice(itemIndex, 1);
        // Recalcular o total do carrinho
        const total = carrinho.itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
        carrinho.total = total;
        carrinho.dataAtualizacao = new Date();
        await db.collection("carrinhos").updateOne(
            { usuarioId: usuarioId },
            { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
        );
        return res.status(200).json(carrinho);
    }
    //atualizarQuantidade
    async atualizarQuantidade(req:Request, res:Response) {
        const { usuarioId, jogoId, quantidade } = req.body;
        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });
        if (!carrinho) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }
        const item = carrinho.itens.find(item => item.jogoId === jogoId);
        if (!item) {
            return res.status(404).json({ mensagem: "Item não encontrado no carrinho" });
        }
        if (quantidade <= 0) {
            return res.status(400).json({ mensagem: "Quantidade deve ser maior que zero" });
        }
        item.quantidade = quantidade;
        // Recalcular o total do carrinho
        const total = carrinho.itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
        carrinho.total = total;
        carrinho.dataAtualizacao = new Date();
        await db.collection("carrinhos").updateOne(
            { usuarioId: usuarioId },
            { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
        );
        return res.status(200).json(carrinho);
    }
    //listar
    async listar(req:Request, res:Response) {
        const { usuarioId } = req.params;
        if (!usuarioId || typeof usuarioId !== 'string') {
            return res.status(400).json({ mensagem: "usuarioId é obrigatório e deve ser uma string" });
        }
        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId});
        if (!carrinho) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }
        return res.status(200).json(carrinho);
    }
    //remover                -> Remover o carrinho todo
    async remover(req:Request, res:Response) {
        const { usuarioId } = req.params;
        const resultado = await db.collection("carrinhos").deleteOne({ usuarioId: usuarioId });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }
        return res.status(200).json({ mensagem: "Carrinho removido com sucesso" });
    }
}
export default new CarrinhoController();