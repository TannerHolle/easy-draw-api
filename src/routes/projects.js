const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const { list, listByCreator, getProjectById, create, updateProject, deleteProject, closeCurrentDraw, openNewDraw } = require("../controllers/ProjectController");

/* PROJECT API CALLS */

/**
 * GET /projects
 * Purpose: Get all projects in the db
 */
router.get('/list', checkAuth, list);


/**
 * GET /projects
 * Purpose: Get all projects in the db for one User
 */
router.get('/list/:creatorId', checkAuth, listByCreator);

/**
 * GET /projects/:id
 * Purpose: Get one project filtered by project id
 */
router.get('/:id', checkAuth, getProjectById);

/**
 * POST /projects
 * Purpose: Create a new project
 */
router.post('/create', checkAuth, create);

/**
 * POST /projects/:id
 * Purpose: Update a project
 */
router.post('/update/:id', checkAuth, updateProject);

/**
 * DELETE /projects/:id
 * Purpose: Delete a project from the db
 */
router.delete('/delete/:id', checkAuth, deleteProject)


/**
 * POST /api/close-draw/:id/:drawId
 * Purpose: Close current draw
 */
router.post('/close-draw/:id/:drawId', checkAuth, closeCurrentDraw);

/**
 * POST /api/open-new-draw/:id/:drawId
 * Purpose: Opens a new draw
 */
router.post('/open-new-draw/:id', checkAuth, openNewDraw);


module.exports = router;
