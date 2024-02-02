const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "conferenceRooms",
  password: "palacsinta",
  port: 5432,
});

module.exports = pool;
