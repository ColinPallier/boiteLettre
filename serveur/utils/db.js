const { Pool } = require("pg");
require("dotenv").config({ path: "../.env" });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: parseInt(process.env.PORT),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connection Database");
  }
});

const sql =
  "SET timezone TO 'Europe/Paris' ; create table if not exists mesures (id SERIAL , statut VARCHAR not null, date TIMESTAMPTZ DEFAULT now());";
pool.query(sql, function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log("Success");
  }
});
module.exports = pool;
