const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Routes here
router.get('/', async (req, res) => {
    const users = await User.find({});
    res.render('users/index.ejs', { users });
});

router.get('/:userId', async (req, res) => {
    const users = await User.find({}).populate('pantry savedRecipes ownedRecipes');
    const user = users.find(u => u._id.toString() === req.params.userId);
    res.render('users/show.ejs', { user });
});

module.exports = router;