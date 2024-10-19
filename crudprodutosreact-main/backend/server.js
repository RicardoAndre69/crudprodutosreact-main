const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuração do Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'empresa.db'),
  logging: console.log
});

// Definição do modelo Produto
const Produto = sequelize.define('Produto', {
  ProductID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ProductName: DataTypes.STRING,
  Description: DataTypes.STRING,
  Unit: DataTypes.STRING,
  Price: DataTypes.FLOAT
}, {
  timestamps: false
});

// Rota para obter todos os produtos
app.get('/produtos', async (req, res, next) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (error) {
    next(error);
  }
});

// Rota para obter um único produto
app.get('/produtos/:id', async (req, res, next) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    next(error);
  }
});

// Rota para adicionar um novo produto
app.post('/produtos', async (req, res, next) => {
  try {
    const novoProduto = await Produto.create(req.body);
    res.status(201).json(novoProduto);
  } catch (error) {
    next(error);
  }
});

// Rota para atualizar um produto
app.put('/produtos/:id', async (req, res, next) => {
  try {
    const [updated] = await Produto.update(req.body, {
      where: { ProductID: req.params.id }
    });
    if (updated) {
      const updatedProduto = await Produto.findByPk(req.params.id);
      res.json(updatedProduto);
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    next(error);
  }
});

// Rota para deletar um produto
app.delete('/produtos/:id', async (req, res, next) => {
  try {
    const deleted = await Produto.destroy({
      where: { ProductID: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    next(error);
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!', details: err.message });
});

// Middleware para lidar com rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Sincronize o modelo com o banco de dados e inicie o servidor
sequelize.sync({ force: true }) // Nota: use force: true apenas em desenvolvimento
  .then(() => {
    console.log('Banco de dados sincronizado');
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco de dados:', err);
  });