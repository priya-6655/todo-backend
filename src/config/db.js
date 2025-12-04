const { Sequelize } = require('sequelize')

const {
    DATABASE_NAME,
    DB_USER_NAME,
    DB_USER_PASSWORD,
    DB_HOST,
    DB_PORT
} = process.env

console.log('DATABASE NAME', DATABASE_NAME)

const sequelize = new Sequelize(DATABASE_NAME, DB_USER_NAME, DB_USER_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    port: DB_PORT
})

module.exports = sequelize