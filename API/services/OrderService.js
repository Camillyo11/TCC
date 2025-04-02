const db = require('../config/db');

const createOrder = async (id_cliente, total, metodo_pagamento, tipo_entrega, observacoes, id_endereco, pizzas, bebidas) => {
  try {
    
    const queryPedido = `INSERT INTO pedido (id_cliente, total, metodo_pagamento, tipo_entrega, observacoes, id_endereco) 
                         VALUES (?, ?, ?, ?, ?, ?)`;
    const [resultPedido] = await db.query(queryPedido, [id_cliente, total, metodo_pagamento, tipo_entrega, observacoes, id_endereco]);

    const id_pedido = resultPedido.insertId;

   
    for (const pizza of pizzas) {
      const { sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao } = pizza;
      const queryPizza = `INSERT INTO pizza (sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao, id_pedido) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await db.query(queryPizza, [sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao, id_pedido]);
    }

    for (const bebida of bebidas) {
      const { nome, tamanho, preco } = bebida;
      const queryBebida = `INSERT INTO bebida (nome, tamanho, preco, id_pedido) 
                           VALUES (?, ?, ?, ?)`;
      await db.query(queryBebida, [nome, tamanho, preco, id_pedido]);
    }

    return { message: "Pedido criado com sucesso!" };
  } catch (error) {
    throw new Error('Erro ao criar pedido: ' + error.message);
  }
};


const getOrdersByClient = async (id_cliente) => {
  try {
    const query = `SELECT * FROM pedido WHERE id_cliente = ?`;
    const [rows] = await db.query(query, [id_cliente]);
    return rows;
  } catch (error) {
    throw new Error('Erro ao obter pedidos: ' + error.message);
  }
};


const updateOrderStatus = async (id_pedido, status) => {
  try {
    const query = `UPDATE pedido SET status = ? WHERE id_pedido = ?`;
    await db.query(query, [status, id_pedido]);
    return { message: "Status do pedido atualizado com sucesso!" };
  } catch (error) {
    throw new Error('Erro ao atualizar status do pedido: ' + error.message);
  }
};

const getOrderDetails = async (id_pedido) => {
    try {
      const query = `SELECT p.id_pizza, p.sabor, p.preco_sabor, p.tipo_borda, p.preco_borda, p.tamanho, p.observacao, 
                            b.id_bebida, b.nome, b.tamanho, b.preco
                     FROM pedido pe
                     LEFT JOIN pizza p ON p.id_pedido = pe.id_pedido
                     LEFT JOIN bebida b ON b.id_pedido = pe.id_pedido
                     WHERE pe.id_pedido = ?`;
      const [rows] = await db.query(query, [id_pedido]);
      return rows;
    } catch (error) {
      throw new Error('Erro ao obter detalhes do pedido: ' + error.message);
    }
  };
  
  const updatePizza = async (id_pizza, id_pedido, sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao) => {
    try {
      const query = `UPDATE pizza 
                     SET sabor = ?, preco_sabor = ?, tipo_borda = ?, preco_borda = ?, tamanho = ?, observacao = ? 
                     WHERE id_pizza = ? AND id_pedido = ?`;
      await db.query(query, [sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao, id_pizza, id_pedido]);
      return { message: "Pizza atualizada com sucesso!" };
    } catch (error) {
      throw new Error('Erro ao atualizar pizza no pedido: ' + error.message);
    }
  };
  
 
  const updateBebida = async (id_bebida, id_pedido, nome, tamanho, preco) => {
    try {
      const query = `UPDATE bebida 
                     SET nome = ?, tamanho = ?, preco = ? 
                     WHERE id_bebida = ? AND id_pedido = ?`;
      await db.query(query, [nome, tamanho, preco, id_bebida, id_pedido]);
      return { message: "Bebida atualizada com sucesso!" };
    } catch (error) {
      throw new Error('Erro ao atualizar bebida no pedido: ' + error.message);
    }
  };
  
  const removePizza = async (id_pizza, id_pedido) => {
    try {
      const query = `DELETE FROM pizza WHERE id_pizza = ? AND id_pedido = ?`;
      await db.query(query, [id_pizza, id_pedido]);
      return { message: "Pizza removida do pedido com sucesso!" };
    } catch (error) {
      throw new Error('Erro ao remover pizza do pedido: ' + error.message);
    }
  };

  const removeBebida = async (id_bebida, id_pedido) => {
    try {
      const query = `DELETE FROM bebida WHERE id_bebida = ? AND id_pedido = ?`;
      await db.query(query, [id_bebida, id_pedido]);
      return { message: "Bebida removida do pedido com sucesso!" };
    } catch (error) {
      throw new Error('Erro ao remover bebida do pedido: ' + error.message);
    }
  };
  

  module.exports = { createOrder, getOrdersByClient, updateOrderStatus, getOrderDetails, updatePizza, updateBebida, removePizza, removeBebida };
