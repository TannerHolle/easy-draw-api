const express = require("express");

const { Project } = require('../db/models/project.model')

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
   router.post('/create', (req, res) => {
    let body = req.body;
  
    let newProject = new Project({
      name: body.name,
      address: body.address,
      client: body.client,
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
   router.post('/update/:id', (req, res) => {
    Project.findOneAndUpdate({ _id: req.params.id}, {
      $set:       
      {
        name: req.body.name,
        address: req.body.address,
        client: req.body.client,
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
   router.delete('/delete/:id', (req, res) => {
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
  


module.exports = router;
