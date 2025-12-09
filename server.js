require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;


const todoRoutes = require('./src/routes/todoList.route')
const regRoutes = require('./src/routes/register.route')

const corsOptions = {
    origin: 'https://todo-frontend-six-eta.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions))
app.use(express.json({ limit: '3mb' }))
app.use(express.urlencoded({ extended: true }))


app.use('/todo', todoRoutes)
app.use('/register', regRoutes)

app.get('/', (req, res) => {
    res.send('Welcom to todo list page')
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