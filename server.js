require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

// CORS configuration for frontend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '3mb' }))
app.use(express.urlencoded({ extended: true }))

// Root endpoint - works without database
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to todo list API',
        status: 'Server is running',
        endpoints: {
            health: '/health',
            todos: '/todo/viewtodo',
            addTodo: '/todo/addtodo',
            editTodo: '/todo/edit',
            deleteTodo: '/todo/delete/:id',
            completeTodo: '/todo/completed'
        }
    })
})

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const sequelize = require('./src/config/db');
        await sequelize.authenticate();
        res.status(200).json({
            status: 'OK',
            database: 'Connected',
            env: {
                DB_HOST: process.env.DB_HOST ? 'Set' : 'NOT SET',
                DATABASE_NAME: process.env.DATABASE_NAME ? 'Set' : 'NOT SET',
                DB_USER_NAME: process.env.DB_USER_NAME ? 'Set' : 'NOT SET'
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            database: 'Disconnected',
            error: error.message,
            env: {
                DB_HOST: process.env.DB_HOST ? 'Set' : 'NOT SET',
                DATABASE_NAME: process.env.DATABASE_NAME ? 'Set' : 'NOT SET',
                DB_USER_NAME: process.env.DB_USER_NAME ? 'Set' : 'NOT SET'
            }
        });
    }
})

// Load todo routes (database dependent)
const todoRoutes = require('./src/routes/todoList.route')
app.use('/todo', todoRoutes)

// Only listen when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
    const sequelize = require('./src/config/db');
    sequelize.sync().then(() => {
        console.log('DB Synced')
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    }).catch((err) => {
        console.log('DB connection error:', err.message)
        // Start server anyway for debugging
        app.listen(port, () => {
            console.log(`Server running on port ${port} (DB not connected)`)
        })
    })
}

module.exports = app