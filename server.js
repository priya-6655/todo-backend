require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;


const todoRoutes = require('./src/routes/todoList.route')
const regRoutes = require('./src/routes/register.route')


app.use(cors())
app.use(express.json({ limit: '3mb' }))
app.use(express.urlencoded({ extended: true }))


app.use('/todo', todoRoutes)
app.use('/register', regRoutes)

app.get('/', (req, res) => {
    res.send('Welcom to todo list page')
})

// Test DB connection and sync
// sequelize.authenticate()
//     .then(() => {
//         console.log('Database connected successfully')
//         return sequelize.sync()
//     })
//     .then(() => {
//         console.log('DB Synced')
//     })
//     .catch((err) => {
//         console.log('DB connection error:', err.message)
//         console.log('Full error:', err)
//     })

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

// Close DB connections properly on shutdown
// process.on('SIGTERM', async () => {
//     await sequelize.close()
//     server.close()
// })
// process.on('SIGINT', async () => {
//     await sequelize.close()
//     server.close()
// })

module.exports = app