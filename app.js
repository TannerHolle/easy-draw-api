const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const { mongoose } = require('./db/mongoose');

const { Project } = require('./db/models/project.model')
const { Invoice } = require('./db/models/invoice.model')
const { Company } = require('./db/models/company.model')
const { Category } = require('./db/models/category.model')
const { User } = require('./db/models/user.model')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

/* INVOICE API CALLS */

/**
 * POST /invoices
 * Purpose: Create a new invoice
 */
app.post('/api/invoices', (req, res) => {
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

/* PROJECT API CALLS */

/**
 * GET /projects
 * Purpose: Get all projects in the db
 */
app.get('/api/projects', (req, res) => {
  Project.find({}).then((projects) => {
    res.send(projects);
  }).catch((e) => {
    res.send(e);
  });
});

/**
 * GET /projects/:id
 * Purpose: Get one project filtered by project id
 */
app.get('/api/projects/:id', (req, res) => {
  Project.find({"_id": req.params.id}).then((projects) => {
    console.log(projects)
    res.send(projects);
  }).catch((e) => {
    console.log(e)
    res.send(e);
  });
});

/**
 * POST /projects
 * Purpose: Create a new project
 */
app.post('/api/projects', (req, res) => {
  let body = req.body;

  let newProject = new Project({
    name: body.name,
    address: body.address,
    homeOwners: body.homeOwners,
    phone: body.phone,
    email: body.email,
    budget: body.budget,
    categories: body.categories,
    draws: body.draws
  });
  console.log(newProject);

  newProject.save().then((projectDoc) => {
    res.send(projectDoc);
  });
});

/**
 * POST /projects/:id
 * Purpose: Update a project
 */
app.post('/api/projects/:id', (req, res) => {
  Project.findOneAndUpdate({ _id: req.params.id}, {
    $set:       
    {
      name: req.body.name,
      address: req.body.address,
      homeOwners: req.body.homeOwners,
      budget: req.body.budget,
      phone: req.body.phone,
      email: req.body.email,
      categories: req.body.categories
    }
  }).then(() => {
    res.sendStatus(200);
  })
});

/**
 * DELETE /projects/:id
 * Purpose: Delete a project from the db
 */
app.delete('/api/projects/:id', (req, res) => {
  Project.findOneAndRemove({
    _id: req.params.id
  }).then((removedProject) => {
    res.send(removedProject)
  });
})


/**
 * POST /api/close-draw/:id/:drawId
 * Purpose: Close current draw
 */
 app.post('/api/close-draw/:id/:drawId', (req, res) => {

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
});

/**
 * POST /api/open-new-draw/:id/:drawId
 * Purpose: Opens a new draw
 */
app.post('/api/open-new-draw/:id/:drawId', (req, res) => {

  let drawNum = req.params.drawId[req.params.drawId.length -1];
  let newDrawId = "draw" + (Number(drawNum) + 1);
  console.log(newDrawId);

  let newDraw = {
    name: newDrawId,
    isOpen: true,
    invoices: []
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
    
});



/* COMPANY API CALLS */

/**
 * GET /companies
 * Purpose: Get a list of all the companies
 */
app.get('/api/companies', (req, res) => {
  Company.find({}).then((companies) => {
    res.send(companies);
  }).catch((e) => {
    res.send(e);
  });
});

/**
 * POST /companies
 * Purpose: Create a new company
 */
app.post('/api/companies', (req, res) => {
  let body = req.body;

  let newCompany = new Company({
    Name: body.Name,
    Address: body.Address,
    TaxID: body.TaxID,
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
app.post('/api/companies/:id', (req, res) => {
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
app.delete('/api/companies/:id', (req, res) => {
  Company.findOneAndRemove({
    _id: req.params.id
  }).then((removedCompany) => {
    res.send(removedCompany)
  });
});

/* Catgory API CALLS */

/**
 * POST /categories
 * Purpose: Create a new category
 */
 app.post('/api/categories', (req, res) => {
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

/* User API CALLS */

/**
 * POST /api/user/login
 * Purpose: Sign In
 */
 app.post('/api/user/login', (req, res) => {
  let body = req.body;
  let fetchedUser;
  User.findOne({email: body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer', 
        {expiresIn: '1h'}
      );
      res.status(200).json({
        token:token
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth Failed"
      });
    })
});

/**
 * POST /api/user/sign-up
 * Purpose: Create a new user
 */
 app.post('/api/user/sign-up', (req, res) => {
  let body = req.body;

  bcrypt.hash(body.password, 10)
  .then(hash => {
      let newUser = new User({
        email: body.email,
        password: hash
      });
      console.log(newUser)
      newUser.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created',
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    }
  )


});

module.exports = app

