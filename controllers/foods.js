const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render('foods/index.ejs', { pantry: user.pantry });
});

router.get('/new', (req, res) => {
    res.render('foods/new.ejs');
});

router.get('/:itemId/edit', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    const item = user.pantry.id(req.params.itemId);
    res.render('foods/edit.ejs', { item });
});

router.post('/', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    user.pantry.push({ name: req.body.name });
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
});

router.delete('/:itemId', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    user.pantry.pull(req.params.itemId);
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
});

router.put('/:itemId', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    const item = user.pantry.id(req.params.itemId);
    item.name = req.body.name;
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
});

module.exports = router;