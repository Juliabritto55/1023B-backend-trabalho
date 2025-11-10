import { ObjectId } from 'bson'

// Mock do db do Mongo
const mockJogosFind = jest.fn()
const mockJogosFindOne = jest.fn()
const mockCarrinhosFindOne = jest.fn()
const mockCarrinhosInsertOne = jest.fn()
const mockCarrinhosUpdateOne = jest.fn()
const mockCarrinhosFind = jest.fn()
const mockCarrinhosDeleteOne = jest.fn()

interface ItemCarrinho {
    produtoId: string;
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

jest.mock('../database/banco-mongo.js', () => ({
  db: {
    collection: (name: string) => {
      if (name === 'jogos') {
        return { 
          findOne: mockJogosFindOne,
          find: mockJogosFind
        }
      }
      if (name === 'carrinhos') {
        return {
          find: mockCarrinhosFind,
          insertOne: mockCarrinhosInsertOne,
          updateOne: mockCarrinhosUpdateOne,
          findOne: mockCarrinhosFindOne,
          deleteOne: mockCarrinhosDeleteOne,
          toArray: () => mockCarrinhosFind()
        }
      }
      throw new Error('colecao desconhecida: ' + name)
    },
  },
}))

import controller from '../carrinho/carrinho.controller.js'

function createMockRes() {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('CarrinhoController.adicionarItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('deve validar campos obrigatórios', async () => {
    const req: any = { body: { usuarioId: 'u1', jogoId: '', quantidade: 1 } }
    const res = createMockRes()

    await controller.adicionarItem(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'usuarioId, jogoId e quantidade são obrigatórios' })
  })
  test("Deve buscar o jogo no banco de dados e retornar erro se não existir", async () => {
    const req: any = { body: { usuarioId: 'u1', jogoId: '123456789012123456789012', quantidade: 1 } }
    const res = createMockRes()
    mockJogosFind.mockResolvedValue([]) // Produto não existe
    await controller.adicionarItem(req, res)
    expect(mockJogosFind).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('123456789012123456789012') })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Jogo não encontrado'})
  })
  test('Deve devolver um jogo quando o produto existir com os campos corretors', async () => {
    const req: any = { body: { usuarioId: 'u1', jogoId: '123456789012123456789012', quantidade: 2 } }
    const res = createMockRes()
    mockJogosFind.mockResolvedValue({ 
      _id: ObjectId.createFromHexString('123456789012123456789012'),
      nome: 'Jogo 1',
      preco: 50,
      descricao: 'Descricao do jogo 1',
      imagem: 'http://foto.com/produto1.jpg'
    }) // Produto existe
    await controller.adicionarItem(req, res)
    expect(mockJogosFind).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('123456789012123456789012') })
  })

  test('Deve criar um novo carrinho se não existir um para o usuário', async () => {
    const req: any = { body: { usuarioId: '123123123123123123123123', jogoId: '123456789012123456789012', quantidade: 2 } }
    const res = createMockRes()
    const jogo = {
      _id: ObjectId.createFromHexString('123456789012123456789012'),
      nome: 'Jogo 1',
      preco: 50,
      descricao: 'Descricao do jogo 1',
      urlfoto: 'http://foto.com/produto1.jpg'
    }
    mockJogosFind.mockResolvedValue([jogo]) // Produto existe
    mockCarrinhosFind.mockResolvedValue([]) // Carrinho não existe
    mockCarrinhosInsertOne.mockResolvedValue(
      { usuarioId: '123123123123123123123123', 
      itens: [{ jogoId: '123456789012123456789012', quantidade: 2, precoUnitario: 50, nome: 'Jogo 1' }],
      dataAtualizacao: new Date(),
      total: 100 })
    await controller.adicionarItem(req, res)
    expect(mockCarrinhosFind).toHaveBeenCalledWith({ usuarioId: '123123123123123123123123' })
    expect(mockCarrinhosInsertOne).toHaveBeenCalledWith({ usuarioId: '123123123123123123123', 
      itens: [{ jogoId: '123456789012123456789012', quantidade: 2, precoUnitario: 50, nome: 'Jogo 1' }],
      dataAtualizacao: expect.any(Date),
      total: 100
  })
})

  
})

