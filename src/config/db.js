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
    console.log('Connected to LIVE Database');
} else {
    DB_NAME = process.env.LOCAL_DB_NAME;
    DB_USER = process.env.LOCAL_DB_USER;
    DB_PASSWORD = process.env.LOCAL_DB_PASSWORD;
    DB_HOST = process.env.LOCAL_DB_HOST;
    DB_PORT = process.env.LOCAL_DB_PORT;
    console.log('Connected to LOCAL Database');
}

console.log('DATABASE NAME', DB_NAME)

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    port: DB_PORT,

    pool: {
        max: 1,
        min: 0,
        acquire: 60000,
        idle: 3000,
        evict: 1000
    },
    dialectOptions: {
        connectTimeout: 15000
    },
    retry: {
        max: 5,
        match: [
            /max_user_connections/,
            /too many connections/i,
            /ETIMEDOUT/,
            /ECONNREFUSED/
        ]
    }
})

// Test connection with retry
const connectWithRetry = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await sequelize.authenticate()
            console.log('Database connected successfully')
            return true
        } catch (err) {
            if (err.message.includes('max_user_connections') || err.message.includes('too many connections')) {
                console.log(`Connection attempt ${i + 1}/${retries} failed. Waiting ${delay / 1000}s for connections to free up...`)
                await new Promise(resolve => setTimeout(resolve, delay))
            } else {
                throw err
            }
        }
    }
    throw new Error('Could not connect to database after multiple retries')
}

sequelize.connectWithRetry = connectWithRetry

module.exports = sequelize
