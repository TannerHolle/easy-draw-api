const express = require("express");
const router = express.Router();
const { create, uploadCSV } = require("../controllers/CategoryController")
const checkAuth = require("../middleware/check-auth");

/* Catgory API CALLS */

/**
 * POST /categories
 * Purpose: Create a new category
 */
router.post('/create', checkAuth, create);

/**
 * POST /category-upload/:id
 * Purpose: upload csv and add all categories to project
 */
router.post('/upload/:id', checkAuth, uploadCSV);

module.exports = router;
