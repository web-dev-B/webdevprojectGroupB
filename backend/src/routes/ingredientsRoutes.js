const express = require('express');
const router = express.Router();
const { getAllIngredients, searchIngredients } = require('../controllers/ingredientsController');

router.get('/', getAllIngredients);
router.get('/search', searchIngredients);

module.exports = router;