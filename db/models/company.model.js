const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  taxId: { type: String, required: true },
  certOfInsurance: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Notes: { type: String}
})

const Company = mongoose.model('Company', CompanySchema)

module.exports = { Company }
