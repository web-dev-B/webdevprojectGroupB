const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const homeRoutes = require('./src/routes/homeRoutes')
const pool = require('./src/config/db');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//link to frontend part
app.use(express.static(path.join(__dirname, 'frontend/public')));

//app routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });


  // const express = require('express');
  // const cors = require('cors');
  // const connectDB = require('./config/db');
  // require('dotenv').config();
  
  // const app = express();
  
  // // Connect Database
  // connectDB();
  
  // // Middleware
  // app.use(express.json());
  // app.use(cors());
  
  // // Routes
  // app.use('/api/auth', require('./routes/auth'));
  
  // const PORT = process.env.PORT || 5000;
  
  // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  