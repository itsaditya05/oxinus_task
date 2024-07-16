const sequelize = require('../config/database');
const Account = require('./account');
const Token = require('./token');

const initDB = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Unable to sync the database:', error);
    }
};

module.exports = { initDB, Account, Token };
