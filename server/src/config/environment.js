const dotenv = require("dotenv");

dotenv.config();

const ENV = {
  HTTPS_REDIRECT: process.env.HTTPS_REDIRECT === "true",
  HTTPS_PORT: process.env.HTTPS_PORT,
  PORT: process.env.PORT,
  KEY_SSL_PATH: process.env.KEY_SSL_PATH,
  CERT_SSL_PATH: process.env.CERT_SSL_PATH,
};

module.exports = ENV;
