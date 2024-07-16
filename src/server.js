require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportInstance = require('./lib/passport');
const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes');
const { initDB } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => passportInstance(app, res, next));

app.use('/api/user', userRoutes);

app.use(passport.authenticate('bearer', { session: false }));
app.use('/api/accounts', accountRoutes);

initDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
