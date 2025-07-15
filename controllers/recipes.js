const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const User = require('../models/user');

// routes here
router.get('/', async (req, res) => {
    const user = await User.findById(req.session.user._id).populate('recipes');
    console.log('RECIPES ARE:', user.recipes);
    res.render('recipes/index.ejs', { recipes: user.recipes });
});

router.get('/new', (req, res) => {
    res.render('recipes/new.ejs');
});

module.exports = router;