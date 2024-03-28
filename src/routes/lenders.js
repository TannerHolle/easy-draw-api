const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const { create, findAll } = require("../controllers/LenderController");

/* Lender API CALLS */

/**
 * POST /create
 * Purpose: Create a new Lender
 */
router.post('/create', checkAuth, create);

/**
 * POST /findAll
* Purpose: Return all matching lenders
 */
router.post('/findAll', checkAuth, findAll);

module.exports = router;
