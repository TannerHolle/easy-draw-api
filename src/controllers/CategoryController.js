const { Project } = require('../../db/models/project.model')
const { Category } = require('../../db/models/category.model')

/**
 * POST /categories
 * Purpose: Create a new category
 */
module.exports.create = (req, res) => {
  let body = req.body;

  let newCategory = new Category({
    costCode: body.costCode,
    category: body.category,
    budget: body.budget,
  });

  Project.findOneAndUpdate({ "_id": body.projectId },
    { $push: { "categories": newCategory } }).then(() => {
      res.sendStatus(200)
    });
}

/**
 * POST /category-upload/:id
 * Purpose: upload csv and add all categories to project
 */
module.exports.uploadCSV = (req, res) => {
  let body = req.body;

  Project.updateOne({ "_id": req.params.id },
    { $push: { "categories": { $each: body } } }).then(() => {
      res.sendStatus(200)
    });
}
