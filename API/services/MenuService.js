const db = require('../config/db');


const getPizzas = async () => {
  try {
    const query = `SELECT * FROM pizza`;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    throw new Error('Erro ao listar pizzas: ' + error.message);
  }
};


const getBebidas = async () => {
  try {
    const query = `SELECT * FROM bebida`;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    throw new Error('Erro ao listar bebidas: ' + error.message);
  }
};


const addPizza = async (sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao) => {
  try {
    const query = `INSERT INTO pizza (sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    await db.query(query, [sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao]);
    return { message: "Pizza adicionada com sucesso!" };
  } catch (error) {
    throw new Error('Erro ao adicionar pizza: ' + error.message);
  }
};


const addBebida = async (nome, tamanho, preco) => {
  try {
    const query = `INSERT INTO bebida (nome, tamanho, preco) VALUES (?, ?, ?)`;
    await db.query(query, [nome, tamanho, preco]);
    return { message: "Bebida adicionada com sucesso!" };
  } catch (error) {
    throw new Error('Erro ao adicionar bebida: ' + error.message);
  }
};


const updatePizza = async (id_pizza, sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao) => {
  try {
    const query = `UPDATE pizza 
                   SET sabor = ?, preco_sabor = ?, tipo_borda = ?, preco_borda = ?, tamanho = ?, observacao = ? 
                   WHERE id_pizza = ?`;
    await db.query(query, [sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao, id_pizza]);
    return { message: "Pizza atualizada com sucesso!" };
  } catch (error) {
    throw new Error('Erro ao atualizar pizza: ' + error.message);
  }
};

const updateBebida = async (id_bebida, nome, tamanho, preco) => {
  try {
    const query = `UPDATE bebida 
                   SET nome = ?, tamanho = ?, preco = ? 
                   WHERE id_bebida = ?`;
    await db.query(query, [nome, tamanho, preco, id_bebida]);
    return { message: "Bebida atualizada com sucesso!" };
  } catch (error) {
    throw new Error('Erro ao atualizar bebida: ' + error.message);
  }
};


const removePizza = async (id_pizza) => {
  try {
    const query = `DELETE FROM pizza WHERE id_pizza = ?`;
    await db.query(query, [id_pizza]);
    return { message: "Pizza removida com sucesso!" };
  } catch (error) {
    throw new Error('Erro ao remover pizza: ' + error.message);
  }
};


const removeBebida = async (id_bebida) => {
  try {
    const query = `DELETE FROM bebida WHERE id_bebida = ?`;
    await db.query(query, [id_bebida]);
    return { message: "Bebida removida com sucesso!" };
  } catch (error) {
    throw new Error('Erro ao remover bebida: ' + error.message);
  }
};

module.exports = { getPizzas, getBebidas, addPizza, addBebida, updatePizza, updateBebida, removePizza, removeBebida };
