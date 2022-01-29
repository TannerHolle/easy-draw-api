const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');

const checkAuth = require("../middleware/check-auth");

const { Invoice } = require('../db/models/invoice.model')
const { Project } = require('../db/models/project.model')


const router = express.Router();

//Configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    console.log(__dirname)
    cb(null, path.join(__dirname, '../images/'));
  },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      cb(null, name + "-" + Date.now() + "." + ext);
  },
  });
  
  // Multer Filter
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "pdf" || file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Not a PDF or JPG File"), false);
    }
  };
  
  //Calling the "multer" Function
  const upload = multer({
    storage: storage,
    fileFilter: multerFilter,
  });
  

/* INVOICE API CALLS */

/**
 * POST /invoices
 * Purpose: Create a new invoice
 */
router.post('/create_deprecated', (req, res) => {
    let body = req.body;
  
    let newInvoice = new Invoice({
      company: body.company,
      address: body.address,
      category: body.category,
      invoiceNum: body.invoiceNum,
      invoiceAmt: body.invoiceAmt,
    });
  
  
    Project.findOneAndUpdate(
      {
        "_id": req.body.project._id
      },
      { $push: { "draws.$[a].invoices": newInvoice } },
      {
        "new": true,
        "arrayFilters": [
          { "a.name": body.draw },
        ]
      }).then(() => {
            res.sendStatus(200)
      });
  });
  
  //TEST
  /**
   * POST /invoices
   * Purpose: Create a new invoice
   */
router.post('/create', checkAuth, upload.single("image"), async (req, res) => {
    let body = req.body;
    const url = req.protocol + '://' + req.get("host")
    let newInvoice = new Invoice({
      company: body.company,
      address: body.address,
      category: body.category,
      invoiceNum: body.invoiceNum,
      invoiceAmt: body.invoiceAmt,
      invoicePath: url + "/api/images/" + req.file.filename
    });
  
  
    Project.findOneAndUpdate(
      {
        "_id": req.body.projectId
      },
      { $push: { "draws.$[a].invoices": newInvoice } },
      {
        "new": true,
        "arrayFilters": [
          { "a.name": body.draw },
        ]
      }).then(createdInvoice => {
            res.status(201).json({
              message: "created Invoice Successfully"
            })
      });
  });

  module.exports = router;
