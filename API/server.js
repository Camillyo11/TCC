const express = require('express');
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes'); // Confirma se o caminho tá certo
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Aqui a gente verifica se essas rotas estão sendo importadas corretamente
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
