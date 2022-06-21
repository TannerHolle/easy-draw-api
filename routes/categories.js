const express = require("express");

const { Project } = require('../db/models/project.model')
const { Category } = require('../db/models/category.model')

const router = express.Router();

/* Catgory API CALLS */

/**
 * POST /categories
 * Purpose: Create a new category
 */
router.post('/create', (req, res) => {
    console.log("is it getting here?")
    let body = req.body;
  
    let newCategory = new Category({
      costCode: body.costCode,
      category: body.category,
      budget: body.budget,
    });
  
    console.log(newCategory);
    console.log(body.projectId);
  
    Project.findOneAndUpdate({ "_id": body.projectId},
      { $push: { "categories": newCategory } }).then(() => {
            res.sendStatus(200)
      });
  });
  
  /**
   * POST /category-upload/:id
   * Purpose: upload csv and add all categories to project
   */
   router.post('/upload/:id', (req, res) => {
    let body = req.body;

    console.log("category upload: " + JSON.stringify(body))
  
    Project.updateOne({ "_id": req.params.id},
      { $push: { "categories": {$each: body} } }).then(() => {
            res.sendStatus(200)
      });
  });

  module.exports = router;
