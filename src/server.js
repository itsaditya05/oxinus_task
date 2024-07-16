require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const accountRoutes = require('./routes/accountRoutes');
const { initDB } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/accounts', accountRoutes);

initDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
