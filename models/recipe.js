const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
  },
});

const recipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ingredients: [ingredientSchema],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

module.exports = mongoose.model('Recipe', recipeSchema);