const express = require("express");
const multer = require('multer');
const path = require('path');
const checkAuth = require("../middleware/check-auth");
const { create, createChangeOrder, changePaidStatus, getAwsFileByName, update, deleteInvoice, uploadCSVAndInvoices, attachChecksToDraw, attachSignedDraw } = require("../controllers/InvoiceController");

const router = express.Router();

//Configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(__dirname)
    cb(null, path.join(__dirname, '../images/'));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf" || file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "heic") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF or JPG File"), false);
  }
};

//Calling the "multer" Function
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});


/* INVOICE API CALLS */

/**
 * POST /invoice/create
 * Purpose: Create a new invoice
 */
router.post('/create', checkAuth, upload.single("image"), create);

/**
 * POST /invoice/create-change-order
 * Purpose: Create a new change order
 */
router.post('/create-change-order', checkAuth, upload.single("image"), createChangeOrder);

/**
 * POST /invoice/change-paid-status
 * Purpose: Create a new change order
 */
router.post('/change-paid-status', changePaidStatus);

/**
* GET /invoice/get-aws-file
* Purpose: Retrieve aws s3 file
*/
router.get('/get-aws-file/:fileName', getAwsFileByName);

/**
 * POST /invoice/update
 * Purpose: Update an invoice
 */
router.post('/update', checkAuth, update);

/**
 * POST /invoice/delete
 * Purpose: Delete an invoice
 */
router.post('/delete/:projectId/:draw', checkAuth, deleteInvoice);

/**
 * POST /invoice/upload/:projectId/:draw
 * Purpose: upload csv and add all invoices to draw
 */
router.post('/upload/:projectId/:draw', uploadCSVAndInvoices);

/**
 * POST /invoice/checks/:projectId/:draw
 * Purpose: attach a copy of the checks to the draw
 */
router.post('/checks/:projectId/:draw', upload.single("image"), attachChecksToDraw);

/**
 * POST /invoice/signedDraw/:projectId/:draw
 * Purpose: attach signed draw image to the draw
 */
router.post('/signedDraw/:projectId/:draw', upload.single("image"), attachSignedDraw);


module.exports = router;
