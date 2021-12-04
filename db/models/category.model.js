const mongoose = require('mongoose');

const CateogrySchema = new mongoose.Schema({
  costCode: String,
  category: String,
  budget: Number,
})

const Category = mongoose.model('Category', CateogrySchema)

module.exports = { Category }
