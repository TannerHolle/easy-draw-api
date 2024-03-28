const { Project } = require('../../db/models/project.model');

/**
 * GET /projects
 * Purpose: Get all projects in the db
 */
module.exports.list = (req, res) => {
  Project.find({}).populate('borrower').populate('lender').then((projects) => {
    res.send(projects);
  }).catch((e) => {
    res.send(e);
  });
}


/**
 * GET /projects
 * Purpose: Get all projects in the db for one User
 */
module.exports.listByCreator = (req, res) => {
  Project.find({ creator: req.params.creatorId }).populate('borrower').populate('lender').then((projects) => {
    res.send(projects);
  }).catch((e) => {
    res.send(e);
  });
}

/**
 * GET /projects/:id
 * Purpose: Get one project filtered by project id
 */
module.exports.getProjectById = (req, res) => {
  Project.find({ "_id": req.params.id }).populate('borrower').populate('lender').then((projects) => {
    res.send(projects);
  }).catch((e) => {
    console.log(e)
    res.send(e);
  });
}

/**
 * POST /projects
 * Purpose: Create a new project
 */
module.exports.create = (req, res) => {
  let body = req.body;

  let newProject = new Project({
    name: body.name,
    address: body.address,
    borrower: body.borrower,
    lender: body.lender,
    phone: body.phone,
    email: body.email,
    budget: body.budget,
    categories: body.categories,
    draws: body.draws,
    creator: req.userData.userId,
    completed: false
  });

  newProject.save().then((projectDoc) => {
    res.send(projectDoc);
  });
}

/**
 * POST /projects/:id
 * Purpose: Update a project
 */
module.exports.updateProject = (req, res) => {
  Project.updateOne({ _id: req.params.id, creator: req.userData.userId },
    {
      name: req.body.name,
      address: req.body.address,
      client: req.body.client,
      budget: req.body.budget,
      phone: req.body.phone,
      email: req.body.email,
      categories: req.body.categories,
      creator: req.userData.userId
    }
  ).then(result => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Update successful' });
    } else {
      res.status(401).json({ message: 'Not Authorized' });

    }
  })
}

/**
 * DELETE /projects/:id
 * Purpose: Delete a project from the db
 */
module.exports.deleteProject = (req, res) => {
  Project.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Deletion successful' });
      } else {
        res.status(401).json({ message: 'Not Authorized' });
      }
    });
}


/**
 * POST /api/close-draw/:id/:drawId
 * Purpose: Close current draw
 */
module.exports.closeCurrentDraw = (req, res) => {
  Project.findOneAndUpdate(
    {
      "_id": req.params.id
    },
    {
      $set: { "draws.$[a].isOpen": false },
    },
    {
      "new": true,
      "arrayFilters": [
        { "a.name": req.params.drawId },
      ]
    }).then(() => {
      res.sendStatus(200)
    });
}

/**
 * POST /api/open-new-draw/:id/:drawId
 * Purpose: Opens a new draw
 */
module.exports.openNewDraw = (req, res) => {
  const currentDateTime = new Date().toISOString();

  let newDraw = {
    name: req.body.drawId,
    isOpen: true,
    invoices: [],
    changeOrders: [],
    checks: '',
    signedDraw: '',
    dateOpened: currentDateTime
  }
  Project.findOneAndUpdate(
    {
      "_id": req.params.id
    },
    {
      $push: { "draws": newDraw }
    }
  ).then(() => {
    res.sendStatus(200)
  });
}
