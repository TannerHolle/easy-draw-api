const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  role: { type: String, default: 'guest', enum: ['superAdmin', 'lenderAdmin', 'guest'] },
  password: { type: String, require: true },
  isVerified: { type: Boolean, require: true },
  resetPasswordLink: { type: Object },
  dateAccountCreated: { type: Date, default: Date.now }
})

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);

module.exports = { User }
