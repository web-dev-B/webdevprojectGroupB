const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./src/config/db');
const bodyParser = require('body-parser');
const postsRouter = require('./src/routes/postsRoutes');
const ingredientsRouter = require('./src/routes/ingredientsRoutes');
require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./src/routes/authRoutes'));

// API Routes
app.use('/api/posts', postsRouter);
app.use('/api/ingredients', ingredientsRouter);

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.static(path.join(__dirname, '../frontend/views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/home', 'index.html'));
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the HTML file
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/user', 'createRecipe.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



