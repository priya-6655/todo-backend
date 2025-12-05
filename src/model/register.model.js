const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Registration = sequelize.define('registration', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    regUsername: {
        type: DataTypes.STRING,
        allowNull: false
    },
    regEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    regPass: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'registration',
    timestamps: false
})

module.exports = Registration