const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const User = require('../models/user');

router.get('/', async (req, res) => {
    const user = await User.findById(req.session.user._id).populate('ownedRecipes savedRecipes');
    console.log('USER IS:', user);
    res.render('recipes/index.ejs', { 
        savedRecipes: user.savedRecipes, 
        ownedRecipes: user.ownedRecipes
    });
});

router.get('/new', (req, res) => {
    res.render('recipes/new.ejs');
});

router.get('/:recipeId', async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId).populate('owner');
    console.log('RECIPE IS:', recipe);
    res.render('recipes/show.ejs', { recipe });
});

// Add recipe to user's saved recipes
// Add user to recipe's 'users' array
router.put('/:recipeId/save', async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId);
    const user = await User.findById(req.session.user._id).populate('savedRecipes');

    // Check if the recipe is already saved
    if (!user.savedRecipes.includes(recipe._id)) {
        user.savedRecipes.push(recipe._id);
        recipe.users.push(user._id);
        await user.save();
        await recipe.save();
        console.log('Recipe saved successfully.');
    } else {
        console.log('Recipe is already saved.');
    }

    res.redirect(`/users/${user._id}/recipes`);
});

router.post('/', async (req, res) => {
    console.log('REQ.BODY IS:', req.body);
    const { name, instructions } = req.body;
    const ingredientNames = req.body['ingredients[][name]'];
    const ingredientQuantities = req.body['ingredients[][quantity]'];

    const ingredients = ingredientNames.map((name, index) => {
        return { name: name, quantity: ingredientQuantities[index] };
    });
    console.log('INGREDIENTS ARE:', ingredients);

    const newRecipe = await Recipe.create({
        name,
        instructions,
        owner: req.session.user._id,
        ingredients: ingredients,
    });
    console.log('NEW RECIPE IS:', newRecipe);

    const user = await User.findById(req.session.user._id);
    user.ownedRecipes.push(newRecipe._id);
    await user.save();
    res.redirect(`/users/${req.session.user._id}/recipes`);
});

module.exports = router;