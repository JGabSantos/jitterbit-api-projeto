# API de Pedidos

API REST desenvolvida em **Node.js** com **Express**, **MySQL** e **Sequelize** para gerenciamento eficiente de pedidos e seus itens associados.

## Funcionalidades

- Criar pedidos com múltiplos itens
- Listar todos os pedidos com ordenação por data
- Buscar pedido específico por ID
- Atualizar pedidos e seus itens
- Deletar pedidos com cascata automática de itens
- Validação robusta de dados de entrada
- Tratamento centralizado e estruturado de erros
- Health check para monitoramento da API

## Requisitos do Sistema

- **Node.js** versão 14.0 ou superior
- **MySQL** versão 5.7 ou superior
- **npm** ou **yarn**

## Instalação

### 1. Instalar as Dependências

Execute o comando abaixo para instalar todas as dependências do projeto:

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure com seus valores específicos:

```bash
cp .env.example .env
```

Preencha o arquivo `.env` com as seguintes variáveis:

```
PORT=3000
NODE_ENV=development
MYSQL_HOST=localhost
MYSQL_DATABASE=orders_db
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha_aqui
JWT_SECRET=troque_por_um_secret_forte
JWT_EXPIRES_IN=1d
```

### 3. Criar Banco de Dados e Tabelas

Execute os comandos SQL abaixo no seu cliente MySQL para criar a estrutura do banco:

```sql
CREATE DATABASE orders_db;

CREATE TABLE orders (
    orderId VARCHAR(100) NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    creationDate DATETIME NOT NULL,
    PRIMARY KEY (orderId)
);

CREATE TABLE items (
    id INT NOT NULL AUTO_INCREMENT,
    orderId VARCHAR(100) NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    PRIMARY KEY (id),
    KEY orderId (orderId),
    FOREIGN KEY (orderId) REFERENCES orders (orderId) ON DELETE CASCADE
);

  CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id)
  );
```

### 4. Iniciar o Servidor

Execute o comando para iniciar a aplicação:

```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## Endpoints da API

### Autenticação

#### Registrar usuário

```http
POST /auth/register
Content-Type: application/json
```

Exemplo de body:

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json
```

Exemplo de body:

```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

#### Usuário autenticado

```http
GET /auth/me
Authorization: Bearer <token>
```

### Health Check

Verifica o status de funcionamento da API.

```http
GET /health
```

Resposta de sucesso (HTTP 200):

```json
{
  "status": "ok",
  "message": "API is running"
}
```

---

### Criar Pedido

Cria um novo pedido com seus itens associados.

Requer autenticação JWT:

```http
Authorization: Bearer <token>
```

```http
POST /order
Content-Type: application/json
```

Exemplo de requisição:

```json
{
  "numeroPedido": "PED-001",
  "valorTotal": 150.5,
  "dataCriacao": "2026-03-08T10:30:00Z",
  "items": [
    {
      "idItem": "PROD-123",
      "quantidadeItem": 2,
      "valorItem": 75.25
    },
    {
      "idItem": "PROD-456",
      "quantidadeItem": 1,
      "valorItem": 75.25
    }
  ]
}
```

Resposta (HTTP 201):

```json
{
  "success": true,
  "data": {
    "orderId": "PED-001",
    "value": "150.50",
    "creationDate": "2026-03-08T10:30:00.000Z",
    "items": [
      {
        "id": 1,
        "orderId": "PED-001",
        "productId": 123,
        "quantity": 2,
        "price": "75.25"
      },
      {
        "id": 2,
        "orderId": "PED-001",
        "productId": 456,
        "quantity": 1,
        "price": "75.25"
      }
    ]
  },
  "message": "Pedido criado com sucesso"
}
```

Possível erro (HTTP 400):

```json
{
  "success": false,
  "error": "Campo 'numeroPedido' é obrigatório"
}
```

Possível erro (HTTP 409):

```json
{
  "success": false,
  "error": "Pedido com este número já existe"
}
```

---

### Listar Pedidos

Lista todos os pedidos existentes ordenados por data de criação.

Requer autenticação JWT:

```http
Authorization: Bearer <token>
```

```http
GET /order/list
```

Resposta (HTTP 200):

```json
{
  "success": true,
  "data": [
    {
      "orderId": "PED-001",
      "value": "150.50",
      "creationDate": "2026-03-08T10:30:00.000Z",
      "items": [...]
    }
  ],
  "count": 1
}
```

---

### Buscar Pedido

Retorna os dados de um pedido específico.

Requer autenticação JWT:

```http
Authorization: Bearer <token>
```

```http
GET /order/:orderId
```

Exemplo: `GET /order/PED-001`

Resposta (HTTP 200):

```json
{
  "success": true,
  "data": {
    "orderId": "PED-001",
    "value": "150.50",
    "creationDate": "2026-03-08T10:30:00.000Z",
    "items": [...]
  }
}
```

Erro quando não encontrado (HTTP 404):

```json
{
  "success": false,
  "error": "Pedido não encontrado"
}
```

---

### Atualizar Pedido

Atualiza um pedido existente e seus itens.

Requer autenticação JWT:

```http
Authorization: Bearer <token>
```

```http
PUT /order/:orderId
Content-Type: application/json
```

Corpo da requisição: mesmo formato do POST

Resposta (HTTP 200):

```json
{
  "success": true,
  "data": {...},
  "message": "Pedido atualizado com sucesso"
}
```

---

### Deletar Pedido

Remove um pedido e todos seus itens associados.

Requer autenticação JWT:

```http
Authorization: Bearer <token>
```

```http
DELETE /order/:orderId
```

Resposta de sucesso (HTTP 204): Sem conteúdo

Erro quando não encontrado (HTTP 404):

```json
{
  "success": false,
  "error": "Pedido não encontrado"
}
```

---

## Estrutura do Projeto

```
src/
├── config/
│   └── database.js           Configuração Sequelize e pool de conexões
├── controllers/
│   ├── authController.js     Controlador de autenticação
│   └── orderController.js    Controladores para requisições HTTP
├── middlewares/
│   ├── auth.js               Middleware de autenticação JWT
│   ├── validateAuth.js       Validação de dados de autenticação
│   └── validateOrder.js      Middlewares de validação de dados
├── models/
│   ├── user.js               Modelo de Usuário
│   ├── order.js              Modelo de Pedido
│   └── item.js               Modelo de Item
├── routes/
│   ├── authRoutes.js         Rotas de autenticação
│   └── orderRoutes.js        Definição de rotas da API
├── services/
│   ├── authService.js        Regras de negócio da autenticação
│   └── orderService.js       Lógica de negócio da aplicação
├── utils/
│   ├── errors.js             Classes de erro customizadas
│   └── mapOrder.js           Mapeamento de dados de requisição
└── app.js                    Configuração central do Express

server.js                      Ponto de entrada da aplicação
.env.example                   Variáveis de ambiente de exemplo
package.json                   Dependências do projeto
```

## Arquitetura da Aplicação

O projeto segue o padrão de arquitetura em camadas, separando as responsabilidades em diferentes módulos:

```
Requisição HTTP
    ↓
Routes (orderRoutes.js)
    ↓
Validation Middleware (validateOrder.js)
    ↓
Controller (orderController.js) - Mapeia dados
    ↓
Service (orderService.js) - Contém lógica de negócio
    ↓
Models (Order, Item) - Interage com banco de dados
    ↓
Resposta HTTP
```

Para autenticação JWT, o fluxo é:

```
POST /auth/register ou POST /auth/login
  ↓
Retorno de token JWT
  ↓
Envio do token no header Authorization: Bearer <token>
  ↓
GET /auth/me
```

## Banco de Dados

### Relacionamentos

A aplicação implementa um relacionamento um-para-muitos entre Pedidos e Itens:

- Um pedido pode conter múltiplos itens
- Cada item pertence a um único pedido
- Exclusão de pedido remove automaticamente todos seus itens (DELETE CASCADE)

### Esquema de Dados

**Tabela: orders**

| Campo        | Tipo          | Descrição                                      |
| ------------ | ------------- | ---------------------------------------------- |
| orderId      | VARCHAR(100)  | Identificador único do pedido (Chave Primária) |
| value        | DECIMAL(12,2) | Valor total do pedido                          |
| creationDate | DATETIME      | Data e hora de criação do pedido               |

**Tabela: items**

| Campo     | Tipo          | Descrição                                                    |
| --------- | ------------- | ------------------------------------------------------------ |
| id        | INT           | Identificador único do item (Chave Primária, Auto Increment) |
| orderId   | VARCHAR(100)  | Referência ao pedido (Chave Estrangeira)                     |
| productId | INT           | Identificador do produto                                     |
| quantity  | INT           | Quantidade do item                                           |
| price     | DECIMAL(12,2) | Preço unitário do item                                       |

**Tabela: users**

| Campo        | Tipo         | Descrição                                         |
| ------------ | ------------ | ------------------------------------------------- |
| id           | INT          | Identificador único do usuário (PK, Auto Increment) |
| name         | VARCHAR(120) | Nome do usuário                                   |
| email        | VARCHAR(255) | E-mail único do usuário                           |
| passwordHash | VARCHAR(255) | Hash da senha (bcrypt)                            |
| createdAt    | DATETIME     | Data de criação                                   |
| updatedAt    | DATETIME     | Data da última atualização                        |

## Configurações da Aplicação

### Variáveis de Ambiente

| Variável       | Padrão      | Descrição                                     |
| -------------- | ----------- | --------------------------------------------- |
| PORT           | 3000        | Porta em que o servidor será executado        |
| NODE_ENV       | development | Ambiente de execução (development/production) |
| MYSQL_HOST     | localhost   | Endereço do servidor MySQL                    |
| MYSQL_DATABASE | orders_db   | Nome do banco de dados                        |
| MYSQL_USER     | root        | Usuário de acesso ao MySQL                    |
| MYSQL_PASSWORD | -           | Senha de acesso ao MySQL                      |
| JWT_SECRET     | -           | Chave secreta para assinatura dos tokens JWT  |
| JWT_EXPIRES_IN | 1d          | Tempo de expiração do token JWT               |

### Pool de Conexões

O Sequelize está configurado com um pool de conexões para otimizar o desempenho:

```javascript
{
  max: 5,         // Máximo de 5 conexões simultâneas
  min: 0,         // Mínimo de conexões ociosas
  acquire: 30000, // Tempo máximo de 30s para adquirir conexão
  idle: 10000     // Liberar conexão após 10s inativa
}
```

## Tratamento de Erros

A aplicação implementa um tratamento estruturado de erros com códigos HTTP apropriados:

| Código | Descrição                                                 |
| ------ | --------------------------------------------------------- |
| 200    | Sucesso em requisições GET e PUT                          |
| 201    | Recurso criado com sucesso (POST)                         |
| 204    | Recurso deletado com sucesso (DELETE)                     |
| 400    | Dados de entrada inválidos ou ausentes                    |
| 401    | Não autorizado (token ausente, inválido ou expirado)      |
| 404    | Recurso solicitado não foi encontrado                     |
| 409    | Conflito - recurso já existe (duplicação)                 |
| 503    | Serviço indisponível - erro na conexão com banco de dados |
| 500    | Erro interno do servidor                                  |

## Guia de Desenvolvimento

Para trabalhar localmente no projeto, siga os passos:

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` copiando o exemplo:

```bash
cp .env.example .env
```

3. Configure as variáveis de ambiente com seus dados locais

4. Inicie o servidor:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

### Habilitando Logs SQL

Para visualizar os comandos SQL executados pelo Sequelize durante desenvolvimento, edite o arquivo `src/config/database.js`:

```javascript
logging: console.log; // Descomente para habilitar logs SQL
```

## Dependências Principais

- **express** (5.2.1) - Framework web para Node.js
- **sequelize** (6.37.8) - ORM para MySQL com suporte a relacionamentos
- **mysql2** (3.19.0) - Driver MySQL para Node.js
- **dotenv** (17.3.1) - Carregamento de variáveis de ambiente

## Práticas de Segurança

A aplicação implementa os seguintes mecanismos de segurança:

- Validação rigorosa de todos os dados de entrada
- Tratamento estruturado de erros sem exposição de informações sensíveis
- Proteção contra SQL Injection através do Sequelize ORM
- Gerenciamento seguro de credenciais via variáveis de ambiente
- Pool de conexões configurado para otimização de recursos

## Licença

ISC
