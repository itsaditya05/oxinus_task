const db = require('../db');
const bcrypt = require('bcryptjs');

const createAccount = async (account) => {
  const { first_name, last_name, email, phone, password, birthday } = account;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO accounts (first_name, last_name, email, phone, password, birthday) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [first_name, last_name, email, phone, hashedPassword, birthday]
  );
  return result.rows[0];
};

const getAccountByEmail = async (email) => {
  const result = await db.query('SELECT * FROM accounts WHERE email = $1', [email]);
  return result.rows[0];
};

const getAccountById = async (id) => {
    const result = await db.query('SELECT * FROM accounts WHERE id = $1', [id]);
    return result.rows[0];
};

const getAccounts = async (limit) => {
    const result = await db.query('SELECT * FROM accounts');
    return result.rows[0];
};

const update = async (limit) => {
    const result = await db.query('SELECT * FROM accounts');
    return result.rows[0];
};

const destroy = async (limit) => {
    const result = await db.query('SELECT * FROM accounts');
    return result.rows[0];
};

// Add more CRUD operations as needed

module.exports = {
  createAccount,
  getAccountByEmail,
  getAccountById,
  getAccounts,
  update,
  destroy,
};
