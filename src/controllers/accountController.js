const { Account } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

const createAccount = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, birthday } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const ifExist = await Account.findOne({ where: { email } });
        if (ifExist) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        await Account.create({
            first_name,
            last_name,
            email,
            phone,
            password: hashedPassword,
            birthday,
            created_at: new Date(),
            last_modified: new Date()
        });
        res.status(201).json({ message: 'Your account has been created successfully'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ where: { email } });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Login successfully'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const listAccounts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const accounts = await Account.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'last_modified'],
            order: [['last_modified', 'DESC']],
            limit,
        });
        res.json(accounts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const accounts = await Account.findOne({
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'last_modified'],
            where: { id },
        });
        if (!accounts) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.json(accounts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, birthday } = req.body;
        await Account.update(
            {
                first_name,
                last_name,
                phone,
                birthday,
                last_modified: new Date(),
            },
            {
                where: { id },
            },
        );
        res.status(201).json({ message: 'Your account has been updated successfully'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        await Account.destroy({ where: { id } });
        res.status(201).json({ message: 'Your account has been deleted successfully'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createAccount,
    login,
    listAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
  };
