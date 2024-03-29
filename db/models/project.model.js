const mongoose = require('mongoose');
const { Category } = require('./category.model')

const ProjectSchema = new mongoose.Schema({
  name: String,
  address: String,
  client: String,
  phone: String,
  email: String,
  budget: Number,
  categories: [],
  draws: [],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateStarted: { type : Date, default: Date.now },
  completed: Boolean,
  dateCompleted: Date,
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = { Project }
