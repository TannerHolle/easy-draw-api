const { Lender } = require('../../db/models/lender.model')

/**
 * POST /create
 * Purpose: Create a new Lender
 */
module.exports.create = (req, res) => {
  const body = req.body;

  const newLender = new Lender({
    name: body.name,
    admin: body.admin,
  });

  newLender.save().then((lenderDoc) => {
    res.send(lenderDoc);
  });
}


/**
* GET /lender/findAll
* Purpose: Return all matching lenders
*/
module.exports.findAll = (req, res) => {
  const name = req.body.name;
  Lender.find({ name: { $regex: name } }).then((lenders) => {
    res.send(lenders);
  }).catch((e) => {
    res.send(e);
  });
}
