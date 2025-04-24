const mysql = require('mysql2');
require('dotenv').config();

// Criação do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'pizzaria',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true, // Aguarda por conexões disponíveis no pool
  connectionLimit: 10, // Limite de conexões no pool
  queueLimit: 0, // Sem limite de requisições na fila
  connectTimeout: 30000, // Aumentado para 30 segundos
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Teste de conexão com mensagens mais detalhadas
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:');
    console.error('Código do erro:', err.code);
    console.error('Mensagem:', err.message);
    console.error('Host:', process.env.DB_HOST || 'localhost');
    console.error('Porta:', process.env.DB_PORT || 3306);
    console.error('Usuário:', process.env.DB_USER || 'root');
    console.error('Banco de dados:', process.env.DB_NAME || 'pizzaria');
    process.exit(1);
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
  connection.release();
});

// Usando a função promise() para facilitar o uso com async/await
module.exports = pool.promise();
