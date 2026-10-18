require('dotenv').config();

const express = require('express'); const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes'); // Importem les rutes

const app = express(); app.use(express.json());
connectDB();

app.get('/', (req, res) => res.send('API Ecommerce en marxa'));

