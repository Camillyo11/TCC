const db = require('../db');

// Listar pedidos
const getOrders = (req, res) => {
  const sql = 'SELECT * FROM orders';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar pedidos');
    res.json(results);
  });
};

// Criar pedido
const createOrder = (req, res) => {
  const { user_id, valor_total, itens } = req.body;
  const sqlOrder = 'INSERT INTO orders (user_id, valor_total) VALUES (?, ?)';

  db.query(sqlOrder, [user_id, valor_total], (err, result) => {
    if (err) return res.status(500).send('Erro ao criar pedido');
    
    const orderId = result.insertId;
    const sqlItems = 'INSERT INTO order_items (order_id, pizza_id, quantidade, preco_unitario) VALUES ?';

    const values = itens.map(item => [orderId, item.pizza_id, item.quantidade, item.preco_unitario]);
    db.query(sqlItems, [values], err => {
      if (err) return res.status(500).send('Erro ao adicionar itens do pedido');
      res.status(201).send('Pedido criado com sucesso!');
    });
  });
};

module.exports = { getOrders, createOrder };
