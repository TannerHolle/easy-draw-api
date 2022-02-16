const express = require("express");

const { Project } = require('../db/models/project.model');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/* PROJECT API CALLS */

/**
 * GET /projects
 * Purpose: Get all projects in the db
 */
 router.get('/list', (req, res) => {
    Project.find({}).then((projects) => {
      res.send(projects);
    }).catch((e) => {
      res.send(e);
    });
  });

/**
 * GET /projects
 * Purpose: Get all projects in the db for User
 */
 router.get('/list/:creatorId', (req, res) => {
    Project.find({creator: req.params.creatorId}).then((projects) => {
      res.send(projects);
    }).catch((e) => {
      res.send(e);
    });
  });
  
  /**
   * GET /projects/:id
   * Purpose: Get one project filtered by project id
   */
   router.get('/:id', (req, res) => {
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
   router.post('/create', checkAuth, (req, res) => {
    let body = req.body;
  
    let newProject = new Project({
      name: body.name,
      address: body.address,
      client: body.client,
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
  });
  
  /**
   * POST /projects/:id
   * Purpose: Update a project
   */
   router.post('/update/:id', checkAuth, (req, res) => {
    Project.updateOne({ _id: req.params.id, creator: req.userData.userId},    
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
      if(result.modifiedCount > 0) {
        res.sendStatus(200).json({ message: 'Update successful'});
      } else {
        res.sendStatus(401).json({ message: 'Not Authorized'});

      }

    })
  });
  
  /**
   * DELETE /projects/:id
   * Purpose: Delete a project from the db
   */
   router.delete('/delete/:id', checkAuth, (req, res, next) => {
    Project.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(
      result => {
        if(result.deletedCount > 0) {
          res.sendStatus(200).json({ message: 'Deletion successful'});
        } else {
          res.sendStatus(401).json({ message: 'Not Authorized'});  
        }    
      });
  })
  
  
  /**
   * POST /api/close-draw/:id/:drawId
   * Purpose: Close current draw
   */
   router.post('/close-draw/:id/:drawId', (req, res) => {
  
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
  router.post('/open-new-draw/:id/:drawId', (req, res) => {
  
    let drawNum = req.params.drawId[req.params.drawId.length -1];
    let newDrawId = "draw" + (Number(drawNum) + 1);
    console.log(newDrawId);
  
    let newDraw = {
      name: newDrawId,
      isOpen: true,
      invoices: [],
      changeOrders: []
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
  


module.exports = router;
