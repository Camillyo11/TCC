CREATE DATABASE pizzaria;
USE pizzaria;



CREATE TABLE pedido (
    id_pedido INTEGER NOT NULL AUTO_INCREMENT,
    data_pedido DATE NOT NULL DEFAULT (CURRENT_DATE),
    status ENUM('pendente', 'em preparo', 'entregue', 'cancelado') NOT NULL DEFAULT 'pendente',
    total DECIMAL(10,2) NOT NULL,
    id_cliente INTEGER NOT NULL,
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_cliente) REFERENCES users(id)
);

CREATE TABLE pizza (
    id_pizza INTEGER NOT NULL AUTO_INCREMENT,
    sabor VARCHAR(50) NOT NULL,
    preco_sabor DECIMAL(10,2) NOT NULL,
    tipo_borda ENUM('tradicional', 'recheada', 'sem borda') NOT NULL,
    preco_borda DECIMAL(10,2) NOT NULL,
    tamanho ENUM('broto', 'tradicional', 'meio-a-meio') NOT NULL,
    observacao VARCHAR(200),
    id_pedido INTEGER NOT NULL,
    PRIMARY KEY (id_pizza),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

CREATE TABLE bebida (
    id_bebida INTEGER NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    tamanho ENUM('lata', '600ml', '1L', '2L') NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    id_pedido INTEGER NOT NULL,
    PRIMARY KEY (id_bebida),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(100) NOT NULL,
    senha_cliente VARCHAR(255) NOT NULL,
    telefone_cliente VARCHAR(20),
    data_nascimento_cliente DATE,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE endereco (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    cep VARCHAR(10),
    rua_endereco VARCHAR(255),
    numero_endereco VARCHAR(20),
    bairro_endereco VARCHAR(100),
    cidade_endereco VARCHAR(100),
    estado_endereco VARCHAR(50),
    tipo_endereco VARCHAR(50),
    complemento TEXT,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente) -- Supondo que a tabela cliente tenha a coluna id_cliente
);
