require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;


const todoRoutes = require('./src/routes/todoList.route')


// CORS configuration for frontend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '3mb' }))
app.use(express.urlencoded({ extended: true }))


app.use('/todo', todoRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to todo list API')
})

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({ status: 'OK', database: 'Connected' });
    } catch (error) {
        res.status(500).json({ status: 'Error', database: 'Disconnected', error: error.message });
    }
})

// Sync database only once (not on every request)
let dbSynced = false;
const syncDatabase = async () => {
    if (!dbSynced) {
        try {
            await sequelize.sync();
            dbSynced = true;
            console.log('DB Synced');
        } catch (err) {
            console.log('DB connection error:', err.message);
        }
    }
};

// Sync on first import (for serverless)
syncDatabase();

// Only listen when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

module.exports = app