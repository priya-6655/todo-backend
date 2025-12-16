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
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    loginStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'vegRegistration',
    timestamps: false,
    freezeTableName: true
})

module.exports = OrderVegRegister