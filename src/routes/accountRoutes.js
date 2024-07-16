const express = require('express');
const accountController = require('../controllers/accountController');
const router = express.Router();

router.get('/accounts', accountController.listAccounts);
router.get('/:id', accountController.getAccountById);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
