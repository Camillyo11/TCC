const MenuService = require('../services/MenuService');


const getPizzas = async (req, res) => {
  try {
    const pizzas = await MenuService.getPizzas();
    res.json(pizzas);
  } catch (error) {
    console.error('Erro ao listar pizzas:', error);
    res.status(500).json({ message: 'Erro ao listar pizzas.' });
  }
};


const getBebidas = async (req, res) => {
  try {
    const bebidas = await MenuService.getBebidas();
    res.json(bebidas);
  } catch (error) {
    console.error('Erro ao listar bebidas:', error);
    res.status(500).json({ message: 'Erro ao listar bebidas.' });
  }
};


const addPizza = async (req, res) => {
  const { sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao } = req.body;
  try {
    const response = await MenuService.addPizza(sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao);
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao adicionar pizza:', error);
    res.status(500).json({ message: 'Erro ao adicionar pizza.' });
  }
};


const addBebida = async (req, res) => {
  const { nome, tamanho, preco } = req.body;
  try {
    const response = await MenuService.addBebida(nome, tamanho, preco);
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao adicionar bebida:', error);
    res.status(500).json({ message: 'Erro ao adicionar bebida.' });
  }
};


const updatePizza = async (req, res) => {
  const { id_pizza, sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao } = req.body;
  try {
    const response = await MenuService.updatePizza(id_pizza, sabor, preco_sabor, tipo_borda, preco_borda, tamanho, observacao);
    res.json(response);
  } catch (error) {
    console.error('Erro ao atualizar pizza:', error);
    res.status(500).json({ message: 'Erro ao atualizar pizza.' });
  }
};


const updateBebida = async (req, res) => {
  const { id_bebida, nome, tamanho, preco } = req.body;
  try {
    const response = await MenuService.updateBebida(id_bebida, nome, tamanho, preco);
    res.json(response);
  } catch (error) {
    console.error('Erro ao atualizar bebida:', error);
    res.status(500).json({ message: 'Erro ao atualizar bebida.' });
  }
};


const removePizza = async (req, res) => {
  const { id_pizza } = req.params;
  try {
    const response = await MenuService.removePizza(id_pizza);
    res.json(response);
  } catch (error) {
    console.error('Erro ao remover pizza:', error);
    res.status(500).json({ message: 'Erro ao remover pizza.' });
  }
};


const removeBebida = async (req, res) => {
  const { id_bebida } = req.params;
  try {
    const response = await MenuService.removeBebida(id_bebida);
    res.json(response);
  } catch (error) {
    console.error('Erro ao remover bebida:', error);
    res.status(500).json({ message: 'Erro ao remover bebida.' });
  }
};

module.exports = { getPizzas, getBebidas, addPizza, addBebida, updatePizza, updateBebida, removePizza, removeBebida };
