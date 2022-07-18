const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');

const invoiceRoutes = require("./routes/invoices");
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const companyRoutes = require("./routes/companies");
const categoryRoutes = require("./routes/categories");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/images", express.static(path.join(__dirname + "/images")))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/invoice/", invoiceRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/company/", companyRoutes);
app.use("/api/project/", projectRoutes);
app.use("/api/category/", categoryRoutes);

module.exports = app

