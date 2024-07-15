require('dotenv').config();
const express = require('express');
const app = express();
const accountRoutes = require('./routes/accountRoutes');

app.use(express.json());
app.use('/api/accounts', accountRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
