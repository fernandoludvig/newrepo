const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * but will cause problems in production environment
 * if-else will make determination which to use
 * *************** */
let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Configuração SSL, pode ser necessário para produção
  },
});

// Added for troubleshooting queries
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
  pool, // Exportando o pool para uso em outros módulos
};
