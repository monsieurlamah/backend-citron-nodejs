const dotenv = require("dotenv");

dotenv.config();

const ENV = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DATABASE: process.env.DATABASE,
    DIALECT: process.env.DIALECT,
    PORT_DATABASE: process.env.PORT_DATABASE,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
  };


  module.exports = ENV;
