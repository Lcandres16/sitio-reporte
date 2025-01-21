const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  pool: {
    max: 10,
    min: 1,
  },
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = sequelize;
