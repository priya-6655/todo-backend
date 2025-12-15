const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const OrderVegRegister = sequelize.define('vegRegistration', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false,
    }
}, {
    tableName: 'vegRegistration',
    timestamps: false
})

module.exports = OrderVegRegister