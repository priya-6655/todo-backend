const express = require('express')
const { addTodo, viewTodo, completedTodo, editTodo, deleteItem } = require('../controllers/todoList.controller')
const router = express.Router()

router.post('/addtodo', addTodo)
router.get('/viewtodo', viewTodo)
router.put('/completed', completedTodo)
router.put('/edit', editTodo)
router.delete('/delete/:id', deleteItem)

module.exports = router