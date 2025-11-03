import express from 'express'
import cors from 'cors'

// Importa as rotas
import rotas from './rotas/rotas.js'          // rotas autenticadas (jogos, carrinho etc.)
import rotasPublicas from './rotas/rotas-naoAutenticadas.js' // rotas de login/cadastro
import { conectarAoBanco } from './database/banco-mongo.js'

// Cria o app Express
const app = express()

// Configurações básicas
app.use(cors())
app.use(express.json())

// Usa as rotas
app.use(rotasPublicas)
app.use(rotas)

// Conecta ao banco e inicia o servidor
conectarAoBanco()
    .then(() => {
        app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'))
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco:', err)
    })
