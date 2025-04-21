const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const postsRouter = require('./src/routes/postsRoutes');
const ingredientsRouter = require('./src/routes/ingredientsRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/user', 'createRecipe.html'));
});

// API Routes
app.use('/api/posts', postsRouter);
app.use('/api/ingredients', ingredientsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});