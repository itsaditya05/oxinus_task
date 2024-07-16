const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Token = sequelize.define('Token', {
    token_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Accounts',
            key: 'id'
        },
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(1024),
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'tokens'
});

module.exports = Token;
