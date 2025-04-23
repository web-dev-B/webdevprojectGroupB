const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./src/config/db');
require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./src/routes/authRoutes'));

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.static(path.join(__dirname, '../frontend/views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/home', 'index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));