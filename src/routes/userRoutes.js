const express = require('express');
const accountController = require('../controllers/accountController');
const router = express.Router();

router.post('/register', accountController.createAccount);
router.post('/login', accountController.login);

module.exports = router;
