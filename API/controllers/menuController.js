const db = require('../db');

const getMenu = (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Erro ao buscar cardápio');
        res.json(results);
    });
};

const addPizza = (req, res) => {
    const { nome_pizza, descricao, preco } = req.body;
    if (!nome_pizza || !preco) return res.status(400).send('Nome e preço são obrigatórios.');

    const sql = 'INSERT INTO menu (nome_pizza, descricao, preco) VALUES (?, ?, ?)';
    db.query(sql, [nome_pizza, descricao, preco], (err, result) => {
        if (err) return res.status(500).send('Erro ao adicionar pizza');

        const novoItem = {
            id: result.insertId,
            nome_pizza,
            descricao,
            preco,
        };

        res.status(201).json(novoItem);
    });
};

module.exports = { getMenu, addPizza };