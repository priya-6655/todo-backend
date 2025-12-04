const { Sequelize } = require('sequelize')

const DATABASE_NAME = process.env.DATABASE_NAME || ''
const DB_USER_NAME = process.env.DB_USER_NAME || ''
const DB_USER_PASSWORD = process.env.DB_USER_PASSWORD || ''
const DB_HOST = process.env.DB_HOST || ''
const DB_PORT = process.env.DB_PORT || 3306

// Check if all required env vars are present
if (!DATABASE_NAME || !DB_USER_NAME || !DB_HOST) {
    console.error('Missing database environment variables!')
    console.error('Required: DATABASE_NAME, DB_USER_NAME, DB_USER_PASSWORD, DB_HOST')
}

const sequelize = new Sequelize(DATABASE_NAME, DB_USER_NAME, DB_USER_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    port: DB_PORT,
    dialectOptions: {
        connectTimeout: 30000
    },
    pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

module.exports = sequelize