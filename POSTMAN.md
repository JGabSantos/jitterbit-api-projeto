# Documentação Postman - API de Pedidos

## Como Importar

### 1. Importar a Coleção

1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Arraste o arquivo `postman_collection.json` ou clique em **files** e selecione-o
4. Clique em **Import**

### 2. Importar o Environment (Opcional)

1. No Postman, clique no ícone de **Environments** (no canto superior direito)
2. Clique em **Import**
3. Selecione o arquivo `postman_environment.json`
4. Ative o environment "API Pedidos - Local" no dropdown superior direito

## Como Usar

### Fluxo de Teste Completo

#### 1. Registrar Usuário

- Endpoint: **Autenticação → Registrar Usuário**
- Método: `POST /auth/register`
- O token JWT é **capturado automaticamente** após o registro
- Body de exemplo:

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456"
}
```

#### 2. Login (Alternativa ao Registro)

- Endpoint: **Autenticação → Login**
- Método: `POST /auth/login`
- O token JWT é **capturado automaticamente** após o login
- Body de exemplo:

```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

#### 3. Testar Rota Protegida

- Endpoint: **Autenticação → Meu Perfil**
- Método: `GET /auth/me`
- Usa automaticamente o token capturado no passo anterior
- Retorna dados do usuário autenticado

#### 4. Criar Pedido

- Endpoint: **Pedidos → Criar Pedido**
- Método: `POST /order`
- Usa automaticamente o token JWT
- Body de exemplo:

```json
{
  "numeroPedido": "PED-001",
  "valorTotal": 150.5,
  "dataCriacao": "2026-03-09T10:30:00Z",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 75.25
    }
  ]
}
```

#### 5. Listar Todos os Pedidos

- Endpoint: **Pedidos → Listar Pedidos**
- Método: `GET /order/list`
- Usa automaticamente o token JWT

#### 6. Buscar Pedido por ID

- Endpoint: **Pedidos → Buscar Pedido por ID**
- Método: `GET /order/:orderId`
- Na aba **Params**, altere `orderId` para o ID do pedido (ex: `PED-001`)
- Usa automaticamente o token JWT

#### 7. Atualizar Pedido

- Endpoint: **Pedidos → Atualizar Pedido**
- Método: `PUT /order/:orderId`
- Altere `orderId` nos **Params**
- Usa automaticamente o token JWT

#### 8. Deletar Pedido

- Endpoint: **Pedidos → Deletar Pedido**
- Método: `DELETE /order/:orderId`
- Altere `orderId` nos **Params**
- Usa automaticamente o token JWT

## Variáveis da Coleção

A coleção usa as seguintes variáveis:

| Variável  | Valor Padrão            | Descrição                                               |
| --------- | ----------------------- | ------------------------------------------------------- |
| `baseUrl` | `http://localhost:3000` | URL base da API                                         |
| `token`   | (vazio)                 | Token JWT capturado automaticamente após login/registro |
| `userId`  | (vazio)                 | ID do usuário capturado automaticamente                 |

### Como Visualizar/Editar Variáveis

1. Clique com botão direito na coleção "API de Pedidos - JWT Auth"
2. Selecione **Edit**
3. Vá na aba **Variables**

## Automação de Token

Os endpoints de **Registrar Usuário** e **Login** possuem scripts automáticos que:

- Capturam o token JWT da resposta
- Salvam na variável `{{token}}`
- Salvam o `userId` na variável `{{userId}}`

Todos os endpoints de **Pedidos** usam automaticamente `{{token}}` no header `Authorization: Bearer`.

## Respostas HTTP

| Código | Significado                             |
| ------ | --------------------------------------- |
| `200`  | Sucesso (GET, PUT)                      |
| `201`  | Recurso criado (POST)                   |
| `204`  | Recurso deletado (DELETE)               |
| `400`  | Dados inválidos                         |
| `401`  | Não autorizado (token ausente/inválido) |
| `404`  | Recurso não encontrado                  |
| `409`  | Conflito (recurso duplicado)            |
| `500`  | Erro interno do servidor                |

## Testando Erros de Autenticação

### Teste 1: Token Inválido

1. Vá nas variáveis da coleção
2. Altere manualmente `token` para um valor qualquer (ex: `abc123`)
3. Tente acessar qualquer endpoint de pedidos
4. Esperado: `401 Unauthorized`

### Teste 2: Sem Token

1. Limpe a variável `token`
2. Tente acessar qualquer endpoint de pedidos
3. Esperado: `401 Unauthorized`

### Teste 3: Token Expirado

1. Aguarde o tempo de expiração do token (padrão: 1 dia)
2. Tente acessar qualquer endpoint de pedidos
3. Esperado: `401 Unauthorized`
4. Solução: Faça login novamente

## Troubleshooting

### Erro: "Rota não encontrada"

- Verifique se o servidor está rodando (`npm start`)
- Confirme a URL base nas variáveis da coleção
- Verifique se a porta está correta (padrão: 3000)

### Erro: "Token não informado"

- Execute primeiro o endpoint de **Login** ou **Registrar Usuário**
- Verifique se o token foi capturado (veja variáveis da coleção)

### Erro: "Database connection failed"

- Verifique se o MySQL está rodando
- Confirme credenciais no arquivo `.env`
- Verifique se o banco `orders_db` existe

### Erro: "Pedido não encontrado"

- Verifique se o `orderId` está correto
- Liste todos os pedidos antes para ver os IDs disponíveis

## Exportar Resultados para Documentação

1. Execute todos os endpoints
2. Salve as respostas clicando em **Save Response** abaixo de cada resposta
3. No menu da coleção, clique em **⋯ → Export**
4. Escolha **Collection v2.1**
5. Salve o arquivo com exemplos de resposta incluídos

## Suporte

Para problemas ou dúvidas:

1. Verifique o arquivo `README.md` na raiz do projeto
2. Consulte os logs do servidor no terminal
3. Verifique a documentação da API no próprio README
