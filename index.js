const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initRoutes = require('./src/routes');
require('./src/util/database');
require('./src/util/schedule');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: process.env.ClIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extends: true }));

app.get('/', (req, res) => {
  res.json('Home');
});

initRoutes(app);

// Run app
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
