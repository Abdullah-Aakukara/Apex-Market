// Importing Sequelize class from the sequelize package.
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')})


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,                   // Forces SSL connection required by Supabase
        rejectUnauthorized: false        // Prevents connection errors with cloud certificates
      } : false
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

// Exporting the sequelize instance to be used in other parts of the application.
module.exports =  sequelize; 
                
                