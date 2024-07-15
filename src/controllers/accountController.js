const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const bCrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const account = await Account.createAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.getAccountByEmail(email);
    if (!account) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bCrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAccounts = async (req, res) => {
    const { limit } = req.query;
    try {
        const accounts = await Account.getAccounts({ limit: parseInt(limit) });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAccountById = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.getAccountById(id);
        if (!account) return res.status(404).json({ error: 'Account not found' });
        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, password, birthday } = req.body;
    const hashedPassword = password ? await bCrypt.hash(password, 10) : undefined;
    try {
        const account = await Account.getAccountById(id);
        if (!account) return res.status(404).json({ error: 'Account not found' });
        await account.update({
            first_name,
            last_name,
            email,
            phone,
            password: hashedPassword || account.password,
            birthday,
            last_modified: new Date()
        });
        res.status(200).json(account);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.getAccountById(id);
        if (!account) return res.status(404).json({ error: 'Account not found' });
        await account.destroy();
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
  register,
  login,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
