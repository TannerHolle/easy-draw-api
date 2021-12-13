const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  company: String,
  address: String,
  category: String,
  invoiceNum: String,
  invoiceAmt: Number,
  invoicePath: String
})

const Invoice = mongoose.model('Invoice', InvoiceSchema)

module.exports = { Invoice }
