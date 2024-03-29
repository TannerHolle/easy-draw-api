const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose')

const checkAuth = require("../middleware/check-auth");

const { Invoice } = require('../db/models/invoice.model')
const { Project } = require('../db/models/project.model')
const { uploadFile, getFileStream, deleteFile } = require('../s3')


// To delete image from server
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)


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
router.post('/create', checkAuth, upload.single("image"), async (req, res) => {
  let body = req.body;
  console.log(body);
  const url = req.protocol + '://' + req.get("host")
  const result = await uploadFile(req.file)
  await unlinkFile(req.file.path)
  console.log(result)
  let newInvoice = new Invoice({
    company: body.company,
    address: body.address,
    costCode: body.costCode,
    category: body.category,
    invoiceNum: body.invoiceNum,
    invoiceAmt: body.invoiceAmt,
    invoicePath: result.Location,
    taxId: body.taxId,
    isPaid: false
  });


  Project.findOneAndUpdate(
    {
      "_id": req.body.projectId
    },
    { $push: { "draws.$[a].invoices": newInvoice } },
    {
      "new": true,
      "arrayFilters": [
        { "a.name": body.draw },
      ]
    }).then(createdInvoice => {
      res.status(201).json({
        message: "Created Invoice Successfully"
      })
    });
});

/**
 * POST /invoice/create-change-order
 * Purpose: Create a new change order
 */
router.post('/create-change-order', checkAuth, upload.single("image"), async (req, res) => {
  let body = req.body;
  const url = req.protocol + '://' + req.get("host")
  const result = await uploadFile(req.file)
  await unlinkFile(req.file.path)
  let newChangeOrder = new Invoice({
    company: body.company,
    address: body.address,
    costCode: body.costCode,
    category: body.category,
    invoiceNum: body.invoiceNum,
    invoiceAmt: body.invoiceAmt,
    invoicePath: result.Location,
    taxId: body.taxId,
    isPaid: false
  });


  Project.findOneAndUpdate(
    {
      "_id": req.body.projectId
    },
    { $push: { "draws.$[a].changeOrders": newChangeOrder } },
    {
      "new": true,
      "arrayFilters": [
        { "a.name": body.draw },
      ]
    }).then(createdInvoice => {
      res.status(201).json({
        message: "Created Change Order Successfully"
      })
    });
});

/**
 * POST /invoice/change-paid-status
 * Purpose: Create a new change order
 */
router.post('/change-paid-status', async (req, res) => {
  let body = req.body;

  if (body.type == 'Invoices') {
    Project.findOneAndUpdate(
      {
        "_id": body.id
      },
      {
        $set: { "draws.$[draw].invoices.$[invoice].isPaid": !body.paidStatus }
      },
      {
        new: true,
        "arrayFilters": [
          { "draw.name": body.drawId },
          { "invoice._id": mongoose.Types.ObjectId(body.invoiceId) },
        ]
      }
    ).then((result) => {
      res.send(result.draws)
    }).catch((e) => {
      console.log(e)
      res.send(e);
    });
  } else {
    Project.findOneAndUpdate(
      {
        "_id": body.id
      },
      {
        $set: { "draws.$[draw].changeOrders.$[invoice].isPaid": !body.paidStatus }
      },
      {
        new: true,
        "arrayFilters": [
          { "draw.name": body.drawId },
          { "invoice._id": mongoose.Types.ObjectId(body.invoiceId) },
        ]
      }
    ).then((result) => {
      res.send(result.draws)
    }).catch((e) => {
      console.log(e)
      res.send(e);
    });
  }
});

/**
* GET /invoice/get-aws-file
* Purpose: Retrieve aws s3 file
*/
router.get('/get-aws-file/:fileName', async (req, res) => {
  let fileName = req.params.fileName;
  let result = await getFileStream(fileName);
  result.pipe(res)
});

/**
 * POST /invoice/update
 * Purpose: Update an invoice
 */
router.post('/update', checkAuth, async (req, res) => {
  Project.findOneAndUpdate(
    {
      "_id": req.body.projectId
    },
    {
      $set: { "draws.$[draw].invoices.$[invoice].invoiceAmt": req.body.invoiceAmt, "draws.$[draw].invoices.$[invoice].invoiceNum": req.body.invoiceNum }
    },
    {
      new: true,
      "arrayFilters": [
        { "draw.name": req.body.draw },
        { "invoice._id": mongoose.Types.ObjectId(req.body.invoiceId) },
      ]
    }
  ).then((result) => {
    res.send(result.draws)
  }).catch((e) => {
    console.log(e)
    res.send(e);
  });

});

/**
 * POST /invoice/delete
 * Purpose: Delete an invoice
 */
router.post('/delete/:projectId/:draw', checkAuth, async (req, res) => {
  console.log(req.body)
  if (req.body.invoicePath.length > 0) {
    var fileName = /[^/]*$/.exec(req.body.invoicePath)[0]
    let result = await deleteFile(fileName)
    console.log(result)
  }

  Project.findOneAndUpdate(
    {
      "_id": req.params.projectId
    },
    {
      $pull: { "draws.$[draw].invoices": { _id: mongoose.Types.ObjectId(req.body._id) } }
    },
    {
      new: true,
      "arrayFilters": [
        { "draw.name": req.params.draw },
      ]
    }
  ).then((result) => {

    res.send("Invoice and file deleted successfully")
  }).catch((e) => {
    console.log(e)
    res.send(e);
  });

});

/**
 * POST /invoice/upload/:projectId/:draw
 * Purpose: upload csv and add all invoices to draw
 */
router.post('/upload/:projectId/:draw', (req, res) => {
  let body = req.body;
  const currentDateTime = new Date().toISOString();
  let invoices = body.map(v => ({...v, _id: mongoose.Types.ObjectId(), dateEntered: currentDateTime}))

  Project.findOneAndUpdate(
    {
      "_id": req.params.projectId
    },
    { $push: { "draws.$[draw].invoices": { $each: invoices } }} ,
    {
      new: true,
      "arrayFilters": [
        { "draw.name": req.params.draw },
      ]
    })
    .then(() => {
      res.sendStatus(200)
    });
});

/**
 * POST /invoice/checks/:projectId/:draw
 * Purpose: attach a copy of the checks to the draw
 */
router.post('/checks/:projectId/:draw', upload.single("image"), async (req, res) => {
  let body = req.body;
  console.log(body)
  const result = await uploadFile(req.file)
  await unlinkFile(req.file.path)
  
  Project.findOneAndUpdate(
    {
      "_id": req.params.projectId
    },
    { $set: { "draws.$[draw].checks": result.Location}} ,
    {
      new: true,
      "arrayFilters": [
        { "draw.name": req.params.draw },
      ]
    })
    .then(() => {
      res.sendStatus(200)
    });
  });
  
  /**
   * POST /invoice/signedDraw/:projectId/:draw
   * Purpose: attach signed draw image to the draw
   */
router.post('/signedDraw/:projectId/:draw', upload.single("image"), async (req, res) => {
  let body = req.body;
  console.log(body)
  const result = await uploadFile(req.file)
  await unlinkFile(req.file.path)


  Project.findOneAndUpdate(
    {
      "_id": req.params.projectId
    },
    { $set: { "draws.$[draw].signedDraw": result.Location}} ,
    {
      new: true,
      "arrayFilters": [
        { "draw.name": req.params.draw },
      ]
    })
    .then(() => {
      res.sendStatus(200)
    });
});


module.exports = router;
