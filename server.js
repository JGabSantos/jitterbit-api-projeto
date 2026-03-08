const app = require("./src/app");
const sequelize = require("./src/config/database");

const PORT = process.env.PORT || 3000;

/**
 * Inicia o servidor:
 * 1. Autentica conexão com BD
 * 2. Sincroniza modelos (cria/atualiza tabelas)
 * 3. Inicia servidor HTTP
 */
async function start() {
  try {
    // Testa conexão com banco de dados
    await sequelize.authenticate();
    console.log("Database connection established");

    // Sincroniza modelos com BD (cria tabelas se não existirem)
    await sequelize.sync();
    console.log("Database synchronized");

    // Inicia servidor
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

start();
