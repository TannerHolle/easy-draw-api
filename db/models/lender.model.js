const mongoose = require('mongoose');

const lenderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  admin: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});

const Lender = mongoose.model('Lender', lenderSchema);

module.exports = { Lender };
