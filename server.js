require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;


const todoRoutes = require('./src/routes/todoList.route')
const regRoutes = require('./src/routes/register.route')


app.use(cors({
    origin: ["http://localhost:5173", "https://todo-frontend-six-eta.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json({ limit: '3mb' }))
app.use(express.urlencoded({ extended: true }))


app.use('/todo', todoRoutes)
app.use('/register', regRoutes)

app.get('/', (req, res) => {
    res.send('Welcom to todo list page')
})

// Connect with retry for free MySQL hosting limits
sequelize.connectWithRetry().then(() => {
    return sequelize.sync()
}).then(() => {
    console.log('DB Synced')
}).catch((err) => {
    console.log('DB connection error:', err.message)
})

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

// Close DB connections properly on shutdown
process.on('SIGTERM', async () => {
    await sequelize.close()
    server.close()
})
process.on('SIGINT', async () => {
    await sequelize.close()
    server.close()
})

module.exports = app