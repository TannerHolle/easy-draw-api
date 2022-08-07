const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  company: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  resetPasswordLink: {type: Object},
  securityQuestion: { type: String },
  securityAnswer: { type: String }
})

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);

module.exports = { User }
