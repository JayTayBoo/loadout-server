const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  database: "loadouts",
  host: "localhost",
  port: 5432,
})

module.exports = pool;