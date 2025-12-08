const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Registration = sequelize.define('registration', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fname: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    lname: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    regUsername: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    regEmail: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    regPass: {
        type: DataTypes.STRING(25),
        allowNull: false
    }
}, {
    tableName: 'registration',
    timestamps: false
})

module.exports = Registration