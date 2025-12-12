const express = require('express')
const { addTodo, viewTodo, completedTodo, editTodo, deleteItem } = require('../controllers/todoList.controller')
const verifyToken = require('../middleware/authMiddleware')
const router = express.Router()

// All todo routes require JWT authentication
router.post('/addtodo', verifyToken, addTodo)
router.get('/viewtodo', verifyToken, viewTodo)
router.put('/completed', verifyToken, completedTodo)
router.put('/edit', verifyToken, editTodo)
router.delete('/delete/:id', verifyToken, deleteItem)

module.exports = router