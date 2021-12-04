const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Address: { type: String, required: true },
  TaxID: { type: String, required: true },
  Notes: { type: String}
})

const Company = mongoose.model('Company', CompanySchema)

module.exports = { Company }
