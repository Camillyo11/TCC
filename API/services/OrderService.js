const db = require('../config/db');

const createOrder = async (id_cliente, total, metodo_pagamento, tipo_entrega, observacoes, id_endereco, pizzas, bebidas) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Criar pedido
    const queryPedido = `
      INSERT INTO pedido (id_cliente, total, tipo_entrega, observacoes, id_endereco) 
      VALUES (?, ?, ?, ?, ?)`;
    const [resultPedido] = await conn.query(queryPedido, [id_cliente, total, tipo_entrega, observacoes, id_endereco]);
    const id_pedido = resultPedido.insertId;

    // 2. Criar pizzas e relacionar com sabores
    for (const pizza of pizzas) {
      const { tipo_borda, preco_borda, tamanho, observacao, sabores } = pizza;

      const queryPizza = `
        INSERT INTO pizza (tipo_borda, preco_borda, tamanho, observacao, id_pedido)
        VALUES (?, ?, ?, ?, ?)`;
      const [resultPizza] = await conn.query(queryPizza, [tipo_borda, preco_borda, tamanho, observacao, id_pedido]);

      const id_pizza = resultPizza.insertId;

      for (const id_sabor of sabores) {
        const queryPizzaSabor = `INSERT INTO pizza_sabor (id_pizza, id_sabor) VALUES (?, ?)`;
        await conn.query(queryPizzaSabor, [id_pizza, id_sabor]);
      }
    }

    // 3. Criar bebidas
    for (const bebida of bebidas) {
      const { nome, tamanho, preco, imagem_url } = bebida;
      const queryBebida = `
        INSERT INTO bebida (nome, tamanho, preco, imagem_url, id_pedido)
        VALUES (?, ?, ?, ?, ?)`;
      await conn.query(queryBebida, [nome, tamanho, preco, imagem_url, id_pedido]);
    }

    // 4. Criar pagamento
    const queryPagamento = `
      INSERT INTO pagamento (data_pagamento, valor, metodo, id_pedido)
      VALUES (CURDATE(), ?, ?, ?)`;
    await conn.query(queryPagamento, [total, metodo_pagamento, id_pedido]);

    await conn.commit();
    return { message: "Pedido criado com sucesso!" };
  } catch (error) {
    await conn.rollback();
    throw new Error('Erro ao criar pedido: ' + error.message);
  } finally {
    conn.release();
  }
};
