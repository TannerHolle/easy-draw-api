const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const checkAuth = require("../middleware/check-auth");



const { Company } = require('../db/models/company.model')

const router = express.Router();


/* COMPANY API CALLS */

/**
 * GET /companies
 * Purpose: Get a list of all the companies
 */
router.get('/list', (req, res) => {
    Company.find({}).then((companies) => {
      res.send(companies);
    }).catch((e) => {
      res.send(e);
    });
  });
  
/**
 * GET /companies
 * Purpose: Get a list of all the companies for a User
 */
router.get('/list/:creatorId', (req, res) => {
    Company.find({creator: req.params.creatorId}).then((companies) => {
      console.log(companies)
      res.send(companies);
    }).catch((e) => {
      res.send(e);
    });
  });

/**
 * POST /companies
 * Purpose: Create a new company
 */
 router.post('/create', checkAuth, (req, res) => {
    let body = req.body;
  
    let newCompany = new Company({
      name: body.name,
      address: body.address,
      email: body.email,
      phone: body.phone,
      taxId: body.taxId,
      certOfInsurance: body.certOfInsurance,
      creator: req.userData.userId,
      Notes: body.Notes
    });
  
    newCompany.save().then((companyDoc) => {
      res.send(companyDoc);
    });
  });
  
  /**
   * POST /companies/:id
   * Purpose: Update a company in the db
   */
   router.post('/update/:id', (req, res) => {
    Company.findOneAndUpdate({ _id: req.params.id}, {
      $set: req.body
    }).then(() => {
      res.sendStatus(200);
    })
  });
  
  /**
   * DELETE /companies/:id
   * Purpose: Delete a company from the db
   */
   router.delete('/delete/:id', (req, res) => {
    Company.findOneAndRemove({
      _id: req.params.id
    }).then((removedCompany) => {
      res.send(removedCompany)
    });
  });

  module.exports = router;
