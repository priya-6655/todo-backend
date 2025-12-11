const { Sequelize } = require('sequelize')
require('dotenv').config()

const mode = process.env.DB_MODE || 'LOCAL'

let DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT;

if (mode === 'LIVE') {
    DB_NAME = process.env.LIVE_DB_NAME;
    DB_USER = process.env.LIVE_DB_USER;
    DB_PASSWORD = process.env.LIVE_DB_PASSWORD;
    DB_HOST = process.env.LIVE_DB_HOST;
    DB_PORT = process.env.LIVE_DB_PORT;
    console.log('Using LIVE Database');
} else {
    DB_NAME = process.env.LOCAL_DB_NAME;
    DB_USER = process.env.LOCAL_DB_USER;
    DB_PASSWORD = process.env.LOCAL_DB_PASSWORD;
    DB_HOST = process.env.LOCAL_DB_HOST;
    DB_PORT = process.env.LOCAL_DB_PORT;
    console.log('Using LOCAL Database');
}

// Log connection details (without password)
console.log('DB Config:', { host: DB_HOST, database: DB_NAME, port: DB_PORT, user: DB_USER })

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: console.log,
    port: DB_PORT || 3306,
    pool: {
        max: 2,
        min: 0,
        acquire: 60000,
        idle: 10000
    },
    dialectOptions: {
        connectTimeout: 60000,
        ssl: false
        // mode === 'LIVE' ? {
        //     require: true,
        //     rejectUnauthorized: false
        // } : false
    }
})

module.exports = sequelize
