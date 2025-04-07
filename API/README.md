# API Bella Massa

API para o sistema de pedidos de pizza Bella Massa.

## Requisitos

- Node.js 14.x ou superior
- MySQL 5.7 ou superior
- NPM ou Yarn

## Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd API
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações

4. Execute as migrações do banco de dados
```bash
npm run migrate
```

5. Inicie o servidor
```bash
npm run dev
```

## Estrutura do Projeto

```
API/
├── config/         # Configurações
├── controllers/    # Controladores
├── middlewares/    # Middlewares
├── models/         # Modelos
├── routes/         # Rotas
├── services/       # Serviços
├── utils/          # Utilitários
└── logs/           # Logs
```

## Endpoints

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/forgot-password` - Solicitar recuperação de senha
- `POST /api/auth/reset-password` - Resetar senha

### Usuários

- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/orders` - Listar pedidos do usuário

### Pedidos

- `POST /api/orders` - Criar pedido
- `GET /api/orders/:id` - Obter detalhes do pedido
- `PUT /api/orders/:id/status` - Atualizar status do pedido
- `GET /api/orders` - Listar pedidos (admin)

### Menu

- `GET /api/menu` - Listar menu
- `GET /api/menu/pizzas` - Listar pizzas
- `GET /api/menu/bebidas` - Listar bebidas

## Segurança

- Autenticação via JWT
- Rate limiting
- Validação de dados
- Sanitização de inputs
- Headers de segurança (Helmet)
- CORS configurado

## Logs

Os logs são armazenados em:
- `logs/error.log` - Logs de erro
- `logs/combined.log` - Todos os logs

## Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento
- `npm test` - Executa os testes
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código

## Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC. 