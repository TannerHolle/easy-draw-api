const { Company } = require('../../db/models/company.model')

/**
 * GET /companies
 * Purpose: Get a list of all the companies
 */
module.exports.list = (req, res) => {
  Company.find({}).then((companies) => {
    res.send(companies);
  }).catch((e) => {
    res.send(e);
  });
}

/**
 * GET /companies
 * Purpose: Get a list of all the companies for a User
 */
module.exports.listByCreatorId = (req, res) => {
  Company.find({ creator: req.params.creatorId }).then((companies) => {
    res.send(companies);
  }).catch((e) => {
    res.send(e);
  });
}

/**
 * POST /companies
 * Purpose: Create a new company
 */
module.exports.create = (req, res) => {
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
}

/**
 * POST /companies
 * Purpose: Create new companies
 */
module.exports.createCompanies = (req, res) => {
  let companies = req.body;

  for (let company of companies) {
    company["creator"] = req.userData.userId
  }
  Company.insertMany(companies)
    .then(() => {
      res.sendStatus(200)
    });
}

/**
 * POST /companies/:id
 * Purpose: Update a company in the db
 */
module.exports.update = (req, res) => {
  Company.findOneAndUpdate({ _id: req.params.id }, {
    $set: req.body
  }).then(() => {
    res.sendStatus(200);
  })
}

/**
 * DELETE /companies/:id
 * Purpose: Delete a company from the db
 */
module.exports.deleteCompany = (req, res) => {
  Company.findOneAndRemove({
    _id: req.params.id
  }).then((removedCompany) => {
    res.send(removedCompany)
  });
}