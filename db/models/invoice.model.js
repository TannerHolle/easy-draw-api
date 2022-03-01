const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  company: String,
  address: String,
  taxId: String,
  category: String,
  invoiceNum: String,
  invoiceAmt: Number,
  invoicePath: String,
  isPaid: Boolean
})

const Invoice = mongoose.model('Invoice', InvoiceSchema)

module.exports = { Invoice }
