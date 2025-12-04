const { json } = require('sequelize')
const addTodoList = require('../model/todoList.model')


const addTodo = async (req, res) => {
    try {
        const { todoText } = req.body

        if (!todoText) {
            return res.status(400).json({
                message: 'Invalid item insertion'
            })
        }

        const newTodo = await addTodoList.create({
            todoText
        })

        res.status(201).json({
            success: true,
            message: "Added Successful",
            data: newTodo
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const viewTodo = async (req, res) => {
    try {
        const viewList = await addTodoList.findAll()

        res.status(200).json({
            success: true,
            message: "Todo list fetched successfully",
            data: viewList
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const completedTodo = async (req, res) => {
    try {
        const { id, completed } = req.body

        const todo = await addTodoList.findByPk(id)

        if (!todo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }

        todo.completed = completed
        await todo.save()

        res.status(200).json({
            success: true,
            message: 'Todo updated',
            data: todo
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}

const editTodo = async (req, res) => {
    try {
        const { id, todoText } = req.body

        const todo = await addTodoList.findByPk(id)

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        todo.todoText = todoText
        await todo.save()

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: todo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params
        const delTodo = await addTodoList.findByPk(id)

        if (!delTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            })
        }

        await delTodo.destroy()

        res.status(200).json({
            success: true,
            message: "Todo delete success"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}


module.exports = { addTodo, viewTodo, completedTodo, editTodo, deleteItem }