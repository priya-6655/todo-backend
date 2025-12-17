const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Registration = require('../model/register.model')

const ContactUs = sequelize.define('contactus', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Registration,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'contactus',
    timestamps: true
})

Registration.hasMany(ContactUs, { foreignKey: 'userId' })
ContactUs.belongsTo(Registration, { foreignKey: 'userId' })

module.exports = ContactUs
