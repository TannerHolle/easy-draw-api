const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const { list, listByCreatorId, create, createCompanies, update, deleteCompany } = require("../controllers/CompanyController");

/* COMPANY API CALLS */

/**
 * GET /companies
 * Purpose: Get a list of all the companies
 */
router.get('/list', checkAuth, list);

/**
 * GET /companies
 * Purpose: Get a list of all the companies for a User
 */
router.get('/list/:creatorId', checkAuth, listByCreatorId);

/**
 * POST /companies
 * Purpose: Create a new company
 */
router.post('/create', checkAuth, create);

/**
 * POST /companies
 * Purpose: Create a new company
 */
router.post('/upload', checkAuth, createCompanies);

/**
 * POST /companies/:id
 * Purpose: Update a company in the db
 */
router.post('/update/:id', checkAuth, update);

/**
 * DELETE /companies/:id
 * Purpose: Delete a company from the db
 */
router.delete('/delete/:id', checkAuth, deleteCompany);

module.exports = router;
