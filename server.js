require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;


const todoRoutes = require('./src/routes/todoList.route')
const regRoutes = require('./src/routes/register.route')


app.use(cors({
    origin: ['http://localhost:5173', 'https://todo-frontend-six-eta.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))


app.use('/register', regRoutes)
app.use('/todo', todoRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to todo list page')
})

// DB status check endpoint
app.get('/db-status', async (req, res) => {
    try {
        await sequelize.authenticate()
        res.json({ status: 'connected', message: 'Database connected successfully' })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
})

// Error handling middleware for file uploads
app.use((err, req, res, next) => {
    if (err.name === 'MulterError') {
        return res.status(400).json({ message: 'File upload error', error: err.message })
    }
    if (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
    next()
})

sequelize.sync().then(() => {
    console.log('DB Synced')
}).catch((err) => {
    console.error('DB Connection Error:', err)
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


module.exports = app
