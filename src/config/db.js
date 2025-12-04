const { Sequelize } = require('sequelize')

const {
    DATABASE_NAME,
    DB_USER_NAME,
    DB_USER_PASSWORD,
    DB_HOST,
    DB_PORT
} = process.env

const sequelize = new Sequelize(DATABASE_NAME, DB_USER_NAME, DB_USER_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    port: DB_PORT || 3306,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        connectTimeout: 60000
    },
    pool: {
        max: 2,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
})

module.exports = sequelize