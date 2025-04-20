const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/post', require('./src/routes/postRoutes'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));