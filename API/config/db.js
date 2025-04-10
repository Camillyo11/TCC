const mysql = require('mysql2');
require('dotenv').config();

// Criação do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pizzaria',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true, // Aguarda por conexões disponíveis no pool
  connectionLimit: 10, // Limite de conexões no pool
  queueLimit: 0 // Sem limite de requisições na fila
});

// Usando a função promise() para facilitar o uso com async/await
module.exports = pool.promise();
