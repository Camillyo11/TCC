const mysql = require('mysql2');

// Criação do pool de conexões
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pizzaria',
  waitForConnections: true, // Aguarda por conexões disponíveis no pool
  connectionLimit: 10, // Limite de conexões no pool
  queueLimit: 0 // Sem limite de requisições na fila
});

// Usando a função promise() para facilitar o uso com async/await
module.exports = pool.promise();
