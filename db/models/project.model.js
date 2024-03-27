const mongoose = require('mongoose');
const { Category } = require('./category.model')

const ProjectSchema = new mongoose.Schema({
  name: String,
  address: String,
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  phone: String,
  email: String,
  budget: Number,
  categories: [],
  draws: [],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateStarted: { type: Date, default: Date.now },
  completed: Boolean,
  dateCompleted: Date,
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = { Project }
