const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const addTodoList = sequelize.define('addtodolist', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    todoText: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'addtodolist',
    timestamps: false
})

module.exports = addTodoList